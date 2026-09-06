import type { BalanceModuleId } from "./canalBalance";
import type { MasterProfile } from "./game";
import { type ActiveProgram, type CompositionTier } from "./program";

export type DeliveredTier = "Bad" | "Normal" | "Rare" | "Iconic";
export type ProgramReview = { composition: CompositionTier; execution: DeliveredTier; venueFit: DeliveredTier; stars: number; note: string };

const points: Record<CompositionTier | DeliveredTier, number> = { Bad: 1, Normal: 2, Rare: 3, Iconic: 4, Ultimate: 5 };

export function evaluateProgramDelivery(program: ActiveProgram, built: readonly BalanceModuleId[], master: MasterProfile | undefined, occupancy: number): ProgramReview {
  const composition = program.revealedTier ?? "Normal";
  let execution: DeliveredTier = master ? "Normal" : "Bad";
  let venueFit: DeliveredTier = "Normal";
  let note = "A competent first delivery. The next improvement should follow what guests actually notice.";

  if (!master) {
    note = "A Master is required before a Special Gus can deliver its full promise.";
  } else if (program.format === "Short" && program.heat === "High-Heat Finale") {
    execution = "Bad";
    note = "The finale arrived before the compact session had room to develop.";
  } else if (
    (program.heat === "High-Heat Finale" && master.heatCraft + (master.equipment.includes("hand-fan") ? 1 : 0) < 4) ||
    (program.aromaRounds.length === 3 && master.aromaCraft + (master.equipment.includes("infusion-kit") ? 1 : 0) < 4) ||
    (program.performance === "Choreographed Show" && master.performanceCraft + (master.equipment.includes("towel-set") ? 1 : 0) < 4)
  ) {
    execution = "Bad";
    note = "The programme asks more of this Master's current craft than the delivery can reliably carry.";
  } else {
    const styleMatch = (program.performance === "Classic Towelwork" && master.style === "Traditional") ||
      (program.performance === "Quiet Ritual" && master.style === "Meditative") ||
      (program.performance === "Rhythmic Flow" && master.style === "Energetic") ||
      ((program.performance === "Choreographed Show" || program.performance === "Story-led Performance") && master.style === "Theatrical");
    const craftPeak = master.heatCraft >= 7 && master.aromaCraft >= 7 && master.performanceCraft >= 7;

    if (points[composition] >= points.Iconic && styleMatch && craftPeak && program.supplementPrice <= 18) {
      execution = "Iconic";
      note = "The programme, Master and occasion landed at their highest level.";
    } else if (points[composition] >= points.Rare && styleMatch && program.supplementPrice <= 12) {
      execution = "Rare";
      note = "The programme's promise, price and delivery landed together.";
    }
  }

  const requiresShower = program.recoveryFinish === "Outdoor Shower";
  const requiresPlunge = program.recoveryFinish === "Cold Plunge";
  const requiresShop = program.recoveryFinish === "Refreshment Finish";
  const requiresFutureCanalFacility = program.recoveryFinish === "Natural Water Dip" || program.recoveryFinish === "Rest Deck";
  if ((requiresShower && !built.includes("shower")) || (requiresPlunge && !built.includes("cold-plunge")) || (requiresShop && !built.includes("shop")) || requiresFutureCanalFacility) {
    venueFit = "Bad";
    note = "The advertised recovery finish is not physically available at this venue.";
  } else if (program.intent === "Show Journey" && !built.includes("program") && !built.includes("aufguss-yard")) {
    venueFit = "Bad";
    note = "This show promise needs a visible program room or Outdoor Gus Sauna.";
  } else if (program.intent === "Quiet Recovery" && built.includes("shower") && built.includes("cold-plunge") && built.includes("program") && occupancy <= 75) {
    venueFit = "Iconic";
    note = "The dedicated room and complete recovery route make this a distinctive calm experience.";
  } else if (program.intent === "Social Energy" && built.includes("aufguss-yard") && built.includes("program") && occupancy >= 60 && occupancy <= 90) {
    venueFit = "Iconic";
    note = "The venue can carry the shared energy without losing flow or recovery space.";
  } else if (program.intent === "Classic Ritual" && built.includes("program") && built.includes("shower") && occupancy <= 80) {
    venueFit = "Iconic";
    note = "The dedicated sauna and simple recovery route give the ritual room to feel complete.";
  } else if (program.intent === "Show Journey" && built.includes("program") && built.includes("aufguss-yard") && occupancy >= 45 && occupancy <= 90) {
    venueFit = "Iconic";
    note = "The dedicated room and outdoor field let the full show build, peak and land cleanly.";
  } else if (program.intent === "Quiet Recovery" && (built.includes("shower") || built.includes("cold-plunge")) && occupancy <= 85) {
    venueFit = "Rare";
    note = "The recovery route gives the calm programme a credible landing.";
  } else if (program.intent === "Social Energy" && built.includes("aufguss-yard") && occupancy >= 60) {
    venueFit = "Rare";
    note = "The outdoor field and shared attendance support the social promise.";
  } else if (program.intent === "Classic Ritual" && built.includes("program")) {
    venueFit = "Rare";
    note = "The dedicated sauna supports the programme's traditional pacing.";
  } else if (program.intent === "Show Journey" && (built.includes("program") || built.includes("aufguss-yard"))) {
    venueFit = "Rare";
    note = "The venue has a credible stage for the programme, though not its full journey.";
  }

  const floor = Math.min(points[composition], points[execution], points[venueFit]);
  const allRare = points[composition] >= 3 && points[execution] >= 3 && points[venueFit] >= 3;
  return { composition, execution, venueFit, stars: Math.min(5, floor + (allRare ? 1 : 0)), note };
}
