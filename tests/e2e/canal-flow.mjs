import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium } from "playwright";

const port = 4173;
const url = `http://127.0.0.1:${port}/`;

async function waitForServer(process) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (process.exitCode !== null) throw new Error(`Vite exited before the E2E server started (${process.exitCode}).`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The dev server has not opened its socket yet.
    }
    await sleep(100);
  }
  throw new Error("Timed out waiting for the E2E server.");
}

async function waitForText(page, selector, expected) {
  await page.waitForFunction(({ selector, expected }) => document.querySelector(selector)?.textContent?.includes(expected) ?? false, { selector, expected });
}

const vite = spawn("pnpm", ["exec", "vite", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { stdio: "pipe" });
let browser;

try {
  await waitForServer(vite);
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  // 1. New game renders its initial operational state.
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.getByLabel("Sauna name").waitFor();
  await waitForText(page, ".eyebrow", "WEEK 1");

  // 2. The player can edit their active Gus.
  await page.getByRole("button", { name: "programs" }).click();
  await page.getByLabel("Program name").fill("E2E Cedar Circuit");
  assert.equal(await page.getByLabel("Program name").inputValue(), "E2E Cedar Circuit");

  // 3. Advancing the temporary prototype week produces the next operational state.
  await page.getByRole("button", { name: "overview" }).click();
  await page.getByRole("button", { name: "Run Week" }).click();
  await waitForText(page, ".eyebrow", "WEEK 2");

  // 4. A visible amenity can be started and rushed to completion through normal UI controls.
  await page.getByRole("button", { name: "venue" }).click();
  const arrivalCard = page.locator(".build-card").filter({ hasText: "Renovated Entrance Sign" });
  await arrivalCard.getByRole("button", { name: "Build" }).click();
  await page.getByLabel("Construction projects").getByRole("button", { name: /Rush/ }).click();
  await arrivalCard.filter({ hasText: "Built" }).waitFor();

  // 5. The local autosave restores both business state and edited program after a reload.
  await sleep(300);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByLabel("Sauna name").waitFor();
  await waitForText(page, ".eyebrow", "WEEK 2");
  await page.getByRole("button", { name: "programs" }).click();
  assert.equal(await page.getByLabel("Program name").inputValue(), "E2E Cedar Circuit");
  await page.getByRole("button", { name: "venue" }).click();
  await waitForText(page, ".build-card", "Built");

  await context.close();
  console.log("E2E Canal flow passed: start, program, week, amenity, save/reload.");
} finally {
  await browser?.close();
  vite.kill("SIGTERM");
}
