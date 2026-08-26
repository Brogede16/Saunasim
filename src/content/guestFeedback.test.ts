import { describe, expect, it } from "vitest";
import { guestFeedbackLine } from "./guestFeedback";

describe("guest feedback rotation", () => {
  it("does not repeat the same family line for a fixed guest slot in consecutive weeks", () => {
    const lines = [1, 2, 3].map((week) => guestFeedbackLine("shop", week, 0));
    expect(new Set(lines).size).toBe(3);
  });
});
