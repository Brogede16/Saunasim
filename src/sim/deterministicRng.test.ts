import { describe, expect, it } from "vitest";
import { createRngState, forkRng, nextInt, nextRng } from "./deterministicRng";

describe("deterministic simulation RNG", () => {
  it("replays the same stream from the same seed", () => {
    let left = createRngState(12345);
    let right = createRngState(12345);
    const leftValues: number[] = [];
    const rightValues: number[] = [];

    for (let index = 0; index < 20; index += 1) {
      const a = nextRng(left);
      const b = nextRng(right);
      leftValues.push(a.value);
      rightValues.push(b.value);
      left = a.state;
      right = b.state;
    }

    expect(leftValues).toEqual(rightValues);
    expect(left).toEqual(right);
  });

  it("creates stable named streams without consuming the parent", () => {
    const root = createRngState(20260916);
    expect(forkRng(root, "guests")).toEqual(forkRng(root, "guests"));
    expect(forkRng(root, "guests")).not.toEqual(forkRng(root, "trends"));
    expect(root).toEqual(createRngState(20260916));
  });

  it("produces deterministic bounded integers", () => {
    const first = nextInt(createRngState(42), 3, 8);
    const second = nextInt(createRngState(42), 3, 8);
    expect(first).toEqual(second);
    expect(first.value).toBeGreaterThanOrEqual(3);
    expect(first.value).toBeLessThan(8);
  });
});
