export const guestFeedback = {
  noMaster: [
    "A simple visit, but there was no special Gus on the schedule.",
    "The heat was welcome, though the visit lacked a programme moment.",
    "A straightforward sauna stop; a Master-led session would give it more character.",
  ],
  highPrice: [
    "The entry price did not yet match the compact offer.",
    "They expected more visible value before committing to that admission.",
    "The visit looked pleasant, but not enough had changed to justify the higher price.",
  ],
  coldQueue: [
    "The Gus was good, but the cold plunge queue made the finish feel cramped.",
    "The recovery route slowed just when the session needed a clean ending.",
    "They enjoyed the heat, then lost patience waiting for cold water.",
  ],
  shop: [
    "The shop made the visit easier without interrupting the pace.",
    "A quick drink at the port was a useful, low-friction stop.",
    "The counter added a small convenience to an otherwise simple visit.",
  ],
  showerBeforePlunge: [
    "The shower gave the cold finish a calmer, more comfortable rhythm.",
    "Rinsing first made the plunge feel prepared rather than rushed.",
    "The two-step cooldown gave the session a clear physical ending.",
  ],
  shower: [
    "The shower gave the session a simple, clear finish before the guest headed on.",
    "A quick outdoor rinse was exactly enough to reset after the heat.",
    "The shower kept the cooldown practical and unhurried.",
  ],
  plungeWithShower: [
    "The shower and cold finish worked as one clear recovery route.",
    "The cold water felt sharper because the route into it was well prepared.",
    "A direct plunge worked here without turning the recovery into a wait.",
  ],
  plunge: [
    "The cold finish was memorable, even with limited recovery space.",
    "The plunge gave the visit a strong finish, though the surrounding flow was tight.",
    "Cold water was the highlight, even without much room to linger afterwards.",
  ],
  outdoorGus: [
    "The outdoor session gave this small venue a stronger reason to visit.",
    "Being outside made the programme feel like an occasion rather than a routine slot.",
    "The yard added a visible shared energy to the Gus.",
  ],
  programRoom: [
    "The dedicated room made the programme feel worth planning around.",
    "A purpose-built programme space made the visit feel more deliberate.",
    "The room gave the Gus its own identity instead of borrowing ordinary sauna time.",
  ],
  compactClassic: [
    "The compact Gus had a clear sensory identity.",
    "The session gave an otherwise simple visit one memorable moment.",
    "The pace stayed focused without asking too much of the small room.",
  ],
  compactQuiet: [
    "The calm pacing gave the compact visit a clear landing.",
    "The quieter Gus made enough room for the heat to settle.",
    "It felt intentionally unhurried, even in the smaller format.",
  ],
  compactSocial: [
    "The shared pace gave the compact visit a stronger social pull.",
    "The programme created an easy shared moment without becoming overwhelming.",
    "The room felt more lively because the session had a readable pulse.",
  ],
  routineFlow: [
    "Arrival and check-in were quick, so this stayed the easy weekly stop it should be.",
    "No fuss at the door or the counter - exactly the reliable, familiar visit they were after.",
    "The sign made it easy to find and the reception was fast, so the whole visit stayed brisk.",
  ],
  routineWait: [
    "The visit was fine, but the door and reception felt slower than a routine stop should.",
    "Nothing went wrong, it just took longer to get in and checked in than a quick visit warrants.",
    "A dependable sauna stop, held back only by a slow arrival and reception experience.",
  ],
} as const;

export type GuestFeedbackFamily = keyof typeof guestFeedback;

export function guestFeedbackLine(family: GuestFeedbackFamily, week: number, index: number) {
  const options = guestFeedback[family];
  // Keep a fixed guest slot moving through this small prototype bank. The later persisted
  // content-memory engine replaces this with the approved 30-visit cooldown contract.
  return options[(week + index) % options.length];
}
