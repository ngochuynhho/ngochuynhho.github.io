/* Browser-only acceptance checks against public files; native fixtures stay private. */
const {chromium} = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {pathToFileURL} = require("node:url");
const root = path.resolve(__dirname, "..");
const site = (process.env.SPARE_AD_SITE_URL || "http://localhost:8879").replace(/\/$/, "");
const bundle = path.join(root, ".spare-ad-runtime/bundle");
const expected = JSON.parse(fs.readFileSync(path.join(root, ".spare-ad-runtime/browser-development/expected-all.json")));
let browser;

(async () => {
  const {parseCSV} = await import(pathToFileURL(path.join(root, "services/spare_ad/browser/csv.mjs")));
  browser = await chromium.launch({headless: true, args: ["--no-sandbox"]});
  const context = await browser.newContext({viewport: {width: 1440, height: 1000}});
  await context.addInitScript(() => {
    window.workerActions = [];
    const send = Worker.prototype.postMessage;
    Worker.prototype.postMessage = function (value, ...args) {
      window.workerActions.push(value.action);
      return send.call(this, value, ...args);
    };
  });
  const requests = [], errors = [];
  context.on("request", request => requests.push({url: request.url(), method: request.method(), body: request.postData()}));
  await context.route("**/*", async route => {
    const url = new URL(route.request().url());
    if (url.origin !== site) return route.abort();
    if (process.env.SPARE_AD_SITE_URL) return route.continue();
    // Simulate ordinary static hosting without running an app server.
    const relative = decodeURIComponent(url.pathname).replace(/^\//, "") || "index.html";
    let file = path.resolve(root, relative);
    if (!file.startsWith(root + path.sep) || relative.split("/").some(part => part.startsWith("."))) return route.fulfill({status: 404, body: "Not found"});
    try {
      if (fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
      const types = {".html": "text/html", ".mjs": "application/javascript", ".js": "application/javascript", ".css": "text/css", ".json": "application/json", ".gz": "application/gzip", ".png": "image/png"};
      return route.fulfill({contentType: types[path.extname(file)] || "application/octet-stream", body: fs.readFileSync(file)});
    } catch {return route.fulfill({status: 404, body: "Not found"});}
  });
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(site, {waitUntil: "networkidle"});
  await page.locator(".publication-app").click();
  await page.waitForURL(site + "/spare-ad/");
  const ready = () => page.waitForFunction(() => document.getElementById("refCount").textContent === "14,597" && !document.getElementById("model").disabled);
  await ready();
  assert.deepEqual(await page.locator("#model option").allTextContents(), ["Best model", "Average model"]);
  assert.equal(await page.locator('[data-group="cohort"], [data-group="partition"]').count(), 0);
  assert.equal(await page.evaluate(() => document.getElementById("chart").data.find(trace => trace.name.startsWith("Reference MCI")).x.length), 5590);
  assert(await page.evaluate(() => document.getElementById("chart").data.filter(trace => trace.mode === "markers").every(trace => trace.customdata.every(row => row[0] === "Reference scan"))));

  async function exported() {
    const pending = page.waitForEvent("download");
    await page.locator("#download").click();
    const download = await pending, chunks = [];
    for await (const chunk of await download.createReadStream()) chunks.push(chunk);
    const data = parseCSV(Buffer.concat(chunks).toString("utf8"));
    return data.rows.map(row => Object.fromEntries(data.columns.map((name, i) => [name, row[i]])));
  }
  const fixture = fs.readFileSync(path.join(bundle, "private/smoke_input.csv"));
  for (const model of ["best", "average"]) {
    if (model === "average") {
      await page.locator("#model").selectOption(model);
      await ready();
      assert.equal(await page.locator("#results tr").count(), 0);
    }
    await page.locator("#score").selectOption("index");
    await page.locator("#trend").selectOption("linear");
    await page.locator("#file").setInputFiles({name: "opaque-fixture.csv", mimeType: "text/csv", buffer: fixture});
    await page.locator("#harmonized").check();
    if (model === "average") {
      let delay = true;
      await page.route("**/models/average.bin.gz", async route => {
        if (delay) {delay = false; await new Promise(resolve => setTimeout(resolve, 1500));}
        try {await route.fallback();} catch { /* The first request is deliberately cancelled. */ }
      });
      await page.locator("#predict").click();
      await page.locator("#cancel-calculation").click();
      await page.waitForFunction(() => document.getElementById("error").textContent.includes("cancelled") && !document.getElementById("model").disabled);
    }
    await page.locator("#predict").click();
    await page.waitForFunction(() => document.querySelectorAll("#results tr").length === 6 && !document.getElementById("model").disabled);
    for (const score of ["index", "logit", "age_z"]) for (const trend of ["linear", "curve"]) {
      await page.locator("#score").selectOption(score); await ready();
      await page.locator("#trend").selectOption(trend); await ready();
      const rows = await exported(), targets = expected[model][score + "_" + trend];
      assert.equal(rows.length, targets.length);
      for (let i = 0; i < rows.length; i++) {
        for (const key of ["p", "index", "logit", "age_z", "trend_distance_CN", "trend_distance_MCI", "trend_distance_DA"]) assert(Math.abs(Number(rows[i][key]) - targets[i][key]) < 1e-12, model + " " + key);
        for (const key of ["prediction", "binary_prediction", "trend_prediction", "trend_status"]) assert.equal(rows[i][key], targets[i][key]);
        assert.equal(rows[i].reference_overlap_status, "not_checked_browser");
        assert.equal(Number(rows[i].model_count), model === "best" ? 1 : 100);
      }
    }
    const before = await exported(), actions = await page.evaluate(() => workerActions.slice());
    await page.locator("#filters details").evaluate(details => details.open = true);
    await page.locator('[data-group="diagnosis"][value="MCI"]').uncheck();
    await page.locator("#ageMin").fill("70"); await page.locator("#ageMin").dispatchEvent("change");
    await page.locator("#ageMax").fill("80"); await page.locator("#ageMax").dispatchEvent("change");
    assert.deepEqual(await exported(), before);
    assert.deepEqual(await page.evaluate(() => workerActions), actions, "Display filters must not predict or reclassify");
    await page.locator('[data-group="diagnosis"][value="MCI"]').check();
    console.log(model + ": all score/trend combinations match native fixtures; filters preserve the complete export.");
  }
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({width, height: 1000});
    await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth && document.getElementById("chart").layout.margin.b === (innerWidth <= 800 ? 220 : 100));
  }
  await page.screenshot({path: "/tmp/portfolio-spare-ad-pages-desktop.png", fullPage: true});
  assert.deepEqual(errors, []);
  assert(requests.every(request => request.method === "GET" && !request.body));
  assert(!requests.some(request => request.url.includes("/api/")));
  assert.equal(await page.evaluate(() => localStorage.length), 0);
  console.log("GitHub Pages app passed: static GET assets only, no CSV transmission, no reference IDs/cohort filters, cancellation, and mobile/desktop layout.");
  await browser.close();
})().catch(async error => {
  console.error(error);
  if (browser) await browser.close();
  process.exitCode = 1;
});
