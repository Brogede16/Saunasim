import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const assets = join("dist", "assets");
const files = readdirSync(assets).filter((file) => file.endsWith(".js"));
const management = files.find((file) => file.startsWith("index-"));
const scene = files.find((file) => file.startsWith("CanalScene-"));

if (!management) throw new Error("Missing management entry chunk.");
if (!scene) throw new Error("Missing lazy Canal scene chunk; Phaser must not enter the management bundle.");
const managementBytes = statSync(join(assets, management)).size;
const managementBudget = 450_000;
if (managementBytes > managementBudget) {
  throw new Error(`Management entry is ${managementBytes} B; budget is ${managementBudget} B. Keep Phaser behind a dynamic import.`);
}

console.log(`Management entry ${management}: ${managementBytes} B within ${managementBudget} B budget.`);
