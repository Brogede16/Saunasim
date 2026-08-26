import { simulateCanalWeek, type BalanceModuleId, type WeekReport } from "./canalBalance";
import { simulateGuestWeek } from "./guestWeek";
import { evaluateComposition, programSignature, starterProgram, type ActiveProgram } from "./program";
import { evaluateProgramDelivery } from "./programEvaluation";
import { conditionWear, type MaintainableModuleId } from "./maintenance";
import { defaultShopRange, shopItems, type ShopItemId } from "./shop";
import { serviceTeamTiers } from "./serviceTeam";
import { canalWorkshopVenue, compatibleVenueModules, type VenueModuleDefinition, type VenueModuleId } from "../content/venueModules";

export type { MaintainableModuleId } from "./maintenance";

export type ModuleId = VenueModuleId;
export type ModuleDefinition = VenueModuleDefinition;
// The Canal prototype already consumes the same compatibility resolution future offers will use.
export const modules = compatibleVenueModules(canalWorkshopVenue);

export type ConstructionProject = { moduleId: ModuleId; completesAt: number };
export type LoanId = "small" | "standard" | "large";
export type Loan = { id: LoanId; weeklyPayment: number; remainingWeeks: number };
export const masterEquipment = [
  { id: "towel-set", name: "Towel Set", price: 350, helps: "Classic and performance delivery" },
  { id: "hand-fan", name: "Hand Fan", price: 450, helps: "Controlled heat and finales" },
  { id: "infusion-kit", name: "Infusion Kit", price: 600, helps: "Ice, herbs and aroma rounds" },
  { id: "rain-ladle", name: "Rain Ladle", price: 650, helps: "Broad, controlled rain pours" },
] as const;
export type MasterEquipmentId = (typeof masterEquipment)[number]["id"];
export type MasterStyle = "Traditional" | "Meditative" | "Energetic" | "Theatrical";
export type MasterProfile = { name: string; style: MasterStyle; heatCraft: number; aromaCraft: number; performanceCraft: number; weeklyWage: number; equipment: MasterEquipmentId[] };
export type MasterCraft = "heatCraft" | "aromaCraft" | "performanceCraft";
export type MasterCandidate = Omit<MasterProfile, "equipment"> & { id: string; hiringFee: number; note: string };
export type MasterSearchTier = "patient" | "standard" | "immediate";
export type MasterSearch = { tier: MasterSearchTier; completesAt: number };

export const masterCandidates: MasterCandidate[] = [
  { id: "starter-master", name: "Starter Master", style: "Traditional", heatCraft: 3, aromaCraft: 3, performanceCraft: 2, hiringFee: 650, weeklyWage: 500, note: "A capable, classic first hire with room to grow." },
  { id: "rowan-vale", name: "Rowan Vale", style: "Meditative", heatCraft: 2, aromaCraft: 4, performanceCraft: 2, hiringFee: 900, weeklyWage: 575, note: "Thoughtful with layered aromas and calmer recovery programmes." },
  { id: "avery-reed", name: "Avery Reed", style: "Energetic", heatCraft: 4, aromaCraft: 2, performanceCraft: 3, hiringFee: 1_300, weeklyWage: 650, note: "Comfortable building heat and carrying a lively room." },
  { id: "morgan-lee", name: "Morgan Lee", style: "Theatrical", heatCraft: 3, aromaCraft: 3, performanceCraft: 4, hiringFee: 1_700, weeklyWage: 750, note: "Strong presentation craft when a programme earns the occasion." },
];

export const masterSearchOptions: Record<MasterSearchTier, { name: string; fee: number; waitMinutes: number; note: string }> = {
  patient: { name: "Patient search", fee: 0, waitMinutes: 60, note: "A free local search. Results arrive in about an hour." },
  standard: { name: "Standard search", fee: 125, waitMinutes: 20, note: "A modest agency fee for a quicker shortlist." },
  immediate: { name: "Immediate shortlist", fee: 350, waitMinutes: 0, note: "Pay for an immediate introduction, not stronger candidates." },
};
export type VenueSchedule = { openDays: number; opensAt: number; closesAt: number };
export type SavedProgram = { id: string; savedAtWeek: number; composition: NonNullable<ActiveProgram["revealedTier"]>; program: ActiveProgram };
export const defaultSchedule: VenueSchedule = { openDays: 5, opensAt: 10, closesAt: 20 };
export type RepairTask = { moduleId: MaintainableModuleId; completesAt: number };
export const maintainableModules: MaintainableModuleId[] = ["program", "shower", "cold-plunge"];

export const loanOffers: Record<LoanId, { name: string; amount: number; weeklyPayment: number; weeks: number }> = {
  small: { name: "Small Bridge Loan", amount: 7_500, weeklyPayment: 375, weeks: 22 },
  standard: { name: "Standard Expansion Loan", amount: 20_000, weeklyPayment: 750, weeks: 30 },
  large: { name: "Large Secured Loan", amount: 60_000, weeklyPayment: 1_900, weeks: 36 },
};

export type GameState = {
  venueName: string;
  cash: number;
  week: number;
  built: ModuleId[];
  masterHired: boolean;
  master?: MasterProfile;
  masterCandidates: MasterCandidate[];
  masterSearch?: MasterSearch;
  masterSearchCount: number;
  admissionPrice: number;
  schedule: VenueSchedule;
  activeProgram: ActiveProgram;
  repertoire: SavedProgram[];
  shopRange: ShopItemId[];
  construction: ConstructionProject[];
  loans: Loan[];
  profitableWeeks: number;
  financialDecisionPending: boolean;
  condition: Partial<Record<MaintainableModuleId, number>>;
  hostHired: boolean;
  serviceHostCount: number;
  technicianHired: boolean;
  repairTask?: RepairTask;
  selectedGuestId?: string;
  selectedModuleId?: ModuleId;
  lastReport?: WeekReport;
};

export const initialState: GameState = {
  venueName: "Canal Sauna",
  cash: 4_000,
  week: 1,
  built: [],
  masterHired: false,
  masterCandidates: [masterCandidates[0]],
  masterSearchCount: 0,
  admissionPrice: 24,
  schedule: defaultSchedule,
  activeProgram: starterProgram,
  repertoire: [],
  shopRange: defaultShopRange,
  construction: [],
  loans: [],
  profitableWeeks: 0,
  financialDecisionPending: false,
  condition: {},
  hostHired: false,
  serviceHostCount: 0,
  technicianHired: false,
};

let state = initialState;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function outstandingDebt(snapshot: GameState) {
  return snapshot.loans.reduce((total, loan) => total + loan.weeklyPayment * loan.remainingWeeks, 0);
}

export function borrowingLimit(snapshot: GameState) {
  // Fresh construction is limited collateral; sustained operations should drive later borrowing growth.
  // The ceiling intentionally clears the Large Secured Loan's total repayment, while still
  // requiring a developed, consistently profitable venue before that band is available.
  const builtValue = snapshot.built.reduce((total, id) => total + (modules.find((module) => module.id === id)?.economy.price ?? 0) * 0.25, 0);
  return 23_000 + Math.min(70_000, Math.round(builtValue + snapshot.profitableWeeks * 1_600));
}

export function borrowingRoom(snapshot: GameState) {
  return Math.max(0, borrowingLimit(snapshot) - outstandingDebt(snapshot));
}

export function hasAvailableLoan(snapshot: GameState) {
  const room = borrowingRoom(snapshot);
  return Object.values(loanOffers).some((offer) => offer.weeklyPayment * offer.weeks <= room);
}

export function projectFor(snapshot: GameState, id: ModuleId) {
  return snapshot.construction.find((project) => project.moduleId === id);
}

export function masterCourseCost(master: MasterProfile, craft: MasterCraft) {
  const nextLevel = master[craft] + 1;
  return nextLevel > 10 ? 0 : 200 + nextLevel * nextLevel * 25;
}

function resolveConstruction(now = Date.now()) {
  const complete = state.construction.filter((project) => project.completesAt <= now);
  if (complete.length === 0) return;
  const completedIds = complete.map((project) => project.moduleId);
  state = {
    ...state,
    built: [...state.built, ...completedIds],
    construction: state.construction.filter((project) => project.completesAt > now),
  };
  notify();
}

function hireMaster(candidateId: string) {
  if (state.masterHired) return;
  const candidate = state.masterCandidates.find((entry) => entry.id === candidateId);
  if (!candidate || state.cash < candidate.hiringFee) return;
  const { id: _id, hiringFee: _hiringFee, note: _note, ...master } = candidate;
  state = { ...state, cash: state.cash - candidate.hiringFee, masterHired: true, master: { ...master, equipment: [] }, masterSearch: undefined };
  notify();
}

function repairCost(id: MaintainableModuleId) {
  const condition = state.condition[id] ?? 100;
  const module = modules.find((entry) => entry.id === id);
  return Math.max(80, Math.round((module?.economy.price ?? 0) * (0.015 + (100 - condition) * 0.002)));
}

function resolveRepair(now = Date.now()) {
  if (!state.repairTask || state.repairTask.completesAt > now) return;
  const { moduleId } = state.repairTask;
  state = { ...state, condition: { ...state.condition, [moduleId]: 100 }, repairTask: undefined };
  notify();
}

function advanceWeek() {
  if (state.financialDecisionPending) return;
  resolveConstruction();
  resolveRepair();
  const loanRepayment = state.loans.reduce((total, loan) => total + loan.weeklyPayment, 0);
  const unavailable = maintainableModules.filter((id) => (state.condition[id] ?? 100) <= 0 || state.repairTask?.moduleId === id);
  const balanceInput = { ...state, brandIdentity: state.repertoire.length, built: state.built.filter((id) => !unavailable.includes(id as MaintainableModuleId)), loanRepayment, masterWage: state.master?.weeklyWage };
  const ledger = simulateCanalWeek(balanceInput);
  const guestWeek = simulateGuestWeek(balanceInput, ledger, state.week, state.activeProgram);
  const revealedProgram = state.masterHired ? { ...state.activeProgram, revealedTier: evaluateComposition(state.activeProgram) } : state.activeProgram;
  const report: WeekReport = { ...ledger, ...guestWeek, programReview: state.masterHired ? evaluateProgramDelivery(revealedProgram, state.built, state.master, ledger.specialOccupancy ?? 0) : undefined };
  const cash = state.cash + report.netResult;
  state = {
    ...state,
    cash,
    week: state.week + 1,
    loans: state.loans
      .map((loan) => ({ ...loan, remainingWeeks: loan.remainingWeeks - 1 }))
      .filter((loan) => loan.remainingWeeks > 0),
    profitableWeeks: report.netResult > 0 ? state.profitableWeeks + 1 : 0,
    financialDecisionPending: cash < 0,
    selectedGuestId: report.guestSnapshots?.[0]?.id,
    activeProgram: revealedProgram,
    condition: Object.fromEntries(maintainableModules.filter((id) => state.built.includes(id)).map((id) => [
      id,
      // A repair task makes the facility unavailable, but must never erase its actual wear.
      // `repairTask` is the canonical under-maintenance state until the technician completes it.
      state.repairTask?.moduleId === id
        ? (state.condition[id] ?? 100)
        : Math.max(0, (state.condition[id] ?? 100) - conditionWear(id, {
          specialSeats: ledger.specialSeats,
          recoveryDemand: ledger.recoveryDemand ?? 0,
        })),
    ])),
    lastReport: report,
  };
  notify();
}

export const gameStore = {
  getState: () => state,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  startConstruction(id: ModuleId, now = Date.now()) {
    const module = modules.find((entry) => entry.id === id);
    if (!module || state.built.includes(id) || projectFor(state, id) || state.cash < module.economy.price) return;

    state = {
      ...state,
      cash: state.cash - module.economy.price,
      construction: [...state.construction, { moduleId: id, completesAt: now + module.economy.buildHours * 60 * 60 * 1000 }],
    };
    notify();
  },
  resolveConstruction,
  rushConstruction(id: ModuleId) {
    const module = modules.find((entry) => entry.id === id);
    const project = projectFor(state, id);
    if (!module || !project) return;
    const rushCost = Math.ceil(module.economy.price * 0.25);
    if (state.cash < rushCost) return;
    state = {
      ...state,
      cash: state.cash - rushCost,
      built: [...state.built, id],
      construction: state.construction.filter((entry) => entry.moduleId !== id),
    };
    notify();
  },
  rename(venueName: string) {
    state = { ...state, venueName: venueName.trim() || initialState.venueName };
    notify();
  },
  hireStarterMaster() {
    hireMaster("starter-master");
  },
  startMasterSearch(tier: MasterSearchTier, now = Date.now()) {
    if (state.masterHired || state.masterSearch) return;
    const option = masterSearchOptions[tier];
    if (state.cash < option.fee) return;
    state = { ...state, cash: state.cash - option.fee, masterSearch: { tier, completesAt: now + option.waitMinutes * 60 * 1000 } };
    notify();
  },
  resolveMasterSearch(now = Date.now()) {
    if (!state.masterSearch || state.masterSearch.completesAt > now) return;
    const first = 1 + (state.masterSearchCount % (masterCandidates.length - 1));
    const second = 1 + ((state.masterSearchCount + 1) % (masterCandidates.length - 1));
    state = { ...state, masterCandidates: [masterCandidates[first], masterCandidates[second]], masterSearch: undefined, masterSearchCount: state.masterSearchCount + 1 };
    notify();
  },
  hireMaster,
  dismissMaster() {
    if (!state.masterHired) return;
    state = { ...state, masterHired: false, master: undefined };
    notify();
  },
  hireServiceHost() {
    const tier = serviceTeamTiers[state.serviceHostCount];
    if (!tier || !state.built.includes("shop") || state.cash < tier.hireCost) return;
    const serviceHostCount = state.serviceHostCount + 1;
    state = { ...state, cash: state.cash - tier.hireCost, hostHired: true, serviceHostCount };
    notify();
  },
  trainMaster(craft: MasterCraft) {
    if (!state.master) return;
    const cost = masterCourseCost(state.master, craft);
    if (cost === 0 || state.cash < cost) return;
    state = { ...state, cash: state.cash - cost, master: { ...state.master, [craft]: state.master[craft] + 1 } };
    notify();
  },
  equipMaster(id: MasterEquipmentId) {
    const item = masterEquipment.find((entry) => entry.id === id);
    if (!state.master || !item || state.master.equipment.includes(id) || state.cash < item.price) return;
    state = { ...state, cash: state.cash - item.price, master: { ...state.master, equipment: [...state.master.equipment, id] } };
    notify();
  },
  setAdmissionPrice(admissionPrice: number) {
    state = { ...state, admissionPrice: Math.max(16, Math.min(45, Math.round(admissionPrice))) };
    notify();
  },
  updateSchedule(schedule: VenueSchedule) {
    const opensAt = Math.max(6, Math.min(22, Math.round(schedule.opensAt)));
    const closesAt = Math.max(opensAt + 2, Math.min(24, opensAt + 16, Math.round(schedule.closesAt)));
    state = { ...state, schedule: { openDays: Math.max(1, Math.min(7, Math.round(schedule.openDays))), opensAt, closesAt } };
    notify();
  },
  updateProgram(activeProgram: ActiveProgram) {
    const compositionChanged = programSignature(state.activeProgram) !== programSignature(activeProgram);
    state = {
      ...state,
      activeProgram: {
        ...activeProgram,
        // Operating choices do not create a new Gus composition.
        revealedTier: compositionChanged ? undefined : state.activeProgram.revealedTier,
      },
    };
    notify();
  },
  saveActiveProgram() {
    const composition = state.activeProgram.revealedTier;
    if (!composition) return;
    const signature = programSignature(state.activeProgram);
    if (state.repertoire.some((entry) => programSignature(entry.program) === signature)) return;
    state = {
      ...state,
      repertoire: [...state.repertoire, {
        id: `program-${state.week}-${state.repertoire.length + 1}`,
        savedAtWeek: state.week,
        composition,
        program: { ...state.activeProgram, aromaRounds: state.activeProgram.aromaRounds.map((round) => ({ ...round })) },
      }],
    };
    notify();
  },
  loadSavedProgram(id: string) {
    const saved = state.repertoire.find((entry) => entry.id === id);
    if (!saved) return;
    state = { ...state, activeProgram: { ...saved.program, aromaRounds: saved.program.aromaRounds.map((round) => ({ ...round })) } };
    notify();
  },
  setShopRange(nextRange: ShopItemId[]) {
    const allowed = new Set(shopItems.filter((item) => !item.requiresIdentity || state.repertoire.length > 0).map((item) => item.id));
    const range = [...new Set(nextRange)].filter((id): id is ShopItemId => allowed.has(id)).slice(0, 3);
    state = { ...state, shopRange: range };
    notify();
  },
  hireTechnician() {
    if (state.technicianHired || state.cash < 900) return;
    state = { ...state, cash: state.cash - 900, technicianHired: true };
    notify();
  },
  repairCost,
  dispatchRepair(id: MaintainableModuleId, now = Date.now()) {
    if (!state.technicianHired || !state.built.includes(id) || state.repairTask) return;
    const cost = repairCost(id);
    if (state.cash < cost) return;
    state = { ...state, cash: state.cash - cost, repairTask: { moduleId: id, completesAt: now + 20 * 60 * 1000 } };
    notify();
  },
  resolveRepair,
  takeLoan(id: LoanId) {
    const offer = loanOffers[id];
    const projectedDebt = outstandingDebt(state) + offer.weeklyPayment * offer.weeks;
    if (projectedDebt > borrowingLimit(state)) return;
    state = {
      ...state,
      cash: state.cash + offer.amount,
      loans: [...state.loans, { id, weeklyPayment: offer.weeklyPayment, remainingWeeks: offer.weeks }],
      financialDecisionPending: false,
    };
    notify();
  },
  advanceWeek,
  continueAtRisk() {
    // The negative-cash grace period lasts exactly as long as a realistic loan remains
    // available. Once borrowing room reaches zero while cash is still negative, waiting is no
    // longer a real choice: the player must take the loan offer that is still open, or declare
    // bankruptcy (docs/decision-log.md: "Automatic bankruptcy happens only at a financial
    // settlement where due obligations cannot be paid and no realistic approved loan... remains").
    if (!state.financialDecisionPending || !hasAvailableLoan(state)) return;
    state = { ...state, financialDecisionPending: false };
    notify();
  },
  declareBankruptcy() {
    if (!state.financialDecisionPending) return;
    state = { ...initialState, venueName: state.venueName };
    notify();
  },
  selectGuest(selectedGuestId?: string) {
    const exists = state.lastReport?.guestSnapshots?.some((guest) => guest.id === selectedGuestId);
    state = { ...state, selectedGuestId: exists ? selectedGuestId : undefined };
    notify();
  },
  selectModule(selectedModuleId?: ModuleId) {
    const exists = selectedModuleId ? state.built.includes(selectedModuleId) : false;
    state = { ...state, selectedModuleId: exists ? selectedModuleId : undefined };
    notify();
  },
  reset() {
    state = { ...initialState };
    notify();
  },
  hydrate(nextState: GameState) {
    state = { ...initialState, ...nextState };
    notify();
  },
};

export function hasModule(snapshot: GameState, id: ModuleId) {
  return snapshot.built.includes(id);
}
