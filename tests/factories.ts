import type { BalanceInput } from "../src/sim/canalBalance";
import type { MasterProfile } from "../src/sim/game";
import { starterProgram, type ActiveProgram } from "../src/sim/program";

export function makeMaster(overrides: Partial<MasterProfile> = {}): MasterProfile {
  return {
    name: "Starter Master",
    style: "Traditional",
    heatCraft: 3,
    aromaCraft: 3,
    performanceCraft: 2,
    weeklyWage: 500,
    equipment: [],
    ...overrides,
  };
}

export function makeProgram(overrides: Partial<ActiveProgram> = {}): ActiveProgram {
  return { ...starterProgram, aromaRounds: [...starterProgram.aromaRounds], ...overrides };
}

export function makeVenue(overrides: Partial<BalanceInput> = {}): BalanceInput {
  return { cash: 0, built: [], masterHired: true, admissionPrice: 24, ...overrides };
}
