# Sauna Empire Content Studio

## Purpose

Sauna Empire Content Studio is an internal macOS authoring tool built in the same Xcode workspace as the game. Its purpose is to let a non-programmer create, review, validate and maintain locations, buildings, modules, upgrades, routes and asset metadata without editing Swift by hand.

It is not part of the player-facing game. It is a production tool and should be easier to understand than the underlying data model.

## Core UX principle

At every moment the Studio must make one question obvious:

**What does this item belong to, and what can legally be attached to it?**

The interface must never present one undifferentiated catalogue of buildings and upgrades.

## Canonical hierarchy

```text
Location
├── Environment / site
├── Start Building Choices
│   ├── Base Building A
│   │   ├── Base-building upgrades
│   │   └── Compatible add-on anchor groups
│   └── Base Building B
│       ├── Base-building upgrades
│       └── Compatible add-on anchor groups
├── Location-owned modules
│   └── modules that belong to the site rather than a building
├── Shared compatible modules
└── Routes, activity points, effects and masks

Add-on Module
├── Module asset/state
├── Module upgrades
├── Capacity/economy/effects
└── Its own child anchors, if any
```

## Content classes

Every item must have exactly one structural class:

1. **Location** - the physical site/environment.
2. **Start Building** - a building that may be selected as the venue's initial operating base.
3. **Add-on Module** - a new physical facility/structure bought later.
4. **Base Upgrade** - changes/improves a start building without becoming a separate free-standing module.
5. **Module Upgrade** - changes/improves a specific add-on module.
6. **Location Module** - belongs to the site itself, e.g. an authored water/shore/roof field, not to the building.
7. **Shared Prop/Facility** - reusable content permitted only through compatibility rules.
8. **Visual/Effect Asset** - non-ownable rendering content such as steam, ripple, shadow or decorative state.

The Studio must use distinct icons and labels for these classes.

## Provenance and approval

Every content record must contain a visible status:

- `approved`
- `proposal`
- `legacy_reference`
- `placeholder`
- `deprecated`

And a provenance field:

- `user_decision`
- `existing_repo`
- `agent_suggestion`
- `generated_test_data`

An AI suggestion can never become `approved` automatically.

Specific city names, venue names and market names created by agents are proposals unless the user explicitly approves them.

## Location editor

The Location screen should show:

### Left: hierarchy

A collapsible tree showing the exact ownership chain.

Example:

```text
Location X
  Environment
  Start Buildings
    Building A
      Base Upgrades
      Add-on slots
    Building B
  Location Modules
  Shared Eligible Modules
  Routes
  Effects
```

Selecting an item highlights it in the preview.

### Center: visual canvas

A SpriteKit preview with placeholder geometry or real assets.

Capabilities:

- pan/zoom;
- snap to native world grid;
- toggle anchors;
- toggle collision/walkable overlays;
- toggle routes;
- toggle z-order/masks;
- preview building states;
- preview purchased modules/upgrades;
- preview construction state;
- preview test guests following routes;
- preview day/evening/night overlays where defined.

### Right: inspector

Plain-language fields grouped by purpose, not raw JSON.

Sections:

- Identity
- Approval/provenance
- Ownership
- Compatibility
- Placement
- Capacity
- Economy
- Guest experience
- Maintenance
- Construction
- Rendering
- Routes/activity
- Upgrade relationships

Advanced/technical fields should be collapsible.

## Start building rules

A location may define one or more legal start-building choices.

Each start building must specify:

- stable ID;
- display name;
- allowed locations/location families;
- footprint;
- placement anchor;
- initial included facilities;
- starting capacities;
- purchase/acquisition relation if relevant;
- base operating cost;
- upgrade anchors;
- legal base upgrades;
- legal add-on modules;
- visual states;
- entrance/exit route contract.

The Studio must make it visually impossible to confuse a start building with an add-on.

## Add-on module rules

Each add-on module specifies:

- parent type: building, location or explicitly both;
- legal anchor types;
- required parent content;
- incompatible modules;
- whether the anchor is consumed after purchase;
- footprint/collision;
- capacity channels;
- economy values;
- construction duration;
- maintenance behavior;
- guest route/activity contract;
- child-upgrade anchors if applicable;
- rendering package.

## Upgrade rules

An upgrade always has a clear parent.

The Studio must display upgrades underneath that parent, never as floating catalogue entries.

Examples of legal relationships:

```text
Start Building
  -> Bench Refit
  -> Better Ventilation
  -> Roof Insulation

Cold Plunge Module
  -> Larger Basin
  -> Better Filtration
  -> Lighting Package
```

Exact gameplay upgrades are data/content decisions. The hierarchy above is structural.

## Location-specific content

Some modules are valid only for one authored location or a narrow set of sites.

The Studio must clearly display:

- `Location specific`
- which location(s) own/permit it;
- why it is restricted, in a human-readable note;
- whether it is a location-owned module or a building-owned module.

Copying a location must not accidentally turn location-specific modules into globally reusable content.

## Compatibility system

Compatibility is data-driven. Do not encode ordinary content combinations in Swift conditionals.

A record may define:

- required tags;
- prohibited tags;
- allowed parent IDs;
- allowed anchor types;
- required sibling modules;
- incompatible sibling modules;
- required location capability, e.g. water edge, roof field, road access;
- capacity prerequisites where needed.

The Studio should translate these rules into plain-language feedback.

Example:

`Cannot place Bathing Bridge here: this location has no authored water-edge anchor.`

Not:

`validation_error 1042`.

## Anchors

Every attachable visual object uses authored anchor data.

Anchor fields:

- stable ID;
- owner ID;
- anchor type;
- x/y coordinate in native world space;
- optional rotation/orientation;
- z-layer;
- allowed child classes/tags;
- occupied/free state;
- optional route connection;
- optional effect/mask linkage.

Examples:

- `building_main`
- `building_rear_extension`
- `building_roof_01`
- `site_water_edge_01`
- `site_yard_02`
- `module_child_01`

Names are technical IDs, not player-facing copy.

## Routes and guest activity

The Studio must support authoring a route graph independently of purchase order.

Required authoring concepts:

- walkable patches;
- blocked patches;
- route nodes;
- connections;
- entrances/exits;
- stairs/roof transitions;
- water transitions;
- activity points;
- waiting/queue points;
- seated/standing orientation;
- hidden transitions where appropriate.

Purchasing an upgrade may activate/deactivate route nodes, but the route system must not assume upgrades are bought in one fixed order.

## Rendering and layers

The Studio should preview canonical layer categories such as:

1. background/environment;
2. ground overlays;
3. building base;
4. building modules;
5. location modules;
6. shadows;
7. guests/staff depending on depth;
8. foreground masks/roofs;
9. effects;
10. debug overlays/UI.

Exact draw ordering within a scene is authored through metadata.

## Placeholder-first production

Final assets are not required to author gameplay content.

Every content item can use:

- rectangle/shape placeholder;
- symbolic placeholder icon;
- temporary asset;
- approved asset.

Replacing a placeholder with final art must not change simulation IDs, compatibility or gameplay behavior.

The Studio should warn if final artwork violates the defined footprint/frame/anchor contract.

## AI assistance

AI can help inside the Studio, but proposals must remain reviewable.

Useful actions:

- suggest compatible modules for a location;
- suggest missing route anchors;
- detect impossible capacity/route combinations;
- flag likely inconsistent prices/effects;
- propose a first layout from existing constraints;
- suggest required asset list for a location;
- explain why a validation failed;
- compare a new location against existing content for duplication/inconsistency.

AI must not silently:

- approve a location;
- invent canonical city names;
- change economy values;
- change player-facing progression;
- broaden a location-specific module into shared content;
- delete content.

## Validation

`Validate Location` should run structural checks before export.

At minimum:

- stable unique IDs;
- at least one valid start building;
- every start building has entrance/exit routes;
- all module parent relations resolve;
- no impossible compatibility cycles;
- anchors exist for all attached content;
- no illegal overlapping exclusive footprints;
- all guest-visible functions have activity and route data;
- all capacity-producing facilities define affected capacity channels;
- all purchasable items define economy/construction fields;
- maintainable items define wear/repair fields;
- all rendering packages define anchor/draw metadata;
- proposal/deprecated content cannot accidentally ship as approved production content.

Validation output is grouped into:

- BLOCKING ERROR
- WARNING
- SUGGESTION

## Data output

The game consumes versioned deterministic content files, not Studio UI state.

Suggested structure:

```text
Content/
  locations/
  buildings/
  modules/
  upgrades/
  routes/
  catalogs/
```

The exact encoding can be JSON or generated Codable data, but ordinary content editing should not require modifying Swift source.

## Change history

Every save/export should retain:

- content schema version;
- item version;
- modified timestamp;
- approval state;
- provenance;
- optional decision/reference note.

## Ease-of-use definition of done

The Studio is not done merely because a developer can use it.

It is done when the user can create or modify a location and reliably answer, without reading code:

- What can the venue start with?
- What can I add later?
- What can I upgrade on the original building?
- What can I upgrade on an add-on?
- What belongs specifically to this location?
- What is shared with other locations?
- Where does each thing attach?
- Can guests physically reach/use it?
- What gameplay effect does it have?
- Is this approved content or only a suggestion?
- Why is this combination invalid?

That clarity is a core production requirement, not polish.