// Guest appearance mixing rules for the locked variation scope (decision-log.md, 2026-08-25):
// 2 genders x 3 body types x 10 hairstyles, realistic skin-tone/hair-colour ramps, an optional
// eye-colour variant and one optional accessory. This module decides *which combination* a guest
// gets - not how it is drawn. Every value here is a runtime palette/layer selector, matched to
// guest-sprite-production-brief-v0.1.md's layer breakdown; it renders nothing on its own and does
// not require any art to exist yet. Not yet wired into GuestSnapshot/the save schema: there is no
// sprite consumer for it, and persisting an unused field would be exactly the kind of premature
// scaffolding this project has already been burned by once (see rettelser-fra-claude.md).

// "Non-binary" is a flat-chested body with a small top-surgery-style chest scar - representation,
// not a sexualised detail. It shares the exact same slot, action rig and foot anchor as the other
// two genders (decision-log.md, 2026-08-26): 3 genders x 3 body types = 9 base bodies, not a
// special-cased extra body. The scar itself is drawn at the same restrained pixel-art treatment
// as any other body mark - never a focal point, close-up or bare-chest pose. This is purely an
// internal appearance axis; no guest-facing UI ever labels or exposes a guest's gender.
export const guestGenders = ["Feminine", "Masculine", "Non-binary"] as const;
export type GuestGender = (typeof guestGenders)[number];

export const guestBodyTypes = ["Slim", "Average", "Stocky"] as const;
export type GuestBodyType = (typeof guestBodyTypes)[number];

export const guestHairstyles = [
  "Short crop", "Buzz cut", "Curly crop", "Shoulder-length", "Long straight",
  "Long wavy", "Top knot", "Braided", "Bald", "Short afro",
] as const;
export type GuestHairstyle = (typeof guestHairstyles)[number];

// A realistic, evenly-spaced ramp rather than a small stylised set - each entry is a distinct
// shade group in the source art per pixel-art-production-guide-v0.1.md's palette-variation rule.
export const guestSkinTones = ["Porcelain", "Fair", "Light tan", "Tan", "Brown", "Deep brown"] as const;
export type GuestSkinTone = (typeof guestSkinTones)[number];

export const guestHairColours = ["Black", "Dark brown", "Brown", "Auburn", "Blonde", "Grey", "White", "Red"] as const;
export type GuestHairColour = (typeof guestHairColours)[number];

export const guestEyeColours = ["Brown", "Hazel", "Green", "Blue", "Grey"] as const;
export type GuestEyeColour = (typeof guestEyeColours)[number];

// "None" is a real, dominant option, not a placeholder: an accessory on every single guest would
// read as a costume party, not a believable crowd. See ACCESSORY_WEIGHTS below.
export const guestAccessories = ["None", "Sunglasses", "Piercing", "Sauna hat"] as const;
export type GuestAccessory = (typeof guestAccessories)[number];
const ACCESSORY_WEIGHTS = [0.7, 0.12, 0.1, 0.08] as const;

export type GuestAppearance = {
  gender: GuestGender;
  bodyType: GuestBodyType;
  hairstyle: GuestHairstyle;
  skinTone: GuestSkinTone;
  hairColour: GuestHairColour;
  eyeColour: GuestEyeColour;
  accessory: GuestAccessory;
};

// The "silhouette" is what a player's eye actually distinguishes a guest by at a glance and small
// gameplay scale - gender, body type and hairstyle. Skin/hair colour and eye colour are real but
// secondary variety; two guests sharing a colour ramp is unremarkable, two guests sharing a full
// silhouette right next to each other reads as a reused sprite.
function silhouetteKey(appearance: GuestAppearance) {
  return `${appearance.gender}-${appearance.bodyType}-${appearance.hairstyle}`;
}

// Same small deterministic PRNG shape as src/sim/guestWeek.ts's seeded(), kept independent so
// appearance never depends on guest-generation call order.
function seeded(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4_294_967_296;
  };
}

// FNV-1a: a small, well-distributed string hash so each layer draws from its own decorrelated
// seed. Reusing one seed/PRNG call sequence across layers would visibly pattern the output (for
// example every "Slim" guest always getting the same hairstyle because both were the Nth draw).
function hashSeed(text: string) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function pick<T>(options: readonly T[], guestId: string, layer: string): T {
  const random = seeded(hashSeed(`${guestId}:${layer}`));
  return options[Math.floor(random() * options.length)];
}

function pickWeighted<T>(options: readonly T[], weights: readonly number[], guestId: string, layer: string): T {
  const random = seeded(hashSeed(`${guestId}:${layer}`));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const roll = random() * total;
  let cumulative = 0;
  for (let index = 0; index < options.length; index += 1) {
    cumulative += weights[index];
    if (roll < cumulative) return options[index];
  }
  return options[options.length - 1];
}

function pickAccessory(guestId: string): GuestAccessory {
  return pickWeighted(guestAccessories, ACCESSORY_WEIGHTS, guestId, "accessory");
}

// A soft, continuous curve rather than an age cutoff: the chance of being bald or grey/white-haired
// rises gradually with age, and stays nonzero for the young and well short of certain even for the
// very old. "A guest or several may well look nothing like their age group's usual pattern, just
// proportionally less often" (owner, 2026-08-26) - so this shapes a probability, never a rule.
function agingShare(age: number | undefined, atTwenty: number, atSeventyFive: number) {
  if (age === undefined) return atTwenty;
  const normalized = Math.max(0, Math.min(1, (age - 20) / 55));
  return atTwenty + normalized * (atSeventyFive - atTwenty);
}

function pickHairstyle(guestId: string, age: number | undefined): GuestHairstyle {
  const baldIndex = guestHairstyles.indexOf("Bald");
  const baldShare = agingShare(age, 0.03, 0.3);
  const otherShare = (1 - baldShare) / (guestHairstyles.length - 1);
  const weights = guestHairstyles.map((_, index) => (index === baldIndex ? baldShare : otherShare));
  return pickWeighted(guestHairstyles, weights, guestId, "hairstyle");
}

function pickHairColour(guestId: string, age: number | undefined): GuestHairColour {
  const greySharePair = { grey: guestHairColours.indexOf("Grey"), white: guestHairColours.indexOf("White") };
  const greyWhiteShare = agingShare(age, 0.02, 0.4);
  const otherShare = (1 - greyWhiteShare) / (guestHairColours.length - 2);
  const weights = guestHairColours.map((_, index) => {
    if (index === greySharePair.grey) return greyWhiteShare * 0.6;
    if (index === greySharePair.white) return greyWhiteShare * 0.4;
    return otherShare;
  });
  return pickWeighted(guestHairColours, weights, guestId, "hairColour");
}

/**
 * Deterministic per-guest appearance: the same guest id always renders the same guest. `age`
 * (from the guest's existing profile in guestWeek.ts) softly biases hairstyle toward Bald and
 * hair colour toward Grey/White as it rises - see agingShare(). Omit it to fall back to a flat,
 * age-independent draw.
 */
export function pickGuestAppearance(guestId: string, age?: number): GuestAppearance {
  return {
    gender: pick(guestGenders, guestId, "gender"),
    bodyType: pick(guestBodyTypes, guestId, "bodyType"),
    hairstyle: pickHairstyle(guestId, age),
    skinTone: pick(guestSkinTones, guestId, "skinTone"),
    hairColour: pickHairColour(guestId, age),
    eyeColour: pick(guestEyeColours, guestId, "eyeColour"),
    accessory: pickAccessory(guestId),
  };
}

/**
 * Appearances for one visible batch (one week's sampled guests), guaranteeing no two guests share
 * a full silhouette even though each guest's own appearance stays fully deterministic. A pure
 * independent roll per guest is fine at chain scale, but a visible batch is only 4-8 guests, so
 * two identical silhouettes landing next to each other by chance is common enough to read as a
 * reused sprite rather than a coincidence. On a collision, only that one guest rerolls (seeded by
 * its own id plus the attempt number, so it stays fully deterministic), instead of reshuffling
 * the whole batch.
 */
export function pickGuestAppearances(guests: readonly { id: string; age?: number }[]): Map<string, GuestAppearance> {
  const seenSilhouettes = new Set<string>();
  const result = new Map<string, GuestAppearance>();
  for (const { id: guestId, age } of guests) {
    let appearance = pickGuestAppearance(guestId, age);
    let attempt = 1;
    while (seenSilhouettes.has(silhouetteKey(appearance)) && attempt <= 8) {
      appearance = {
        gender: pick(guestGenders, guestId, `gender:${attempt}`),
        bodyType: pick(guestBodyTypes, guestId, `bodyType:${attempt}`),
        hairstyle: pickHairstyle(`${guestId}:${attempt}`, age),
        skinTone: appearance.skinTone,
        hairColour: appearance.hairColour,
        eyeColour: appearance.eyeColour,
        accessory: appearance.accessory,
      };
      attempt += 1;
    }
    seenSilhouettes.add(silhouetteKey(appearance));
    result.set(guestId, appearance);
  }
  return result;
}
