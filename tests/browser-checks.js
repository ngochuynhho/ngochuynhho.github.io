/* Run against a local HTTP preview with Playwright installed outside the site. */
const {chromium} = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const root = path.resolve(__dirname, "..");
let siteURL = process.env.SITE_URL;
const read = name => JSON.parse(fs.readFileSync(path.join(root, "data", `${name}.json`), "utf8"));
let launchedBrowser, localServer;

(async () => {
  if (!siteURL) {
    const types = {".html":"text/html", ".css":"text/css", ".js":"application/javascript",
      ".json":"application/json", ".svg":"image/svg+xml", ".jpg":"image/jpeg", ".png":"image/png", ".pdf":"application/pdf"};
    localServer = http.createServer((request, response) => {
      try {
        const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
        const relative = pathname === "/" ? "index.html" : pathname.slice(1);
        const target = path.resolve(root, relative);
        if (!target.startsWith(`${root}${path.sep}`) || relative.split("/")[0].startsWith(".")) throw new Error("Invalid path");
        response.writeHead(200, {"Content-Type":types[path.extname(target)] || "application/octet-stream"});
        response.end(fs.readFileSync(target));
      } catch {response.writeHead(404); response.end("Not found");}
    });
    await new Promise(resolve => localServer.listen(0, "127.0.0.1", resolve));
    siteURL = `http://127.0.0.1:${localServer.address().port}`;
  }
  const browser = launchedBrowser = await chromium.launch({headless:true, args:["--no-sandbox"]});
  const context = await browser.newContext({viewport:{width:1440, height:1000}});
  const errors = [], missing = [];
  await context.route("**/*", route => route.request().url().startsWith(siteURL) ? route.continue() : route.abort());
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  page.on("response", response => {if (response.url().startsWith(siteURL) && response.status() >= 400) missing.push(response.url());});
  await page.goto(siteURL, {waitUntil:"networkidle"});
  await page.waitForSelector("html.js-ready");
  assert.equal(await page.locator(".project-card").count(), 5);
  assert.match(await page.locator(".hero-affiliation").textContent(), /Instructor/);
  assert.match(await page.locator("#resume").textContent(), /May 2026 – Present/);
  assert.match(await page.locator("#resume").textContent(), /May 2024 – May 2026/);
  assert.equal(await page.locator(".publication").count(), 8);
  await page.locator("#load-more").click();
  assert.equal(await page.locator(".publication").count(), 16);
  await page.locator("#publication-search").fill("polynomial");
  assert.equal(await page.locator(".publication").count(), 1);
  await page.locator("#publication-search").fill("does-not-exist-123");
  assert.equal(await page.locator(".empty-state").count(), 1);
  await page.locator("#publication-search").fill("");
  await page.locator('[data-type="all"]').click();
  assert.match(await page.locator("#publication-results").textContent(), /48 publications/);
  await page.locator('[data-type="journal"]').click();
  for (const topic of read("topics")) {
    await page.locator(`[data-topic="${topic.id}"]`).click();
    assert.equal(await page.locator("#topic-dialog").evaluate(dialog => dialog.open), true);
    assert.equal(await page.locator("#topic-title").textContent(), topic.title);
    assert.equal(await page.locator(".topic-sources li").count(), read("publications").publications.filter(p => p.type === "journal" && p.topic === topic.id).length);
    for (const video of topic.videos) assert.equal(await page.locator(`.topic-videos a[href="${video.url}"]`).count(), 1);
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => !document.getElementById("topic-dialog").open && !document.body.classList.contains("dialog-open"));
    assert.equal(await page.evaluate(() => document.body.classList.contains("dialog-open")), false);
  }
  for (const width of [360, 390, 768, 1000, 1440]) {
    await page.setViewportSize({width, height:900});
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${width}px`);
  }
  await page.setViewportSize({width:390, height:844});
  await page.locator(".menu-toggle").click();
  assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "true");
  await page.locator('#primary-nav a[href="#projects"]').click();
  assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({path:"/tmp/portfolio-mobile.png", fullPage:true});
  await page.setViewportSize({width:1440, height:1000});
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({path:"/tmp/portfolio-desktop.png", fullPage:true});
  console.log("Public portfolio: panels, videos, filters, 5 responsive widths, navigation, and screenshots passed.");

  const admin = await context.newPage();
  admin.on("pageerror", error => errors.push(error.message));
  let catalog = read("publications"), snapshot = read("scholar"), sha = "initial-sha";
  let owner = "ngochuynhho", dispatchedID = null, conclusion = "success", saveCount = 0;
  let missingKey = false;
  let denied = "";
  const candidate = {title:'New journal paper <img src=x onerror="alert(1)">', authors:"NH Ho, José Researcher",
    venue:"Scientific Reports", year:2026, type:"journal", topic:"dementia", scholar_id:"dYRENHsAAAAJ:new-id",
    url:"https://www.nature.com/articles/test", doi:"", citations:2};
  const scannedArticles = [candidate];
  const authHeaders = [];
  await admin.route("https://api.github.com/**", async route => {
    const request = route.request(), url = new URL(request.url());
    authHeaders.push(request.headers().authorization);
    const fulfill = data => route.fulfill({status:200, contentType:"application/json", body:JSON.stringify(data)});
    if (denied === "dispatch" && url.pathname.endsWith("/dispatches")) return route.fulfill({status:403,
      contentType:"application/json", headers:{"x-accepted-github-permissions":"actions=write"},
      body:JSON.stringify({message:"Resource not accessible by personal access token"})});
    if (denied === "rate" && url.pathname === "/user") return route.fulfill({status:403,
      contentType:"application/json", headers:{"x-ratelimit-remaining":"0", "retry-after":"60"},
      body:JSON.stringify({message:"API rate limit exceeded"})});
    if (url.pathname === "/user") return fulfill({login:owner});
    if (url.pathname === "/repos/ngochuynhho/ngochuynhho.github.io") return fulfill({default_branch:"main", permissions:{push:true}});
    if (url.pathname.endsWith("/dispatches")) {
      dispatchedID = request.postDataJSON().inputs.request_id;
      snapshot = {...snapshot, status:"ok", citations:1400, h_index:20, i10_index:28,
        updated_at:new Date().toISOString(), articles:scannedArticles};
      return route.fulfill({status:204, body:""});
    }
    if (url.pathname.endsWith("/runs")) return fulfill({workflow_runs:[
      {display_title:"Scholar sync · unrelated-request", status:"completed", conclusion:"failure", html_url:"https://github.com/example/unrelated"},
      {id:1, display_title:`Scholar sync · ${dispatchedID}`, status:"completed", conclusion, html_url:"https://github.com/ngochuynhho/ngochuynhho.github.io/actions/runs/1"}
    ]});
    if (url.pathname.endsWith("/jobs")) return fulfill({jobs:[{steps:[{name:missingKey ? "Check Scholar API key" : "Refresh Scholar citations and publication queue", conclusion:"failure"}]}]});
    if (url.pathname.endsWith("/contents/data/publications.json")) {
      if (request.method() === "PUT") {
        const body = request.postDataJSON();
        assert.equal(body.sha, sha);
        catalog = JSON.parse(Buffer.from(body.content, "base64").toString("utf8"));
        sha = `updated-${++saveCount}`;
        return fulfill({content:{sha}, commit:{sha:"commit-sha"}});
      }
      return fulfill({sha, content:Buffer.from(JSON.stringify(catalog)).toString("base64")});
    }
    if (url.pathname.endsWith("/contents/data/scholar.json")) return fulfill({sha:"scholar-sha", content:Buffer.from(JSON.stringify(snapshot)).toString("base64")});
    throw new Error(`Unexpected GitHub request: ${url.pathname}`);
  });
  await admin.goto(`${siteURL}/admin.html`, {waitUntil:"networkidle"});
  await admin.waitForFunction(() => !document.getElementById("login-button").disabled);
  denied = "rate";
  await admin.locator("#github-token").fill("test-token-only");
  await admin.locator("#login-button").click();
  await admin.waitForFunction(() => document.getElementById("admin-status").textContent.includes("rate limit reached"));
  assert.match(await admin.locator("#admin-status").textContent(), /60 seconds/);
  denied = "dispatch";
  await admin.locator("#github-token").fill("test-token-only");
  await admin.locator("#login-button").click();
  await admin.waitForFunction(() => document.getElementById("admin-status").textContent.includes("denied permission to start"));
  assert.match(await admin.locator("#admin-status").textContent(), /actions=write/);
  assert.equal(dispatchedID, null);
  await admin.locator("#logout-button").click();
  denied = "";
  owner = "someone-else";
  await admin.locator("#github-token").fill("test-token-only");
  await admin.locator("#login-button").click();
  await admin.waitForFunction(() => document.getElementById("admin-status").textContent.includes("not the configured website owner"));
  assert.equal(dispatchedID, null);
  owner = "ngochuynhho";
  await admin.locator("#github-token").fill("test-token-only");
  await admin.locator("#login-button").click();
  await admin.waitForFunction(() => document.getElementById("admin-status").textContent.includes("ready for review"));
  assert.equal(await admin.locator("#admin-pending").textContent(), "1");
  assert.equal(await admin.locator("#review-list img").count(), 0);
  assert.equal(await admin.locator("#github-token").inputValue(), "");
  assert.equal(await admin.evaluate(() => localStorage.length + sessionStorage.length), 0);
  await admin.locator('.candidate-form button[type="submit"]').click();
  await admin.waitForFunction(() => document.getElementById("admin-status").textContent.includes("Publication added"));
  assert.equal(saveCount, 1);
  assert.equal(catalog.publications[0].authors, "NH Ho, José Researcher");
  assert.equal(await admin.locator("#admin-pending").textContent(), "0");
  assert(authHeaders.every(value => value === "Bearer test-token-only"));
  await admin.setViewportSize({width:360, height:800});
  assert(await admin.evaluate(() => document.documentElement.scrollWidth <= innerWidth));

  scannedArticles.push({...candidate, title:"A second new paper", scholar_id:"dYRENHsAAAAJ:second"});
  await admin.locator("#scan-button").click();
  await admin.waitForFunction(() => document.getElementById("admin-status").textContent.includes("ready for review"));
  await admin.locator(".ignore-button").click();
  await admin.waitForFunction(() => document.getElementById("admin-status").textContent.includes("Record ignored"));
  assert.equal(saveCount, 2);
  assert(catalog.ignored.includes("scholar:dYRENHsAAAAJ:second"));
  assert.equal(await admin.locator("#admin-pending").textContent(), "0");
  const downloadPromise = admin.waitForEvent("download");
  await admin.locator("#backup-button").click();
  const download = await downloadPromise;
  assert.match(download.suggestedFilename(), /^research-backup-.*\.json$/);
  scannedArticles.push({...candidate, title:"A third new paper", scholar_id:"dYRENHsAAAAJ:third"});
  await admin.locator("#scan-button").click();
  await admin.waitForFunction(() => document.getElementById("admin-status").textContent.includes("ready for review"));
  sha = "external-change";
  await admin.locator('.candidate-form button[type="submit"]').click();
  await admin.waitForFunction(() => document.getElementById("admin-status").textContent.includes("changed since you loaded"));
  assert.equal(saveCount, 2, "Concurrent edits must not be overwritten");
  conclusion = "failure";
  await admin.locator("#scan-button").click();
  await admin.waitForFunction(() => document.getElementById("admin-status").textContent.includes("did not complete"));
  assert.equal(saveCount, 2, "Failed scans must not write the catalog");
  missingKey = true;
  await admin.locator("#scan-button").click();
  await admin.waitForFunction(() => document.getElementById("admin-status").textContent.includes("SERPAPI_KEY is missing or empty"));
  assert.match(await admin.locator("#admin-status").textContent(), /New repository secret/);
  assert.equal(saveCount, 2, "Missing API keys must not write the catalog");
  await admin.locator("#logout-button").click();
  assert.equal(await admin.locator("#owner-panel").isVisible(), false);
  assert.equal(await admin.locator("#review-list").textContent(), "");
  console.log("Admin: unauthorized login, automatic scan, request isolation, safe rendering, Unicode publishing, ignore, backup download, edit conflicts, failed scans, and logout passed.");
  assert.deepEqual(errors, []);
  assert.deepEqual(missing, []);
  await browser.close();
  if (localServer) await new Promise(resolve => localServer.close(resolve));
})().catch(async error => {
  console.error(error);
  if (launchedBrowser) await launchedBrowser.close();
  if (localServer) await new Promise(resolve => localServer.close(resolve));
  process.exitCode = 1;
});
