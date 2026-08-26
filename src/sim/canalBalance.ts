import { previewProgram } from "./program";
import { conditionMultiplier, conditionStatus, type MaintainableModuleId } from "./maintenance";
import { canalShopAudience, defaultShopRange, resolveShopLines, shopAssortmentFit, type ShopAudience, type ShopItemId, type ShopLine } from "./shop";
import { serviceTeamArrivalPlaces, serviceTeamShopConversion, serviceTeamWeeklyWage } from "./serviceTeam";
import { canalProgramCapacity } from "../content/canalCapacity";
import type { VenueModuleId } from "../content/venueModules";

export type BalanceModuleId = VenueModuleId;

export type WeekReport = {
  admissions: number;
  specialSeats: number;
  specialCapacity?: number;
  specialOccupancy?: number;
  shopSales: number;
  shopLines: ShopLine[];
  revenue: number;
  operatingCosts: number;
  loanRepayment: number;
  netResult: number;
  revenueBreakdown: { admissions: number; specialGus: number; shop: number };
  costBreakdown: { venueBase: number; staff: number; utilitiesAndCleaning: number; programMaterials: number; shopProcurement: number; facilities: number };
  requestedSessions?: number;
  feasibleSessions?: number;
  scheduleFit: "Natural" | "Mixed" | "Awkward";
  scheduleNote: string;
  venueDemandNote?: string;
  signal: string;
  queueLoss?: number;
  bottleneck?: string;
  recoveryDemand?: number;
  guestSnapshots?: import("./guestWeek").GuestSnapshot[];
  programReview?: import("./programEvaluation").ProgramReview;
};

export type BalanceInput = {
  cash: number;
  built: readonly BalanceModuleId[];
  masterHired: boolean;
  admissionPrice: number;
  activeProgram?: import("./program").ActiveProgram;
  schedule?: import("./game").VenueSchedule;
  loanRepayment?: number;
  hostHired?: boolean;
  serviceHostCount?: number;
  masterWage?: number;
  condition?: Partial<Record<MaintainableModuleId, number>>;
  shopRange?: readonly ShopItemId[];
  brandIdentity?: number;
};

const owns = (input: BalanceInput, id: BalanceModuleId) => input.built.includes(id);

type OperatingSchedule = { openDays: number; opensAt: number; closesAt: number };

function overlap(start: number, end: number, from: number, to: number) {
  return Math.max(0, Math.min(end, to) - Math.max(start, from));
}

export function evaluateScheduleFit(schedule: OperatingSchedule, program?: import("./program").ActiveProgram) {
  const dayHours = overlap(schedule.opensAt, schedule.closesAt, 9, 17);
  const eveningHours = overlap(schedule.opensAt, schedule.closesAt, 17, 23);
  const otherHours = Math.max(0, schedule.closesAt - schedule.opensAt - dayHours - eveningHours);
  // The base Canal schedule, 10:00-20:00, is the neutral reference rather than a secret optimal choice.
  const generalTiming = Math.max(0.65, Math.min(1.15, (dayHours + eveningHours * 0.9 + otherHours * 0.6) / 9.7));
  if (!program) return { generalTiming, programTiming: 1, fit: "Natural" as const, note: "The opening window reaches both daytime recovery and early-evening demand." };

  if (program.intent === "Quiet Recovery") {
    const programTiming = dayHours >= 4 ? 1.08 : eveningHours >= 4 ? 0.9 : 0.82;
    return { generalTiming, programTiming, fit: programTiming >= 1 ? "Natural" as const : programTiming >= 0.9 ? "Mixed" as const : "Awkward" as const, note: programTiming >= 1 ? "This window gives quieter recovery visits room in the day." : "Quiet recovery can still run here, but the current window reaches fewer natural recovery visits." };
  }
  if (program.intent === "Social Energy" || program.intent === "Show Journey") {
    // Canal's neutral 10:00-20:00 plan reaches an early social window but earns no free bonus.
    // A venue must stay clearly later to gain the stronger shared-programme draw.
    const programTiming = eveningHours >= 4 ? 1.1 : eveningHours >= 2 && dayHours >= 4 ? 1 : dayHours >= 4 ? 0.88 : 0.8;
    return { generalTiming, programTiming, fit: programTiming >= 1 ? "Natural" as const : programTiming >= 0.88 ? "Mixed" as const : "Awkward" as const, note: programTiming >= 1 ? "The later window supports a shared, higher-energy programme." : "A social or show-led Gus is possible, but this window leaves less natural room for it." };
  }
  return { generalTiming, programTiming: 1, fit: "Natural" as const, note: "A classic Gus can work across the venue's current opening window." };
}

// Each branch is the Canal-specific (Repair Workshop) implementation of one archetype route from
// docs/venue-fit-archetypes-v0.1.md, which is itself tagged with the canonical guest need it
// serves from docs/guest-behaviour-model-v0.1.md's five visit motivations. Keep these three in
// sync: a fourth condition added here without an equivalent doc route (or vice versa) is exactly
// the kind of doc/code drift rettelser-fra-claude.md exists to catch.
function physicalProgramDemandFit(program: NonNullable<BalanceInput["activeProgram"]>, built: readonly BalanceModuleId[]) {
  const has = (id: BalanceModuleId) => built.includes(id);
  // "Canal Reset" route -> Recovery need.
  if (program.intent === "Quiet Recovery" && (has("shower") || has("cold-plunge"))) {
    return { multiplier: 1.1, priceSensitivity: 0.85, note: "Venue fit: the visible recovery route supports this calmer promise." };
  }
  // "Forge & Steam" route -> Social need.
  if (program.intent === "Social Energy" && has("aufguss-yard")) {
    return { multiplier: 1.15, priceSensitivity: 0.85, note: "Venue fit: the Outdoor Gus Yard supports a shared programme." };
  }
  // Special premium is not its own route: it is Workshop Classic or Forge & Steam delivered at a
  // price the venue's actual visible support can sustain, so it reuses their physical checks
  // rather than adding a fourth condition that would double-count the same support.
  if (program.intent === "Show Journey" && (has("program") || has("aufguss-yard"))) {
    return { multiplier: 1.15, priceSensitivity: 0.8, note: "Venue fit: the dedicated programme space supports a more ambitious journey." };
  }
  // "Workshop Classic" route -> Ritual need.
  if (program.intent === "Classic Ritual" && has("program")) {
    return { multiplier: 1.08, priceSensitivity: 0.9, note: "Venue fit: the dedicated sauna gives the ritual a clearer home." };
  }
  return { multiplier: 1, priceSensitivity: 1, note: undefined };
}

// Exported so the program builder can show the same factual recovery-capacity numbers before the
// player commits to a schedule, not only after running the week - reusing this instead of a
// separate UI estimate means the preview can never quietly drift from the real weekly result.
export function coldRecoveryQueueLoss(input: BalanceInput, specialSeats: number, program?: BalanceInput["activeProgram"]) {
  const hasPlunge = owns(input, "cold-plunge");
  const hasShower = owns(input, "shower");
  const usesPlungeFinish = program?.recoveryFinish === "Cold Plunge" && hasPlunge;
  const recoveryDemand = usesPlungeFinish
    ? Math.ceil(specialSeats * 0.45)
    : hasPlunge
      ? Math.ceil(specialSeats * 0.2)
      : 0;
  const sessions = program?.requestedSessions ?? 2;
  const plungeSlots = hasPlunge ? Math.floor(sessions * 2 * conditionMultiplier(input.condition?.["cold-plunge"] ?? 100)) : 0;
  const showerSlots = hasShower ? Math.floor(sessions * 2 * conditionMultiplier(input.condition?.shower ?? 100)) : 0;
  const queueLoss = Math.min(5, Math.max(0, Math.ceil((recoveryDemand - plungeSlots - showerSlots) / 2)));
  return { recoveryDemand, queueLoss, bottleneck: queueLoss > 0 ? "Cold recovery" : undefined };
}

export function simulateCanalWeek(input: BalanceInput): WeekReport {
  const hasMaster = input.masterHired;
  const hasSign = owns(input, "arrival");
  const hasShop = owns(input, "shop");
  const serviceHostCount = hasShop ? Math.max(0, Math.min(3, input.serviceHostCount ?? (input.hostHired ? 1 : 0))) : 0;
  const hasHost = serviceHostCount > 0;
  const hasProgramSauna = owns(input, "program");
  const hasYard = owns(input, "aufguss-yard");
  const hasShower = owns(input, "shower");
  const hasPlunge = owns(input, "cold-plunge");
  const hasBenchRefit = owns(input, "bench-refit");
  const programCondition = input.condition?.program ?? 100;
  const requestedSchedule = input.schedule ?? { openDays: 5, opensAt: 10, closesAt: 20 };
  // A single venue can run a long day, but not a 24-hour operation without a later shift system.
  const dailyHours = Math.max(2, Math.min(16, requestedSchedule.closesAt - requestedSchedule.opensAt));
  const schedule = { ...requestedSchedule, openDays: Math.max(1, Math.min(7, requestedSchedule.openDays)), closesAt: requestedSchedule.opensAt + dailyHours };
  const openHours = schedule.openDays * dailyHours;
  const operationFactor = openHours / 50;
  const scheduleEvaluation = evaluateScheduleFit(schedule, input.activeProgram);

  // Program Sauna's ordinary-visit benefit already flows through basePotentialGuests below and
  // is capped by this shared 82-place limit like every other module; it does not also widen the
  // cap itself, or its own presence would let admissions escape the same cap all other modules respect.
  const baseOrdinaryCapacity = 82;
  const basePotentialGuests = Math.round(((hasMaster
    ? 70 + (hasSign ? 5 : 0) + (hasPlunge ? 6 : 0) + (hasYard ? 8 : 0) + (hasProgramSauna ? 8 : 0)
    : 30 + (hasSign ? 3 : 0)) * operationFactor * scheduleEvaluation.generalTiming));
  // A Host is a natural reception-and-shop role once the venue sells goods. They improve
  // ordinary arrivals from the start, then open a fuller second flow line under pressure.
  const arrivalPressure = basePotentialGuests >= baseOrdinaryCapacity * 0.9;
  const hostArrivalRelief = serviceTeamArrivalPlaces(serviceHostCount, arrivalPressure);
  const ordinaryCapacity = baseOrdinaryCapacity + hostArrivalRelief;
  const potentialGuests = basePotentialGuests + hostArrivalRelief;
  // Admission price is a value judgement, not a fixed $24 cliff. Each visible amenity makes
  // a higher entry price credible; lower prices deliberately buy more ordinary footfall.
  const programmeReputation = input.activeProgram?.revealedTier === "Ultimate" || input.activeProgram?.revealedTier === "Iconic" ? 2 : input.activeProgram?.revealedTier === "Rare" ? 1 : 0;
  // Program Sauna does not add its own credible-price allowance: its physical-fit benefit is
  // already the bounded programDemand multiplier below, so it must not also cheapen ordinary
  // admissions and inflate general foot traffic beyond that bounded amount.
  const credibleAdmissionPrice = 24 + (hasYard ? 2 : 0) + (hasShower ? 1 : 0) + (hasPlunge ? 1 : 0) + (hasHost ? 1 : 0) + programmeReputation;
  const priceDelta = input.admissionPrice - credibleAdmissionPrice;
  const priceResistance = priceDelta < 0
    ? priceDelta * 4
    : priceDelta * 2 + Math.max(0, priceDelta - 6) * 2;
  const acceptedAdmissions = Math.max(0, Math.min(ordinaryCapacity, potentialGuests - priceResistance));

  const program = input.activeProgram;
  const preview = program ? previewProgram(program) : undefined;
  const physicalFit = program ? physicalProgramDemandFit(program, input.built) : undefined;
  // A compact room has eight guest places. Time and the requested frequency cap delivery before expansions.
  const scheduleSlots = Math.max(1, Math.floor(openHours / 6));
  const feasibleSessions = hasMaster && program && preview ? Math.max(1, Math.min(program.requestedSessions, scheduleSlots, Math.floor(120 / preview.roomMinutes))) : 0;
  // One Master runs one room or field at a time. Upgrades increase the credible session size;
  // later Masters unlock parallel lanes instead of silently multiplying one person's output.
  const programSeatCapacity = hasProgramSauna ? Math.max(1, Math.floor(canalProgramCapacity.programSauna * conditionMultiplier(programCondition))) : 0;
  const sessionSeatCapacity = (hasProgramSauna ? programSeatCapacity : hasYard ? canalProgramCapacity.outdoorGusYard : canalProgramCapacity.compactRoom)
    + (hasBenchRefit && !hasProgramSauna && !hasYard ? canalProgramCapacity.benchRefitBonus : 0);
  const starterCapacity = program ? feasibleSessions * sessionSeatCapacity : hasMaster ? 14 : 0;
  const yardSeats = !program && hasMaster && hasYard ? canalProgramCapacity.outdoorGusYard : 0;
  const idleProgramSeats = !program && hasMaster && hasProgramSauna ? programSeatCapacity : 0;
  const specialCapacity = starterCapacity + yardSeats + idleProgramSeats;
  // Frequency creates more bookable occasions, not free seat sales. Each requested session has
  // its own modest demand pool, and a higher supplement must still be justified every time.
  // The two-session starter reference remains 14 interested guests.
  const baseProgramDemand = program
    ? Math.max(0, Math.round(
      program.requestedSessions * physicalFit!.multiplier * Math.max(0,
        7
        + (program.intent === "Social Energy" ? 2.5 : program.intent === "Show Journey" ? 2 : 0)
        - Math.max(0, program.supplementPrice - 7) * 2 * physicalFit!.priceSensitivity,
      ),
    ))
    : specialCapacity;
  const programDemand = program ? Math.round(baseProgramDemand * scheduleEvaluation.programTiming) : baseProgramDemand;
  const potentialSpecialSeats = Math.min(acceptedAdmissions, specialCapacity, programDemand);
  // Recovery is a real final capacity channel. Guests who cannot complete the recovery promise
  // leave rather than becoming decorative queue sprites with a fully paid ledger entry.
  const recoveryQueue = coldRecoveryQueueLoss(input, potentialSpecialSeats, program);
  const admissions = Math.max(0, acceptedAdmissions - recoveryQueue.queueLoss);
  const specialSeats = Math.min(admissions, potentialSpecialSeats);
  const specialOccupancy = specialCapacity > 0 ? Math.round((specialSeats / specialCapacity) * 100) : 0;
  const specialRevenue = program ? specialSeats * program.supplementPrice : (hasMaster ? 14 * 7 : 0) + yardSeats * 14 + idleProgramSeats * 11;
  const specialMaterials = (preview ? preview.materialCost * feasibleSessions : hasMaster ? 23 : 0) + (hasYard ? 90 : 0) + (hasProgramSauna ? 70 : 0);

  const potentialShopSales = hasShop ? Math.round(admissions * serviceTeamShopConversion(serviceHostCount, arrivalPressure)) : 0;
  const programmeAudience: ShopAudience = { ...canalShopAudience };
  if (program?.intent === "Quiet Recovery") programmeAudience.recovery += 0.12;
  if (program?.intent === "Social Energy" || program?.intent === "Show Journey") programmeAudience.social += 0.12;
  if (program?.revealedTier === "Rare" || program?.revealedTier === "Iconic" || program?.revealedTier === "Ultimate") programmeAudience.premium += 0.1;
  const assortmentFit = shopAssortmentFit(input.shopRange ?? defaultShopRange, programmeAudience, (input.brandIdentity ?? 0) > 0);
  const shopSales = Math.round(potentialShopSales * (0.55 + assortmentFit * 1.5));
  const shopLines = resolveShopLines(input.shopRange ?? defaultShopRange, shopSales, programmeAudience, (input.brandIdentity ?? 0) > 0);
  const shopRevenue = shopLines.reduce((total, line) => total + line.revenue, 0);
  const shopProcurement = shopLines.reduce((total, line) => total + line.procurement, 0);
  const moduleCosts = (hasShower ? 20 : 0) + (hasPlunge ? 75 : 0) + (hasYard ? 100 : 0) + (hasProgramSauna ? 220 : 0);
  const admissionsRevenue = admissions * input.admissionPrice;
  const venueBase = 300 + openHours * 2;
  // 50 hours is one normal weekly staffing commitment. Extra public hours require extra
  // cover, even before the later multi-Master/shift system is implemented.
  const staffingCoverage = Math.max(1, openHours / 50);
  const staff = Math.round(((hasMaster ? (input.masterWage ?? 500) : 0) + serviceTeamWeeklyWage(serviceHostCount)) * staffingCoverage);
  const utilitiesAndCleaning = 200 + openHours * 2 + 12;
  const revenue = admissionsRevenue + specialRevenue + shopRevenue;
  const operatingCosts = venueBase + staff + utilitiesAndCleaning + specialMaterials + shopProcurement + moduleCosts;
  const loanRepayment = input.loanRepayment ?? 0;
  const netResult = revenue - operatingCosts - loanRepayment;

  let signal = "Stable compact workshop. Save for the next visible improvement.";
  if (!hasMaster) signal = "Routine admissions cover little more than the base venue. A Master unlocks the stronger loop.";
  else if (input.admissionPrice >= credibleAdmissionPrice + 7) signal = "Guests accept the price less often. Improve value or lower admission.";
  else if (recoveryQueue.bottleneck) signal = "Cold recovery is losing visits. Add or repair a shower to relieve the visible bottleneck.";
  else if (hasProgramSauna && conditionStatus(programCondition) !== "Healthy") signal = `Program Sauna is ${conditionStatus(programCondition).toLowerCase()}; programme capacity is reduced until it is serviced.`;
  else if (hasProgramSauna && !hasYard) signal = "The Program Sauna has spare potential. Improve the offer before buying more capacity.";
  else if (hasYard) signal = "Outdoor Gus is drawing attention. Master time and recovery flow now matter more.";

  return {
    admissions, specialSeats, specialCapacity, specialOccupancy, shopSales, shopLines, revenue, operatingCosts, loanRepayment, netResult, signal,
    revenueBreakdown: { admissions: admissionsRevenue, specialGus: specialRevenue, shop: shopRevenue },
    costBreakdown: { venueBase, staff, utilitiesAndCleaning, programMaterials: specialMaterials, shopProcurement, facilities: moduleCosts },
    requestedSessions: program?.requestedSessions,
    feasibleSessions: program ? feasibleSessions : undefined,
    scheduleFit: scheduleEvaluation.fit,
    scheduleNote: scheduleEvaluation.note,
    venueDemandNote: physicalFit?.note,
    ...recoveryQueue,
  };
}
