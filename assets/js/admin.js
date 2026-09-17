(() => {
  "use strict";
  const {escapeHTML: esc, safeURL, pending, keys, typeLabels} = ResearchCore;
  let config, token = "", repository, topics = [], catalog, snapshot;
  let fileSHA = "", busy = false, session = 0, controller = new AbortController();
  const status = document.getElementById("admin-status");
  const loginButton = document.getElementById("login-button");
  const scanButton = document.getElementById("scan-button");
  const reviewList = document.getElementById("review-list");
  const setStatus = (message, kind = "") => {status.textContent = message; status.className = `status-message ${kind}`;};
  const setBusy = value => {
    busy = value;
    loginButton.disabled = value || !config;
    scanButton.disabled = value;
    reviewList.querySelectorAll("button").forEach(button => {button.disabled = value;});
  };
  const decode = value => JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(value.replace(/\s/g, "")), c => c.charCodeAt(0))));
  const encode = value => {
    const bytes = new TextEncoder().encode(`${JSON.stringify(value, null, 2)}\n`);
    let binary = "";
    bytes.forEach(byte => {binary += String.fromCharCode(byte);});
    return btoa(binary);
  };
  async function api(path, options = {}) {
    // Every authenticated request goes to this fixed origin, never to data-supplied links.
    const auth = token;
    if (!auth) throw new Error("Sign in to continue.");
    const response = await fetch(`https://api.github.com${path}`, {
      ...options, cache:"no-store", signal:controller.signal,
      headers:{Accept:"application/vnd.github+json", Authorization:`Bearer ${auth}`,
        ...(options.body ? {"Content-Type":"application/json"} : {})}
    });
    if (!response.ok) {
      if (response.status === 401) throw new Error("GitHub rejected this token. Check that it is valid and has not expired.");
      if (response.status === 403) throw new Error("GitHub denied access. Check the token’s Contents and Actions permissions, or your GitHub rate limit.");
      if (response.status === 404) throw new Error("GitHub could not find the repository, data, or workflow. Deploy these files and check the token’s repository selection.");
      if (response.status === 409 || response.status === 422) throw new Error("The repository changed or rejected the update. Refresh the scan and retry; your changes were not saved.");
      throw new Error(`GitHub request failed (${response.status}). Please try again.`);
    }
    if (response.status === 204) return null;
    return response.json();
  }
  const base = () => `/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}`;
  async function readFile(path) {
    const data = await api(`${base()}/contents/${path}?ref=${encodeURIComponent(repository.default_branch)}`);
    if (!data.content) throw new Error("GitHub did not return the website data. Please check the repository files.");
    return {value:decode(data.content), sha:data.sha};
  }
  async function refreshData() {
    const current = session;
    const [publicationFile, scholarFile] = await Promise.all([readFile("data/publications.json"), readFile("data/scholar.json")]);
    if (current !== session) return false;
    catalog = publicationFile.value; fileSHA = publicationFile.sha; snapshot = scholarFile.value;
    if (!Array.isArray(catalog.publications) || !Array.isArray(snapshot.articles)) throw new Error("Publication data is malformed. Restore a data backup before continuing.");
    renderReview();
    return true;
  }
  function renderReview() {
    const candidates = pending(snapshot, catalog);
    document.getElementById("admin-citations").textContent = Number.isInteger(snapshot.citations) ? snapshot.citations.toLocaleString() : "—";
    document.getElementById("admin-published").textContent = catalog.publications.length;
    document.getElementById("admin-pending").textContent = candidates.length;
    const date = snapshot.updated_at && new Date(snapshot.updated_at);
    document.getElementById("scan-timestamp").textContent = date ? `Last successful Scholar scan: ${date.toLocaleString()}` : "Your Scholar profile has not been scanned yet.";
    reviewList.innerHTML = candidates.length ? candidates.map((paper, index) => {
      const suggestedType = paper.type || "other";
      const link = safeURL(paper.url);
      return `<article class="admin-card" data-candidate="${index}"><div class="candidate-header"><div><span class="eyebrow">NEW PUBLICATION / ${index + 1}</span><h3>${esc(paper.title)}</h3></div>${link ? `<a href="${esc(link)}" target="_blank" rel="noopener noreferrer">View source ↗</a>` : ""}</div><form class="candidate-form"><div class="review-grid"><label class="full-width">Title<input name="title" required value="${esc(paper.title)}"></label><label class="full-width">Authors<input name="authors" required value="${esc(paper.authors)}"></label><label class="full-width">Journal / conference / venue<input name="venue" required value="${esc(paper.venue)}"></label><label>Year<input name="year" type="number" min="1900" max="${new Date().getFullYear() + 1}" required value="${esc(paper.year || "")}"></label><label>Publication type<select name="type" required>${Object.entries(typeLabels).map(([value, label]) => `<option value="${value}" ${value === suggestedType ? "selected" : ""}>${esc(label)}</option>`).join("")}</select></label><label>Research theme<select name="topic" required><option value="">Choose a theme…</option>${topics.map(topic => `<option value="${esc(topic.id)}" ${topic.id === paper.topic ? "selected" : ""}>${esc(topic.short_title)}</option>`).join("")}<option value="other" ${paper.topic === "other" ? "selected" : ""}>Other / unassigned</option></select></label><label>DOI (optional)<input name="doi" value="${esc(paper.doi || "")}" placeholder="10.…"></label><label class="full-width">Paper / publisher URL<input name="url" type="url" required value="${esc(link)}" placeholder="https://…"></label></div><p class="help">Type and theme are suggestions. Confirm the metadata from the paper’s source.</p><div class="admin-actions"><button class="button button-primary" type="submit">Add publication ↗</button><button class="button button-outline ignore-button" type="button">Ignore this record</button></div></form></article>`;
    }).join("") : '<div class="admin-card"><h2>No papers waiting for review.</h2><p class="help">A successful scan will notify you here when Scholar lists a publication that is missing from your website.</p></div>';
    setBusy(busy);
  }
  function showRunLink(url) {
    const link = document.createElement("a");
    link.href = safeURL(url); link.target = "_blank"; link.rel = "noopener noreferrer";
    link.textContent = "View the scan in GitHub Actions ↗";
    document.getElementById("scan-link").replaceChildren(link);
  }
  const pause = () => new Promise(resolve => setTimeout(resolve, 5000));
  async function scan() {
    if (busy) return;
    setBusy(true);
    const current = session;
    try {
      const requestID = crypto.randomUUID();
      setStatus("Starting a fresh Google Scholar scan…");
      await api(`${base()}/actions/workflows/${config.workflow}/dispatches`, {
        method:"POST", body:JSON.stringify({ref:repository.default_branch, inputs:{request_id:requestID}})
      });
      showRunLink(`https://github.com/${config.owner}/${config.repo}/actions/workflows/${config.workflow}`);
      for (let attempt = 0; attempt < 60; attempt++) {
        await pause();
        if (current !== session || !token) return;
        const runs = await api(`${base()}/actions/workflows/${config.workflow}/runs?event=workflow_dispatch&per_page=20`);
        const run = runs.workflow_runs.find(item => item.display_title?.includes(requestID));
        if (!run) {setStatus("Scan requested. Waiting for a GitHub Actions runner…"); continue;}
        showRunLink(run.html_url);
        if (run.status !== "completed") {setStatus("Scanning your Scholar profile and checking for new papers…"); continue;}
        if (run.conclusion !== "success") throw new Error("The Scholar scan did not complete. Open the GitHub Actions log below and check SERPAPI_KEY, API quota, and repository workflow permissions. Your existing website data has been kept.");
        if (!await refreshData()) return;
        const count = pending(snapshot, catalog).length;
        setStatus(count ? `Scan complete: ${count} new ${count === 1 ? "publication is" : "publications are"} ready for review.` : "Scan complete. Your publication list is up to date.", "success");
        return;
      }
      setStatus("The scan is still queued or running. Check GitHub Actions below; use Scan Scholar again later to refresh the review queue.");
    } catch (error) {
      if (current === session) setStatus(error.message, "error");
    } finally {if (current === session) setBusy(false);}
  }
  document.getElementById("login-form").addEventListener("submit", async event => {
    event.preventDefault();
    if (busy || !config) return;
    token = document.getElementById("github-token").value.trim();
    document.getElementById("github-token").value = "";
    setBusy(true);
    const current = session;
    try {
      setStatus("Verifying your GitHub identity and repository access…");
      const user = await api("/user");
      if (user.login.toLowerCase() !== config.admin_login.toLowerCase()) throw new Error("This GitHub account is not the configured website owner.");
      repository = await api(base());
      if (!repository.permissions?.push) throw new Error("This account does not have write access to the website repository.");
      if (!await refreshData()) return;
      document.getElementById("owner-name").textContent = user.login;
      document.getElementById("login-panel").hidden = true;
      document.getElementById("owner-panel").hidden = false;
      setBusy(false);
      await scan();
    } catch (error) {
      if (current === session) {token = ""; setStatus(error.message, "error");}
    } finally {if (current === session) setBusy(false);}
  });
  scanButton.addEventListener("click", scan);
  function logout() {
    session++;
    token = "";
    controller.abort(); controller = new AbortController();
    repository = catalog = snapshot = null; fileSHA = "";
    document.getElementById("owner-panel").hidden = true;
    document.getElementById("login-panel").hidden = false;
    reviewList.replaceChildren();
    document.getElementById("scan-link").replaceChildren();
    document.getElementById("github-token").value = "";
    setBusy(false); setStatus("Signed out. Your access token has been cleared.");
    document.getElementById("github-token").focus();
  }
  document.getElementById("logout-button").addEventListener("click", logout);
  async function saveCandidate(card, ignore) {
    if (busy) return;
    const paper = pending(snapshot, catalog)[Number(card.dataset.candidate)];
    if (!paper) return;
    const form = card.querySelector("form");
    if (!ignore && !form.reportValidity()) return;
    const fields = new FormData(form);
    const incoming = {...paper};
    if (!ignore) {
      ["title", "authors", "venue", "doi", "type", "topic"].forEach(name => {incoming[name] = fields.get(name).trim();});
      incoming.year = Number(fields.get("year"));
      incoming.url = safeURL(fields.get("url"));
      if (!incoming.title || !incoming.authors || !incoming.venue || !incoming.url) {setStatus("A title, authors, venue, and an HTTP or HTTPS source URL are required.", "error"); return;}
      if (incoming.doi && !/^10\.\d{4,9}\/\S+$/.test(incoming.doi)) {setStatus("Enter a DOI in the form 10.…/… without a doi.org prefix.", "error"); return;}
      incoming.id = incoming.scholar_id ? `scholar-${incoming.scholar_id.replace(/[^a-zA-Z0-9_-]/g, "-")}` : crypto.randomUUID();
      // Remember the original Scholar title even if the owner corrects it.
      incoming.scholar_title = paper.title;
    }
    const current = session;
    setBusy(true);
    try {
      setStatus(ignore ? "Saving the ignored record…" : "Adding your publication…");
      const latest = await readFile("data/publications.json");
      if (current !== session) return;
      if (latest.sha !== fileSHA) throw new Error("The publication catalog has changed since you loaded it. Scan again to refresh, then retry your edit.");
      const next = structuredClone(latest.value);
      next.ignored = next.ignored || [];
      if (ignore) next.ignored = [...new Set([...next.ignored, ...keys(paper)])];
      else {
        const existing = new Set(next.publications.flatMap(keys));
        if (keys(incoming).some(key => existing.has(key))) throw new Error("This publication is already in your catalog. Refresh the scan.");
        next.publications.unshift(incoming);
      }
      await api(`${base()}/contents/data/publications.json`, {method:"PUT", body:JSON.stringify({
        message:ignore ? `Ignore Scholar record: ${paper.title.slice(0, 100)}` : `Add publication: ${incoming.title.slice(0, 100)}`,
        content:encode(next), sha:latest.sha, branch:repository.default_branch
      })});
      if (current !== session) return;
      await refreshData();
      if (current !== session) return;
      setStatus(ignore ? "Record ignored. It will not be suggested again." : "Publication added. Your portfolio will update after the GitHub Pages deployment completes.", "success");
    } catch (error) {if (current === session) setStatus(error.message, "error");}
    finally {if (current === session) setBusy(false);}
  }
  reviewList.addEventListener("submit", event => {event.preventDefault(); const card = event.target.closest("[data-candidate]"); if (card) saveCandidate(card, false);});
  reviewList.addEventListener("click", event => {const button = event.target.closest(".ignore-button"); if (button) saveCandidate(button.closest("[data-candidate]"), true);});
  document.getElementById("backup-button").addEventListener("click", () => {
    if (!catalog || !snapshot) return;
    const blob = new Blob([JSON.stringify({exported_at:new Date().toISOString(), publications:catalog, scholar:snapshot, topics}, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `research-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  window.addEventListener("pagehide", () => {token = ""; controller.abort();});
  window.addEventListener("pageshow", event => {if (event.persisted) logout();});
  async function initialize() {
    try {
      const results = await Promise.allSettled(["site-config", "topics"].map(async name => {
        const response = await fetch(`data/${name}.json`, {cache:"no-store"});
        if (!response.ok) throw new Error("Could not load owner configuration. Serve this folder over HTTP or deploy it to GitHub Pages.");
        return response.json();
      }));
      if (results.some(result => result.status !== "fulfilled")) throw new Error("Could not load owner configuration. Serve this folder over HTTP or deploy it to GitHub Pages.");
      config = results[0].value; topics = results[1].value;
      if (![config.owner, config.repo, config.admin_login].every(value => typeof value === "string" && /^[a-zA-Z0-9_.-]+$/.test(value)) || !/^[a-zA-Z0-9_.-]+\.yml$/.test(config.workflow)) throw new Error("Owner configuration is invalid.");
      loginButton.disabled = false;
      setStatus("Sign in to start a Scholar scan and review any missing publications.");
    } catch (error) {setStatus(error.message, "error");}
  }
  initialize();
})();
