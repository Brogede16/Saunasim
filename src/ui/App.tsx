import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { exportSave, importSave, loadAutosave, saveAutosave } from "../save/savegame";
import { borrowingLimit, borrowingRoom, gameStore, hasAvailableLoan, hasModule, loanOffers, maintainableModules, masterCourseCost, masterEquipment, masterSearchOptions, modules, outstandingDebt, projectFor, type MasterCraft } from "../sim/game";
import { coldRecoveryQueueLoss, evaluateScheduleFit } from "../sim/canalBalance";
import { deliveryForms, formats, heatProfiles, intents, materialClass, materials, musicDirections, performances, previewProgram, programSignature, programSummary, recoveryFinishes, suggestedProgramName, type ActiveProgram } from "../sim/program";
import { conditionEffect, conditionStatus } from "../sim/maintenance";
import { shopItems } from "../sim/shop";
import { serviceTeamTiers } from "../sim/serviceTeam";

function useGameState() {
  return useSyncExternalStore(gameStore.subscribe, gameStore.getState, gameStore.getState);
}

export function App() {
  const state = useGameState();
  const [saveStatus, setSaveStatus] = useState("Loading");
  const [sceneReady, setSceneReady] = useState(false);
  const [, setNow] = useState(() => Date.now());
  const [activePanel, setActivePanel] = useState<"overview" | "programs" | "team" | "venue" | "shop" | "guests" | "finance">("overview");
  const saveFileInput = useRef<HTMLInputElement>(null);
  const programPreview = previewProgram(state.activeProgram);
  // Same factual numbers the weekly report already uses (coldRecoveryQueueLoss), shown before the
  // player commits to a schedule instead of only after running the week. Based on last week's
  // actual special-seat count when one exists; a brand-new venue with no report yet simply has
  // nothing to preview against. Informational only, like the loan menu's objective terms - it
  // never blocks a choice, matching the "player evaluates, nothing is auto-restricted" rule.
  const recoveryPreview = coldRecoveryQueueLoss(state, state.lastReport?.specialSeats ?? 0, state.activeProgram);
  const selectedSceneModule = state.selectedModuleId ? modules.find((module) => module.id === state.selectedModuleId) : undefined;
  const activeProgramIsSaved = state.repertoire.some((entry) => programSignature(entry.program) === programSignature(state.activeProgram));
  const updateProgram = <K extends keyof ActiveProgram>(key: K, value: ActiveProgram[K]) => {
    const current = gameStore.getState().activeProgram;
    const next = { ...current, [key]: value } as ActiveProgram;
    if (key !== "name" && current.name === suggestedProgramName(current)) next.name = suggestedProgramName(next);
    gameStore.updateProgram(next);
  };
  const downloadSave = () => {
    const blob = new Blob([exportSave(gameStore.getState())], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `${state.venueName.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "sauna-sim"}-save.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(href), 0);
  };
  const uploadSave = async (file?: File) => {
    if (!file) return;
    const imported = importSave(await file.text());
    if (!imported) {
      setSaveStatus("Invalid save file");
      return;
    }
    gameStore.hydrate(imported);
    await saveAutosave(imported);
    setSaveStatus("Imported local save");
  };

  useEffect(() => {
    const host = document.querySelector<HTMLDivElement>("#game-host");
    if (!host) return;
    let cancelled = false;
    let destroy: (() => void) | undefined;
    // The management dock is useful before the heavyweight Phaser scene has downloaded.
    void import("../game/CanalScene").then(({ createCanalGame }) => {
      if (cancelled) return;
      const game = createCanalGame(host);
      destroy = () => game.destroy(true);
      setSceneReady(true);
    });
    return () => {
      cancelled = true;
      destroy?.();
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
      gameStore.resolveConstruction();
      gameStore.resolveRepair();
      gameStore.resolveMasterSearch();
    }, 1_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let ready = false;
    let queuedSave: number | undefined;
    const flushAutosave = () => {
      if (!ready || cancelled) return;
      window.clearTimeout(queuedSave);
      setSaveStatus("Saving");
      void saveAutosave(gameStore.getState())
        .then(() => !cancelled && setSaveStatus("Saved locally"))
        .catch(() => !cancelled && setSaveStatus("Saving unavailable"));
    };
    const saveWhenHidden = () => {
      if (document.visibilityState === "hidden") flushAutosave();
    };

    void loadAutosave()
      .then((saved) => {
        if (saved) gameStore.hydrate(saved);
        if (!cancelled) {
          ready = true;
          setSaveStatus("Saved locally");
        }
      })
      .catch(() => {
      // Do not mark the store ready: an unreadable save must never be overwritten by a fresh game.
      if (!cancelled) setSaveStatus("Local save needs recovery");
      });

    const unsubscribe = gameStore.subscribe(() => {
      if (!ready || cancelled) return;
      window.clearTimeout(queuedSave);
      setSaveStatus("Saving");
      queuedSave = window.setTimeout(() => {
        flushAutosave();
      }, 150);
    });

    window.addEventListener("pagehide", flushAutosave);
    document.addEventListener("visibilitychange", saveWhenHidden);

    return () => {
      cancelled = true;
      window.clearTimeout(queuedSave);
      unsubscribe();
      window.removeEventListener("pagehide", flushAutosave);
      document.removeEventListener("visibilitychange", saveWhenHidden);
    };
  }, []);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    let disposed = false;
    let uninstall: (() => void) | undefined;
    void import("../dev/qaHooks").then(({ installQaHooks }) => {
      if (!disposed) uninstall = installQaHooks();
    });
    return () => {
      disposed = true;
      uninstall?.();
    };
  }, []);

  return (
    <main className="app-shell">
      <section className="game-frame" aria-label="Sauna Sim venue">
        <div id="game-host" />
        {!sceneReady && <div className="scene-loading" aria-live="polite">Loading venue…</div>}
      </section>
      <section className="control-dock" aria-label="Venue controls">
        <header className="venue-header">
          <div>
            <p className="eyebrow">WEEK {state.week} · CANAL WORKSHOP · {saveStatus}</p>
            <input
              aria-label="Sauna name"
              className="venue-name"
              value={state.venueName}
              onChange={(event) => gameStore.rename(event.target.value)}
            />
          </div>
          <div className="cash">${state.cash.toLocaleString("en-US")}</div>
        </header>
        <nav className="venue-nav" aria-label="Venue management">
          {(["overview", "programs", "team", "venue", "shop", "guests", "finance"] as const).map((panel) => <button key={panel} className={activePanel === panel ? "active" : ""} onClick={() => setActivePanel(panel)}>{panel}</button>)}
        </nav>
        {activePanel === "team" && <>
        <div className="operations-card">
          <div>
            <strong>{state.master ? `${state.master.name} · ${state.master.style}` : "No Aufguss Master"}</strong>
            <small>{state.master ? `Heat ${state.master.heatCraft} · Aroma ${state.master.aromaCraft} · Performance ${state.master.performanceCraft} · $${state.master.weeklyWage}/week` : "Special Gus is unavailable"}</small>
          </div>
          {state.master ? <button className="action-button" onClick={() => gameStore.dismissMaster()}>Dismiss</button> : null}
        </div>
        {!state.master && <section className="candidate-panel" aria-label="Aufguss Master candidates">
          <header><span>MASTER CANDIDATES</span><small>{state.masterSearch ? `${masterSearchOptions[state.masterSearch.tier].name} in progress` : "Choose a candidate or request a new shortlist"}</small></header>
          {state.masterCandidates.map((candidate) => <div className="candidate-card" key={candidate.id}>
            <span><b>{candidate.name} · {candidate.style}</b><small>Heat {candidate.heatCraft} · Aroma {candidate.aromaCraft} · Performance {candidate.performanceCraft}</small><small>{candidate.note}</small></span>
            <button disabled={state.cash < candidate.hiringFee || !!state.masterSearch} onClick={() => gameStore.hireMaster(candidate.id)}>Hire · ${candidate.hiringFee}</button>
            <em>${candidate.weeklyWage}/week</em>
          </div>)}
          <div className="search-options">{(Object.keys(masterSearchOptions) as Array<keyof typeof masterSearchOptions>).map((tier) => {
            const option = masterSearchOptions[tier];
            return <button key={tier} disabled={!!state.masterSearch || state.cash < option.fee} onClick={() => gameStore.startMasterSearch(tier)}><b>{option.name}</b><small>{option.note}</small>{option.fee ? <small>${option.fee}</small> : <small>Free</small>}</button>;
          })}</div>
        </section>}
        {state.master && <section className="master-training" aria-label="Master training">
          <header><span>MASTER COURSES</span><small>Each course raises one craft level</small></header>
          {(["heatCraft", "aromaCraft", "performanceCraft"] as const).map((craft) => {
            const label: Record<MasterCraft, string> = { heatCraft: "Heat Craft", aromaCraft: "Aroma Craft", performanceCraft: "Performance Craft" };
            const cost = masterCourseCost(state.master!, craft);
            return <div key={craft}><span>{label[craft]} · {state.master![craft]}/10</span><button disabled={cost === 0 || state.cash < cost} onClick={() => gameStore.trainMaster(craft)}>{cost === 0 ? "Max" : `Course · $${cost}`}</button></div>;
          })}
        </section>}
        {state.master && <section className="master-equipment" aria-label="Master equipment">
          <header><span>MASTER EQUIPMENT</span><small>Tools improve one delivery moment</small></header>
          {masterEquipment.map((item) => <div key={item.id}><span><b>{item.name}</b><small>{item.helps}</small></span><button disabled={state.master!.equipment.includes(item.id) || state.cash < item.price} onClick={() => gameStore.equipMaster(item.id)}>{state.master!.equipment.includes(item.id) ? "Owned" : `Buy · $${item.price}`}</button></div>)}
        </section>}
        {hasModule(state, "shop") && <div className="operations-card host-card">
          <div><strong>Service Team · {state.serviceHostCount}/3</strong><small>{state.serviceHostCount ? "Reception, shop flow and guest support" : "A natural reception and shop role"}</small></div>
          {(() => {
            const next = serviceTeamTiers[state.serviceHostCount];
            return <button className="action-button" disabled={!next || state.cash < (next?.hireCost ?? 0)} onClick={() => gameStore.hireServiceHost()}>{next ? `Hire ${state.serviceHostCount === 0 ? "Host" : "Assistant"} · $${next.hireCost}` : "Team complete"}</button>;
          })()}
        </div>}
        </>}
        {activePanel === "finance" && <>
        <label className="price-control">
          <span>Admission price</span>
          <input
            aria-label="Admission price"
            type="range"
            min="16"
            max="45"
            value={state.admissionPrice}
            onChange={(event) => gameStore.setAdmissionPrice(Number(event.target.value))}
          />
          <strong>${state.admissionPrice}</strong>
        </label>
        <div className="schedule-control" aria-label="Opening schedule"><span>Open</span><input aria-label="Opening days" type="number" min="1" max="7" value={state.schedule.openDays} onChange={(event) => gameStore.updateSchedule({ ...state.schedule, openDays: Number(event.target.value) })}/><span>days ·</span><input aria-label="Opening time" type="number" min="6" max="22" value={state.schedule.opensAt} onChange={(event) => gameStore.updateSchedule({ ...state.schedule, opensAt: Number(event.target.value) })}/><span>to</span><input aria-label="Closing time" type="number" min="8" max="24" value={state.schedule.closesAt} onChange={(event) => gameStore.updateSchedule({ ...state.schedule, closesAt: Number(event.target.value) })}/></div>
        <p className="schedule-note"><b>{evaluateScheduleFit(state.schedule, state.activeProgram).fit} fit.</b> {evaluateScheduleFit(state.schedule, state.activeProgram).note}</p>
        </>}
        {activePanel === "overview" && <>
          <div className="week-actions">
          <button className="run-week" disabled={state.financialDecisionPending} onClick={() => gameStore.advanceWeek()}>Run Week</button>
          <button className="reset-button" onClick={() => gameStore.reset()}>Reset</button>
          </div>
          {selectedSceneModule && <section className="scene-selection" aria-label="Selected venue upgrade">
            <div><strong>{selectedSceneModule.name}</strong><small>{selectedSceneModule.shortEffect}</small></div>
            <div><button onClick={() => setActivePanel("venue")}>View in Venue</button><button aria-label="Clear selected venue upgrade" onClick={() => gameStore.selectModule(undefined)}>Clear</button></div>
          </section>}
          <section className="save-panel" aria-label="Save and backup">
          <header><span>SAVE & BACKUP</span><small>{saveStatus}</small></header>
          <p>Your game saves automatically on this device. Export a file only when you want a separate backup or to move the prototype.</p>
          <div><button onClick={downloadSave}>Export save</button><button onClick={() => saveFileInput.current?.click()}>Import save</button><input ref={saveFileInput} aria-label="Import save file" type="file" accept="application/json,.json" hidden onChange={(event) => { void uploadSave(event.target.files?.[0]); event.currentTarget.value = ""; }} /></div>
        </section>
        </>}
        {activePanel === "programs" && <>
        <section className="program-panel" aria-label="Active Aufguss program">
          <header><span>ACTIVE GUS</span><small>{programSummary(state.activeProgram)}</small></header>
          <input aria-label="Program name" className="program-name" value={state.activeProgram.name} onChange={(event) => updateProgram("name", event.target.value || "Untitled Gus")} />
          <div className="program-grid">
            <label>Intent<select value={state.activeProgram.intent} onChange={(event) => updateProgram("intent", event.target.value as ActiveProgram["intent"])}>{intents.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Heat<select value={state.activeProgram.heat} onChange={(event) => updateProgram("heat", event.target.value as ActiveProgram["heat"])}>{heatProfiles.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Format<select value={state.activeProgram.format} onChange={(event) => updateProgram("format", event.target.value as ActiveProgram["format"])}>{formats.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Performance<select value={state.activeProgram.performance} onChange={(event) => updateProgram("performance", event.target.value as ActiveProgram["performance"])}>{performances.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Music<select value={state.activeProgram.music} onChange={(event) => updateProgram("music", event.target.value as ActiveProgram["music"])}>{musicDirections.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Finish<select value={state.activeProgram.recoveryFinish} onChange={(event) => updateProgram("recoveryFinish", event.target.value as ActiveProgram["recoveryFinish"])}>{recoveryFinishes.map((item) => <option key={item} disabled={item === "Outdoor Shower" ? !hasModule(state, "shower") : item === "Cold Plunge" ? !hasModule(state, "cold-plunge") : item === "Refreshment Finish" ? !hasModule(state, "shop") : item === "Natural Water Dip" || item === "Rest Deck"}>{item}</option>)}</select></label>
            <label>Sessions<input aria-label="Requested Gus sessions" type="number" min="1" max="8" value={state.activeProgram.requestedSessions} onChange={(event) => updateProgram("requestedSessions", Math.max(1, Math.min(8, Number(event.target.value) || 1)))}/></label>
            <label>Gus price<input aria-label="Gus supplement price" type="number" min="0" max="40" value={state.activeProgram.supplementPrice} onChange={(event) => updateProgram("supplementPrice", Math.max(0, Math.min(40, Number(event.target.value) || 0)))}/></label>
          </div>
          <div className="aroma-rounds">
            {state.activeProgram.aromaRounds.map((round, index) => <div className="aroma-round" key={`${index}-${round.material}`}><strong>ROUND {index + 1}</strong><select aria-label={`Aroma round ${index + 1}`} value={round.material} onChange={(event) => gameStore.updateProgram({ ...state.activeProgram, aromaRounds: state.activeProgram.aromaRounds.map((entry, roundIndex) => roundIndex === index ? { ...entry, material: event.target.value as typeof round.material } : entry) })}>{materials.map((item) => <option key={item}>{item}</option>)}</select><select aria-label={`Delivery round ${index + 1}`} value={round.delivery} onChange={(event) => gameStore.updateProgram({ ...state.activeProgram, aromaRounds: state.activeProgram.aromaRounds.map((entry, roundIndex) => roundIndex === index ? { ...entry, delivery: event.target.value as typeof round.delivery } : entry) })}>{deliveryForms.map((item) => <option key={item}>{item}</option>)}</select>{state.activeProgram.aromaRounds.length > 1 && <button onClick={() => gameStore.updateProgram({ ...state.activeProgram, aromaRounds: state.activeProgram.aromaRounds.filter((_, roundIndex) => roundIndex !== index) })}>Remove</button>}</div>)}
            {state.activeProgram.aromaRounds.length < 3 && <button className="add-round" onClick={() => gameStore.updateProgram({ ...state.activeProgram, aromaRounds: [...state.activeProgram.aromaRounds, { material: "Nordic Birch", delivery: "Water Pour" }] })}>Add aroma round</button>}
          </div>
          <p>{state.activeProgram.aromaRounds.map((round) => `${materialClass(round.material)} ${round.material}`).join(" · ")}. Order changes the programme's later composition review.</p>
          <div className="program-preview"><span>ROOM {programPreview.roomMinutes} MIN</span><span>GUEST JOURNEY {programPreview.guestMinutes} MIN</span><span>INPUTS ${programPreview.materialCost}/SESSION</span><span>{state.activeProgram.revealedTier ?? programPreview.composition.toUpperCase()}</span></div>
          <p>{programPreview.flowNote}</p>
          {recoveryPreview.bottleneck && <p className="recovery-preview-note">Based on last week's turnout, this recovery finish and schedule would need about {recoveryPreview.recoveryDemand} recovery visits against your current shower/plunge capacity - expect some cold-recovery queueing.</p>}
          <div className="repertoire-action"><span>{state.activeProgram.revealedTier ? `${state.activeProgram.revealedTier} composition discovered` : "Run this Gus once to discover its composition"}</span><button disabled={!state.activeProgram.revealedTier || activeProgramIsSaved} onClick={() => gameStore.saveActiveProgram()}>{activeProgramIsSaved ? "Saved" : "Save to repertoire"}</button></div>
          {state.repertoire.length > 0 && <section className="repertoire-panel" aria-label="Saved Gus repertoire">
            <header><span>SAVED GUS</span><small>{state.repertoire.length} discovered</small></header>
            {state.repertoire.map((saved) => <button className={`saved-program ${saved.composition.toLowerCase()}`} key={saved.id} onClick={() => gameStore.loadSavedProgram(saved.id)}><span><b>{saved.program.name}</b><small>{saved.composition} · {programSummary(saved.program)}</small></span><em>Load</em></button>)}
          </section>}
        </section>
        </>}
        {activePanel === "overview" && state.lastReport && (
          <section className="week-report" aria-label="Latest weekly report">
            <header><span>WEEK {state.week - 1} RESULT</span><strong className={state.lastReport.netResult >= 0 ? "positive" : "negative"}>{state.lastReport.netResult >= 0 ? "+" : ""}${state.lastReport.netResult}</strong></header>
            <div>{state.lastReport.admissions} admissions · {state.lastReport.specialSeats}/{state.lastReport.specialCapacity ?? state.lastReport.specialSeats} Gus guests · {state.lastReport.specialOccupancy ?? 0}% occupied · {state.lastReport.shopSales} shop sales</div>
            <div className="ledger-breakdown">Income: ${state.lastReport.revenueBreakdown.admissions} entry · ${state.lastReport.revenueBreakdown.specialGus} Gus · ${state.lastReport.revenueBreakdown.shop} shop</div>
            <div className="ledger-breakdown">Costs: ${state.lastReport.costBreakdown.venueBase} venue · ${state.lastReport.costBreakdown.staff} staff · ${state.lastReport.costBreakdown.utilitiesAndCleaning + state.lastReport.costBreakdown.facilities} operations · ${state.lastReport.costBreakdown.programMaterials + state.lastReport.costBreakdown.shopProcurement} inputs{state.lastReport.loanRepayment > 0 ? ` · $${state.lastReport.loanRepayment} loans` : ""}</div>
            {state.lastReport.requestedSessions && <div className="ledger-breakdown">Gus schedule: {state.lastReport.feasibleSessions}/{state.lastReport.requestedSessions} requested sessions could run</div>}
            <div className="ledger-breakdown">Opening window: {state.lastReport.scheduleFit} fit · {state.lastReport.scheduleNote}</div>
            {state.lastReport.venueDemandNote && <div className="ledger-breakdown">{state.lastReport.venueDemandNote}</div>}
            {state.lastReport.bottleneck && <div className="bottleneck">{state.lastReport.queueLoss} visits lost to delays at {state.lastReport.bottleneck}</div>}
            {state.lastReport.programReview && <div className="program-result">Gus: {state.lastReport.programReview.composition} composition · {state.lastReport.programReview.execution} execution · {state.lastReport.programReview.venueFit} venue fit · {state.lastReport.programReview.stars} stars</div>}
            <p>{state.lastReport.signal}</p>
            {state.lastReport.programReview && <p>{state.lastReport.programReview.note}</p>}
          </section>
        )}
        {activePanel === "guests" && state.lastReport?.guestSnapshots && (
          <section className="guest-panel" aria-label="Recent guests">
            <header><span>RECENT GUESTS</span><small>Tap a guest in the scene or below</small></header>
            <div className="guest-list">
              {state.lastReport.guestSnapshots.map((guest) => (
                <button
                  key={guest.id}
                  className={state.selectedGuestId === guest.id ? "guest-row selected" : "guest-row"}
                  onClick={() => gameStore.selectGuest(guest.id)}
                >
                  <span className={`guest-dot ${guest.palette}`} />
                  <span><strong>{guest.name}, {guest.age}</strong><small>{guest.latestActivity}</small></span>
                  <em>{guest.outcome}</em>
                </button>
              ))}
            </div>
            {(() => {
              const guest = state.lastReport.guestSnapshots.find((entry) => entry.id === state.selectedGuestId) ?? state.lastReport.guestSnapshots[0];
              return <article className="guest-card" aria-label={`${guest.name} profile`}>
                <strong>{guest.name}, {guest.age}</strong>
                <small>{guest.visitGoal}</small>
                <p><b>Program fit:</b> {guest.programFit}</p>
                <p><b>Likes:</b> {guest.likes}</p>
                <p><b>Avoids:</b> {guest.dislikes}</p>
                <p><b>Route:</b> {guest.visitPath.join(" → ")}</p>
                <p>{guest.reaction}</p>
              </article>;
            })()}
          </section>
        )}
        {activePanel === "finance" && <section className="loan-panel" aria-label="Chain loans">
          <header><span>Finance</span><strong>${borrowingRoom(state).toLocaleString("en-US")} credit capacity</strong></header>
          <p className="loan-explainer">Choose a loan to receive cash now. Repayments are taken automatically once per game week. Credit capacity is based on your venue value and recent profitable weeks.</p>
          {state.loans.length > 0 && <p>Current loan balance: ${outstandingDebt(state).toLocaleString("en-US")} · next weekly repayment: ${state.loans.reduce((total, loan) => total + loan.weeklyPayment, 0).toLocaleString("en-US")}</p>}
          <div className="loan-grid">
            {Object.entries(loanOffers).map(([id, offer]) => {
              const total = offer.weeklyPayment * offer.weeks;
              const available = total <= borrowingRoom(state);
              const requiresMoreValue = id === "large" && borrowingLimit(state) < total;
              return (
                <button key={id} className="loan-button" disabled={!available} onClick={() => gameStore.takeLoan(id as keyof typeof loanOffers)}>
                  <span>{offer.name}</span>
                  <small>{available ? `Receive now: $${offer.amount.toLocaleString("en-US")}` : requiresMoreValue ? "Requires more venue value" : "No credit capacity"}</small>
                  {available && <small>Repay: ${offer.weeklyPayment.toLocaleString("en-US")} per game week for {offer.weeks} weeks · Total: ${total.toLocaleString("en-US")}</small>}
                </button>
              );
            })}
          </div>
        </section>}
        {activePanel === "finance" && state.financialDecisionPending && (
          <section className="financial-alert" aria-label="Financial decision">
            <strong>Cash is below zero</strong>
            {hasAvailableLoan(state) ? (
              <p>Borrowing room: ${borrowingRoom(state).toLocaleString("en-US")}. Choose a loan, continue to the next settlement, or declare bankruptcy.</p>
            ) : (
              <p>No realistic loan remains. The grace period is over: take an available loan below if one still fits, or declare bankruptcy.</p>
            )}
            <div>
              {hasAvailableLoan(state) && <button className="action-button" onClick={() => gameStore.continueAtRisk()}>Continue at risk</button>}
              <button className="reset-button" onClick={() => gameStore.declareBankruptcy()}>Declare bankruptcy</button>
            </div>
          </section>
        )}
        {activePanel === "venue" && state.construction.length > 0 && (
          <section className="construction-panel" aria-label="Construction projects">
            <strong>UNDER CONSTRUCTION</strong>
            {state.construction.map((project) => {
              const module = modules.find((entry) => entry.id === project.moduleId);
              // `now` triggers the once-per-second re-render; the countdown itself must use the
              // current instant so a just-started three-hour project never displays as four hours.
              const remainingMs = Math.max(0, project.completesAt - Date.now());
              const remainingText = remainingMs < 60 * 60 * 1000 ? `${Math.ceil(remainingMs / 60_000)} min` : `${Math.ceil(remainingMs / (60 * 60 * 1000))} h`;
              return <div key={project.moduleId}><span>{module?.name} · {remainingText}</span><button className="action-button" onClick={() => gameStore.rushConstruction(project.moduleId)}>Rush · ${Math.ceil((module?.economy.price ?? 0) * 0.25).toLocaleString("en-US")}</button></div>;
            })}
          </section>
        )}
        {activePanel === "team" && <section className="maintenance-panel" aria-label="Maintenance">
          <header><span>MAINTENANCE</span><button className="action-button" disabled={state.technicianHired || state.cash < 900} onClick={() => gameStore.hireTechnician()}>{state.technicianHired ? "Technician hired" : "Hire technician · $900"}</button></header>
          {maintainableModules.filter((id) => state.built.includes(id)).map((id) => {
            const condition = Math.round(state.condition[id] ?? 100);
            const task = state.repairTask?.moduleId === id;
            return <div className="maintenance-row" key={id}><span><b>{modules.find((module) => module.id === id)?.name} · {condition}% · {conditionStatus(condition)}</b><small>{conditionEffect(id, condition)}</small></span><button disabled={!state.technicianHired || task || condition >= 100} onClick={() => gameStore.dispatchRepair(id)}>{task ? "On route / repair" : `Repair · $${gameStore.repairCost(id)}`}</button></div>;
          })}
        </section>}
        {activePanel === "shop" && <section className="shop-panel" aria-label="Shop">
          <header><span>RECEPTION SHOP</span><small>{hasModule(state, "shop") ? "Open" : "Not built"}</small></header>
          {!hasModule(state, "shop") && <p>Build Reception Shop Port in Venue to create the first optional purchase stop.</p>}
          {hasModule(state, "shop") && <>
            <p>Choose up to three items. Replenishment and retail price stay automatic; every selected item carries its own procurement cost.</p>
            <div className="shop-range" aria-label="Shop range">
              {shopItems.map((item) => {
                const selected = state.shopRange.includes(item.id);
                const locked = !!item.requiresIdentity && state.repertoire.length === 0;
                const canSelect = !locked && (selected || state.shopRange.length < 3);
                return <button key={item.id} className={selected ? "selected" : ""} disabled={!canSelect} onClick={() => gameStore.setShopRange(selected ? state.shopRange.filter((id) => id !== item.id) : [...state.shopRange, item.id])}><span><b>{item.name}</b><small>${item.retailPrice} sale · ${item.procurementCost} cost</small><small>{locked ? "Unlock by saving your first discovered Gus." : item.note}</small></span><em>{locked ? "Locked" : selected ? "In range" : "Add"}</em></button>;
              })}
            </div>
            <div className="shop-result"><b>Latest week:</b> {state.lastReport?.shopSales ?? 0} purchases{state.lastReport?.shopLines.length ? <> · {state.lastReport.shopLines.map((line) => `${line.units} ${line.name}`).join(" · ")}</> : null}</div>
            {state.lastReport?.shopLines.length ? <div className="shop-result">${state.lastReport.revenueBreakdown.shop} shop revenue · ${state.lastReport.costBreakdown.shopProcurement} procurement</div> : null}
            <p>A Service Host improves shop flow, but adds a weekly wage.</p>
          </>}
        </section>}
        {activePanel === "venue" && <><p className="dock-intro">Build in the order that fits your venue. Each change affects the model and appears in the scene.</p>
        <div className="build-grid">
          {modules.map((module) => {
            const built = hasModule(state, module.id);
            const project = projectFor(state, module.id);
            const affordable = state.cash >= module.economy.price;
            return (
              <article
                key={module.id}
                className="build-card"
              >
                <span>{built ? "Built" : module.name}</span>
                <small>{built ? module.shortEffect : project ? "Construction in progress" : `$${module.economy.price.toLocaleString("en-US")} · ${module.economy.buildHours}h · ${module.shortEffect}`}</small>
                {!built && !project && <button disabled={!affordable} onClick={() => gameStore.startConstruction(module.id)}>Build</button>}
              </article>
            );
          })}
        </div></>}
      </section>
    </main>
  );
}
