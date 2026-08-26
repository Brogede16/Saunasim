export type MaintainableModuleId = "program" | "shower" | "cold-plunge";

export type ConditionStatus = "Healthy" | "Worn" | "Degraded" | "Critical" | "Out of service";

export function conditionStatus(condition = 100): ConditionStatus {
  if (condition <= 0) return "Out of service";
  if (condition < 10) return "Critical";
  if (condition < 40) return "Degraded";
  if (condition < 70) return "Worn";
  return "Healthy";
}

/** Keeps early wear noticeable but contained until a facility actually fails. */
export function conditionMultiplier(condition = 100) {
  if (condition <= 0) return 0;
  if (condition < 10) return 0.5;
  if (condition < 40) return 0.75;
  if (condition < 70) return 0.95;
  return 1;
}

export function conditionEffect(id: MaintainableModuleId, condition = 100) {
  const status = conditionStatus(condition);
  if (status === "Healthy") return "Full function";
  if (status === "Out of service") return "Unavailable until repaired";
  const noun = id === "program" ? "Programme seats" : "Recovery flow";
  return `${noun} reduced ${Math.round((1 - conditionMultiplier(condition)) * 100)}%`;
}

/**
 * Wear follows the physical channel each facility serves. A closed or unused facility does not
 * decay, while sustained Gus and recovery use becomes visible during a multi-day prototype test.
 */
export function conditionWear(id: MaintainableModuleId, use: { specialSeats: number; recoveryDemand: number }) {
  if (id === "program") return Math.max(0, Math.ceil(use.specialSeats / 5));
  return Math.max(0, use.recoveryDemand);
}
