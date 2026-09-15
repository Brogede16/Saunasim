export const REAL_MS_PER_GAME_WEEK = 24 * 60 * 60 * 1000;
export const GAME_DAYS_PER_WEEK = 7;
export const GAME_WEEKS_PER_YEAR = 52;
export const REAL_MS_PER_GAME_DAY = REAL_MS_PER_GAME_WEEK / GAME_DAYS_PER_WEEK;
export const REAL_MS_PER_GAME_YEAR = REAL_MS_PER_GAME_WEEK * GAME_WEEKS_PER_YEAR;

export type CanonicalTimestamp = number;

export function assertCanonicalInterval(from: CanonicalTimestamp, to: CanonicalTimestamp) {
  if (!Number.isFinite(from) || !Number.isFinite(to)) {
    throw new Error("Canonical simulation timestamps must be finite numbers.");
  }
  if (to < from) {
    throw new Error("Canonical simulation cannot advance backwards in time.");
  }
}

export function elapsedGameWeeks(from: CanonicalTimestamp, to: CanonicalTimestamp) {
  assertCanonicalInterval(from, to);
  return (to - from) / REAL_MS_PER_GAME_WEEK;
}

export function elapsedGameDays(from: CanonicalTimestamp, to: CanonicalTimestamp) {
  return elapsedGameWeeks(from, to) * GAME_DAYS_PER_WEEK;
}

export function gameWeekIndex(origin: CanonicalTimestamp, timestamp: CanonicalTimestamp) {
  if (!Number.isFinite(origin) || !Number.isFinite(timestamp)) {
    throw new Error("Canonical simulation timestamps must be finite numbers.");
  }
  return Math.floor((timestamp - origin) / REAL_MS_PER_GAME_WEEK);
}

export function nextGameWeekBoundary(origin: CanonicalTimestamp, after: CanonicalTimestamp) {
  const index = gameWeekIndex(origin, after);
  const boundary = origin + (index + 1) * REAL_MS_PER_GAME_WEEK;
  return boundary <= after ? boundary + REAL_MS_PER_GAME_WEEK : boundary;
}

export function splitAtGameWeekBoundaries(
  origin: CanonicalTimestamp,
  from: CanonicalTimestamp,
  to: CanonicalTimestamp,
) {
  assertCanonicalInterval(from, to);
  if (from === to) return [] as Array<{ from: number; to: number; endsGameWeek: boolean }>;

  const intervals: Array<{ from: number; to: number; endsGameWeek: boolean }> = [];
  let cursor = from;

  while (cursor < to) {
    const boundary = nextGameWeekBoundary(origin, cursor);
    const end = Math.min(boundary, to);
    intervals.push({ from: cursor, to: end, endsGameWeek: end === boundary });
    cursor = end;
  }

  return intervals;
}
