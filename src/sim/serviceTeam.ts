export const serviceTeamTiers = [
  { hireCost: 450, weeklyWage: 210, arrivalPlaces: 8, shopConversion: 0.41 },
  { hireCost: 900, weeklyWage: 260, arrivalPlaces: 6, shopConversion: 0.04 },
  { hireCost: 1_500, weeklyWage: 330, arrivalPlaces: 4, shopConversion: 0.03 },
] as const;

export function serviceTeamWeeklyWage(count: number) {
  return serviceTeamTiers.slice(0, count).reduce((total, tier) => total + tier.weeklyWage, 0);
}

export function serviceTeamArrivalPlaces(count: number, underPressure: boolean) {
  const normalPlaces = serviceTeamTiers.slice(0, count).reduce((total, tier) => total + tier.arrivalPlaces, 0);
  return normalPlaces + (underPressure && count > 0 ? 4 : 0);
}

export function serviceTeamShopConversion(count: number, underPressure: boolean) {
  if (count === 0) return 0.33;
  const normalConversion = serviceTeamTiers.slice(0, count).reduce((total, tier) => total + tier.shopConversion, 0);
  return normalConversion + (underPressure ? 0.03 : 0);
}
