export const shopMotivations = ["routine", "recovery", "social", "premium", "curious"] as const;
export type ShopMotivation = (typeof shopMotivations)[number];
export type ShopAudience = Record<ShopMotivation, number>;
export const canalShopAudience: ShopAudience = { routine: 0.26, recovery: 0.24, social: 0.18, premium: 0.14, curious: 0.18 };

export const shopItems = [
  { id: "cold-water", name: "Cold Water", retailPrice: 6, procurementCost: 2, draw: 2, tags: ["routine", "recovery", "social"] as ShopMotivation[], requiresIdentity: false, note: "A simple post-sauna staple." },
  { id: "herbal-tea", name: "Herbal Tea", retailPrice: 9, procurementCost: 3, draw: 1.1, tags: ["recovery", "routine"] as ShopMotivation[], requiresIdentity: false, note: "A calmer, slower recovery choice." },
  { id: "towel-rental", name: "Towel Rental", retailPrice: 5, procurementCost: 1, draw: 1.3, tags: ["routine", "recovery"] as ShopMotivation[], requiresIdentity: false, note: "A ready towel at check-in; laundering is included." },
  { id: "sauna-towel", name: "Sauna Towel", retailPrice: 18, procurementCost: 8, draw: 1, tags: ["routine", "premium"] as ShopMotivation[], requiresIdentity: false, note: "A practical take-home item." },
  { id: "house-blend", name: "House Blend Oil", retailPrice: 22, procurementCost: 10, draw: 0.9, tags: ["premium", "curious"] as ShopMotivation[], requiresIdentity: false, note: "A small-batch scent blend for home use." },
  { id: "signature-towel", name: "Signature Towel", retailPrice: 30, procurementCost: 16, draw: 0.65, tags: ["premium", "curious"] as ShopMotivation[], requiresIdentity: true, note: "Venue-logo stock costs more to order and sells at a premium." },
  { id: "fruit-snack", name: "Fruit & Nut Pack", retailPrice: 8, procurementCost: 3, draw: 1.2, tags: ["social", "recovery"] as ShopMotivation[], requiresIdentity: false, note: "A light option after a longer visit." },
] as const;

export type ShopItemId = (typeof shopItems)[number]["id"];
export type ShopLine = { itemId: ShopItemId; name: string; units: number; revenue: number; procurement: number };

export const defaultShopRange: ShopItemId[] = ["cold-water", "sauna-towel", "house-blend"];

export function shopItemAvailable(id: ShopItemId, hasIdentity: boolean) {
  const item = shopItems.find((entry) => entry.id === id);
  return !!item && (!item.requiresIdentity || hasIdentity);
}

function itemFit(item: typeof shopItems[number], audience: ShopAudience) {
  return item.tags.reduce((total, tag) => total + audience[tag], 0) / item.tags.length;
}

export function shopAssortmentFit(range: readonly ShopItemId[], audience: ShopAudience, hasIdentity: boolean) {
  const selected = shopItems.filter((item) => range.includes(item.id) && shopItemAvailable(item.id, hasIdentity));
  if (!selected.length) return 0;
  return selected.reduce((total, item) => total + itemFit(item, audience), 0) / selected.length;
}

export function resolveShopLines(range: readonly ShopItemId[], sales: number, audience: ShopAudience = canalShopAudience, hasIdentity = false): ShopLine[] {
  const selected = shopItems.filter((item) => range.includes(item.id) && shopItemAvailable(item.id, hasIdentity));
  if (sales <= 0 || selected.length === 0) return [];
  const totalDraw = selected.reduce((total, item) => total + item.draw * itemFit(item, audience), 0);
  let assigned = 0;
  return selected.map((item, index) => {
    const units = index === selected.length - 1 ? sales - assigned : Math.round((sales * item.draw * itemFit(item, audience)) / totalDraw);
    assigned += units;
    return { itemId: item.id, name: item.name, units, revenue: units * item.retailPrice, procurement: units * item.procurementCost };
  });
}
