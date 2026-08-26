import Phaser from "phaser";
import { canalAnchor, type CanalAnchorId, canalWorkshopScene } from "../content/canalWorkshopScene";
import { type GameState, gameStore, hasModule, type ModuleId } from "../sim/game";
import { conditionStatus, type MaintainableModuleId } from "../sim/maintenance";

const WORLD = canalWorkshopScene.world;
const VIEWPORT = { width: 456, height: 640 };
const colors = { ink: 0x20333a, paving: 0xa5a69f, stone: 0x747d78, water: 0x287f99, waterLight: 0x6fbecc, brick: 0x9b563e, brickDark: 0x65382f, timber: 0x704333, warm: 0xf3bb62, green: 0x66865d, greenLight: 0x9eb980, empty: 0xc0b89f, steam: 0xe9eee9 };

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
const moduleFields = Object.fromEntries(canalWorkshopScene.fields.filter((field): field is ModuleField => "module" in field).map((field) => [field.module, field])) as Record<SceneModuleId, ModuleField>;

class CanalScene extends Phaser.Scene {
  private unsubscribe?: () => void;
  private staticGraphics!: Phaser.GameObjects.Graphics;
  private moduleGraphics!: Phaser.GameObjects.Graphics;
  private venueNameText!: Phaser.GameObjects.Text;
  private effectLayer!: Phaser.GameObjects.Container;
  private markerLayer!: Phaser.GameObjects.Container;
  private hostLayer!: Phaser.GameObjects.Container;
  private occupancyLayer!: Phaser.GameObjects.Container;
  private guestLayer!: Phaser.GameObjects.Container;
  private guests = new Map<string, Phaser.GameObjects.Container>();
  private layoutKey = "";
  private effectKey = "";
  private markerKey = "";
  private hostKey = "";
  private occupancyKey = "";
  private guestKey = "";
  private venueName = "";

  constructor() { super("canal"); }

  create() {
    const camera = this.cameras.main;
    camera.setBackgroundColor("#c8d0c7");
    camera.setBounds(0, 0, WORLD.width, WORLD.height);
    camera.centerOn(WORLD.width / 2, WORLD.height / 2);
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (!pointer.isDown || pointer.getDistance() < 4) return;
      camera.scrollX = Phaser.Math.Clamp(camera.scrollX - pointer.velocity.x, 0, WORLD.width - VIEWPORT.width);
    });
    this.staticGraphics = this.add.graphics();
    this.moduleGraphics = this.add.graphics();
    this.effectLayer = this.add.container();
    this.markerLayer = this.add.container();
    this.hostLayer = this.add.container();
    this.occupancyLayer = this.add.container();
    this.guestLayer = this.add.container();
    this.drawStaticWorld();
    this.createAmbientEffects();
    this.createInputZones();
    this.unsubscribe = gameStore.subscribe(() => this.applySnapshot(gameStore.getState()));
    const stopListening = () => { this.unsubscribe?.(); this.unsubscribe = undefined; };
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, stopListening);
    this.events.once(Phaser.Scenes.Events.DESTROY, stopListening);
    this.applySnapshot(gameStore.getState());
  }

  private applySnapshot(snapshot: GameState) {
    if (!this.sys.isActive()) return;
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
    this.drawStreet(this.staticGraphics);
    this.drawWater(this.staticGraphics);
    this.drawWorkshop(this.staticGraphics);
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

  private drawWorkshop(g: Phaser.GameObjects.Graphics) {
    g.fillStyle(colors.brickDark).fillRect(160, 208, 320, 280);
    g.fillStyle(colors.brick).fillRect(168, 216, 304, 264);
    g.fillStyle(colors.timber).fillTriangle(144, 216, 320, 104, 496, 216);
    g.lineStyle(4, colors.ink).strokeRect(160, 208, 320, 280);
    g.lineStyle(4, colors.ink).strokeTriangle(144, 216, 320, 104, 496, 216);
    g.fillStyle(colors.ink).fillRect(208, 400, 56, 80);
    g.fillStyle(colors.timber).fillRect(214, 408, 44, 72);
    g.fillStyle(colors.warm).fillRect(196, 272, 34, 42);
    g.fillStyle(colors.warm).fillRect(406, 272, 34, 42);
    g.fillStyle(colors.brickDark).fillRect(360, 136, 30, 82);
  }

  private drawFields(g: Phaser.GameObjects.Graphics, snapshot: GameState) {
    for (const field of canalWorkshopScene.fields) {
      if (field.id === "ws-capacity" || field.id === "canal-terrace" || field.id === "canal-bridge") continue;
      if (field.module && hasModule(snapshot, field.module)) continue;
      g.fillStyle(colors.empty).fillRect(field.x, field.y, field.width, field.height);
      g.lineStyle(3, 0x8e8c7e).strokeRect(field.x, field.y, field.width, field.height);
    }
    g.fillStyle(0x82958c).fillRect(624, 160, 80, 144);
    g.fillStyle(colors.timber).fillRect(688, 416, 144, 28);
    g.lineStyle(3, colors.ink).strokeRect(688, 416, 144, 28);
  }

  private drawModules(g: Phaser.GameObjects.Graphics, snapshot: GameState) {
    for (const [id, field] of Object.entries(moduleFields) as Array<[SceneModuleId, ModuleField]>) {
      if (!hasModule(snapshot, id)) continue;
      if (id === "arrival") { g.fillStyle(colors.ink).fillRect(field.x, field.y + 64, field.width, 16); g.fillStyle(colors.warm).fillRect(field.x + 5, field.y + 67, field.width - 10, 10); }
      if (id === "shop") { g.fillStyle(colors.ink).fillRect(field.x, field.y, field.width, field.height); g.fillStyle(0xe0c087).fillRect(field.x + 5, field.y + 5, field.width - 10, field.height - 10); g.fillStyle(colors.warm).fillRect(field.x + 12, field.y + 30, field.width - 24, 10); }
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
    const anchor = snapshot.built.includes("aufguss-yard") ? canalAnchor("gus-master-yard") : snapshot.built.includes("program") ? canalAnchor("program-door") : canalAnchor("workshop-door");
    const point = { x: anchor.x, y: anchor.y - 34 };
    this.occupancyLayer.add(this.add.ellipse(point.x, point.y, 42, 24, colors.steam, 0.92).setStrokeStyle(2, colors.ink));
    this.occupancyLayer.add(this.add.text(point.x, point.y, `${seats}/${capacity}`, { fontFamily: "ui-monospace, monospace", fontSize: "10px", fontStyle: "bold", color: "#20333a" }).setOrigin(0.5));
  }

  private drawHost(snapshot: GameState) {
    if (snapshot.serviceHostCount === 0 || !hasModule(snapshot, "shop")) return;
    [0, 1, 2].slice(0, snapshot.serviceHostCount).forEach((index) => this.drawPerson(this.hostLayer, 220 + index * 20, 314 + (index % 2) * 18, 0x334f62, `service-${index}`));
  }

  private syncGuests(snapshot: GameState) {
    const fallback = ["arrival-street", "workshop-door", "gus-guest-yard-a", "shop-stop", "cold-plunge-a"] as const;
    const guests = snapshot.lastReport?.guestSnapshots ?? [];
    const people = guests.length ? guests : fallback.map((anchor, index) => ({ id: `idle-${index}`, palette: "sand", currentStop: "arrival" as const, visitPath: ["arrival"] as import("../sim/guestWeek").GuestRouteStop[], anchor }));
    const activeIds = new Set(people.map((person) => person.id));
    for (const [id, guest] of this.guests) {
      if (activeIds.has(id)) continue;
      this.tweens.killTweensOf(guest);
      guest.destroy();
      this.guests.delete(id);
    }
    people.forEach((person, index) => {
      if (this.guests.has(person.id)) return;
      const target = "anchor" in person ? canalAnchor(person.anchor) : this.guestRouteTarget(person.currentStop, index, person.id, people);
      const start = "anchor" in person ? target : this.guestRouteTarget("arrival", index, person.id, people);
      const guest = this.drawPerson(this.guestLayer, start.x, start.y, this.guestColor(person.palette), person.id);
      this.guests.set(person.id, guest);
      if (!("anchor" in person)) {
        guest.setSize(28, 40).setInteractive({ useHandCursor: true });
        guest.on("pointerdown", (_pointer: Phaser.Input.Pointer, _localX: number, _localY: number, event: Phaser.Types.Input.EventData) => {
          // A guest in front of a module owns this tap; it must not select the module beneath.
          event.stopPropagation();
          gameStore.selectGuest(person.id);
        });
        const stops = person.visitPath.slice(0, Math.max(1, person.visitPath.lastIndexOf(person.currentStop) + 1));
        this.tweens.chain({ targets: guest, tweens: stops.map((stop) => ({ ...this.guestRouteTarget(stop, index, person.id, people), duration: 780, ease: "Sine.easeInOut" })), delay: index * 120 });
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
    person.add([this.add.rectangle(0, 10, 14, 18, color).setStrokeStyle(2, colors.ink), this.add.circle(0, -3, 7, 0xb67958).setStrokeStyle(2, colors.ink)]);
    layer.add(person);
    return person;
  }

  private clearLayer(layer: Phaser.GameObjects.Container) {
    for (const child of [...layer.list]) {
      this.tweens.killTweensOf(child);
      child.destroy();
    }
  }

  private guestRouteTarget(stop: import("../sim/guestWeek").GuestRouteStop, index: number, personId: string, people: readonly { id: string; currentStop: import("../sim/guestWeek").GuestRouteStop }[]) {
    const anchors: Record<import("../sim/guestWeek").GuestRouteStop, CanalAnchorId> = {
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
