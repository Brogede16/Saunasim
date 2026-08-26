import { simulateCanalWeek, type BalanceInput, type WeekReport } from "./canalBalance";
import { starterProgram } from "./program";

export type CanalScenarioId =
  | "owner-routine"
  | "healthy-starter"
  | "overpriced-starter"
  | "higher-frequency"
  | "capacity-before-demand"
  | "social-yard-fit"
  | "cold-recovery-pressure"
  | "loan-pressure";

export type CanalScenario = {
  id: CanalScenarioId;
  name: string;
  purpose: string;
  input: BalanceInput;
};

const base: Pick<BalanceInput, "cash" | "masterHired" | "admissionPrice"> = {
  cash: 0,
  masterHired: true,
  admissionPrice: 24,
};

// This is the balance contract, not a player-facing preset list. New systems must keep every
// scenario understandable before their numbers are allowed to affect other venues.
export const canalScenarioMatrix: CanalScenario[] = [
  {
    id: "owner-routine",
    name: "Owner routine",
    purpose: "Opening without a Master stays close to break-even, rather than silently thriving.",
    input: { cash: 0, built: [], masterHired: false, admissionPrice: 24, activeProgram: starterProgram },
  },
  {
    id: "healthy-starter",
    name: "Healthy starter",
    purpose: "Two modest Canal Ritual sessions keep the compact workshop healthy.",
    input: { ...base, built: [], activeProgram: starterProgram },
  },
  {
    id: "overpriced-starter",
    name: "Unsupported entry price",
    purpose: "A raw admission increase loses accepted visits and cannot be the dominant early strategy.",
    input: { ...base, built: [], admissionPrice: 32, activeProgram: starterProgram },
  },
  {
    id: "higher-frequency",
    name: "Higher viable frequency",
    purpose: "Additional feasible sessions create demand and inputs, but remain limited by physical seats.",
    input: { ...base, built: ["bench-refit"], activeProgram: { ...starterProgram, requestedSessions: 4 } },
  },
  {
    id: "capacity-before-demand",
    name: "Capacity before demand",
    purpose: "A Program Sauna gets only its bounded physical-fit benefit and is not an immediate money printer.",
    input: { ...base, built: ["program"], activeProgram: starterProgram },
  },
  {
    id: "social-yard-fit",
    name: "Social yard fit",
    purpose: "Outdoor Gus Yard supports a fitting shared programme through demand, not a generic bonus.",
    input: { ...base, built: ["aufguss-yard"], activeProgram: { ...starterProgram, intent: "Social Energy", performance: "Rhythmic Flow" } },
  },
  {
    id: "cold-recovery-pressure",
    name: "Cold recovery pressure",
    purpose: "A promised cold finish must have physical recovery capacity and remains a queue risk without a shower.",
    input: { ...base, built: ["cold-plunge"], activeProgram: { ...starterProgram, intent: "Quiet Recovery", recoveryFinish: "Cold Plunge", requestedSessions: 3 } },
  },
  {
    id: "loan-pressure",
    name: "Loan pressure",
    purpose: "Debt is transparent pressure on an otherwise healthy operating week, not a separate hidden rule.",
    input: { ...base, built: [], activeProgram: starterProgram, loanRepayment: 375 },
  },
];

export function runCanalScenarioMatrix() {
  return canalScenarioMatrix.map((scenario) => ({ scenario, report: simulateCanalWeek(scenario.input) }));
}

export function scenarioReport(id: CanalScenarioId): WeekReport {
  const scenario = canalScenarioMatrix.find((entry) => entry.id === id);
  if (!scenario) throw new Error(`Unknown Canal balance scenario: ${id}`);
  return simulateCanalWeek(scenario.input);
}
