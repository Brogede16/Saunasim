import Phaser from "phaser";
import { canalAnchor, type CanalAnchorId, canalWorkshopScene } from "../content/canalWorkshopScene";
import { type GameState, gameStore, hasModule, type ModuleId } from "../sim/game";
import { conditionStatus, type MaintainableModuleId } from "../sim/maintenance";
import type { GuestRouteStop } from "../sim/guestWeek";

const WORLD = canalWorkshopScene.world;
const VIEWPORT = { width: 456, height: 640 };
const colors = { ink: 0x20333a, paving: 0xa5a69f, pavingLight: 0xb9b8ac, stone: 0x747d78, water: 0x287f99, waterLight: 0x6fbecc, brick: 0x9b563e, brickLight: 0xbc7050, brickDark: 0x65382f, roof: 0x3f4a52, timber: 0x704333, warm: 0xf3bb62, green: 0x66865d, greenLight: 0x9eb980, empty: 0xc0b89f, steam: 0xe9eee9, route: 0xd9c783 };

// A small set of fixed clustering offsets so guests sharing one anchor (Program, Shop, Shower,
// Basic Sauna, Outdoor Gus, Cold Plunge) don't render exactly on top of each other. Slots are
// assigned by each guest's rank among the *other guests currently resting at that same stop*, not
// by their raw sample index - the previous `index % 2` approach could put three different-parity
// guests all on the same slot while the other sat empty. Extra guests beyond a stop's slot count
// wrap around (a real collision system is not warranted for a 4-8 guest placeholder sample).
const STOP_CLUSTER_OFFSETS: Partial<Record<import("../sim/guestWeek").GuestRouteStop, ReadonlyArray<{ dx: number; dy: number }>>> = {
  "outdoor-gus": [{ dx: -16, dy: 0 }, { dx: 16, dy: 0 }, { dx: -16, dy: 20 }, { dx: 16, dy: 20 }],
  "cold-plunge": [{ dx: -16, dy: 0 }, { dx: 16, dy: 0 }],
  program: [{ dx: -14, dy: 0 }, { dx: 14, dy: 0 }, { dx: 0, dy: -16 }, { dx: 0, dy: 16 }],
  shower: [{ dx: -12, dy: 0 }, { dx: 12, dy: 0 }],
  shop: [{ dx: -12, dy: 0 }, { dx: 12, dy: 0 }],
  "basic-sauna": [{ dx: -14, dy: 0 }, { dx: 14, dy: 0 }, { dx: 0, dy: -16 }, { dx: 0, dy: 16 }],
};

// Queues render as a real line, not a stack, and are capped at a small visible length regardless
// of how many guests the underlying model says are actually waiting - the simulation already
// resolves excess demand as lost visits (queueLoss in canalBalance.ts), so the scene never needs
// to draw more people than would ever plausibly be visible at a small compact venue's queue.
const QUEUE_MAX_VISIBLE_SLOTS = 6;
const QUEUE_SLOT_SPACING = 18;

type SceneModuleId = Exclude<ModuleId, "bench-refit">;
type ModuleField = Extract<(typeof canalWorkshopScene.fields)[number], { module: string }>;
type GuestAction = "walk" | "sit" | "shower";
type VisibleGuest = { id: string; towel: number; route: ReadonlyArray<{ x: number; y: number }>; startedAt: number; phase: number; action: GuestAction; usesSheet: boolean };
const moduleFields = Object.fromEntries(canalWorkshopScene.fields.filter((field): field is ModuleField => "module" in field).map((field) => [field.module, field])) as Record<SceneModuleId, ModuleField>;

// A simulation stop is not a coordinate. It resolves through the authored scene graph so the
// visible route keeps to paving and reaches outdoor facilities from the Workshop side walk.
const STOP_SCENE_ROUTES: Record<GuestRouteStop, readonly CanalAnchorId[]> = {
  arrival: canalWorkshopScene.routes.arrival,
  "basic-sauna": canalWorkshopScene.routes.entrance,
  shop: ["arrival-street", ...canalWorkshopScene.routes.shop],
  program: ["arrival-street", ...canalWorkshopScene.routes.program],
  "outdoor-gus": ["arrival-street", ...canalWorkshopScene.routes.outdoorGus],
  shower: ["arrival-street", "workshop-door", "workshop-side-walk", "yard-to-shower", "shower-workshop"],
  "cold-plunge": ["arrival-street", "workshop-door", "workshop-side-walk", "yard-to-shower", "shower-workshop", "shower-to-plunge", "cold-plunge-a"],
  queue: ["arrival-street", "workshop-door", "workshop-side-walk", "yard-to-shower", "shower-to-plunge", "cold-plunge-queue"],
  exit: ["workshop-door", "arrival-street"],
};

class CanalScene extends Phaser.Scene {
  private unsubscribe?: () => void;
  private staticGraphics!: Phaser.GameObjects.Graphics;
  private moduleGraphics!: Phaser.GameObjects.Graphics;
  private routeGraphics!: Phaser.GameObjects.Graphics;
  private guestGraphics!: Phaser.GameObjects.Graphics;
  private venueNameText!: Phaser.GameObjects.Text;
  private effectLayer!: Phaser.GameObjects.Container;
  private markerLayer!: Phaser.GameObjects.Container;
  private hostLayer!: Phaser.GameObjects.Container;
  private occupancyLayer!: Phaser.GameObjects.Container;
  private guestLayer!: Phaser.GameObjects.Container;
  private workshopBase!: Phaser.GameObjects.Image;
  private guests = new Map<string, Phaser.GameObjects.Container>();
  private visibleGuests: VisibleGuest[] = [];
  private motionSprites = new Map<string, Phaser.GameObjects.Sprite>();
  private layoutKey = "";
  private effectKey = "";
  private markerKey = "";
  private hostKey = "";
  private occupancyKey = "";
  private guestKey = "";
  private venueName = "";

  constructor() { super("canal"); }

  preload() {
    // This first imported sheet is intentionally limited to the empty-venue motion study. It
    // proves the runtime consumes real animation frames before we commission the full roster.
    this.load.spritesheet("motion-guest-v01", "/assets/sprites/guest-actions-v01.png", { frameWidth: 362, frameHeight: 271 });
    // A composition-only walk reference. Its 4 x 4 grid is close enough to assess the scene at
    // phone scale; a later production pass rebuilds it on the exact 32 px frame contract.
    this.load.spritesheet("guest-walk-composition-test", "/assets/sprites/guest-walk-aligned-draft-v01.png", { frameWidth: 307, frameHeight: 319 });
    // This source is intentionally used only for the visible Canal composition test. Its final
    // runtime replacement will keep the same facade anchors but be a clean native-scale layer.
    this.load.image("workshop-base-composition-test", "/assets/canal/repair-workshop-base-draft-v02.png");
  }

  create() {
    const camera = this.cameras.main;
    camera.setBackgroundColor("#c8d0c7");
    camera.setBounds(0, 0, WORLD.width, WORLD.height);
    // Portrait play starts on the operational core (entrance, workshop and first extensions),
    // rather than halfway between that core and the canal. The player can pan right to the water.
    camera.centerOn(330, 360);
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (!pointer.isDown || pointer.getDistance() < 4) return;
      camera.scrollX = Phaser.Math.Clamp(camera.scrollX - pointer.velocity.x, 0, WORLD.width - VIEWPORT.width);
    });
    this.staticGraphics = this.add.graphics();
    this.moduleGraphics = this.add.graphics();
    this.routeGraphics = this.add.graphics();
    this.guestGraphics = this.add.graphics();
    this.effectLayer = this.add.container();
    this.markerLayer = this.add.container();
    this.hostLayer = this.add.container();
    this.occupancyLayer = this.add.container();
    this.guestLayer = this.add.container();
    this.staticGraphics.setDepth(0);
    this.moduleGraphics.setDepth(2);
    this.routeGraphics.setDepth(4);
    this.guestGraphics.setDepth(32);
    this.effectLayer.setDepth(12);
    this.markerLayer.setDepth(18);
    this.hostLayer.setDepth(22);
    this.occupancyLayer.setDepth(24);
    this.guestLayer.setDepth(30);
    this.createMotionSheetAnimations();
    this.drawStaticWorld();
    this.createAmbientEffects();
    this.createInputZones();
    this.unsubscribe = gameStore.subscribe(() => this.applySnapshot(gameStore.getState()));
    const stopListening = () => { this.unsubscribe?.(); this.unsubscribe = undefined; };
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, stopListening);
    this.events.once(Phaser.Scenes.Events.DESTROY, stopListening);
    this.applySnapshot(gameStore.getState());
  }

  update() {
    if (this.visibleGuests.length === 0) return;
    this.guestGraphics.clear();
    for (const guest of this.visibleGuests) {
      const position = this.visibleGuestPosition(guest, this.time.now);
      if (guest.usesSheet) this.motionSprites.get(guest.id)?.setPosition(position.x, position.y);
      else this.drawPixelGuest(this.guestGraphics, position.x, position.y, guest.towel, position.frame, guest.action);
      this.guests.get(guest.id)?.setPosition(position.x, position.y);
    }
  }

  private createMotionSheetAnimations() {
    const define = (key: string, start: number, end: number) => {
      if (!this.anims.exists(key)) this.anims.create({ key, frames: this.anims.generateFrameNumbers("motion-guest-v01", { start, end }), frameRate: 6, repeat: -1 });
    };
    define("motion-walk", 0, 3);
    define("motion-sit", 4, 7);
    define("motion-shower", 8, 11);
    if (!this.anims.exists("composition-walk")) this.anims.create({ key: "composition-walk", frames: this.anims.generateFrameNumbers("guest-walk-composition-test", { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
  }

  private applySnapshot(snapshot: GameState) {
    // `create()` runs just before Phaser reports the Scene as active. Subscription cleanup on
    // shutdown already prevents late writes, so the first snapshot must be applied here.
    if (this.venueName !== snapshot.venueName) {
      this.venueName = snapshot.venueName;
      this.venueNameText.setText(snapshot.venueName);
    }
    const layoutKey = `${snapshot.built.join("|")}:${snapshot.selectedModuleId ?? ""}`;
    if (layoutKey !== this.layoutKey) {
      this.layoutKey = layoutKey;
      this.moduleGraphics.clear();
      this.drawFields(this.moduleGraphics, snapshot);
      this.drawModules(this.moduleGraphics, snapshot);
    }
    const effectKey = `${snapshot.built.join("|")}:${snapshot.construction.map((project) => project.moduleId).join("|")}:${snapshot.lastReport?.guestSnapshots?.map((guest) => `${guest.id}:${guest.currentStop}`).join("|") ?? ""}`;
    if (effectKey !== this.effectKey) {
      this.effectKey = effectKey;
      this.clearLayer(this.effectLayer);
      this.drawStateEffects(snapshot);
      this.drawConstruction(snapshot);
    }
    const markerKey = `${snapshot.built.join("|")}:${snapshot.repairTask?.moduleId ?? ""}:${Object.entries(snapshot.condition).join("|")}`;
    if (markerKey !== this.markerKey) {
      this.markerKey = markerKey;
      this.clearLayer(this.markerLayer);
      this.drawMaintenance(snapshot);
    }
    const hostKey = `${snapshot.serviceHostCount}:${snapshot.built.includes("shop")}`;
    if (hostKey !== this.hostKey) {
      this.hostKey = hostKey;
      this.clearLayer(this.hostLayer);
      this.drawHost(snapshot);
    }
    const occupancyKey = `${snapshot.lastReport?.specialSeats ?? ""}:${snapshot.lastReport?.specialCapacity ?? ""}:${snapshot.built.includes("program")}:${snapshot.built.includes("aufguss-yard")}`;
    if (occupancyKey !== this.occupancyKey) {
      this.occupancyKey = occupancyKey;
      this.clearLayer(this.occupancyLayer);
      this.drawGusOccupancy(snapshot);
    }
    const guestKey = snapshot.lastReport?.guestSnapshots?.map((guest) => `${guest.id}:${guest.currentStop}:${guest.visitPath.join(",")}`).join("|") ?? "fallback";
    if (guestKey !== this.guestKey) {
      this.guestKey = guestKey;
      this.syncGuests(snapshot);
    }
  }

  private drawStaticWorld() {
    this.staticGraphics.fillStyle(colors.paving).fillRect(0, 0, WORLD.width, WORLD.height);
    // The scene still uses prototype geometry, but this tile rhythm tests the final low-resolution
    // pixel-art reading without committing a large, location-specific background too early.
    for (let x = 120; x < 672; x += 16) {
      for (let y = (x / 16) % 2 === 0 ? 0 : 8; y < WORLD.height; y += 16) {
        this.staticGraphics.fillStyle(colors.pavingLight, 0.32).fillRect(x + 1, y + 1, 13, 1);
        this.staticGraphics.fillStyle(colors.stone, 0.22).fillRect(x + 1, y + 14, 13, 1);
      }
    }
    this.drawStreet(this.staticGraphics);
    this.drawWater(this.staticGraphics);
    this.drawWorkshopGround(this.staticGraphics);
    this.workshopBase = this.add.image(318, 294, "workshop-base-composition-test").setScale(0.275).setDepth(1);
    this.venueNameText = this.add.text(320, 516, "", { fontFamily: "Georgia, serif", fontSize: "18px", color: "#24343a", align: "center" }).setOrigin(0.5);
  }

  private createInputZones() {
    for (const [id, field] of Object.entries(moduleFields) as Array<[SceneModuleId, ModuleField]>) {
      const zone = this.add.rectangle(field.x + field.width / 2, field.y + field.height / 2, field.width, field.height, 0xffffff, 0.001).setInteractive({ useHandCursor: true });
      zone.on("pointerdown", () => {
        gameStore.selectModule(hasModule(gameStore.getState(), id) ? id : undefined);
      });
    }
    this.input.on("pointerdown", (_pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]) => {
      if (currentlyOver.length === 0) gameStore.selectModule(undefined);
    });
  }

  private drawStreet(g: Phaser.GameObjects.Graphics) {
    g.fillStyle(0x657179).fillRect(0, 0, 112, WORLD.height);
    g.lineStyle(3, 0x49545b).lineBetween(112, 0, 112, WORLD.height);
    for (let y = 18; y < WORLD.height; y += 42) g.fillStyle(0xd8d0b9).fillRect(52, y, 8, 22);
    for (const y of [92, 340, 562]) {
      g.fillStyle(colors.green).fillCircle(142, y, 34);
      g.fillStyle(colors.greenLight).fillCircle(132, y - 8, 20);
      g.fillStyle(colors.timber).fillRect(137, y + 22, 10, 24);
    }
  }

  private drawWater(g: Phaser.GameObjects.Graphics) {
    g.fillStyle(colors.water).fillRect(704, 0, 256, WORLD.height);
    g.fillStyle(colors.stone).fillRect(672, 0, 32, WORLD.height);
    g.lineStyle(3, colors.ink).strokeRect(672, 0, 32, WORLD.height);
    for (let y = 20; y < WORLD.height; y += 38) {
      g.fillStyle(colors.waterLight, 0.7).fillRect(732 + ((y / 38) % 2) * 28, y, 52, 3);
      g.fillStyle(colors.waterLight, 0.4).fillRect(848, y + 13, 36, 2);
    }
  }

  private drawWorkshopGround(g: Phaser.GameObjects.Graphics) {
    // A restrained ground shadow keeps the transparent building test grounded without baking a
    // second backdrop into the source artwork.
    g.fillStyle(colors.ink, 0.16).fillEllipse(320, 448, 374, 72);
  }

  private drawFields(g: Phaser.GameObjects.Graphics, snapshot: GameState) {
    for (const field of canalWorkshopScene.fields) {
      if (field.id === "ws-arrival" || field.id === "ws-shop" || field.id === "ws-capacity" || field.id === "canal-terrace" || field.id === "canal-bridge") continue;
      if (field.module && hasModule(snapshot, field.module)) continue;
      // Empty fields stay part of the natural paving/yard until a player selects that specific
      // purchase. Permanent boxes would make an unfinished prototype read as a construction map.
      if (snapshot.selectedModuleId !== field.module) continue;
      g.fillStyle(colors.empty, 0.52).fillRect(field.x, field.y, field.width, field.height);
      g.lineStyle(2, colors.warm, 0.8).strokeRect(field.x, field.y, field.width, field.height);
    }
    g.fillStyle(0x82958c).fillRect(624, 160, 80, 144);
    g.fillStyle(colors.timber).fillRect(688, 416, 144, 28);
    g.lineStyle(3, colors.ink).strokeRect(688, 416, 144, 28);
  }

  private drawModules(g: Phaser.GameObjects.Graphics, snapshot: GameState) {
    for (const [id, field] of Object.entries(moduleFields) as Array<[SceneModuleId, ModuleField]>) {
      if (!hasModule(snapshot, id)) continue;
      if (id === "arrival") { g.fillStyle(colors.ink).fillRect(field.x + 6, field.y + 30, 56, 8); g.fillStyle(colors.warm).fillRect(field.x + 10, field.y + 31, 48, 5); }
      if (id === "shop") { g.fillStyle(colors.ink).fillRect(field.x + 6, field.y + 18, field.width - 12, 10); g.fillStyle(0xe0c087).fillRect(field.x + 12, field.y + 22, field.width - 24, 20); g.fillStyle(colors.warm).fillRect(field.x + 17, field.y + 26, field.width - 34, 5); }
      if (id === "program") { g.fillStyle(colors.brickDark).fillRect(field.x + 12, field.y + 26, field.width - 24, 38); g.fillStyle(colors.timber).fillTriangle(field.x, field.y + 28, field.x + field.width / 2, field.y, field.x + field.width, field.y + 28); }
      if (id === "aufguss-yard") { g.fillStyle(colors.timber).fillRect(field.x, field.y, field.width, field.height); g.lineStyle(3, colors.ink).strokeRect(field.x, field.y, field.width, field.height); g.fillStyle(0x9a673f).fillRect(field.x + 28, field.y + 42, 56, 48); }
      if (id === "shower") { g.lineStyle(7, 0xa76342).lineBetween(field.x + 28, field.y + 12, field.x + 28, field.y + 82); g.lineStyle(6, 0xa76342).lineBetween(field.x + 28, field.y + 12, field.x + 50, field.y + 12); }
      if (id === "cold-plunge") { g.fillStyle(colors.ink).fillRoundedRect(field.x, field.y + 16, field.width, field.height - 18, 9); g.fillStyle(colors.waterLight).fillRoundedRect(field.x + 6, field.y + 22, field.width - 12, field.height - 30, 6); }
    }
    if (snapshot.selectedModuleId && hasModule(snapshot, snapshot.selectedModuleId)) {
      const field = moduleFields[snapshot.selectedModuleId as SceneModuleId];
      if (field) g.lineStyle(3, colors.warm).strokeRect(field.x - 3, field.y - 3, field.width + 6, field.height + 6);
    }
  }

  private createAmbientEffects() {
    for (let i = 0; i < 7; i += 1) {
      const ripple = this.add.rectangle(760 + (i % 2) * 38, 48 + i * 82, 28, 2, colors.waterLight, 0.58);
      this.tweens.add({ targets: ripple, x: ripple.x + 22, alpha: 0.12, duration: 1300 + i * 90, yoyo: true, repeat: -1 });
    }
    const chimney = canalAnchor("workshop-chimney");
    for (let i = 0; i < 3; i += 1) {
      const steam = this.add.circle(chimney.x + (i - 1) * 8, chimney.y - i * 16, 10 - i, colors.steam, 0.65 - i * 0.13);
      this.tweens.add({ targets: steam, y: steam.y - 22, alpha: 0.08, duration: 1500 + i * 190, delay: i * 170, yoyo: true, repeat: -1 });
    }
  }

  private drawStateEffects(snapshot: GameState) {
    const guests = snapshot.lastReport?.guestSnapshots ?? [];
    if (hasModule(snapshot, "aufguss-yard") && guests.some((guest) => guest.currentStop === "outdoor-gus")) this.animatedSteam(this.effectLayer, canalAnchor("aufguss-steam-yard"));
    if (hasModule(snapshot, "shower") && guests.some((guest) => guest.currentStop === "shower")) {
      for (let i = 0; i < 3; i += 1) {
        const water = this.add.rectangle(636 + i * 5, 390, 2, 24, colors.waterLight, 0.75);
        this.effectLayer.add(water);
        this.tweens.add({ targets: water, y: 432, alpha: 0.1, duration: 380, delay: i * 90, repeat: -1 });
      }
    }
  }

  private animatedSteam(layer: Phaser.GameObjects.Container, point: { x: number; y: number }) {
    const steam = this.add.circle(point.x, point.y, 12, colors.steam, 0.7);
    layer.add(steam);
    this.tweens.add({ targets: steam, y: steam.y - 32, alpha: 0.1, duration: 1100, yoyo: true, repeat: -1 });
  }

  private drawConstruction(snapshot: GameState) {
    for (const project of snapshot.construction) {
      const field = moduleFields[project.moduleId as SceneModuleId];
      if (!field) continue;
      this.animatedSteam(this.effectLayer, { x: field.x + field.width / 2, y: field.y + field.height / 2 });
      this.effectLayer.add(this.add.text(field.x + field.width / 2, field.y + field.height / 2 + 22, "BUILD", { fontFamily: "ui-monospace, monospace", fontSize: "9px", fontStyle: "bold", color: "#f3bb62", stroke: "#20333a", strokeThickness: 2 }).setOrigin(0.5));
    }
  }

  private drawMaintenance(snapshot: GameState) {
    const markers: Record<MaintainableModuleId, CanalAnchorId> = { program: "program-door", shower: "shower-workshop", "cold-plunge": "cold-plunge-a" };
    for (const id of Object.keys(markers) as MaintainableModuleId[]) {
      if (!hasModule(snapshot, id)) continue;
      const repairing = snapshot.repairTask?.moduleId === id;
      if (!repairing && conditionStatus(snapshot.condition[id] ?? 100) === "Healthy") continue;
      const point = canalAnchor(markers[id]);
      this.markerLayer.add(this.add.circle(point.x + 12, point.y - 20, 11, repairing ? 0x65747a : colors.warm).setStrokeStyle(3, colors.ink));
      this.markerLayer.add(this.add.text(point.x + 12, point.y - 20, repairing ? "..." : "!", { fontFamily: "ui-monospace, monospace", fontSize: repairing ? "9px" : "15px", fontStyle: "bold", color: repairing ? "#d6d9d3" : "#20333a" }).setOrigin(0.5));
    }
  }

  // A small steam-cloud badge showing seats/capacity for the week's Gus activity, next to whichever
  // field is actually hosting it. This is a weekly aggregate (specialSeats/specialCapacity), the
  // same numbers already shown in the report panel - not a live per-session headcount, since the
  // game has no real-time clock simulating concurrent sessions yet (simulation-contract-v0.1.md).
  // Requesting more than one session in a week already raises this same total capacity number
  // rather than tracking each session's occupancy separately.
  private drawGusOccupancy(snapshot: GameState) {
    const seats = snapshot.lastReport?.specialSeats;
    const capacity = snapshot.lastReport?.specialCapacity;
    if (!seats || !capacity) return;
    // Over the dedicated field when one was actually built (the Outdoor Gus Yard or the Program
    // Sauna's own exterior field) - over the main Workshop only when the Gus is happening in the
    // ordinary indoor room, never at the street-level entrance door either way.
    const point = snapshot.built.includes("aufguss-yard")
      ? { x: canalAnchor("gus-master-yard").x, y: canalAnchor("gus-master-yard").y - 34 }
      : snapshot.built.includes("program")
        ? { x: canalAnchor("program-door").x, y: canalAnchor("program-door").y - 34 }
        : { x: 320, y: 150 };
    this.occupancyLayer.add(this.add.ellipse(point.x, point.y, 42, 24, colors.steam, 0.92).setStrokeStyle(2, colors.ink));
    this.occupancyLayer.add(this.add.text(point.x, point.y, `${seats}/${capacity}`, { fontFamily: "ui-monospace, monospace", fontSize: "10px", fontStyle: "bold", color: "#20333a" }).setOrigin(0.5));
  }

  private drawHost(snapshot: GameState) {
    if (snapshot.serviceHostCount === 0 || !hasModule(snapshot, "shop")) return;
    [0, 1, 2].slice(0, snapshot.serviceHostCount).forEach((index) => this.drawPerson(this.hostLayer, 220 + index * 20, 314 + (index % 2) * 18, 0x334f62, `service-${index}`));
  }

  private syncGuests(snapshot: GameState) {
    // This is a deliberately small motion study for an empty prototype venue. It disappears as
    // soon as a completed week has real guests, and lets us assess walk, sit and shower actions
    // before committing to a full production sheet.
    const fallback = [
      { id: "motion-walk", palette: "sand", currentStop: "exit" as const, visitPath: ["arrival", "basic-sauna", "exit"] as import("../sim/guestWeek").GuestRouteStop[], demoRoute: [{ x: 88, y: 440 }, { x: 256, y: 412 }, { x: 88, y: 440 }], action: "walk" as const },
      { id: "motion-sit", palette: "moss", currentStop: "shop" as const, visitPath: ["shop"] as import("../sim/guestWeek").GuestRouteStop[], anchor: "shop-stop" as const, action: "sit" as const },
      { id: "motion-shower", palette: "coral", currentStop: "shower" as const, visitPath: ["shower"] as import("../sim/guestWeek").GuestRouteStop[], anchor: "shower-workshop" as const, action: "shower" as const },
    ];
    const guests = snapshot.lastReport?.guestSnapshots ?? [];
    const people = guests.length ? guests : fallback;
    this.drawGuestRoutes(people);
    this.startVisibleGuestRoutes(people);
    const activeIds = new Set(people.map((person) => person.id));
    for (const [id, guest] of this.guests) {
      if (activeIds.has(id)) continue;
      this.tweens.killTweensOf(guest);
      guest.destroy();
      this.guests.delete(id);
    }
    people.forEach((person, index) => {
      if (this.guests.has(person.id)) return;
      const anchor = "anchor" in person ? person.anchor : undefined;
      const target = anchor ? canalAnchor(anchor) : this.guestRouteTarget(person.currentStop, index, person.id, people);
      const start = anchor ? target : this.guestRouteTarget("arrival", index, person.id, people);
      // The animated figure is rendered by `drawPixelGuest` in the guest layer below. This
      // container exists only as the persistent hit target; drawing a second static person here
      // made the old source-sheet test look like guests were duplicated or leaving a ghost behind.
      const guest = this.add.container(start.x, start.y).setName(person.id).setSize(32, 48).setDepth(this.guestLayer.depth);
      this.guests.set(person.id, guest);
      // The route tween owns the container position. A future walk sheet will animate its own
      // child frames, avoiding two tweens competing for the same x/y values.
      if (!anchor) {
        guest.setSize(28, 40).setInteractive({ useHandCursor: true });
        guest.on("pointerdown", (_pointer: Phaser.Input.Pointer, _localX: number, _localY: number, event: Phaser.Types.Input.EventData) => {
          // A guest in front of a module owns this tap; it must not select the module beneath.
          event.stopPropagation();
          gameStore.selectGuest(person.id);
        });
      }
    });
  }

  // Slot rank among the guests who share this exact resting stop right now, used to fan them out
  // instead of stacking. Only applied at a guest's own currentStop (where they actually linger) -
  // stops a guest merely passes through on the way there are not de-overlapped, since the staggered
  // per-guest tween delay already keeps transient movement from reading as a collision.
  private stopClusterOffset(stop: import("../sim/guestWeek").GuestRouteStop, personId: string, people: readonly { id: string; currentStop: import("../sim/guestWeek").GuestRouteStop }[]) {
    const sharingIds = people.filter((candidate) => candidate.currentStop === stop).map((candidate) => candidate.id);
    const slot = Math.max(0, sharingIds.indexOf(personId));
    if (stop === "queue") {
      const visibleTotal = Math.min(sharingIds.length, QUEUE_MAX_VISIBLE_SLOTS);
      const visibleSlot = Math.min(slot, QUEUE_MAX_VISIBLE_SLOTS - 1);
      return { dx: (visibleSlot - (visibleTotal - 1) / 2) * QUEUE_SLOT_SPACING, dy: 0 };
    }
    const offsets = STOP_CLUSTER_OFFSETS[stop];
    return offsets ? offsets[slot % offsets.length] : { dx: 0, dy: 0 };
  }

  private guestColor(palette: string) { return ({ sand: 0xe7dfd4, moss: 0x9eb980, clay: 0xca8b65, slate: 0x8ca5aa, coral: 0xe69b88 } as Record<string, number>)[palette] ?? 0xe7dfd4; }
  private drawPerson(layer: Phaser.GameObjects.Container, x: number, y: number, color: number, name: string) {
    const person = this.add.container(x, y).setName(name);
    // This is the first runtime pixel-character base: the palette is separate from identity and
    // later sheet frames can replace these same proportions without changing route or depth code.
    const skin = 0xc98261;
    const hair = 0x3d302e;
    person.add([
      this.add.rectangle(0, 15, 18, 4, colors.ink, 0.28),
      this.add.rectangle(-4, 10, 5, 9, skin).setStrokeStyle(1, colors.ink),
      this.add.rectangle(4, 10, 5, 9, skin).setStrokeStyle(1, colors.ink),
      this.add.rectangle(-4, 17, 5, 8, skin).setStrokeStyle(1, colors.ink),
      this.add.rectangle(4, 17, 5, 8, skin).setStrokeStyle(1, colors.ink),
      this.add.rectangle(0, 7, 14, 13, color).setStrokeStyle(2, colors.ink),
      this.add.rectangle(4, 9, 3, 9, 0xf5f1e5),
      this.add.rectangle(0, -3, 13, 12, skin).setStrokeStyle(2, colors.ink),
      this.add.rectangle(0, -8, 13, 4, hair).setStrokeStyle(1, colors.ink),
    ]);
    // Keep people as direct scene objects. Nested Phaser Containers silently inherited the wrong
    // display-list state in headless WebGL, which made the route data real but the people vanish.
    // The supplied layer remains the single source for the intended depth band.
    person.setDepth(layer.depth);
    return person;
  }

  private drawGuestRoutes(people: readonly { id: string; currentStop: GuestRouteStop; anchor?: CanalAnchorId; demoRoute?: ReadonlyArray<{ x: number; y: number }> }[]) {
    this.routeGraphics.clear();
    for (const [personIndex, person] of people.entries()) {
      const route = person.demoRoute
        ?? (person.anchor ? [canalAnchor(person.anchor)] : this.visibleRouteForStop(person.currentStop, personIndex, person.id, people));
      for (let index = 1; index < route.length; index += 1) {
        const from = route[index - 1];
        const to = route[index];
        this.routeGraphics.lineStyle(2, colors.route, 0.48).lineBetween(from.x, from.y, to.x, to.y);
      }
    }
  }

  private startVisibleGuestRoutes(people: readonly ({ id: string; palette: string; currentStop: GuestRouteStop; visitPath: readonly GuestRouteStop[]; anchor?: CanalAnchorId; demoRoute?: ReadonlyArray<{ x: number; y: number }>; action?: GuestAction })[]) {
    const startedAt = this.time.now;
    this.clearMotionSprites();
    this.visibleGuests = people.map((person, index) => {
      const route = person.demoRoute
        ?? (person.anchor
        ? [canalAnchor(person.anchor as CanalAnchorId)]
        : this.visibleRouteForStop(person.currentStop, index, person.id, people));
      // Only the walk reference uses generated art here. The other actions retain deterministic
      // pixel placeholders until their own aligned frames exist.
      return { id: person.id, towel: this.guestColor(person.palette), route, startedAt, phase: index * 180, action: person.action ?? "walk", usesSheet: person.id === "motion-walk" };
    });
    for (const guest of this.visibleGuests) {
      if (!guest.usesSheet) continue;
      const start = guest.route[0];
      const compositionTest = guest.id === "motion-walk";
      const sprite = this.add.sprite(start.x, start.y, compositionTest ? "guest-walk-composition-test" : "motion-guest-v01", 0)
        .setOrigin(0.5, compositionTest ? 0.88 : 0.84)
        .setScale(compositionTest ? 0.16 : 0.23)
        .setDepth(34);
      sprite.play(compositionTest ? "composition-walk" : `motion-${guest.action}`);
      this.motionSprites.set(guest.id, sprite);
    }
  }

  private clearMotionSprites() {
    for (const sprite of this.motionSprites.values()) sprite.destroy();
    this.motionSprites.clear();
  }

  private visibleRouteForStop(stop: GuestRouteStop, index: number, personId: string, people: readonly { id: string; currentStop: GuestRouteStop }[]) {
    const route: Array<{ x: number; y: number }> = STOP_SCENE_ROUTES[stop].map((anchor) => {
      const point = canalAnchor(anchor);
      return { x: point.x, y: point.y };
    });
    route[route.length - 1] = this.guestRouteTarget(stop, index, personId, people);
    return route;
  }

  private visibleGuestPosition(guest: VisibleGuest, time: number) {
    if (guest.route.length < 2) return { ...guest.route[0], frame: Math.floor((time + guest.phase) / 170) % 4 };
    const legDuration = 780;
    const walkDuration = (guest.route.length - 1) * legDuration;
    const loopDuration = walkDuration + 1_100;
    const elapsed = (time - guest.startedAt + guest.phase) % loopDuration;
    if (elapsed >= walkDuration) return { ...guest.route[guest.route.length - 1], frame: Math.floor((time + guest.phase) / 170) % 4 };
    const segment = Math.floor(elapsed / legDuration);
    const rawProgress = (elapsed % legDuration) / legDuration;
    const progress = rawProgress < 0.5 ? 2 * rawProgress * rawProgress : 1 - ((-2 * rawProgress + 2) ** 2) / 2;
    const from = guest.route[segment];
    const to = guest.route[segment + 1];
    return { x: Phaser.Math.Linear(from.x, to.x, progress), y: Phaser.Math.Linear(from.y, to.y, progress), frame: Math.floor(elapsed / 150) % 4 };
  }

  private drawPixelGuest(g: Phaser.GameObjects.Graphics, x: number, y: number, towel: number, frame: number, action: GuestAction) {
    const skin = 0xc98261;
    const hair = 0x3d302e;
    if (action === "sit") {
      const footLift = frame % 2 === 0 ? 0 : -2;
      g.fillStyle(colors.ink).fillRect(x - 13, y + 8, 26, 4);
      g.fillStyle(colors.timber).fillRect(x - 12, y + 7, 24, 2).fillRect(x - 10, y + 11, 3, 5).fillRect(x + 7, y + 11, 3, 5);
      g.fillStyle(colors.ink).fillRect(x - 7, y - 4, 13, 13);
      g.fillStyle(towel).fillRect(x - 6, y - 3, 11, 9);
      g.fillStyle(skin).fillRect(x - 5, y - 15, 10, 10).fillRect(x + 4, y + 5 + footLift, 6, 3);
      g.fillStyle(hair).fillRect(x - 5, y - 16, 10, 4);
      return;
    }
    if (action === "shower") {
      g.lineStyle(3, 0x9a673f).lineBetween(x + 10, y - 30, x + 10, y - 17).lineBetween(x + 3, y - 30, x + 10, y - 30);
      for (let drop = 0; drop < 3; drop += 1) {
        const dropY = y - 16 + ((frame * 4 + drop * 6) % 14);
        g.fillStyle(colors.waterLight, 0.8).fillRect(x + 1 + drop * 4, dropY, 2, 7);
      }
    }
    const stride = [-2, 0, 2, 0][frame];
    const armSwing = [2, 0, -2, 0][frame];
    g.fillStyle(colors.ink).fillRect(x - 8, y + 12, 16, 3);
    g.fillStyle(skin).fillRect(x - 5 + stride, y + 8, 4, 9).fillRect(x + 1 - stride, y + 8, 4, 9);
    g.fillStyle(colors.ink).fillRect(x - 6, y + 7, 12, 11);
    g.fillStyle(towel).fillRect(x - 5, y + 8, 10, 9);
    g.fillStyle(0xf5f1e5).fillRect(x + 2 + stride / 2, y + 10, 2, 6);
    g.fillStyle(colors.ink).fillRect(x - 6, y - 7, 12, 13);
    g.fillStyle(skin).fillRect(x - 5, y - 6, 10, 10);
    g.fillStyle(hair).fillRect(x - 5, y - 7, 10, 4);
    g.fillStyle(skin).fillRect(x - 8, y - 1 + armSwing, 3, 8).fillRect(x + 5, y - 1 - armSwing, 3, 8);
  }

  private clearLayer(layer: Phaser.GameObjects.Container) {
    for (const child of [...layer.list]) {
      this.tweens.killTweensOf(child);
      child.destroy();
    }
  }

  private guestRouteTarget(stop: GuestRouteStop, index: number, personId: string, people: readonly { id: string; currentStop: GuestRouteStop }[]) {
    const anchors: Record<GuestRouteStop, CanalAnchorId> = {
      arrival: "arrival-street", queue: "cold-plunge-queue", "basic-sauna": "workshop-door", program: "program-door", "outdoor-gus": "gus-guest-yard-a", shower: "shower-workshop", "cold-plunge": "cold-plunge-a", shop: "shop-stop", exit: "arrival-street",
    };
    const point = canalAnchor(anchors[stop]);
    if (stop === "exit") return { x: point.x, y: point.y - index * 24 };
    if (stop !== people.find((candidate) => candidate.id === personId)?.currentStop) return point;
    const offset = this.stopClusterOffset(stop, personId, people);
    return { x: point.x + offset.dx, y: point.y + offset.dy };
  }
}

export function createCanalGame(parent: HTMLDivElement) {
  return new Phaser.Game({ type: Phaser.AUTO, parent, width: VIEWPORT.width, height: VIEWPORT.height, backgroundColor: "#c8d0c7", pixelArt: true, render: { antialias: false, preserveDrawingBuffer: true, roundPixels: true }, scene: [CanalScene], scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH } });
}
