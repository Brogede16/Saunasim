import { describe, expect, it } from "vitest";
import { planVenueStaffing } from "./venueStaffing";

describe("venue staffing", () => {
  it("lets the owner cover one normal compact-venue host week for free", () => {
    const plan = planVenueStaffing({ schedule: { openDays: 5, opensAt: 10, closesAt: 20 }, serviceHostCount: 0 });
    expect(plan).toMatchObject({ openHours: 50, ownerHostHours: 50, paidHostHours: 0, uncoveredHostHours: 0, paidHostWage: 0, status: "adequate" });
  });

  it("does not let owner labour create free extended opening", () => {
    const plan = planVenueStaffing({ schedule: { openDays: 7, opensAt: 0, closesAt: 24 }, serviceHostCount: 0 });
    expect(plan.openHours).toBe(168);
    expect(plan.ownerHostHours).toBe(50);
    expect(plan.uncoveredHostHours).toBe(118);
    expect(plan.status).toBe("missing");
  });

  it("assigns hired venue hosts automatically and pays only assigned hours", () => {
    const plan = planVenueStaffing({ schedule: { openDays: 6, opensAt: 8, closesAt: 22 }, serviceHostCount: 1 });
    expect(plan.openHours).toBe(84);
    expect(plan.ownerHostHours).toBe(50);
    expect(plan.paidHostHours).toBe(34);
    expect(plan.uncoveredHostHours).toBe(0);
    expect(plan.paidHostWage).toBe(Math.round((210 / 50) * 34));
  });

  it("never treats venue staff as unlimited chain-wide capacity", () => {
    const oneVenue = planVenueStaffing({ schedule: { openDays: 7, opensAt: 0, closesAt: 24 }, serviceHostCount: 1 });
    expect(oneVenue.uncoveredHostHours).toBe(68);
  });
});
