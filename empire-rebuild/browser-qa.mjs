import { chromium, webkit } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

fs.mkdirSync(new URL('./qa/', import.meta.url), { recursive: true });
const engine = process.env.QA_ENGINE || 'chromium';
const browser = await (engine === 'webkit' ? webkit : chromium).launch({ headless: true });
const results = [];
try {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, isMobile: viewport.width < 700, hasTouch: viewport.width < 700 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') console.log('BROWSER ERROR', message.text()); });
    await page.goto('http://127.0.0.1:5188/');
    await page.waitForSelector('.map-pin');
    assert.equal(await page.locator('.map-pin').count(), 7);
    await page.screenshot({ path: new URL('./qa/empire-' + viewport.width + '.png', import.meta.url).pathname, fullPage: true });
    for (const region of ['nordic', 'europe', 'world', 'denmark']) {
      await page.locator('[data-region="' + region + '"]').click();
      assert.ok(await page.locator('.map-pin').count() >= 6);
    }
    await page.locator('[data-lot="valby"]').click();
    await page.waitForSelector('.venue-scene');
    await page.screenshot({ path: new URL('./qa/location-' + viewport.width + '.png', import.meta.url).pathname, fullPage: true });
    for (const view of ['build', 'goose', 'staff', 'guests', 'reviews', 'finance']) {
      await page.locator('#rail [data-view="' + view + '"]').click();
      assert.ok((await page.locator('#main').innerText()).length > 120);
      assert.equal(await page.locator('.recovery-screen').count(), 0);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), view + ' overflows viewport');
    }
    await page.locator('#rail [data-view="goose"]').click();
    await page.locator('[data-newgoose]').click();
    await page.locator('[name="name"]').fill('Birch Evening');
    await page.locator('[name="price"]').fill('75');
    await page.locator('[name="aroma1"]').selectOption('cedar');
    assert.match(await page.locator('#gooseCostPreview').innerText(), /Calculated cost/);
    await page.screenshot({ path: new URL('./qa/editor-' + viewport.width + '.png', import.meta.url).pathname, fullPage: true });
    await page.locator('#gooseForm button[type="submit"]').click();
    const custom = await page.evaluate(() => window.__SAUNA_TEST__.getState().gooseLibrary.find(goose => goose.name === 'Birch Evening'));
    assert.equal(custom.rounds.length, 2);
    await page.locator('[data-schedule="' + custom.id + '"]').click();
    await page.locator('#schedTime').fill('19:00');
    await page.locator('[data-confirmsched]').click();
    assert.equal(await page.locator('#modalRoot .modal-shell').count(), 0);
    await page.locator('#rail [data-view="build"]').click();
    await page.locator('[data-empty]').first().click();
    assert.equal(await page.evaluate(() => window.__SAUNA_TEST__.getState().locations.valby.rooms.length), 6);
    await page.reload();
    assert.equal(await page.evaluate(() => window.__SAUNA_TEST__.getState().locations.valby.rooms.length), 6);
    await page.evaluate(() => {
      const state = window.__SAUNA_TEST__.getState();
      state.locations.valby.open = true;
      state.paused = false;
      window.advanceTime(132600);
    });
    assert.equal(await page.evaluate(() => window.__SAUNA_TEST__.getState().day), 2);
    await page.locator('#rail [data-view="goose"]').click();
    assert.ok(await page.locator('.history-entry').count() >= 4);
    await page.screenshot({ path: new URL('./qa/history-' + viewport.width + '.png', import.meta.url).pathname, fullPage: true });
    await page.locator('#menu').click();
    await page.waitForSelector('[data-export-save]');
    const downloadPromise = page.waitForEvent('download');
    await page.locator('[data-export-save]').click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), 'sauna-empire-save.json');
    const saved = JSON.parse(fs.readFileSync(await download.path(), 'utf8'));
    assert.equal(saved.day, 2);
    await page.locator('[data-cancel]').click();
    await page.evaluate(() => {
      const state = window.__SAUNA_TEST__.getState();
      state.level = 2;
      state.cash = 150000;
      window.__SAUNA_TEST__.setView('empire');
    });
    await page.locator('.map-pin[data-lot="vesterbro"]').click();
    await page.locator('[data-confirmbuy]').click();
    assert.equal(await page.evaluate(() => window.__SAUNA_TEST__.getState().ownedLots.length), 2);
    await page.locator('#rail [data-view="staff"]').click();
    await page.locator('[data-hire="host"]').click();
    assert.equal(await page.evaluate(() => window.__SAUNA_TEST__.getState().locations.vesterbro.staff.length), 1);
    await page.locator('#rail [data-view="guests"]').click();
    await page.locator('[data-membership]').click();
    await page.locator('[data-merch]').click();
    await page.locator('[data-market="local"]').click();
    assert.equal(await page.evaluate(() => window.__SAUNA_TEST__.getState().locations.vesterbro.membership.enabled), true);
    await page.locator('#rail [data-view="finance"]').click();
    await page.locator('[data-loan="10000"]').click();
    assert.equal(await page.evaluate(() => window.__SAUNA_TEST__.getState().debt), 10000);
    await page.locator('[data-repay="10000"]').click();
    assert.equal(await page.evaluate(() => window.__SAUNA_TEST__.getState().debt), 0);
    await page.locator('#menu').click();
    await page.locator('#importSave').setInputFiles({ name: 'empire.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(saved)) });
    await page.waitForFunction(() => window.__SAUNA_TEST__.getState().ownedLots.length === 1);
    await page.evaluate(() => {
      const state = window.__SAUNA_TEST__.getState();
      state.pendingEvent = { title: 'QA event', body: 'Choose an outcome', options: [{ label: 'Resolve event', cash: 100 }] };
      window.__SAUNA_TEST__.render();
    });
    await page.locator('[data-event-option="0"]').click();
    assert.equal(await page.evaluate(() => window.__SAUNA_TEST__.getState().pendingEvent), null);
    await page.evaluate(() => { window.__SAUNA_TEST__.getState().gameOver = true; window.__SAUNA_TEST__.render(); });
    await page.waitForSelector('.gameover');
    await page.locator('[data-newgame]').click();
    await page.locator('[data-confirm-new]').click();
    await page.waitForSelector('.map-pin');
    assert.equal(errors.length, 0, errors.join('\n'));
    results.push({ engine, viewport, status: 'passed', pageErrors: errors });
    await context.close();
  }
  const recovery = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await recovery.goto('http://127.0.0.1:5188/');
  await recovery.evaluate(() => localStorage.setItem('saunaEmpireRebuild', '{broken'));
  await recovery.reload();
  await recovery.waitForSelector('.map-pin');
  results.push({ damagedSaveBoot: 'passed' });
  await recovery.setViewportSize({ width: 320, height: 740 });
  assert.ok(await recovery.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await recovery.goto(new URL('./sauna-empire-no-sprites-rc.html', import.meta.url).href);
  await recovery.waitForSelector('.map-pin');
  results.push({ standaloneFileBoot: 'passed', width: 320 });
  fs.writeFileSync(new URL('./qa/browser-results-' + engine + '.json', import.meta.url), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
