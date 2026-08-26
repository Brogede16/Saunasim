export const intents = ["Classic Ritual", "Quiet Recovery", "Social Energy", "Show Journey"] as const;
export const heatProfiles = ["Gentle Build", "Steady Heat", "Progressive Rounds", "Rhythmic Pulses", "High-Heat Finale"] as const;
export const formats = ["Short", "Standard", "Long"] as const;
export const performances = ["Classic Towelwork", "Quiet Ritual", "Rhythmic Flow", "Choreographed Show", "Story-led Performance"] as const;
export const musicDirections = ["Silence & Natural Sound", "Ambient", "Acoustic & Folk", "Classical & Instrumental", "Soul & Jazz", "Pop & Disco", "Electronic & Techno", "Rock & Metal", "Ritual Percussion", "Film Scores"] as const;
export const recoveryFinishes = ["No Added Finish", "Outdoor Shower", "Cold Plunge", "Natural Water Dip", "Rest Deck", "Refreshment Finish"] as const;
export const materials = ["Eucalyptus", "Peppermint", "Lemon", "Orange", "Nordic Birch", "Spruce", "Scots Pine", "Fir", "Rosemary", "Sage", "Thyme", "Lavender", "Juniper", "Mountain Pine", "Cedarwood", "Birch Tar", "Hayflower", "Green Tea", "Sea Buckthorn", "Cardamom", "Hinoki", "Coffee", "Beer & Hops", "Chilli Orange", "Dark Chocolate & Mint", "Cappuccino", "Whisky", "Myrrh", "Seaweed", "Curry Spice"] as const;
export const deliveryForms = ["Water Pour", "Scented Ice Round", "Herbal Infusion", "Fresh Birch Vihta", "Rain Pour", "Botanical Water"] as const;

export type ActiveProgram = {
  name: string;
  intent: (typeof intents)[number];
  heat: (typeof heatProfiles)[number];
  format: (typeof formats)[number];
  performance: (typeof performances)[number];
  music: (typeof musicDirections)[number];
  recoveryFinish: (typeof recoveryFinishes)[number];
  aromaRounds: Array<{ material: (typeof materials)[number]; delivery: (typeof deliveryForms)[number] }>;
  requestedSessions: number;
  supplementPrice: number;
  revealedTier?: CompositionTier;
};

export type CompositionTier = "Bad" | "Normal" | "Rare" | "Iconic" | "Ultimate";

export const starterProgram: ActiveProgram = {
  name: "Canal Ritual",
  intent: "Classic Ritual",
  heat: "Steady Heat",
  format: "Standard",
  performance: "Classic Towelwork",
  music: "Silence & Natural Sound",
  recoveryFinish: "No Added Finish",
  aromaRounds: [{ material: "Eucalyptus", delivery: "Water Pour" }],
  requestedSessions: 2,
  supplementPrice: 7,
};

export function suggestedProgramName(program: Omit<ActiveProgram, "name">) {
  if (program.intent === "Quiet Recovery") return "Stillwater Recovery";
  if (program.intent === "Social Energy") return "Canal Social";
  if (program.intent === "Show Journey" && program.music === "Rock & Metal") return "Steel & Steam";
  if (program.intent === "Show Journey") return "Canal Journey";
  return "Canal Ritual";
}

export function programSummary(program: ActiveProgram) {
  return `${program.intent} · ${program.aromaRounds.map((round) => round.material).join(" → ")} · ${program.format}`;
}

/** Stable internal identity for saving a discovered combination without using its player-written name. */
export function programSignature(program: ActiveProgram) {
  return [
    program.intent, program.heat, program.format, program.performance, program.music, program.recoveryFinish,
    ...program.aromaRounds.flatMap((round) => [round.material, round.delivery]),
  ].join("|");
}

export function materialClass(material: ActiveProgram["aromaRounds"][number]["material"]) {
  if (["Eucalyptus", "Peppermint", "Lemon", "Orange"].includes(material)) return "Everyday";
  if (["Juniper", "Mountain Pine", "Cedarwood", "Birch Tar", "Hinoki", "Coffee"].includes(material)) return "Premium";
  if (["Beer & Hops", "Chilli Orange", "Dark Chocolate & Mint", "Cappuccino", "Whisky", "Myrrh", "Seaweed", "Curry Spice"].includes(material)) return "Event";
  return "Craft";
}

export type ProgramPreview = { roomMinutes: number; guestMinutes: number; materialCost: number; composition: "Unproven"; flowNote: string };

export function previewProgram(program: ActiveProgram): ProgramPreview {
  const baseMinutes = { Short: 8, Standard: 12, Long: 17 }[program.format];
  const heatMinutes = { "Gentle Build": 0, "Steady Heat": 1, "Progressive Rounds": 2, "Rhythmic Pulses": 2, "High-Heat Finale": 3 }[program.heat];
  const deliveryMinutes = { "Water Pour": 0, "Scented Ice Round": 2, "Herbal Infusion": 2, "Fresh Birch Vihta": 2, "Rain Pour": 1, "Botanical Water": 1 };
  const deliveryCost = { "Water Pour": 0, "Scented Ice Round": 4, "Herbal Infusion": 6, "Fresh Birch Vihta": 8, "Rain Pour": 4, "Botanical Water": 3 };
  const materialCost = { Everyday: 4, Craft: 9, Premium: 16, Event: 22 };
  const roomMinutes = baseMinutes + heatMinutes + program.aromaRounds.reduce((total, round) => total + 1 + deliveryMinutes[round.delivery], 0);
  const recoveryMinutes = { "No Added Finish": 0, "Outdoor Shower": 4, "Cold Plunge": 7, "Natural Water Dip": 8, "Rest Deck": 10, "Refreshment Finish": 5 }[program.recoveryFinish];
  const guestMinutes = roomMinutes + recoveryMinutes;
  const sessionCost = program.aromaRounds.reduce((total, round) => total + materialCost[materialClass(round.material)] + deliveryCost[round.delivery], 0);
  let flowNote = "A focused single-round Gus with room to develop later.";
  if (program.aromaRounds.length === 2) flowNote = "Two rounds create a clear beginning and development.";
  if (program.aromaRounds.length === 3) flowNote = "Three rounds need a deliberate opening, centre and close.";
  if (program.format === "Short" && program.heat === "High-Heat Finale") flowNote = "Short format leaves little room for a strong finale to land.";
  return { roomMinutes, guestMinutes, materialCost: sessionCost, composition: "Unproven", flowNote };
}

export function evaluateComposition(program: ActiveProgram): CompositionTier {
  const notes = program.aromaRounds.map((round) => round.material);
  const hasExactRounds = (rounds: Array<{ material: ActiveProgram["aromaRounds"][number]["material"]; delivery: ActiveProgram["aromaRounds"][number]["delivery"] }>) =>
    program.aromaRounds.length === rounds.length && rounds.every((round, index) => round.material === program.aromaRounds[index]?.material && round.delivery === program.aromaRounds[index]?.delivery);

  // These are fixed discoveries, not a weighted chance roll. Do not expose this table in UI copy.
  if (
    (program.intent === "Classic Ritual" && program.heat === "Progressive Rounds" && program.format === "Standard" && hasExactRounds([{ material: "Nordic Birch", delivery: "Water Pour" }, { material: "Green Tea", delivery: "Botanical Water" }]) && program.performance === "Classic Towelwork" && program.music === "Acoustic & Folk" && program.recoveryFinish === "Natural Water Dip") ||
    (program.intent === "Social Energy" && program.heat === "Rhythmic Pulses" && program.format === "Standard" && hasExactRounds([{ material: "Lemon", delivery: "Scented Ice Round" }, { material: "Orange", delivery: "Water Pour" }]) && program.performance === "Rhythmic Flow" && program.music === "Pop & Disco" && program.recoveryFinish === "Cold Plunge") ||
    (program.intent === "Quiet Recovery" && program.heat === "Gentle Build" && program.format === "Standard" && hasExactRounds([{ material: "Hinoki", delivery: "Water Pour" }, { material: "Cedarwood", delivery: "Scented Ice Round" }]) && program.performance === "Quiet Ritual" && program.music === "Ambient" && program.recoveryFinish === "Rest Deck") ||
    (program.intent === "Show Journey" && program.heat === "High-Heat Finale" && program.format === "Long" && hasExactRounds([{ material: "Seaweed", delivery: "Botanical Water" }, { material: "Beer & Hops", delivery: "Water Pour" }, { material: "Chilli Orange", delivery: "Scented Ice Round" }]) && program.performance === "Story-led Performance" && program.music === "Rock & Metal" && program.recoveryFinish === "Natural Water Dip") ||
    (program.intent === "Quiet Recovery" && program.heat === "Progressive Rounds" && program.format === "Long" && hasExactRounds([{ material: "Fir", delivery: "Herbal Infusion" }, { material: "Sage", delivery: "Botanical Water" }, { material: "Lavender", delivery: "Water Pour" }]) && program.performance === "Quiet Ritual" && program.music === "Silence & Natural Sound" && program.recoveryFinish === "Rest Deck") ||
    (program.intent === "Classic Ritual" && program.heat === "High-Heat Finale" && program.format === "Long" && hasExactRounds([{ material: "Scots Pine", delivery: "Herbal Infusion" }, { material: "Juniper", delivery: "Water Pour" }, { material: "Birch Tar", delivery: "Water Pour" }]) && program.performance === "Classic Towelwork" && program.music === "Ritual Percussion" && program.recoveryFinish === "Outdoor Shower")
  ) return "Ultimate";
  if (program.format === "Short" && program.heat === "High-Heat Finale") return "Bad";
  if (program.intent === "Quiet Recovery" && (program.music === "Rock & Metal" || program.performance === "Choreographed Show")) return "Bad";
  if (program.intent === "Classic Ritual" && notes.includes("Nordic Birch") && program.performance === "Classic Towelwork") return "Rare";
  if (program.intent === "Quiet Recovery" && notes.includes("Lavender") && program.heat === "Gentle Build" && program.music === "Ambient") return "Rare";
  if (program.intent === "Social Energy" && notes.some((note) => note === "Orange" || note === "Lemon") && program.performance === "Rhythmic Flow") return "Rare";
  if (program.intent === "Show Journey" && program.aromaRounds.length === 3 && program.heat === "Progressive Rounds" && program.performance === "Story-led Performance") return "Iconic";
  return "Normal";
}
