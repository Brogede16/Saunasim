import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const storage = new Map();
const context = vm.createContext({ localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) } });
vm.runInContext(fs.readFileSync(new URL('./core.js', import.meta.url), 'utf8'), context);
const core = context.SaunaGameCore;
const fresh = () => core.createState(1234);
const locationOf = state => state.locations[state.selectedLot];
function runDays(state, days) {
  const random = core.RNG(42);
  for (let day = 0; day < days && !state.gameOver; day++) {
    if (state.pendingEvent) core.resolveEvent(state, 0);
    state.paused = false;
    let guard = 0;
    while (!state.paused && !state.gameOver && guard++ < 200) core.tick(state, 5, random);
    assert.ok(guard < 200);
    assert.equal(core.validate(state).length, 0);
  }
  return state;
}

test('fresh game contains 48 markets and valid normalized formats', () => {
  const state = fresh();
  assert.equal(core.LOTS.length, 48);
  assert.equal(core.validate(state).length, 0);
  assert.ok(state.gooseLibrary.every(goose => goose.cost === core.gooseCost(goose)));
});
test('program cost ignores player supplied cost and follows composition', () => {
  const state = fresh();
  const simple = core.addGoose(state, { cost: -100000, duration: 10 });
  const elaborate = core.addGoose(state, { cost: 0, duration: 60, intensity: 5, equipment: 'show', music: 'Live bowls', rounds: [{ aroma: 'menthol', delivery: 'ice' }, { aroma: 'cedar', delivery: 'ice' }] });
  assert.ok(simple.cost > 0);
  assert.ok(elaborate.cost > simple.cost);
});
test('million-kr tickets produce no attendees or ticket revenue', () => {
  const results = [65, 1000000].map(price => {
    const state = fresh();
    const location = locationOf(state);
    location.open = true;
    const goose = core.addGoose(state, { price, cost: 1 });
    return core.runGoose(state, location, { gooseId: goose.id }, () => .5);
  });
  assert.ok(results[0].seats > 0);
  assert.equal(results[1].seats, 0);
  assert.equal(results[1].revenue, 0);
  assert.ok(results[1].cost > 0);
});
test('inactive assigned Master cancels with no fabricated ticket refunds', () => {
  const state = fresh();
  const location = locationOf(state);
  location.open = true;
  const master = location.staff.find(person => person.role === 'master');
  master.active = false;
  const result = core.runGoose(state, location, { gooseId: 'classic', masterId: master.id }, () => .5);
  assert.equal(result.reason, 'no-master');
  assert.equal(location.day.refunds, 0);
  assert.equal(location.sessionHistory[0].ok, false);
});
test('closed venue cannot sell session tickets', () => {
  const state = fresh();
  assert.equal(core.runGoose(state, locationOf(state), { gooseId: 'classic' }).reason, 'closed');
});
test('unstaffed reception cannot admit paying guests', () => {
  const state = fresh();
  const location = locationOf(state);
  location.staff = [];
  location.open = true;
  state.paused = false;
  core.tick(state, 120, () => .5);
  assert.equal(location.day.guests, 0);
  assert.equal(location.day.revenue, 0);
  assert.ok(location.day.walkaways > 0);
});
test('concurrent rooms automatically select different available Masters', () => {
  const state = fresh();
  const location = locationOf(state);
  location.open = true;
  core.buildRoom(state, location, 'sauna');
  core.hire(state, location, 'master');
  const rooms = location.rooms.filter(room => room.type === 'sauna');
  const first = core.runGoose(state, location, { gooseId: 'classic', time: '12:00', roomId: rooms[0].id }, () => .5);
  const second = core.runGoose(state, location, { gooseId: 'classic', time: '12:00', roomId: rooms[1].id }, () => .5);
  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.notEqual(first.master.id, second.master.id);
});
test('invalid and out of hours schedules rejected', () => {
  const state = fresh();
  const location = locationOf(state);
  for (const time of ['', '99:00', '08:30', '21:55', 'not a time']) assert.equal(core.scheduleGoose(location, 'classic', time, null, state.gooseLibrary).ok, false);
});
test('room conflict rejected, second room allows concurrency, same Master cannot double book', () => {
  const state = fresh();
  const location = locationOf(state);
  location.schedule = [];
  const firstRoom = location.rooms.find(room => room.type === 'sauna');
  const master = location.staff.find(person => person.role === 'master');
  assert.equal(core.scheduleGoose(location, 'classic', '12:00', master.id, state.gooseLibrary, firstRoom.id).ok, true);
  assert.equal(core.scheduleGoose(location, 'forest', '12:05', null, state.gooseLibrary, firstRoom.id).ok, false);
  core.buildRoom(state, location, 'sauna');
  const secondRoom = location.rooms.at(-1);
  assert.equal(core.scheduleGoose(location, 'forest', '12:05', master.id, state.gooseLibrary, secondRoom.id).ok, false);
  assert.equal(core.scheduleGoose(location, 'forest', '12:05', null, state.gooseLibrary, secondRoom.id).ok, true);
});
test('editing a format cannot silently introduce an overlap', () => {
  const state = fresh();
  const location = locationOf(state);
  location.schedule = [];
  core.scheduleGoose(location, 'classic', '12:00', null, state.gooseLibrary);
  core.scheduleGoose(location, 'forest', '12:20', null, state.gooseLibrary);
  assert.equal(core.updateGoose(state, 'classic', { duration: 30 }), false);
});
test('format normalization preserves zero ticket price and clamps invalid values', () => {
  const goose = core.addGoose(fresh(), { price: 0, intensity: 999, duration: NaN });
  assert.equal(goose.price, 0);
  assert.equal(goose.intensity, 5);
  assert.equal(goose.duration, 20);
});
test('loans and repayment reject invalid amounts without corrupting finances', () => {
  const state = fresh();
  for (const amount of [NaN, Infinity, -5, 'oops']) {
    assert.equal(core.takeLoan(state, amount).ok, false);
    assert.equal(core.repay(state, amount).ok, false);
  }
  assert.equal(core.takeLoan(state, 10000).ok, true);
  assert.equal(core.repay(state, 10000).ok, true);
  assert.equal(state.debt, 0);
  assert.equal(state.cash, 52000);
});
test('geographic route and level gates govern acquisition', () => {
  const state = fresh();
  state.cash = 2000000;
  assert.equal(core.buyLot(state, 'vesterbro').ok, false);
  state.level = 20;
  assert.equal(core.buyLot(state, 'tokyo').ok, false);
  assert.equal(core.buyLot(state, 'vesterbro').ok, true);
  assert.equal(core.buyLot(state, 'malmo').ok, true);
  assert.equal(core.buyLot(state, 'berlin').ok, true);
});
test('build capacity, core demolition and max upgrades enforced', () => {
  const state = fresh();
  state.cash = 1000000;
  const location = locationOf(state);
  assert.equal(core.demolishRoom(state, location, location.rooms[0].id).ok, false);
  while (core.buildRoom(state, location, 'sauna').ok) {}
  assert.equal(location.rooms.length, 7);
  const room = location.rooms[0];
  core.upgradeRoom(state, location, room.id);
  core.upgradeRoom(state, location, room.id);
  assert.equal(core.upgradeRoom(state, location, room.id).ok, false);
});
test('buying and immediately reselling property cannot mint cash', () => {
  const state = fresh();
  state.level = 30;
  state.cash = 10000000;
  for (const lot of core.LOTS.slice(1, 7)) {
    const cashBefore = state.cash;
    assert.equal(core.buyLot(state, lot.id).ok, true);
    assert.equal(core.sellLot(state, lot.id).ok, true);
    assert.ok(state.cash < cashBefore, lot.name);
  }
});
test('deleting custom format removes schedules but preserves session history', () => {
  const state = fresh();
  const location = locationOf(state);
  location.open = true;
  const goose = core.addGoose(state, { name: 'Archive test' });
  core.scheduleGoose(location, goose.id, '18:00', null, state.gooseLibrary);
  core.runGoose(state, location, { gooseId: goose.id }, () => .5);
  core.deleteGoose(state, goose.id);
  assert.ok(location.schedule.every(session => session.gooseId !== goose.id));
  assert.equal(location.sessionHistory[0].name, 'Archive test');
});
test('large time step and small time steps produce matching daily finances', () => {
  const first = fresh();
  const second = core.snapshot(first);
  for (const state of [first, second]) { locationOf(state).open = true; state.paused = false; }
  core.tick(first, 780, core.RNG(17));
  const random = core.RNG(17);
  for (let step = 0; step < 156; step++) core.tick(second, 5, random);
  assert.equal(first.cash, second.cash);
  assert.equal(first.day, second.day);
});
test('30-day standard operation stays valid with recorded sessions and reviews', () => {
  const state = fresh();
  locationOf(state).open = true;
  runDays(state, 30);
  assert.equal(state.gameOver, false);
  assert.equal(state.day, 31);
  assert.equal(locationOf(state).history.length, 30);
  assert.ok(locationOf(state).sessionHistory.length > 0);
  assert.ok(state.empireReviews.length > 0);
});
test('multi-location simulation, memberships, merch and marketing settle', () => {
  const state = fresh();
  state.level = 8;
  state.cash = 500000;
  core.buyLot(state, 'vesterbro');
  for (const location of Object.values(state.locations)) {
    location.open = true;
    if (!location.staff.length) for (const role of ['host', 'cleaner', 'master']) core.hire(state, location, role);
    core.setMembership(location, true);
    core.setMerch(location, true);
    core.launchMarketing(state, location, 'local');
  }
  runDays(state, 15);
  for (const location of Object.values(state.locations)) {
    assert.equal(location.history.length, 15);
    assert.ok(location.membership.members >= 5);
    assert.ok(location.lifetime.revenue > 0);
  }
});
test('all 48 markets can operate in a valid funded empire', () => {
  const state = fresh();
  state.level = 30;
  state.cash = 100000000;
  for (const lot of core.LOTS.slice(1)) assert.equal(core.buyLot(state, lot.id).ok, true, lot.name);
  for (const location of Object.values(state.locations)) {
    location.open = true;
    if (!location.staff.length) for (const role of ['host', 'cleaner', 'master']) core.hire(state, location, role);
    if (!location.schedule.length) core.scheduleGoose(location, 'classic', '12:00', null, state.gooseLibrary);
  }
  runDays(state, 3);
  assert.equal(state.ownedLots.length, 48);
  assert.ok(Object.values(state.locations).every(location => location.history.length === 3 && location.sessionHistory.length >= 3));
});
test('sustained insolvency loses the game', () => {
  const state = fresh();
  state.cash = -1000000;
  core.endDay(state, [], () => .99);
  assert.equal(state.gameOver, true);
});
test('campaign completion is acknowledged once and endless operation can continue', () => {
  const state = fresh();
  state.level = 25;
  state.cash = 5000000;
  for (const lot of core.LOTS.slice(1, 8)) core.buyLot(state, lot.id);
  for (const location of Object.values(state.locations)) location.rating = 5;
  core.endDay(state, [], () => .99);
  assert.equal(state.won, true);
  state.won = false;
  state.campaignComplete = true;
  core.endDay(state, [], () => .99);
  assert.equal(state.won, false);
});
test('damaged saves recover safely and stale selected location migrates', () => {
  storage.clear();
  storage.set('saunaEmpireRebuild', '{broken');
  assert.equal(core.load(), null);
  const state = fresh();
  state.selectedLot = 'missing';
  state.trend.id = 'missing';
  core.save(state);
  const loaded = core.load();
  assert.equal(loaded.selectedLot, 'valby');
  assert.equal(loaded.trend.id, 'ritual');
});
test('offline income is capped, consumed once and unavailable after bankruptcy', () => {
  const state = fresh();
  locationOf(state).open = true;
  locationOf(state).history = [{ profit: 13000 }];
  state.lastSavedAt = Date.now() - 24 * 3600000;
  storage.set('saunaEmpireRebuild', JSON.stringify(state));
  const loaded = core.load();
  assert.equal(loaded.cash - state.cash, 2800);
  assert.equal(core.load().cash, loaded.cash);
  state.gameOver = true;
  storage.set('saunaEmpireRebuild', JSON.stringify(state));
  assert.equal(core.load().cash, state.cash);
});

const scenarios = {};
for (const strategy of ['poor', 'standard', 'managed']) {
  const state = fresh();
  const location = locationOf(state);
  location.open = true;
  if (strategy === 'poor') { location.staff = []; location.entryPrice = 350; }
  if (strategy === 'managed') {
    core.hire(state, location, 'manager');
    location.auto.maintenance = true;
    core.setMerch(location, true);
    core.setMembership(location, true);
  }
  runDays(state, 30);
  scenarios[strategy] = { day: state.day, cash: Math.round(state.cash), rating: Number(location.rating.toFixed(2)), lifetimeProfit: Math.round(location.lifetime.profit), bankrupt: state.gameOver };
}
console.log('BALANCE SCENARIOS', JSON.stringify(scenarios));
assert.ok(scenarios.poor.lifetimeProfit < 0);
assert.ok(scenarios.standard.lifetimeProfit > scenarios.poor.lifetimeProfit);
assert.ok(scenarios.managed.lifetimeProfit > scenarios.standard.lifetimeProfit);
