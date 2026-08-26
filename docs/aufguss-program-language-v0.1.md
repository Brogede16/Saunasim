# Sauna Sim Aufguss Program Language v0.1

## Purpose

All player-facing Aufguss cards use one shared descriptive language. Ingredient, delivery, music, tool, Master, venue and upgrade descriptions should hint at strong combinations through ordinary words such as `Calm`, `Warm`, `Bold` and `Social`, rather than exposing a recipe table or raw formula.

These words are qualitative tags used by the composition and feedback systems. A matching word is evidence of coherence, not an automatic bonus. A deliberate contrast can work when the rest of the program gives it a clear role.

## Shared Program Language

| Tag | Player-facing meaning | Typical supporting choices |
| --- | --- | --- |
| `Calm` | Low-pressure, spacious and unhurried. | Gentle Build, Quiet Ritual, Ambient, rest finish. |
| `Fresh` | Clear, light and opening. | Citrus, mint, botanical water, daytime use. |
| `Grounded` | Earthy, woody or settling. | Woods, herbs, acoustic music, classic towelwork. |
| `Warm` | Rounded, welcoming and evening-friendly. | Orange, cardamom, cedarwood, Soul & Jazz. |
| `Ritual` | Deliberate craft, sequence and tradition. | Classic Towelwork, vihta, folk, natural-water finish. |
| `Social` | Shared energy, invitation and conversation. | Pop & Disco, folk, terrace, refreshment finish. |
| `Rhythmic` | A clear pulse that can guide movement. | Rhythmic Pulses, Rhythmic Flow, electronic or percussion. |
| `Bold` | Strong, unusual or high-contrast presence. | High-Heat Finale, Rock & Metal, Event Essence, capable Master. |
| `Playful` | Lightly surprising, accessible and clearly intentional. | Pop/Disco, citrus, selected Event Essence, social setting. |
| `Ceremonial` | Formal, focused or story-led atmosphere. | Story-led Performance, myrrh, hinoki, Film Scores. |

`Relaxing` is player-facing copy for a program that combines `Calm`, `Grounded` and/or `Warm`; it is not a separate hidden stat. `Loud` is used only as plain-language feedback for a program whose music, performance or crowd energy overwhelms a calmer promise; it is not a music genre or a guest stereotype.

## Card Format

Every selectable card contains:

```text
THYME
Warm  Grounded  Ritual

A concentrated green note for a deliberate middle round.

Works well with: steady heat, woods, acoustic ritual.
Watch for: competing strong spices can make the centre feel crowded.
```

Cards may use up to three internal shared tags, but player-facing teaching lives primarily in short, varied descriptive copy. The card must make the component's likely role understandable without showing a compatibility dashboard, a live combination map or raw tag arithmetic.

## Descriptions Teach Through Context

Each card has a short factual/sensory paragraph and a context sentence written from a reviewed phrase library. The wording varies, but the meaning remains consistent:

```text
SAGE

Soft, earthy and a little dry. Sage gives a busy program somewhere to slow down.
It is often chosen for quieter heat, especially beside wood, tea-like or evening notes.
```

```text
ROCK & METAL

Hard edges and a strong pulse. This direction can turn heat into a shared event.
It needs a Master and heat plan willing to meet its energy; dropped into a gentle recovery it can drown out the calm.
```

```text
RAIN LADLE

A broad, even pour that changes the whole room at once.
Best saved for a deliberate stronger phase, rather than used to make every round louder.
```

The player may see a compact `Good to know` sentence where helpful, such as "Often chosen for relaxation" or "Works beautifully when the heat builds in steps." The game does not use repeated fixed templates; authors create several approved phrasings for each role so the cards read as knowledge about sauna craft, not a tooltip spreadsheet.

## Component Rules

### Materials and Delivery Forms

- Every material has two or three shared tags, a sensory sentence, a role sentence and one contextual watch-for line.
- Delivery forms describe their pacing role: Water Pour is `Steady`; Ice Round is a `Calm` or `Fresh` pause; Rain Pour is `Rhythmic`/`Bold` only when supported; Vihta is `Ritual`.
- Event Essences make their unusual character explicit. Their descriptions say what kind of program could make them work and what could make them feel gimmicky, without labelling a current combination as right or wrong before it is tested.

### Music and Performance

- Music cards show their energy and social character, never a generic statement that one genre is objectively better.
- Performance cards name the movement and pacing they support. `Classic Towelwork` can be `Ritual` and `Grounded`; `Rhythmic Flow` can be `Rhythmic` and `Social`; `Story-led Performance` can be `Ceremonial` and `Bold`.
- A music/performance mismatch can be a deliberate contrast if intent and heat provide a bridge. The card should say what bridge would make the contrast readable.

### Masters and Equipment

- Master cards use the same language to describe style and music affinities, alongside the three craft ratings. They never suggest that an appearance or demographic makes someone suited to a program.
- Tool cards explain their exact role in natural language: a fan helps a `Rhythmic` or `Bold` heat phase; an infusion kit supports a `Grounded`, `Fresh` or `Ritual` aroma phase; a rain ladle supports a broad controlled `Bold` phase.

### Venue and Upgrades

- Venue and upgrade cards describe the program language they can physically support. A rest deck supports `Calm`/`Warm`; a program field can support `Social`/`Rhythmic` or `Ceremonial` depending on its setting; natural water can support `Fresh`/`Ritual` contrast.
- They must also explain the physical trade-off, such as recovery capacity or wind exposure. A tag never overrides a missing facility.

## Feedback Use

Steam Guide and guests reuse this vocabulary in varied authored sentences:

```text
"The grounded opening gave the bold final round somewhere to land."
"The music was lively, but it overwhelmed what had promised to be a calm recovery."
"The ritual felt clear from the first birch round to the water finish."
```

The text generator combines only reviewed fragments. It must never produce medical claims, insulting language or demographic assumptions.

## Ultimate Clue Rule

The six locked `Ultimate` patterns are not announced as recipes, but they cannot be practically impossible to find. Each one needs at least two complementary descriptive hints across its ingredient, music, delivery, Master or Steam Guide text. The hints explain the relationship in natural language, never announce an exact recipe or show a tier formula. The internal patterns are defined in `aufguss-ultimate-patterns-v0.1.md`.

## Implementation Boundary

The tag system supplies explainable inputs to Composition Tier, Execution Tier and Venue Fit. It does not replace their detailed rules, turn every same-tag pairing into a Rare combination, or create a visible spreadsheet of hidden points.
