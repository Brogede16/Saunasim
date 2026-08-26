# Sauna Sim Seasons and Operating Calendar Contract v0.1

## Purpose

Seasons give the exterior world, recovery rituals and program language a believable rhythm. They are not a survival system, a weather forecast game or a reason to close facilities that the player has built.

## Calendar

- One in-game week equals one real 24-hour day.
- A game year contains 52 in-game weeks and therefore lasts 52 real days.
- The simulation stores a season and week index; it does not depend on the player's real-world country or weather.
- The player selects opening days and opening/closing times. Seasons do not overwrite these choices.

| Season | Game weeks | Main use |
| --- | --- | --- |
| Spring | 1-13 | reopening energy, fresh recovery, longer daylight mood |
| Summer | 14-26 | outdoor linger, water/social opportunity, evening light |
| Autumn | 27-39 | warm/cool contrast, craft ritual, sheltered recovery |
| Winter | 40-52 | cold-water ritual, steam contrast, quiet premium atmosphere |

## Mechanical Boundary

Season has a small contextual effect only through guest interest and program framing:

| Season | May slightly strengthen | Must not do |
| --- | --- | --- |
| Spring | fresh/calm recovery, daytime discovery, outdoor return | make winter programs weak or close water access |
| Summer | social linger, outdoor programs, beach/harbour timing | make indoor venues unviable or force low prices |
| Autumn | craft/tradition, sheltered rest, warm recovery | penalise outdoor venues for normal weather |
| Winter | cold ritual, contrast, steam/recovery atmosphere | freeze out natural-water routes or force players to buy heat assets |

The effect is bounded below the influence of actual program quality, Venue Fit, capacity, price and local market. A good Metal Gus can still work in winter; a quiet recovery can still work in summer.

## Natural Water Rule

Natural-water facilities remain available all year where the authored site has an eligible route. In winter, the scene's base state includes a safe maintained entry/hole/step-in area as appropriate to the location.

The player does not buy ice removal, pay for weather access, or manually manage a seasonal safety system. Water entry remains governed by its normal capacity and route contract.

## Visual Scope, Deferred

Final seasonal art is deliberately deferred until base locations, buildings, upgrade fields and effect anchors are approved. The future scene system needs only these state hooks now:

```text
season
day_night_phase
weather_flavour_seed
water_surface_state
```

Later visual layers may include snow on authored roof/ground masks, light rain/wind, stronger chimney steam, occasional birds/road movement and seasonal planting variants. They are ambient layers only: they cannot obscure routes, block taps or alter collision/guest logic.

## Weather Flavour

Weather is a short-lived visual flavour inside a season. It can influence copy and exterior ambience but has no direct penalty/bonus in the first release.

| Flavour | Allowed future effects |
| --- | --- |
| Clear | light, water sparkle, ordinary exterior movement |
| Overcast | softer palette and clouds, no system effect |
| Light rain | rain overlay, puddle/surface effects, sheltered guests use normal routes |
| Wind | trees/water/flags movement; only visual outside a future explicit safety event system |
| Snow | roof/ground masks, water contrast, breath/steam effects |

## Content and Feedback Rules

- Reports may describe a season only when it truthfully relates to a completed visit: “The cold finish is drawing more attention this week.”
- Seasonal comments are opportunities, never directives. A player can ignore them without receiving a hidden punishment.
- Materials, music and performance styles stay available all year. No seasonal inventory gate exists.
- A season may provide one contextual prompt to a Steam Guide/local mention, but it cannot change Composition Tier or unlock a hidden recipe.

## First Playable Boundary

The first simulation needs only the calendar state and one subtle `winter` contextual test for a natural-water finish. No seasonal art, snow sprite, bird, rain animation or weather UI is required before the visual production phase.
