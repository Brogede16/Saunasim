import { describe, expect, it } from "vitest";
import baseline from "./fixtures/canal-baseline-v1.json";
import { simulateCanalWeek } from "./canalBalance";

describe("portable browser-to-native baseline fixtures", () => {
  it(baseline.name, () => {
    const result = simulateCanalWeek(baseline.input);
    expect(result).toMatchObject(baseline.expected);
  });
});
