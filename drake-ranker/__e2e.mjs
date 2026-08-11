import { chromium } from "playwright";
import fs from "node:fs";

const shots = "/tmp/drake-shots";
fs.mkdirSync(shots, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

// Phase 1: RatePhase should show immediately.
await page.waitForSelector("text=1 of 18");
const scoreButtonCount = await page.getByRole("button", { name: /^\d+$/ }).count();
console.log("SCORE_BUTTONS_VISIBLE:", scoreButtonCount);
await page.screenshot({ path: `${shots}/01-rate.png` });

// Rate all 18 via KEYBOARD, using a pattern (i % 6) that deliberately
// creates 6 distinct scores with 3-way ties each, to exercise dividers
// and cross-divider dragging in phase 2.
for (let i = 0; i < 18; i++) {
  const score = i % 6; // 0..5, always a single digit -> plain number key works
  await page.keyboard.press(String(score));
  await page.waitForTimeout(220); // outlast the mode="wait" exit+enter transition
}

// Phase 2: TierDrag
await page.waitForSelector("text=Drag to break ties");
await page.waitForTimeout(200);
await page.screenshot({ path: `${shots}/02-drag-initial.png` });

const metrics1 = await page.evaluate(() => ({
  bodyScrollHeight: document.body.scrollHeight,
  innerHeight: window.innerHeight,
}));
console.log("FIT_CHECK_900:", JSON.stringify(metrics1));

const rowsBefore = await page.locator('[style*="touch-action"]').allTextContents();
console.log("ROW_COUNT_BEFORE:", rowsBefore.length);
console.log("FIRST_3_ROWS_BEFORE:", JSON.stringify(rowsBefore.slice(0, 3)));

// Drag the very first row down across its divider into the SECOND score
// group (a cross-divider drag), and confirm it lands there.
const rows = page.locator('[style*="touch-action"]');
const firstBox = await rows.nth(0).boundingBox();
const fourthBox = await rows.nth(4).boundingBox(); // well into the 2nd group (rows 0-2 are group A, 3-5 group B)

if (firstBox && fourthBox) {
  await page.mouse.move(firstBox.x + firstBox.width / 2, firstBox.y + firstBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(fourthBox.x + fourthBox.width / 2, fourthBox.y + fourthBox.height / 2, {
    steps: 15,
  });
  await page.waitForTimeout(100);
  await page.mouse.up();
  await page.waitForTimeout(300);
}

await page.screenshot({ path: `${shots}/03-drag-after.png` });
const rowsAfter = await page.locator('[style*="touch-action"]').allTextContents();
console.log("FIRST_5_ROWS_AFTER:", JSON.stringify(rowsAfter.slice(0, 5)));

await page.click('button:has-text("Done")');
await page.waitForSelector('button:has-text("Save as image")');
await page.screenshot({ path: `${shots}/04-results.png`, fullPage: true });

const [download] = await Promise.all([
  page.waitForEvent("download"),
  page.click('button:has-text("Save as image")'),
]);
const downloadPath = `${shots}/drake-albums-ranked.png`;
await download.saveAs(downloadPath);

await browser.close();

console.log("ERRORS:", JSON.stringify(errors));
console.log("DOWNLOAD_SIZE:", fs.statSync(downloadPath).size);
