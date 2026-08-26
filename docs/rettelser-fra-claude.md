# Rettelser fra Claude

Denne fil er en løbende log over konkrete fejl, jeg (Claude) har rettet i koden, ikke en ny designspec. Nyeste rettelse øverst. Hver post siger hvad der var galt, hvorfor det var galt, og hvad jeg ændrede - med fil:linje.

---

## 2026-08-25 — Program Sauna var en "pengemaskine" (balance-regression)

**Fejl:** Den automatiske test `tests/scenarios/canalScenarioMatrix.test.ts` fejlede: scenariet `capacity-before-demand` gav et bedre ugeresultat (659) end `healthy-starter` (558), selvom testens egen dokumenterede hensigt er at "A Program Sauna gets only its bounded physical-fit benefit and is not an immediate money printer."

**Årsag:** I [src/sim/canalBalance.ts](../src/sim/canalBalance.ts) gav det at bygge Program Sauna *tre* samtidige fordele til almindelige besøg (ikke kun til selve programmet):
1. `baseOrdinaryCapacity` fik +24 pladser — det eneste modul med den slags direkte kapacitetsboost.
2. `basePotentialGuests` fik +8.
3. `credibleAdmissionPrice` fik +2, hvilket gjorde den nuværende pris relativt billigere og dermed udløste endnu flere accepterede besøg.

Fordi kapacitetsloftet (punkt 1) blev udvidet af samme modul som øgede efterspørgslen (punkt 2+3), kunne admissions stige uden det loft, som ellers begrænser alle andre moduler. Program Saunaens egentlige, tilsigtede fordel (programkapacitet, "physical fit"-bonus til selve Aufguss-efterspørgslen) fandtes allerede korrekt i koden — den ekstra almindelige-besøg-bonus var overflødig oveni.

**Rettelse:**
- `baseOrdinaryCapacity` er nu fast 82 for alle moduler ([canalBalance.ts:121](../src/sim/canalBalance.ts)).
- `credibleAdmissionPrice` giver ikke længere +2 for Program Sauna ([canalBalance.ts:134](../src/sim/canalBalance.ts)).
- `basePotentialGuests`-bonussen på +8 er bevaret (ligesom Outdoor Gus Yard's tilsvarende +8), men er nu begrænset af det fælles kapacitetsloft, ligesom alle andre moduler.

**Resultat:** Alle 59 tests passerer. `capacity-before-demand`-scenariet giver nu et lavere resultat end `healthy-starter`, som tiltænkt.

---

## 2026-08-25 — Gemte spil kunne blive permanent ulæselige ved fremtidige schema-opdateringer

**Fejl:** [src/save/savegame.ts](../src/save/savegame.ts) tjekkede gemte spils schema-version mod en håndkodet liste: `schemaVersion !== 9 && !== 10 && !== 11 && !== SAVE_SCHEMA_VERSION`. Alt gemt data i en anden version blev afvist med det samme, uden at kigge på om dataen reelt kunne læses.

**Årsag:** Listen skal opdateres manuelt hver gang `SAVE_SCHEMA_VERSION` hæves. Projektet har allerede skiftet schema-version flere gange på få dage (v9 → v10 → v11 → v12, jf. `progress.md`). Glemmes listen ved næste bump (fx til v13), afvises selv spillets *egne, aktuelle* gemte spil — ikke kun gamle. Da næsten alle felter i schemaet allerede har Zod-`.default()`-værdier, er selve datastrukturen typisk fortsat læsbar på tværs af versioner; det var kun det håndkodede versionstjek, der forhindrede det.

**Rettelse:** Versionstjekket er erstattet af en fast nedre grænse (`MINIMUM_READABLE_SCHEMA_VERSION = 9`, hvor rigtigt inkompatible gamle saves som det tidligere `Silence`-musikvalg hører hjemme) plus det eksisterende Zod-`safeParse`-tjek, som allerede afgør reel kompatibilitet felt for felt. Fremtidige schema-bumps kræver dermed ikke længere en ekstra manuel rettelse i `loadAutosave()` for at undgå at miste spillerens gemte spil.

**Resultat:** Samme test-suite (59 tests) passerer stadig uændret; `importSave()` (eksport/import-backup) er ikke rørt og er fortsat bevidst streng (kræver eksakt nuværende version).

---

## 2026-08-25 — Docs-fundament ryddet op til fremtidig AI-coding

**Baggrund:** Projektets 67 designdokumenter er bevidst tænkt som det grundlag, en fremtidig AI-coder skal bygge det egentlige spil ud fra. Risikoen her er ikke "for mange docs", men (a) indbyrdes modstrid mellem docs, siden der endnu ikke er kode til at fange drift, og (b) uklar kanon/læserækkefølge, så en frisk AI ikke ved hvilket dokument der vinder ved uenighed. Jeg lavede en grundig krydstjekning af Canal Workshop-tal og Aufguss-vokabular på tværs af alle relevante docs og mod koden.

**Fund:** Ingen reelle tal- eller regel-modsigelser. Til gengæld var [docs/README.md](README.md)s fil-liste ufuldstændig (8 filer manglede, inkl. to af de fire audit-dokumenter), og det stod ikke eksplicit hvilken af de fire audit-versioner (v0.1-v0.4) der reelt gælder. Tre punkter fra `system-coherence-audit-v0.3.md` (negative-cash grace rule, maintenance-budget-tal, scene tap-prioritet) var aldrig markeret lukket eller videreført noget sted.

**Rettelse:**
- [docs/README.md](README.md) fik de 8 manglende filer tilføjet til fillisten, en eksplicit linje om at kun `design-closure-audit-v0.4.md` gælder, og en ny "Superseded/Historical"-sektion der navngiver hvad hver ældre audit-version er overhalet af.
- De tre tabte punkter fra `system-coherence-audit-v0.3.md` er flyttet ind i [remaining-work-overview-v0.1.md](remaining-work-overview-v0.1.md) under P1, så de ikke længere er usynlige.
- Denne fil (`rettelser-fra-claude.md`) er nu selv nævnt i README, så den er synlig for en fremtidig AI-coder.

**Resultat:** Ingen kodeændringer i denne runde — kun docs. `npx vitest run` og build er derfor uændret (59/59 tests, build OK).

---

## 2026-08-25 — Gjort klar til asset-produktion og videre kodning

**Baggrund:** Efter docs-oprydningen blev spurgt hvad der specifikt mangler, før assets/sprites kan produceres og spillet kodes videre.

**Rettelser:**
- [pixel-art-production-guide-v0.1.md](pixel-art-production-guide-v0.1.md): "Environment Backdrop"-prompt-skabelonen sagde ikke eksplicit at baggrunden skal (a) række ud over selve grunden med troværdig kontekst, så kameraets zoom-out ikke rammer en hård kant, og (b) holde byggefeltet som en generisk, uformet plads der passer til *alle* godkendte bygningsbaser for lokationen — ikke formet efter én bestemt bygning. Begge de afviste Canal-baggrunds-drafts fejlede netop på dette. Tilføjet som et eksplicit krav, der gælder alle lokationer, ikke kun Canal.
- Samme fil: alpha-kanal-verifikation er nu et formelt, nummereret trin i produktionsmetoden (trin 3), inkl. en kommandolinje-tjek-kommando — ikke kun noget der opdages efter afvisning.
- [simulation-contract-v0.1.md](simulation-contract-v0.1.md): tilføjet en tydelig "Implementation Status: Not Yet Built"-boks øverst. Kontrakten beskriver en fuld real-time simuleringsrækkefølge, men koden bruger stadig den bevidste `Run Week`-debug-stub (`src/sim/game.ts:329`). Uden denne markering kunne en fremtidig AI-coder fejlagtigt tro rækkefølgen allerede kører.
- [game-systems-map-v0.1.md](game-systems-map-v0.1.md): tilføjet en "Implementation Status"-tabel med hvert større system markeret Implemented/Partial/Not started og en fil-reference, så en fremtidig AI-coder kan se på 20 sekunder hvad der reelt er bygget (kun Canal Workshop) mod hvad der kun er vision (sæsoner, regulars, trends, multi-venue, rigtige sprites/art).

**Ikke gjort (bevidst):**
- Ingen ny asset-generering forsøgt — brugeren vurderede at billedgenerering endnu ikke er god nok til at levere brugbare production-assets, så det punkt afventer.
- Onboarding-note til en fremtidig AI-coder er droppet for nu; kommer når projektet er tættere på faktisk kodning.

**Resultat:** Kun docs-ændringer. `npx vitest run` og build uændret (59/59 tests, build OK).

**Opfølgning samme dag — sprite-stil godkendt af ejeren:** Ejeren så selv `guest-walk-reference-draft-v01.png` og vurderede stilen "perfekt". [assets/source/sprites/README.md](../assets/source/sprites/README.md) er opdateret: status ændret fra "rejected as a final base sheet (too chibi/illustration-like)" til "approved visual direction" — proportioner og stil er nu godkendt target, og den tidligere afvisningsbegrundelse er overskrevet. Det der stadig mangler er kun format/skala (ned til 24-32 px body base, sand top-down vinkel på side-frames), ikke stilen selv.

---

## 2026-08-25 — Fire afklaringsspørgsmål besvaret: negativ-kasse-regel implementeret i kode, gæste-variation og sprite-brief låst i docs

**Baggrund:** Fire åbne beslutninger blev sendt som spørgsmål: palette, gæste-visuel-variation, negativ-kasse-regel og næste asset-skridt.

**1. Palette:** "Ved ikke endnu" — ingen ændring, forbliver åben.

**2. Gæste-visuel-variation:** Låst i [decision-log.md](decision-log.md): mindst 2 køn, 3 kropstyper, 10 frisurer, realistiske/varierede hudtone- og hårfarve-ramper, valgfri øjenfarve og ét valgfrit tilbehør (solbriller/piercing/saunahue) — alt sammen palette/lag-swaps på samme delte kropsbase, aldrig separate frames. [remaining-work-overview-v0.1.md](remaining-work-overview-v0.1.md)s åbne punkt om "the visual variation package" er markeret løst for gæster (staff-uniformer er stadig åbent).

**3. Negativ-kasse-regel — implementeret, ikke kun dokumenteret:** Reglen er nu at gratisperioden ("Continue at risk") varer præcis så længe `borrowingRoom` (samlet kreditkapacitet minus udestående gæld) er over nul. Når den rammer nul mens kassen stadig er negativ, trækkes "Continue at risk" tilbage — spilleren skal enten tage et lån der stadig kan lade sig gøre, eller erklære konkurs.
- Kode: [src/sim/game.ts](../src/sim/game.ts) — `continueAtRisk()` blokerer nu når `borrowingRoom(state) <= 0`; ny `declareBankruptcy()`-handling er tilføjet, der nulstiller spillet men bevarer venue-navnet (den gamle "Declare bankruptcy"-knap kaldte bare `reset()`, som fejlagtigt også nulstillede navnet).
- UI: [src/ui/App.tsx](../src/ui/App.tsx) — finance-panelet forklarer nu tydeligt hvornår gratisperioden er slut, og skjuler "Continue at risk"-knappen i det tilfælde.
- 2 nye tests i [src/sim/game.test.ts](../src/sim/game.test.ts) dækker begge veje (kan vente mens der er lånerum; kan ikke vente og kan erklære konkurs uden lånerum).
- Dokumenteret i [decision-log.md](decision-log.md) og løst-markeret i [remaining-work-overview-v0.1.md](remaining-work-overview-v0.1.md) (lukker `system-coherence-audit-v0.3.md` punkt #5).

**4. Næste asset-skridt:** Skrevet [guest-sprite-production-brief-v0.1.md](guest-sprite-production-brief-v0.1.md) — en konkret, produktionsklar brief for gæste-sprittet: låst skala (28 px krop i 32×32 px celler, matcher det låste 16 px tile-grid), et afgrænset første-pas-scope (kun walk-4dir + idle-stand, én kropstype/frisure/hudtone), lag-opdelingen for hele variationsmatricen fra punkt 2, og en færdig genererings-prompt. Tilføjet til README.

**Resultat:** `npx vitest run` → 61/61 tests passerer (2 nye). `tsc -b` ren. Build OK (samme kendte 1.8 MB-advarsel, uændret).

---

## 2026-08-26 — Gennemgang af ChatGPTs seneste runde, to rettelser

**Baggrund:** Brugeren havde fået ChatGPT til at lave en stor runde ændringer (arkitektur-oprydning, CI, dependency-pinning, kode-splitting, m.m.). Jeg gennemgik det hele igen (via en dedikeret review-agent) og fandt at det meste var solidt — flere ting matchede præcis det jeg selv ville have anbefalet (code-splitting, dependency-pinning, CI, `venueModules.ts`/`canalCapacity.ts` som ægte fælles kilde til sandhed). To ting blev rettet:

**1. Doc-drift sneget sig ind igen.** [later-review-list.md](later-review-list.md) og [remaining-work-overview-v0.1.md](remaining-work-overview-v0.1.md) listede stadig "scene tap-prioritet" og "clickable venue overview assets" som åbne/uløste — men begge er faktisk implementeret (`src/game/CanalScene.ts:105-114,254-257`, `src/ui/App.tsx:225-227`). Verificeret i koden og markeret løst i begge docs med konkrete linje-referencer.

**2. `importSave` var strammere end `loadAutosave` uden grund.** [savegame.ts](../src/save/savegame.ts): autosave (IndexedDB) accepterede alt fra v9 og op, men manuel JSON-import krævede eksakt v12 (`z.literal(SAVE_SCHEMA_VERSION)`) — så en eksporteret backup-fil fra en lidt ældre version blev stille afvist ("Invalid save file"), selvom det samme data ville loade fint fra IndexedDB. Begge veje går nu gennem samme delte `readGameState()`-funktion med samme `MINIMUM_READABLE_SCHEMA_VERSION`-grænse, så en backup-fil og en lokal autosave nu er lige robuste. Den eksisterende test der låste den gamle, strammere adfærd er opdateret til at teste en reelt inkompatibel version i stedet, og en ny test bekræfter at en ældre-men-stadig-læsbar eksport nu importeres korrekt.

**Resultat:** `npx vitest run` → 71/71 tests passerer (2 nye/ændrede i `savegame.test.ts`). `tsc -b` ren. Build OK, `check:bundle` OK (420 KB management-bundle, under 450 KB-budgettet).

**Ikke gjort (efter aftale):** Intet git-repo initialiseret, ingen CI-kørsel afprøvet, ingen ny asset-produktion — der er endnu ikke sprite-assets at køre noget imod.

---

## 2026-08-26 — Sikret variation i gæsters udseende (mixing-logik, ikke kun spec)

**Spørgsmål:** Hvordan sikrer vi, at gæster faktisk bliver lavet forskelligt ud fra vores skabeloner (2 køn, 3 kropstyper, 10 frisurer, hudtone-/hårfarve-ramper, øjenfarve, valgfrit tilbehør), i stedet for at ende med et mønster eller ens-udseende gæster?

**Risici uden en bevidst mixing-regel:**
1. Uafhængige rene tilfældige valg pr. lag kan i en lille synlig gruppe (kun 4-8 gæster om ugen) ved ren tilfældighed give to gæster identisk silhuet lige ved siden af hinanden — ser ud som genbrugt sprite, ikke variation.
2. Genbruges det samme tilfældigheds-kald til flere lag, opstår der usynlige mønstre (fx "alle Slim-gæster får samme frisure").
3. Uden en dominerende "intet tilbehør"-vægt ville alle gæster bære solbriller/piercing/saunahue — ligner et kostumeparty.
4. Uden et stabilt per-gæst-seed ville en gæst kunne se forskellig ud fra genrendering til genrendering — et problem for den planlagte "regulars"-funktion, hvor en gæst skal kunne genkendes.

**Løsning implementeret i [src/content/guestAppearance.ts](../src/content/guestAppearance.ts):**
- Hvert lag (køn, kropstype, frisure, hudtone, hårfarve, øjenfarve, tilbehør) trækkes fra sit eget decorrelerede seed (FNV-1a hash af gæste-id + lag-navn), så der ikke opstår skjulte mønstre.
- Tilbehør er vægtet: 70% "intet", resten fordelt på solbriller/piercing/saunahue.
- `pickGuestAppearances()` sikrer, at ingen to gæster i samme synlige ugentlige gruppe deler præcis samme silhuet (køn+kropstype+frisure) — kolliderer to, re-rulles kun den ene gæst deterministisk.
- Alt er 100% deterministisk pr. gæste-id — samme gæst ser altid ens ud.
- 5 nye tests beviser garantierne: determinisme, reel spredning over 40 gæster, tilbehørs-vægtning over 300 gæster, ingen silhuet-kollision i en 8-mands gruppe, og stabile batch-resultater ved gentagne kald.

**Bevidst ikke gjort:** Ikke koblet til `GuestSnapshot`/save-schemaet endnu — der findes ingen sprite til at forbruge det endnu, og at gemme et ubrugt felt ville være præcis den slags for-tidlig scaffolding, vi allerede har set skabe problemer (jf. `hireStarterMaster`-fundet fra tidligere gennemgang).

**Resultat:** `npx vitest run` → 76/76 tests passerer (5 nye). `tsc -b` ren.

---

## 2026-08-26 — Non-binær kropsrepræsentation tilføjet til gæste-variationen

**Ønske:** En tredje kropsvariant: non-binær, fladbrystet, med et lille ar under brystet (top-surgery-stil) — ikke seksuelt, men repræsentation.

**Vurdering:** Passer naturligt ind i den eksisterende krop×kropstype-struktur uden at komplicere systemet — det bliver blot en tredje værdi i samme "gender"-slot som de to andre, med samme handlings-rig og fod-anker. Ingen ny mekanik nødvendig.

**Rettelser:**
- [decision-log.md](decision-log.md): ny låst beslutning — 3 køn × 3 kropstyper = 9 delte kroppe (mod 6 før). Arret er eksplicit beskrevet som en afdæmpet detalje på samme niveau som enhver anden kropsmarkering, aldrig et fokuspunkt, close-up eller bar-brystet positur. Ingen gæste-UI viser eller navngiver nogensinde en gæsts køn — det er en ren visuel akse ligesom hår eller hudtone.
- [guest-sprite-production-brief-v0.1.md](guest-sprite-production-brief-v0.1.md) og [remaining-work-overview-v0.1.md](remaining-work-overview-v0.1.md): tal og beskrivelse opdateret til 3 køn / 9 kroppe.
- [src/content/guestAppearance.ts](../src/content/guestAppearance.ts): `guestGenders` udvidet til `["Feminine", "Masculine", "Non-binary"]`. Ingen anden kodeændring nødvendig — mixing-logikken fra sidste rettelse virker uændret med 3 værdier i stedet for 2.

**Resultat:** `npx vitest run` → 76/76 tests passerer uændret (testerne tjekker dynamisk `guestGenders.length`, så de tilpassede sig automatisk). `tsc -b` ren.

---

## 2026-08-26 — Lokation/behov-kobling for Canal: rigtig kode, ikke kun docs

**Opgave:** Koble Canals moduler og upgrades til de 5 kanoniske gæstebehov (Recovery/Ritual/Social/Routine/Special premium), inkl. alder og pengepung som faktor, uden at det bliver "mega låst".

**1. Repair Workshop-arketyperne tagget med gæstebehov.** [venue-fit-archetypes-v0.1.md](venue-fit-archetypes-v0.1.md): Canals bygningsbase' tre ruter er nu eksplicit mærket — Forge & Steam (Social), Workshop Classic (Ritual), Canal Reset (Recovery). Special premium er bevidst *ikke* en fjerde rute (det er de to andre leveret til en pris venuet kan bære — ville ellers dobbelttælle), og Routine har slet ingen program-rute (det handler om ankomst/reception, ikke om selve Gus'en). De øvrige 12 bygninger er bevidst ikke rørt endnu.

**2. Canals behovsfordeling implementeret som vægte, ikke en fast regel.** [guestWeek.ts](../src/sim/guestWeek.ts): `CANAL_NEED_WEIGHTS` — Routine 25% · Social 25% · Recovery 20% · Ritual 20% · Special premium 10% (justeret efter din feedback om mere Social/Recovery). Hver af de 6 eksisterende gæste-"goals" er tagget med sit kanoniske behov; vægtene fordeles automatisk mellem goals der deler samme behov.

**3. Alder — vægtet fordeling, ikke hårde grænser.** Ny `sampleAge()`: 70% af Canal-gæsterne trækkes fra en "by-topzone" (20-35 år), de resterende 30% fra hele det voksne aldersspænd (19-74) — så en ældre gæst altid kan dukke op i byen, bare sjældnere. Rettede undervejs min egen fejlantagelse om by/land (gemt som hukommelse til senere runder — jeg havde først by=ældre/rigere, land=yngre, hvilket er omvendt af hvad du sagde).

**4. Ny Routine-mekanik.** En Routine-gæst reagerer nu specifikt på om Entrance Sign + Service Team findes — hurtig/glat ankomst giver tilfreds feedback, mangler begge dele giver en mild "langsom ankomst"-kommentar. To nye feedback-familier i [guestFeedback.ts](../src/content/guestFeedback.ts): `routineFlow`/`routineWait`.

**5. Hår-alder-korrelation i udseende-systemet.** [guestAppearance.ts](../src/content/guestAppearance.ts): `pickGuestAppearance(guestId, age?)` — jo ældre, jo større (men aldrig 100%, aldrig 0% for unge) sandsynlighed for skaldethed og gråt/hvidt hår, via en glidende kurve (`agingShare()`), ikke et alderscutoff. Stadig ikke koblet til selve gemte gæste-data — samme begrundelse som før (ingen kunst til at forbruge det endnu).

**6. Tests:** 4 nye tests i `guestWeek.test.ts` (alders-skew uden hård grænse, alle 5 behov forekommer med korrekt relativ vægt, Routine-specifik feedback) og 1 ny i `guestAppearance.test.ts` (ældre = markant mere skaldet/gråhåret, men aldrig hverken 0% eller næsten-sikkert).

**Resultat:** `npx vitest run` → 80/80 tests passerer (9 nye). `tsc -b` ren. Build + bundle-budget OK.

---

## 2026-08-26 — Aldersgrænser udvidet + lille, balanceret "ældre-effekt"

**1. Aldersspænd udvidet til 18-100** (mod tidligere 19-74). Canals by-topzone (20-35) er uændret. [guestWeek.ts](../src/sim/guestWeek.ts).

**2. Ny `elderPaceProfile(age)`-funktion**: meget ældre gæster bevæger sig op til ~6% langsommere gennem venuet, balanceret af op til ~5% mere forbrug/opholdstid — begge kurver flader helt ud ved 1.0 (ingen effekt) indtil et godt stykke over pensionsalder, så det er bevidst umærkeligt ved almindelige aldre og altid parret, aldrig en ensidig straf.

**Bevidst ikke gjort:** Ikke koblet ind i selve den beskyttede `canalBalance.ts`-ledger eller save-schemaet endnu. Canal skævvrider allerede mod unge gæster, så der er reelt intet at verificere effekten imod lige nu — samme begrundelse som `guestAppearance.ts` tidligere: rigtig, testet logik, klar til at blive koblet på når en lokation med en ældre gæsteprofil rent faktisk bygges, i stedet for at ændre den i forvejen skrøbelige, testede økonomimodel uden grund.

**Resultat:** `npx vitest run` → 82/82 tests passerer (2 nye). `tsc -b` ren. Build + bundle-budget OK.

---

## 2026-08-26 — To flere lokationsprofiler godkendt (docs, ingen kode endnu)

**Tilføjet:** Ny sektion "Location Demographic Tendencies" i [guest-behaviour-model-v0.1.md](guest-behaviour-model-v0.1.md), med Canal (implementeret) plus to godkendte eksempler:
- **Forest Lake/Rural Plot** (land): alder topper 45-70, lav-middel pris-tolerance, behov Recovery 30% · Social 25% · Ritual 20% · Routine 15% · Special premium 10%.
- **Industrial/Harbour** (arbejdsnær/rå identitet): bred alder let skæv 30-55, lav-middel pris-tolerance men belønner ægte koncept, behov Social 30% · Routine 25% · Recovery 20% · Ritual 15% · Special premium 10%.

Begge er markeret tydeligt "Example only - not built" i tabellen, så det ikke kan forveksles med implementeret adfærd (samme forsigtighed som resten af docs-oprydningen tidligere i sessionen). Repair Workshop optræder i begge Canal- og Industrial-rækken, fordi bygningen er kompatibel med begge lokationer — det er lokationen, ikke bygningen, der sætter den demografiske tendens.

**Resultat:** Kun docs-ændring. `npx vitest run` uændret: 82/82 tests passerer.

---

## 2026-08-26 — Alle 10 lokationer dækket, med korrekt lokation/hus-lags-adskillelse

**Model rettet:** I stedet for én fast profil pr. lokationsnavn er [guest-behaviour-model-v0.1.md](guest-behaviour-model-v0.1.md)s "Location Demographic Tendencies"-sektion nu bygget af to uafhængige lag der sammenkøres:
- **Lag 1 — Lokations-appeal + alder** (uafhængig af hvilket hus der står der): 8 rækker dækker alle lokationsfamilier.
- **Lag 2 — Hustype-appeal** (uafhængig af lokation): 12 bygninger med deres iboende træk.
- **Sammenkørt resultat**: 8 konkrete lokation×hus-kombinationer med det endelige alders-/pris-/behovsprofil, alle godkendt eksplicit via spørgsmål med begrundelse.

Dette retter en svaghed i den forrige, enklere model (én tabel med "Location family"): samme bygning kan stå på flere lokationer og samme lokation kan have flere bygninger, så en profil bundet direkte til lokationsnavnet ville have skjult den variation.

**Alle 10 låste lokationsfamilier er nu dækket** (Canal, Coast, Beach, Forest Lake, Rural Plot, Industrial, Harbour, Water Plot, Urban Lot, Hotel Rooftop). Kun Canal er implementeret; resten er tydeligt markeret "Example only - not built".

**Resultat:** Kun docs-ændring. `npx vitest run` uændret: 82/82 tests passerer.

---

## 2026-08-26 — Alle 36 lokation×hus-kombinationer dækket

**Baggrund:** Du fangede at "sammenkørt resultat"-tabellen kun havde 8 håndplukkede rækker, og at nogle af dem varierede både lokation *og* hus mellem rækkerne (fx Beach brugte Container Compound, Industrial brugte Repair Workshop) — det viser ikke rent om det er lokationen eller huset der driver forskellen. Der findes reelt 36 gyldige par ifølge `building-library-v0.1.md` (Container Compound alene passer på 6 lokationer, Saunatelt Camp på 5).

**Gjort:** [guest-behaviour-model-v0.1.md](guest-behaviour-model-v0.1.md)s "Merged result"-tabel er nu alle 36 kombinationer, ikke et udvalg. Lag 1-tabellen (lokations-appeal/alder) er splittet op, så Forest Lake, Rural Plot, Industrial og Harbour hver har deres egen række i stedet for slået sammen to og to — nødvendigt for at kunne bygge den fulde matrix præcist. Former Kursted/Badesanatorium er tilføjet til Lag 2 (var overset før).

**Metode:** Efter to afviste spørgsmålsrunder (formatet virkede ikke teknisk for dig) gik du videre med "bare gennemfør med dine forslag på alle". Tabellen er derfor markeret tydeligt: kun Canal + Repair Workshop er implementeret; alle 35 andre rækker er Claudes forslag, ikke linje-for-linje godkendt af dig — så det er klart at de skal genbesøges, første gang den pågældende lokation rent faktisk bygges, i stedet for at fremstå som færdig balance.

**Resultat:** Kun docs-ændring. `npx vitest run` uændret: 82/82 tests passerer.

---

## 2026-08-26 — De 36 kombinationer gentænkt efter tre principkorrektioner

**Baggrund:** I stedet for at forhandle 36 rækker enkeltvis, talte vi principperne igennem. Tre af de otte principper blev korrigeret:
1. Lokation skal trække nogenlunde lige så hårdt som huset, ikke kun være en svag finjustering oven på en hus-domineret grundform.
2. Special premium følger den *oplevede* unikhed ved den konkrete kombination, ikke kun husets byggepris — et billigt telt på en strand ved solnedgang kan sagtens føles unikt. Hver række er genovervejet med "hvad ville en rigtig gæst faktisk føle her", ikke en fast formel.
3. Huset må gerne trække alderen en smule, men lokationen fører stadig an.

**Gjort:** Hele "Merged result"-tabellen i [guest-behaviour-model-v0.1.md](guest-behaviour-model-v0.1.md) er genberegnet under disse tre reviderede principper. Ingen enkelt behovsandel overstiger ~45% noget sted, og ingen rammer 0%. Canal + Repair Workshop (det implementerede) er urørt.

**Resultat:** Kun docs-ændring. `npx vitest run` uændret: 82/82 tests passerer.

---

## 2026-08-26 — Lokalt git-repo oprettet

**Gjort:** `git init` + første commit. Tilføjede `*.tsbuildinfo` til `.gitignore` inden commit — de tre TypeScript-build-cache-filer var ellers blevet stagede ved en fejl (genererede, maskinspecifikke filer, ikke kildekode). Ingen hemmeligheder/credentials fundet ved gennemgang af de stagede filer.

**Bevidst ikke gjort:** Intet remote/GitHub-repo oprettet, intet pushet. Det er en separat beslutning der involverer din konto og synlighed (offentligt/privat repo), så det kræver eksplicit go fra dig — CI-workflowet (`ci.yml`) kan først rent faktisk køre, når koden er hostet på GitHub.

**Resultat:** 134 filer i første commit. `npx vitest run` → 82/82 tests passerer (kørt lige før commit for at bekræfte en ren tilstand).

---

## 2026-08-26 — Gæster overlapper ikke længere, og "ingen Master"-besøg har nu variation

**Spørgsmål:** Kan gæster stå i kø uden at det bliver urealistisk mange, og går de ikke ind i hinanden? Og er der en god historie, selv når der ikke kører nogen Gus?

**1. Fandt reelt overlap-problem.** [CanalScene.ts](../src/game/CanalScene.ts) havde intet kollisions-system — Program, Shop, Shower, almindelig sauna og kø delte alle ét eneste fast ankerpunkt, så 2+ gæster samtidig blev tegnet præcis oven i hinanden. Den eneste eksisterende afhjælpning (`index % 2` for Outdoor Gus/Cold Plunge) havde desuden en reel fejl: den brugte gæstens globale pladsnummer (0-7) i stedet for deres rækkefølge blandt dem der faktisk delte det stop, så tre gæster med samme paritet (fx index 1, 3, 5) alle kunne lande på samme plads, mens den anden plads stod tom.

**2. Rettet med en generel "cluster"-løsning**, ikke kun kø: hvert stop har nu op til 4 faste, små forskudte pladser omkring sit ankerpunkt, tildelt efter gæstens rangorden blandt dem der rent faktisk deler det stop lige nu — beregnet korrekt uanset hvor mange eller få gæster der er. Kø-stoppet er en rigtig linje (`QUEUE_SLOT_SPACING`), og er hårdt begrænset til maks. 6 synlige pladser — modellen taber allerede overskydende efterspørgsel som `queueLoss` i den økonomiske beregning, så scenen skal aldrig tegne flere end det ville se troværdigt ud med på et lille venue.

**3. "Ingen Master"-besøg har nu variation.** Før fik *alle* synlige gæster nøjagtig samme rute, samme reaktion-familie og samme udfald, når ingen Master var hyret — kun navn/alder varierede. Nu tager en shop-venlig gæst (hvis Reception Shop er bygget og der er salg) et hurtigt stop i shoppen, ligesom i alle andre spiltilstande, i stedet for at hele gæste-prøven føles ens.

**Tests:** 1 ny test i [guestWeek.test.ts](../src/sim/guestWeek.test.ts) beviser variationen i "ingen Master"-tilstanden over 30 uger. `CanalScene.ts`s cluster-logik er ikke automatisk testet (Phaser-rendering kræver et canvas/WebGL-miljø som ikke findes i denne test-opsætning i forvejen — samme begrænsning som resten af scenen), men verificeret ved kodegennemgang og `tsc -b`.

**Resultat:** `npx vitest run` → 83/83 tests passerer (1 ny). `tsc -b` ren. Build + bundle-budget OK.

---

## 2026-08-26 — Gæster var aldrig reelt vist i sauna uden Master

**Spørgsmål:** "De gik bare ind og ud, jeg tænker der er mere — de var ikke i sauna." Og: badning uden Master skal kunne lade sig gøre (rigtigt, allerede designet sådan), men det skal også være synligt.

**Fandt reel fejl:** `currentStop = "basic-sauna"` blev kun sat i de to sidste fallback-grene i [guestWeek.ts](../src/sim/guestWeek.ts), som begge kræver `specialSeats > 0`. Uden Master er `specialSeats` altid 0 (ingen kapacitet uden Master), så *alle* gæster endte med `currentStop = "exit"` uanset rute — de gik bogstaveligt talt bare forbi døren på vej ud, aldrig vist hvilende i sauna. Bekræftet ved kodegennemgang og efterfølgende live i browseren (autosave fra tidligere session, uden Master).

**Rettet:** Halvdelen af "ingen Master"-gæsterne (dem der ikke går i shoppen) hviler nu reelt ved `basic-sauna` med rute `arrival → basic-sauna` (stadig i gang med besøget), den anden halvdel vises efter de er gået (`→ exit`). Live-bekræftet i browseren: "Mika Hale — Settling in for a basic sauna session" (rute uden exit) vs. "Leila Lind — Leaving after a basic sauna visit".

**Andre lignende ting jeg lagde mærke til, men IKKE rettede endnu (afventer din prioritering):**
1. Den modsatte fejl kan findes i den tilsvarende fallback *med* Master: når ingen gæster ønsker det aktive program, sætter den sidste fallback-gren ubetinget `currentStop = "basic-sauna"` for alle der lander der — ingen af dem vises nogensinde som allerede gået. Mindre synligt problem end det lige rettede, men samme grundmønster.
2. Høj-pris-afvisning (`highPrice && index < 2`) rammer altid præcis gæst 0 og 1, uanset hvor meget overprissat venuet reelt er — en grov forenkling, ikke en "ingen historie"-fejl som de to ovenstående, men værd at nævne i samme ombæring.

**Tests:** 1 ny test beviser at nogle "ingen Master"-gæster nu reelt hviler i sauna (ikke kun dem der er gået).

**Resultat:** `npx vitest run` → 84/84 tests passerer (1 ny). `tsc -b` ren.

---

## 2026-08-26 — Kapacitets-preview i program-builderen + eksplicit "Gus er forudbestilt"-regel i docs

**Spørgsmål:** Skal en Gus der presser recovery-kapaciteten forhindres automatisk, eller skal spilleren vurdere det selv? Og er Gus forudbestilt hjemmefra, eller skal gæster stå i kø til selve sessionen?

**Svar (begge dele allerede reelt afklaret af eksisterende designprincipper — jeg gjorde dem eksplicitte og lukkede et hul):**
1. **Ingen automatisk begrænsning — kun synlighed.** Spillet forhindrer aldrig en overbooket Gus, men konsekvensen (tabte besøg, navngivet flaskehals) var kun synlig *efter* man kørte ugen. [canalBalance.ts](../src/sim/canalBalance.ts)s `coldRecoveryQueueLoss()` er nu eksporteret og genbruges direkte i [App.tsx](../src/ui/App.tsx)s program-builder til at vise samme faktuelle tal *før* man forpligter sig — i samme afdæmpede tone som lånemenuen ("her er tallene", ikke "dårlig idé"). Ingen ny beregningslogik, kun genbrug — undgår drift mellem preview og faktisk resultat.
2. **Gus er forudbestilt, kun recovery er walk-up.** Dette matcher allerede koden (der findes ingen kø-mekanik for selve Gus-sessionen, kun for koldtvandsrecovery), men var ikke skrevet eksplicit ned. Tilføjet som en tydelig, begrundet regel i [aufguss-system-v0.1.md](aufguss-system-v0.1.md) og krydsrefereret i [guest-behaviour-model-v0.1.md](guest-behaviour-model-v0.1.md), så en fremtidig AI-coder ikke fejlagtigt tilføjer en Gus-kø som en "manglende funktion".

**Bekræftet dokument-konsistens:** Du spurgte om "man kan altid bade uden Master" er skrevet ind alle steder — det var det i 3 andre docs, men ikke i `guest-behaviour-model-v0.1.md`s Core Rule, hvor jeg selv har arbejdet mest. Tilføjet der nu, med reference til de tre eksisterende badnings-niveauer (ingen Master → ren badning, Master uden Program Sauna → Basic Aufguss, Master + Program Sauna/Yard → Special Aufguss).

**Ikke gjort — afventer din prioritering:** Idéen om at Gusmesteren kan signalere ledig plads på et gushold, så walk-in-gæster kan deltage mod at betale ekstra-tillæg. God idé, men rører den beskyttede økonomi-ledger, så den bør besluttes for sig, ikke bygges i forbifarten.

**Live-verifikation:** Bekræftet i browseren efter at have brugt `window.advanceTime()` (dev QA-hook) til at oparbejde nok kassebeholdning til at bygge og ruske Cold Plunge igennem. Med Cold Plunge valgt som finish viste program-builderen præcis: "Based on last week's turnout, this recovery finish and schedule would need about 7 recovery visits against your current shower/plunge capacity - expect some cold-recovery queueing."

**Resultat:** `npx vitest run` → 85/85 tests passerer (1 ny). `tsc -b` ren.

---

## 2026-08-26 — Bundet walk-up-fyldning af ledig Gus-kapacitet implementeret

**Idé:** Gusmesteren kan signalere ledig plads i et allerede planlagt hold, så walk-in-gæster med et reelt matchende behov kan deltage mod tillæg — kun ved godt match, ikke en flad konverteringsrate.

**Implementeret i [canalBalance.ts](../src/sim/canalBalance.ts):**
- Kun tilgængelig når venuet reelt har en kapacitetsopgradering (Bench Refit/Program Sauna/Yard) — den bare startsauna har ingen fleks-plads at tilbyde, så den kanoniske "healthy starter"-reference (558) er urørt.
- Fylder kun en **bundet brøkdel** (25%) af den plads, reel efterspørgsel allerede har ladet stå tom — skalerer bevidst med selve den ledige plads, ikke med det samlede antal admissions, for at holde det genuint beskedent.
- **Beskyttet mod at genåbne det oprindelige "Program Sauna er en pengemaskine"-hul** fra start af denne session: en ny regressionstest beviser at `program`-alene stadig giver et lavere nettoresultat end en almindelig sund uge — testet direkte efter at feature'en var bygget, som fandt problemet ved 40% andel og tvang mig til at skrue den ned til 25%.
- **Gennemsigtig, ikke skjult**: nyt `walkUpSeats`-felt i rapporten, en linje i ugerapporten ("1 spare Gus seat filled by walk-up guests whose interests matched"), og en dedikeret gæste-fortælling ("walkUp"-feedback-familie) i stedet for en usynlig ledger-justering.

**6 eksisterende "gyldne tal"-tests opdaterede** (canalCapacity, canalOperations, canalScenarioMatrix) med forklarende kommentarer om hvorfor tallene ændrede sig — samme metode som Program Sauna-rettelsen fra start af sessionen.

**Live-verificeret:** Rapport-linjen viste korrekt "1 spare Gus seat filled by walk-up guests whose interests matched" i browseren. Selve gæste-fortællingen er sjælden nok (kun når den udpegede "Open to it"-gæst ikke allerede vil have Gus'en) at jeg ikke fangede den efter 7 ugers klik live — men den er bevist med en 60-ugers statistisk test i kode.

**Resultat:** `npx vitest run` → 88/88 tests passerer (5 nye/opdaterede). `tsc -b` ren. Build + bundle-budget OK.

---

## 2026-08-26 — Spejlbillede af walk-up: usolgt Gus-efterspørgsel gjort synlig

**Spørgsmål:** Kan gæster signalere "der er aldrig plads når jeg vil booke" som tegn på stor efterspørgsel? Og findes der en "kæmpe pool af potentielle gæster" der kunne bruges til at skelne stor/lille efterspørgsel?

**Svar på "poolen":** Den findes faktisk allerede — `potentialGuests` (almindelige admissions) og `programDemand` (Gus-specifikt) i `canalBalance.ts` ER den uncappede efterspørgselspool. Der var intet nyt at bygge her, kun noget der manglede at blive vist.

**Implementeret:** Det direkte spejlbillede af walk-up-fyldningen. Når reel Gus-efterspørgsel (`programDemand`) overstiger hvad rummet kan rumme, vises det nu som `WeekReport.turnedAwayFromGus`, en signal-linje ("Gus demand is outrunning capacity...") ved 5+ afviste besøg, og en dedikeret gæste-historie for en gæst der specifikt ville have programmet og ikke kunne få plads.

**Vigtig forskel fra walk-up: ingen balancerisiko overhovedet.** Modsat walk-up-fyldningen ændrer denne funktion **intet økonomisk tal** — den viser blot et gab der altid har eksisteret i den allerede beregnede `programDemand`/`specialCapacity`-sammenligning. Ingen af de 90 eksisterende tests ændrede sig af den grund.

**Live-verificeret:** Rapport-linjen "2 visits wanted this Gus but there was no room this week" virkede korrekt. Selve gæste-historien er igen sjælden nok at jeg ikke fangede den efter et par ugers klik live, men den er bevist med en 30-ugers statistisk test.

**Resultat:** `npx vitest run` → 90/90 tests passerer (2 nye). `tsc -b` ren. Build + bundle-budget OK.

---

## 2026-08-26 — Gus-belægnings-badge i selve scenen

**Idé:** En lille popup/damp-sky ved Gus'en, der viser fx "5/12" for deltagere vs. plads.

**Implementeret** i [CanalScene.ts](../src/game/CanalScene.ts): en lille damp-sky-badge ved den aktive Gus-lokation (Program Sauna, Yard, eller den almindelige dør, alt efter hvad der er bygget) der viser `specialSeats/specialCapacity` — samme tal som allerede findes i ugerapporten, ikke en ny beregning. Genbruger samme mønster som de eksisterende vedligeholdelses-badges.

**Ærlig begrænsning, som du selv nævnte:** Det er et **ugentligt aggregeret tal**, ikke en live optælling pr. session. Spillet har intet rigtigt ur endnu (afventer `simulation-contract-v0.1.md`), så kører man 2 sessioner i en uge, hæver det bare det samme samlede kapacitetstal — det viser ikke to separate badges for to sessioner. En rigtig pr.-session-opdeling skal vente til det rigtige ur bygges.

**Live-verificeret:** Badgen viste korrekt "74/88" ved indgangsdøren i browseren.

**Resultat:** `npx vitest run` → 90/90 tests passerer (uændret — ren rendering, ingen ny logik at teste). `tsc -b` ren. Build + bundle-budget OK.

---

## 2026-08-26 — Badge-placering rettet + dev-only tidsrejse-værktøj

**1. Badge-placering rettet.** Du havde ret — den viste sig "ved indgangsdøren", ikke over Gus'en. Rettet i [CanalScene.ts](../src/game/CanalScene.ts): over Yard eller Program Sauna når en af dem er bygget (uændret, var allerede korrekt), men nu over selve husets tag (ikke gadedøren) når det er en almindelig indendørs Gus uden dedikeret rum.

**2. Dev-only tidsrejse-værktøj.** Under live-test af badgen løb jeg selv ind i problemet: 3-5 timers rigtig byggetid gør manuel test langsom. Bygget [devClock.ts](../src/dev/devClock.ts) — et lille offset-ur (`devNow() = Date.now() + offset`), og et "DEV: TIME TRAVEL"-panel i Overview med -1h/+1h/+6h/+24h/Reset-knapper. Erstatter kun `Date.now()`-kaldene til konstruktion/reparation/Master-søgning — **opfinder aldrig spiluger** (det er en anden ting, allerede bevidst afvist tidligere).

**Bekræftet fjernet fra production:** `grep` på build-outputtet viser 0 forekomster af "DEV: TIME TRAVEL" — Vites `import.meta.env.DEV`-eliminering fjerner panelet helt, ligesom de eksisterende QA-hooks.

**Live-verificeret begge dele:** badgen viser nu korrekt placering; ét klik på "+6h" fuldførte et 3-timers Reception-Shop-byggeri øjeblikkeligt, uden at betale for at ruske det igennem — offset-visningen viste korrekt "+6.0h".

**Resultat:** `npx vitest run` → 90/90 tests passerer (uændret — ren dev-tooling/rendering, ingen ny simuleringslogik). `tsc -b` ren. Build + bundle-budget OK.

---

## Verificeret efter disse rettelser (seneste kørsel)
- `npx vitest run` → 90/90 tests passerer (13 filer)
- `npx tsc -b` → ingen fejl
- `npx vite build` → build lykkes, kodedelt i management-bundle (~424 KB) + separat lazy-loaded Phaser-scene-chunk (1,39 MB)
- `node scripts/check-bundle-size.mjs` → management-bundle inden for 450 KB-budgettet
