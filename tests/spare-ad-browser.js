/* Real browser uploads against the integrated Python server; opaque supplied fixtures only. */
const {chromium} = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const bundle = process.env.SPARE_AD_BUNDLE || path.join(root, ".spare-ad-runtime/bundle");
const site = (process.env.SPARE_AD_SITE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
let browser;

(async () => {
  browser = await chromium.launch({headless: true, args: ["--no-sandbox"]});
  const context = await browser.newContext({viewport: {width: 1440, height: 1000}});
  await context.route("**/*", route => route.request().url().startsWith(site + "/") ? route.continue() : route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  let predictions = 0, classifications = 0;
  page.on("request", request => {
    if (request.method() !== "POST") return;
    if (request.url().endsWith("/api/predict")) predictions++;
    if (request.url().endsWith("/api/classify")) classifications++;
  });
  await page.goto(site, {waitUntil: "networkidle"});
  await page.locator(".publication-app").click();
  await page.waitForURL(site + "/spare-ad/");
  await page.waitForFunction(() => document.getElementById("refCount").textContent === "14,597" && !document.getElementById("model").disabled);
  assert.deepEqual(await page.locator("#model option").allTextContents(), ["Best model", "Average model"]);
  assert.deepEqual(await page.locator("#score option").evaluateAll(options => options.map(o => o.value)), ["index", "logit", "age_z"]);
  assert.deepEqual(await page.locator("#trend option").allTextContents(), ["Straight line", "Curve (quadratic)"]);
  assert.equal(await page.locator("header .brand").getAttribute("href"), "/");
  await page.waitForFunction(() => document.getElementById("chart").data?.some(trace => trace.name.startsWith("Reference MCI")));
  assert.equal(await page.evaluate(() => document.getElementById("chart").data.find(trace => trace.name.startsWith("Reference MCI")).x.length), 5590);
  assert.equal(await page.evaluate(() => document.getElementById("chart").data.filter(trace => trace.mode === "lines").length), 3);

  for (const model of ["best", "average"]) {
    if (model === "average") {
      const loaded = page.waitForResponse(response => response.url().endsWith("api/reference?model=average"));
      await page.locator("#model").selectOption(model);
      await loaded;
      await page.waitForFunction(() => !document.getElementById("model").disabled && document.getElementById("runBadge").textContent.startsWith("Average model"));
      assert.equal(await page.locator("#results tr").count(), 0, "Switching models clears the previous upload");
    }
    await page.locator("#score").selectOption("index");
    await page.locator("#trend").selectOption("linear");
    await page.locator("#file").setInputFiles({name: "opaque-fixture.csv", mimeType: "text/csv", buffer: fs.readFileSync(path.join(bundle, "private/smoke_input.csv"))});
    await page.locator("#harmonized").check();
    const responsePromise = page.waitForResponse(response => response.url().endsWith("api/predict"));
    await page.locator("#predict").click();
    const actual = await (await responsePromise).json();
    const fixture = JSON.parse(fs.readFileSync(path.join(bundle, `private/smoke_expected_${model}.json`), "utf8"));
    assert.equal(actual.rows.length, fixture.rows.length);
    for (const [index, row] of actual.rows.entries()) {
      assert(Math.abs(row.p - fixture.rows[index].p) < 1e-12, model + " native probability parity");
      assert.equal(row.prediction, fixture.rows[index].prediction);
      assert.equal(row.model_count, model === "best" ? 1 : 100);
    }
    await page.waitForFunction(count => document.querySelectorAll("#results tr").length === count && !document.getElementById("model").disabled, actual.rows.length);
    for (const score of ["index", "logit", "age_z"]) {
      if (await page.locator("#score").inputValue() === score) continue;
      const changed = page.waitForResponse(response => response.url().endsWith("api/classify"));
      await page.locator("#score").selectOption(score);
      const classified = await (await changed).json();
      assert.deepEqual(classified.rows.map(r => r.p), actual.rows.map(r => r.p));
      assert(classified.rows.every(r => r.trend_score === score));
      await page.waitForFunction(() => !document.getElementById("model").disabled);
    }
    for (const trend of ["curve", "linear"]) {
      if (await page.locator("#trend").inputValue() === trend) continue;
      const changed = page.waitForResponse(response => response.url().endsWith("api/classify"));
      await page.locator("#trend").selectOption(trend);
      const classified = await (await changed).json();
      assert(classified.rows.every(r => r.trend_kind === trend));
      assert.deepEqual(classified.rows.map(r => r.p), actual.rows.map(r => r.p));
      await page.waitForFunction(() => !document.getElementById("model").disabled);
    }
    const before = await page.locator("#results").textContent();
    const calls = [predictions, classifications];
    await page.locator("#filters details").evaluate(details => details.open = true);
    await page.locator('[data-group="diagnosis"][value="MCI"]').uncheck();
    await page.waitForFunction(() => !document.getElementById("chart").data.some(trace => trace.name.startsWith("Reference MCI")));
    await page.locator("#ageMin").fill("70");
    await page.locator("#ageMin").dispatchEvent("change");
    await page.locator("#ageMax").fill("80");
    await page.locator("#ageMax").dispatchEvent("change");
    assert.equal(await page.locator("#results").textContent(), before);
    assert.deepEqual([predictions, classifications], calls, "Display filters must not predict or reclassify");
    const downloaded = page.waitForEvent("download");
    await page.locator("#download").click();
    const download = await downloaded;
    const chunks = [];
    for await (const chunk of await download.createReadStream()) chunks.push(chunk);
    const csv = Buffer.concat(chunks).toString("utf8");
    assert.equal(csv.trim().split(/\r?\n/).length, actual.rows.length + 1, "Export includes the entire batch despite chart filters");
    for (const column of ["prediction", "trend_prediction", "binary_prediction", "trend_distance_CN", "trend_distance_MCI", "trend_distance_DA", "trend_score", "trend_kind", "trend_status", "trend_extrapolated", "age_z_extrapolated"]) assert(csv.split(/\r?\n/)[0].includes(`"${column}"`));
    await page.locator('[data-group="diagnosis"][value="MCI"]').check();
  }
  assert.equal(predictions, 2, "Only one model inference request per uploaded batch/model");
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({width, height: 1000});
    await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth && document.getElementById("chart").layout.margin.b === (innerWidth <= 800 ? 220 : 100));
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Application overflow at ${width}px`);
  }
  await page.screenshot({path: "/tmp/portfolio-spare-ad-desktop.png", fullPage: true});
  await page.setViewportSize({width: 390, height: 844});
  await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth);
  await page.screenshot({path: "/tmp/portfolio-spare-ad-mobile.png", fullPage: true});
  for (const resource of ["private/model_manifest.json", "private/reference_identity_keys.json", "private/models/run_076/model.ubj", "app/service.py", "precomputed/best.reference.json"]) {
    const response = await page.request.get(`${site}/spare-ad/${resource}`);
    assert.equal(response.status(), 404);
  }
  assert.equal((await page.request.get(`${site}/.spare-ad-runtime/bundle/private/model_manifest.json`)).status(), 404);
  assert.deepEqual(errors, []);

  // Exercise the GitHub Pages launch page independently of the Python mount.
  const launch = await context.newPage();
  let serviceURL = "";
  await launch.route(`${site}/spare-ad/**`, async route => {
    const name = new URL(route.request().url()).pathname.split("/").pop() || "index.html";
    if (name === "service.json") return route.fulfill({json: {service_url: serviceURL}});
    if (!["index.html", "launch.js", "launch.css"].includes(name)) return route.abort();
    return route.fulfill({path: path.join(root, "spare-ad", name)});
  });
  await launch.goto(site + "/spare-ad/", {waitUntil: "networkidle"});
  assert.equal(await launch.locator("#launch-button").isHidden(), true);
  serviceURL = "https://research.example.org/spare-ad/";
  await launch.reload({waitUntil: "networkidle"});
  assert.equal(await launch.locator("#launch-button").getAttribute("href"), serviceURL);
  assert.equal(await launch.locator("#launch-button").isVisible(), true);
  serviceURL = "javascript:alert(1)";
  await launch.reload({waitUntil: "networkidle"});
  assert.equal(await launch.locator("#launch-button").isHidden(), true);
  console.log("Fair SPARE-AD: real Best/Average uploads, fixture parity, MCI, all scores/trends, unchanged filter predictions, full CSV export, responsive layout, private-route denial and static launcher passed.");
  await browser.close();
})().catch(async error => {
  console.error(error);
  if (browser) await browser.close();
  process.exitCode = 1;
});
