import type { GameState } from "./game";
import { canalShopAudience, defaultShopRange, resolveShopLines, shopAssortmentFit, type ShopAudience } from "./shop";
import { serviceTeamShopConversion } from "./serviceTeam";

export type CanalBlockShopOutcome = {
  sales: number;
  revenue: number;
  procurement: number;
};

function programmeAudience(snapshot: GameState): ShopAudience {
  const audience: ShopAudience = { ...canalShopAudience };
  const program = snapshot.activeProgram;
  if (program.intent === "Quiet Recovery") audience.recovery += 0.12;
  if (program.intent === "Social Energy" || program.intent === "Show Journey") audience.social += 0.12;
  if (program.revealedTier === "Rare" || program.revealedTier === "Iconic" || program.revealedTier === "Ultimate") audience.premium += 0.1;
  return audience;
}

/**
 * Resolves shop demand inside the operating block that produced the visitors. Stock is modelled as
 * automatic replenishment, so procurement is booked alongside the sale rather than as a separate
 * inventory simulation. No weekly shop-sales oracle is supplied here.
 */
export function calculateCanalBlockShopOutcome(snapshot: GameState, admissions: number): CanalBlockShopOutcome {
  if (!snapshot.built.includes("shop") || admissions <= 0) return { sales: 0, revenue: 0, procurement: 0 };

  const audience = programmeAudience(snapshot);
  const range = snapshot.shopRange ?? defaultShopRange;
  const hasIdentity = snapshot.repertoire.length > 0;
  const assortmentFit = shopAssortmentFit(range, audience, hasIdentity);
  const conversion = serviceTeamShopConversion(snapshot.serviceHostCount, false);
  const potentialSales = Math.round(admissions * conversion);
  const sales = Math.max(0, Math.round(potentialSales * (0.55 + assortmentFit * 1.5)));
  const lines = resolveShopLines(range, sales, audience, hasIdentity);

  return {
    sales,
    revenue: lines.reduce((total, line) => total + line.revenue, 0),
    procurement: lines.reduce((total, line) => total + line.procurement, 0),
  };
}
