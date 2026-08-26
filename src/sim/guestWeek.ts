import type { BalanceInput, WeekReport } from "./canalBalance";
import { guestFeedbackLine } from "../content/guestFeedback";
import type { ActiveProgram } from "./program";

export type GuestOutcome = "satisfied" | "mixed" | "frustrated" | "aborted";
export type GuestRouteStop = "arrival" | "queue" | "basic-sauna" | "program" | "outdoor-gus" | "shower" | "cold-plunge" | "shop" | "exit";

export type GuestSnapshot = {
  id: string;
  name: string;
  age: number;
  visitGoal: string;
  programFit: "Strong match" | "Open to it" | "Not their main reason today";
  latestActivity: string;
  visitPath: GuestRouteStop[];
  currentStop: GuestRouteStop;
  likes: string;
  dislikes: string;
  reaction: string;
  outcome: GuestOutcome;
  palette: "sand" | "moss" | "clay" | "slate" | "coral";
};

export type GuestWeekResult = {
  guestSnapshots: GuestSnapshot[];
  queueLoss: number;
  bottleneck?: string;
};

const firstNames = [
  "Avery", "Rowan", "Maya", "Theo", "Jordan", "Nora", "Sam", "Ellis", "Leila", "Jamie", "Ravi", "Morgan",
  "Iris", "Noah", "Casey", "Amara", "Robin", "Mina", "Alex", "Sasha", "Emil", "Tara", "Jules", "Cameron",
  "Arden", "Lena", "Owen", "Mika", "Drew", "Anika", "Reese", "Yuki", "Harper", "Nico", "Priya", "Kit",
] as const;

const lastNames = [
  "Bell", "Sato", "Hughes", "Lind", "Patel", "Moreau", "Kim", "Nielsen", "Okafor", "Reed", "Costa", "Berg",
  "Khan", "Walsh", "Tan", "Rossi", "Morgan", "Silva", "Park", "Fletcher", "Lund", "Hale", "Vega", "Fox",
  "Ibrahim", "Blake", "Chen", "Dawson", "Meyer", "Rowe", "Singh", "Ali", "Frost", "Bennett", "Cho", "West",
] as const;

// `need` is the canonical guest visit motivation from docs/guest-behaviour-model-v0.1.md
// (Recovery, Ritual, Social, Routine, Special premium) - every one of the five is represented
// below, so no visible guest sample can drift from the locked motivation vocabulary.
type GuestNeed = "Recovery" | "Ritual" | "Social" | "Routine" | "Special premium";
type GuestGoal = { label: string; need: GuestNeed; likes: string; dislikes: string; intents: ActiveProgram["intent"][]; shopFriendly: boolean };

const goals: GuestGoal[] = [
  { label: "Quiet recovery", need: "Recovery", likes: "Steady heat and a calm finish", dislikes: "Loud, rushed sessions", intents: ["Quiet Recovery", "Classic Ritual"], shopFriendly: false },
  { label: "A reliable ritual", need: "Ritual", likes: "A well-run Aufguss", dislikes: "Unclear waiting times", intents: ["Classic Ritual"], shopFriendly: false },
  { label: "A social reset", need: "Social", likes: "A good session with friends", dislikes: "Feeling pushed through", intents: ["Social Energy", "Show Journey"], shopFriendly: true },
  { label: "Cold-water recovery", need: "Recovery", likes: "A clean cold finish", dislikes: "A crowded recovery area", intents: ["Quiet Recovery", "Classic Ritual"], shopFriendly: false },
  // Routine is not about which Gus is running at all - it is about a fast, predictable, fairly
  // priced visit, so this guest deliberately chases no particular programme intent.
  { label: "A small treat", need: "Routine", likes: "A good value visit", dislikes: "Paying more without a clearer experience", intents: [], shopFriendly: true },
  { label: "A new programme", need: "Special premium", likes: "A distinctive Gus", dislikes: "Missing the session after waiting", intents: ["Show Journey", "Social Energy", "Classic Ritual"], shopFriendly: true },
];

// Canal's need mix (owner-approved 2026-08-26, more Social/Recovery than a Ritual/premium-heavy
// starting guess): a *tendency*, never a hard rule - every need still occurs, just at this rate.
// Update this alongside the matching Repair Workshop routes in venue-fit-archetypes-v0.1.md.
const CANAL_NEED_WEIGHTS: Record<GuestNeed, number> = {
  Routine: 0.25,
  Social: 0.25,
  Recovery: 0.2,
  Ritual: 0.2,
  "Special premium": 0.1,
};

// Split each need's share evenly across however many goals currently represent it, so adding a
// second goal for one need automatically halves each goal's individual weight instead of silently
// doubling that need's real chance.
const goalWeights: number[] = goals.map((goal) => {
  const siblingCount = goals.filter((entry) => entry.need === goal.need).length;
  return CANAL_NEED_WEIGHTS[goal.need] / siblingCount;
});

// City guests skew younger (peak 20-35); a countryside location would use an older peak instead
// - see docs/decision-log.md, 2026-08-26. This is a soft mixture, not a clamp: most guests land in
// the peak band, but a real share of every batch is drawn from the full adult range regardless, so
// an older guest at a city venue (or a younger one at a rural venue, later) is always possible,
// just proportionally less common. Bump peakShare to sharpen the skew, or widen peakMin/peakMax to
// soften it - never remove the floor for weight, an event without it silently becomes a hard rule.
type AgeProfile = { peakMin: number; peakMax: number; peakShare: number };
const CANAL_AGE_PROFILE: AgeProfile = { peakMin: 20, peakMax: 35, peakShare: 0.7 };
const FULL_AGE_RANGE = { min: 18, max: 100 } as const;

function sampleAge(random: () => number, profile: AgeProfile) {
  const inPeakBand = random() < profile.peakShare;
  const { min, max } = inPeakBand ? { min: profile.peakMin, max: profile.peakMax } : FULL_AGE_RANGE;
  return min + Math.floor(random() * (max - min + 1));
}

// A very old guest is a little slower to move through the venue, balanced by a little more time
// and money to spend once there - "not something you'd notice, but real if a venue skews very
// old" (owner, 2026-08-26). Both curves are smooth and stay at 1 (no effect) up to retirement age,
// then diverge gradually: up to 6% slower pace at the oldest end (100), balanced by up to 5% more
// spend/dwell. Deliberately not wired into the protected canalBalance.ts ledger, GuestSnapshot or
// the save schema yet - only Canal exists today and it skews young (CANAL_AGE_PROFILE), so this
// would currently be an unverifiable, near-zero effect there. Kept here as real, tested logic
// ready for whichever location's guest mix actually needs it first, the same way
// src/content/guestAppearance.ts was kept ready ahead of any final art.
export function elderPaceProfile(age: number) {
  const normalized = Math.max(0, Math.min(1, (age - 65) / 35));
  return {
    paceFactor: 1 - normalized * 0.06,
    spendFactor: 1 + normalized * 0.05,
  };
}

function pickWeighted<T>(random: () => number, items: readonly T[], weights: readonly number[]): T {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const roll = random() * total;
  let cumulative = 0;
  for (let index = 0; index < items.length; index += 1) {
    cumulative += weights[index];
    if (roll < cumulative) return items[index];
  }
  return items[items.length - 1];
}

function seeded(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function has(input: BalanceInput, id: BalanceInput["built"][number]) {
  return input.built.includes(id);
}

/** Creates a stable, readable sample of the guests behind the aggregate weekly ledger. */
export function simulateGuestWeek(input: BalanceInput, report: Pick<WeekReport, "admissions" | "specialSeats" | "shopSales" | "queueLoss" | "bottleneck" | "walkUpSeats" | "turnedAwayFromGus">, week: number, program?: ActiveProgram): GuestWeekResult {
  const random = seeded(week * 17_171 + input.admissionPrice * 97 + input.built.length * 1_003 + (input.masterHired ? 1 : 0));
  const hasPlunge = has(input, "cold-plunge");
  const hasShower = has(input, "shower");
  const hasShop = has(input, "shop");
  const hasYard = has(input, "aufguss-yard");
  const hasProgram = has(input, "program");
  const hasSign = has(input, "arrival");
  const hasHost = (input.serviceHostCount ?? (input.hostHired ? 1 : 0)) > 0;
  const usesShowerFinish = program?.recoveryFinish === "Outdoor Shower" && hasShower;
  const usesPlungeFinish = program?.recoveryFinish === "Cold Plunge" && hasPlunge;
  const highPrice = input.admissionPrice >= 31;
  const queueLoss = report.queueLoss ?? 0;
  const recoveryBottleneck = report.bottleneck === "Cold recovery";
  const count = Math.min(8, Math.max(4, Math.ceil(report.admissions / 12)));
  let visibleProgramGuest = false;

  const guestSnapshots = Array.from({ length: count }, (_, index): GuestSnapshot => {
    const first = firstNames[Math.floor(random() * firstNames.length)];
    const last = lastNames[Math.floor(random() * lastNames.length)];
    const goal = pickWeighted(random, goals, goalWeights);
    const visitGoal = goal.label;
    const likes = goal.likes;
    const dislikes = goal.dislikes;
    const age = sampleAge(random, CANAL_AGE_PROFILE);
    const palette = (["sand", "moss", "clay", "slate", "coral"] as const)[index % 5];
    let visitPath: GuestRouteStop[] = ["arrival", "basic-sauna", "exit"];
    let currentStop: GuestRouteStop = "exit";
    let latestActivity = "Leaving after a regular sauna visit";
    let reaction = "The visit felt straightforward and fairly priced.";
    let outcome: GuestOutcome = "satisfied";
    const wantsProgram = !!program && goal.intents.includes(program.intent);
    const firstVisibleProgram = report.specialSeats > 0 && index === count - 1 && !visibleProgramGuest;
    let programFit: GuestSnapshot["programFit"] = wantsProgram ? "Strong match" : firstVisibleProgram ? "Open to it" : "Not their main reason today";
    // The "Open to it" guest represents src/sim/canalBalance.ts's bounded walk-up fill when the
    // ledger actually reports spare seats this week: the Master signalled room in an already-
    // scheduled session, and this guest's need had enough affinity to say yes and pay the
    // supplement - never a guest who wanted nothing to do with the programme at all.
    const isWalkUp = firstVisibleProgram && !wantsProgram && (report.walkUpSeats ?? 0) > 0;

    if (!input.masterHired) {
      // No Master means no Gus at all, but the visit still needs its own story, not one
      // repeated line for every guest - a shop-friendly guest still stops for a drink, and
      // reaction/outcome still varies per guest, matching the variety every other state gets.
      programFit = "Not their main reason today";
      if (hasShop && report.shopSales > 0 && goal.shopFriendly && index % 3 === 1) {
        visitPath = ["arrival", "basic-sauna", "shop", "exit"];
        currentStop = "shop";
        latestActivity = "Picking up a drink from the shop after a basic sauna visit";
        reaction = guestFeedbackLine("shop", week, index);
        outcome = "mixed";
      } else if (index % 2 === 0) {
        // Every sauna room can host a basic bathing visit with no Master and no scheduled Gus
        // (decision-log.md); this guest is currently mid-visit, actually bathing, not just
        // passing through the door on the way out - the previous version always rested every
        // no-Master guest at "exit", so nobody was ever visibly using the sauna at all.
        visitPath = ["arrival", "basic-sauna"];
        currentStop = "basic-sauna";
        latestActivity = "Settling in for a basic sauna session";
        reaction = guestFeedbackLine("noMaster", week, index);
        outcome = "mixed";
      } else {
        visitPath = ["arrival", "basic-sauna", "exit"];
        latestActivity = "Leaving after a basic sauna visit";
        reaction = guestFeedbackLine("noMaster", week, index);
        outcome = "mixed";
      }
    } else if (highPrice && index < 2) {
      visitPath = ["arrival", "exit"];
      latestActivity = "Left after checking the admission price";
      reaction = guestFeedbackLine("highPrice", week, index);
      outcome = "aborted";
    } else if (recoveryBottleneck && index === 0) {
      visitPath = ["arrival", hasYard ? "outdoor-gus" : "program", "queue", "cold-plunge"];
      currentStop = "queue";
      latestActivity = "Waiting for cold recovery";
      reaction = guestFeedbackLine("coldQueue", week, index);
      outcome = "frustrated";
    } else if (hasShop && report.shopSales > 0 && goal.shopFriendly && index % 3 === 1) {
      visitPath = ["arrival", "basic-sauna", "shop", "exit"];
      currentStop = "shop";
      latestActivity = "Picking up a drink from the shop";
      reaction = guestFeedbackLine("shop", week, index);
    } else if (usesPlungeFinish && hasShower && index % 3 === 1) {
      visitPath = ["arrival", hasYard ? "outdoor-gus" : "program", "shower", "cold-plunge", "exit"];
      currentStop = "shower";
      latestActivity = "Rinsing before the cold plunge";
      reaction = guestFeedbackLine("showerBeforePlunge", week, index);
    } else if (usesShowerFinish && index % 3 === 1) {
      visitPath = ["arrival", hasYard ? "outdoor-gus" : "program", "shower", "exit"];
      currentStop = "shower";
      latestActivity = "Cooling down at the outdoor shower";
      reaction = guestFeedbackLine("shower", week, index);
    } else if ((usesPlungeFinish || (hasPlunge && visitGoal === "Cold-water recovery")) && index === 2) {
      visitPath = ["arrival", hasYard ? "outdoor-gus" : "program", "cold-plunge", "exit"];
      currentStop = "cold-plunge";
      latestActivity = "Cooling down at the cold plunge";
      reaction = guestFeedbackLine(hasShower ? "plungeWithShower" : "plunge", week, index);
    } else if (wantsProgram && (report.turnedAwayFromGus ?? 0) > 0 && index === 1) {
      // The mirror of walk-up fill: real demand src/sim/canalBalance.ts's turnedAwayFromGus
      // reports the room genuinely could not serve. This guest wanted the programme specifically
      // (goal.intents matched) and could not get a seat - not a guest who simply had no interest.
      visitPath = ["arrival", "basic-sauna", "exit"];
      currentStop = "basic-sauna";
      latestActivity = "Settling for a basic sauna visit after the Gus was full";
      reaction = guestFeedbackLine("turnedAway", week, index);
      outcome = "frustrated";
      programFit = "Strong match";
    } else if (hasYard && (wantsProgram || firstVisibleProgram) && index % 2 === 0) {
      visitPath = ["arrival", "outdoor-gus", "exit"];
      currentStop = "outdoor-gus";
      latestActivity = isWalkUp ? "Joining the outdoor Gus as a walk-up" : "Joining the outdoor Gus";
      reaction = guestFeedbackLine(isWalkUp ? "walkUp" : "outdoorGus", week, index);
      visibleProgramGuest = true;
    } else if (hasProgram && (wantsProgram || firstVisibleProgram) && index % 2 === 1) {
      visitPath = ["arrival", "program", "exit"];
      currentStop = "program";
      latestActivity = isWalkUp ? "Taking a spare seat in the programme Gus as a walk-up" : "Taking a seat for the programme Gus";
      reaction = guestFeedbackLine(isWalkUp ? "walkUp" : "programRoom", week, index);
      visibleProgramGuest = true;
    } else if (goal.need === "Routine" && !firstVisibleProgram) {
      // Routine guests do not chase a particular Gus (goal.intents is deliberately empty for
      // them); their satisfaction is about fast, predictable arrival and reception, matching the
      // Repair Workshop archetype's "Routine has no programme-flavour route" note. A Routine
      // guest who happens to be this sample's designated firstVisibleProgram ambassador still
      // falls through below - that guarantee (someone tries the visible programme even when it
      // is not their main reason) must not be silently removed by their unrelated need tag.
      visitPath = ["arrival", "basic-sauna", "exit"];
      currentStop = "basic-sauna";
      latestActivity = "Leaving after a quick, familiar visit";
      reaction = guestFeedbackLine(hasSign && hasHost ? "routineFlow" : "routineWait", week, index);
      outcome = hasSign && hasHost ? "satisfied" : "mixed";
    } else if (report.specialSeats > 0 && (wantsProgram || firstVisibleProgram)) {
      visitPath = ["arrival", "program", "exit"];
      currentStop = index % 3 === 0 || firstVisibleProgram ? "program" : "exit";
      latestActivity = currentStop !== "program" ? "Leaving after the compact Gus" : isWalkUp ? "Taking a spare seat in the compact Gus as a walk-up" : "Taking a seat for the compact Gus";
      reaction = guestFeedbackLine(isWalkUp ? "walkUp" : program?.intent === "Quiet Recovery" ? "compactQuiet" : program?.intent === "Social Energy" ? "compactSocial" : "compactClassic", week, index);
      visibleProgramGuest = true;
    } else if (report.specialSeats > 0) {
      visitPath = ["arrival", "basic-sauna", "exit"];
      currentStop = "basic-sauna";
      latestActivity = "Keeping the visit to a regular sauna session";
      reaction = "The scheduled Gus was not the main reason for this visit, so they chose a simple sauna session instead.";
      outcome = "mixed";
    }

    return {
      id: `w${week}-g${index}-${first.toLowerCase()}-${last.toLowerCase()}`,
      name: `${first} ${last}`,
      age,
      visitGoal,
      programFit,
      latestActivity,
      visitPath,
      currentStop,
      likes,
      dislikes,
      reaction,
      outcome,
      palette,
    };
  });

  return { guestSnapshots, queueLoss, bottleneck: report.bottleneck };
}
