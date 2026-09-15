export type RngState = { seed: number; state: number };

function normalizeSeed(seed: number) {
  const normalized = Math.trunc(seed) >>> 0;
  return normalized === 0 ? 0x6d2b79f5 : normalized;
}

export function createRngState(seed: number): RngState {
  const normalized = normalizeSeed(seed);
  return { seed: normalized, state: normalized };
}

export function nextRng(input: RngState): { value: number; state: RngState } {
  let x = input.state >>> 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  const nextState = x >>> 0;
  return {
    value: nextState / 0x1_0000_0000,
    state: { seed: input.seed, state: nextState },
  };
}

export function nextInt(input: RngState, minInclusive: number, maxExclusive: number) {
  if (!Number.isInteger(minInclusive) || !Number.isInteger(maxExclusive) || maxExclusive <= minInclusive) {
    throw new Error("nextInt requires integer bounds with maxExclusive > minInclusive.");
  }
  const next = nextRng(input);
  return {
    value: minInclusive + Math.floor(next.value * (maxExclusive - minInclusive)),
    state: next.state,
  };
}

export function forkRng(input: RngState, streamId: string): RngState {
  let hash = input.seed ^ 0x811c9dc5;
  for (let index = 0; index < streamId.length; index += 1) {
    hash ^= streamId.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return createRngState(hash);
}
