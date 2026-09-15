import type { GameState, ModuleId } from "./game";

export type CanalPeriodCosts = {
  venueBase: number;
  utilitiesAndCleaning: number;
  facilities: number;
  total: number;
};

const FIXED_VENUE_BASE = 300;
const FIXED_UTILITIES_AND_CLEANING = 212;

const FACILITY_PERIOD_COST: Partial<Record<ModuleId, number>> = {
  shower: 20,
  "cold-plunge": 75,
  "aufguss-yard": 100,
  program: 220,
};

function operationalForPeriod(snapshot: GameState, id: ModuleId) {
  if (!snapshot.built.includes(id)) return false;
  if (snapshot.repairTask?.moduleId === id) return false;
  if (id === "program" || id === "shower" || id === "cold-plunge") {
    return (snapshot.condition[id] ?? 100) > 0;
  }
  return true;
}

/**
 * Fixed obligations are deliberately not spread across guest blocks. They are period-boundary
 * costs: the venue exists for the week even if no guest crosses the door. Variable hour/session
 * costs belong to operating blocks and are modelled separately.
 */
export function calculateCanalPeriodCosts(snapshot: GameState): CanalPeriodCosts {
  const facilities = Object.entries(FACILITY_PERIOD_COST).reduce((total, [id, cost]) => {
    return total + (operationalForPeriod(snapshot, id as ModuleId) ? (cost ?? 0) : 0);
  }, 0);
  const total = FIXED_VENUE_BASE + FIXED_UTILITIES_AND_CLEANING + facilities;
  return {
    venueBase: FIXED_VENUE_BASE,
    utilitiesAndCleaning: FIXED_UTILITIES_AND_CLEANING,
    facilities,
    total,
  };
}
