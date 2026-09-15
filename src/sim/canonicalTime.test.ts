import { describe, expect, it } from "vitest";
import {
  GAME_DAYS_PER_WEEK,
  REAL_MS_PER_GAME_DAY,
  REAL_MS_PER_GAME_WEEK,
  elapsedGameDays,
  elapsedGameWeeks,
  gameWeekIndex,
  nextGameWeekBoundary,
  splitAtGameWeekBoundaries,
} from "./canonicalTime";

describe("canonical game time", () => {
  it("maps exactly 24 real hours to one game week", () => {
    expect(REAL_MS_PER_GAME_WEEK).toBe(86_400_000);
    expect(elapsedGameWeeks(0, REAL_MS_PER_GAME_WEEK)).toBe(1);
    expect(elapsedGameDays(0, REAL_MS_PER_GAME_WEEK)).toBe(GAME_DAYS_PER_WEEK);
  });

  it("maps six real hours to one quarter of a game week", () => {
    expect(elapsedGameWeeks(0, 6 * 60 * 60 * 1000)).toBe(0.25);
    expect(elapsedGameDays(0, REAL_MS_PER_GAME_DAY)).toBeCloseTo(1, 12);
  });

  it("finds stable game-week indexes and boundaries from a fixed origin", () => {
    const origin = 1_000;
    expect(gameWeekIndex(origin, origin)).toBe(0);
    expect(gameWeekIndex(origin, origin + REAL_MS_PER_GAME_WEEK - 1)).toBe(0);
    expect(gameWeekIndex(origin, origin + REAL_MS_PER_GAME_WEEK)).toBe(1);
    expect(nextGameWeekBoundary(origin, origin)).toBe(origin + REAL_MS_PER_GAME_WEEK);
  });

  it("splits long offline intervals exactly at game-week boundaries", () => {
    const origin = 10_000;
    const intervals = splitAtGameWeekBoundaries(origin, origin, origin + REAL_MS_PER_GAME_WEEK * 2.5);
    expect(intervals).toEqual([
      { from: origin, to: origin + REAL_MS_PER_GAME_WEEK, endsGameWeek: true },
      { from: origin + REAL_MS_PER_GAME_WEEK, to: origin + REAL_MS_PER_GAME_WEEK * 2, endsGameWeek: true },
      { from: origin + REAL_MS_PER_GAME_WEEK * 2, to: origin + REAL_MS_PER_GAME_WEEK * 2.5, endsGameWeek: false },
    ]);
  });

  it("refuses backwards time", () => {
    expect(() => elapsedGameWeeks(2, 1)).toThrow(/backwards/i);
  });
});
