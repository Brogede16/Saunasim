import { borrowingRoom, gameStore } from "../sim/game";

declare global {
  interface Window {
    render_game_to_text?: () => string;
    advanceTime?: (ms: number) => void;
  }
}

/** Development-only browser hooks used by the local game QA harness. */
export function installQaHooks() {
  const renderGameToText = () => {
    const state = gameStore.getState();
    return JSON.stringify({
      scene: "Canal Repair Workshop",
      venueName: state.venueName,
      cash: state.cash,
      week: state.week,
      built: state.built,
      masterHired: state.masterHired,
      master: state.master ? { name: state.master.name, style: state.master.style, weeklyWage: state.master.weeklyWage } : undefined,
      masterCandidates: state.masterCandidates.map((candidate) => ({ id: candidate.id, name: candidate.name, hiringFee: candidate.hiringFee, weeklyWage: candidate.weeklyWage })),
      masterSearch: state.masterSearch,
      serviceHostCount: state.serviceHostCount,
      admissionPrice: state.admissionPrice,
      schedule: state.schedule,
      activeProgram: state.activeProgram,
      latestWeek: state.lastReport,
      selectedGuest: state.lastReport?.guestSnapshots?.find((guest) => guest.id === state.selectedGuestId),
      selectedModuleId: state.selectedModuleId,
      construction: state.construction,
      maintenance: { condition: state.condition, technicianHired: state.technicianHired, repairTask: state.repairTask },
      loans: state.loans,
      borrowingRoom: borrowingRoom(state),
      visibleActivities: [
        "venue entry",
        ...(state.built.includes("arrival") ? ["arrival sign"] : []),
        ...(state.built.includes("shop") ? ["shop"] : []),
        ...(state.built.includes("program") ? ["indoor Aufguss"] : []),
        ...(state.built.includes("aufguss-yard") ? ["outdoor Aufguss"] : []),
        ...(state.built.includes("shower") ? ["shower"] : []),
        ...(state.built.includes("cold-plunge") ? ["cold plunge"] : []),
      ],
      coordinateSystem: "canvas origin is top-left; x increases right, y increases down",
    });
  };
  const advanceTime = (milliseconds: number) => {
    const weeks = Math.floor(milliseconds / 1_000);
    for (let index = 0; index < weeks; index += 1) gameStore.advanceWeek();
  };
  window.render_game_to_text = renderGameToText;
  window.advanceTime = advanceTime;
  return () => {
    if (window.render_game_to_text === renderGameToText) delete window.render_game_to_text;
    if (window.advanceTime === advanceTime) delete window.advanceTime;
  };
}
