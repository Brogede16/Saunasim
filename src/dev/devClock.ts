// A local time-travel offset for real-time construction/repair/Master-search timers, so testing
// a 5h build no longer means either waiting 5 real hours or paying to rush it every time. Reading
// devNow() is always safe to ship - it is exactly Date.now() until something actually shifts the
// offset, and only the dev-only Time Travel panel (see App.tsx, import.meta.env.DEV) can do that.
let offsetMs = 0;

export function devNow() {
  return Date.now() + offsetMs;
}

export function shiftDevClock(deltaMs: number) {
  offsetMs += deltaMs;
}

export function resetDevClock() {
  offsetMs = 0;
}

export function devClockOffsetHours() {
  return offsetMs / (60 * 60 * 1000);
}
