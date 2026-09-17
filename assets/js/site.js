(() => {
  "use strict";
  const {escapeHTML: esc, safeURL, typeLabels} = ResearchCore;
  const readSeed = id => JSON.parse(document.getElementById(id).textContent);
  let catalog = readSeed("initial-publications");
  let topics = readSeed("initial-topics");
  let scholar = readSeed("initial-scholar");
  let activeType = "journal";
  let visibleCount = 8;
  const list = document.getElementById("publication-list");
  const search = document.getElementById("publication-search");
  const sort = document.getElementById("publication-sort");
  const loadMore = document.getElementById("load-more");
  const dialog = document.getElementById("topic-dialog");
  let lastProject = null;

  function paperURL(paper) {
    return safeURL(paper.url) || (paper.doi ? safeURL(`https://doi.org/${paper.doi}`) : "");
  }
  function paperMarkup(paper) {
    const url = paperURL(paper);
    const title = url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(paper.title)}</a>` : esc(paper.title);
    return `<article class="publication"><div class="pub-year">${esc(paper.year || "—")}</div><div><span class="eyebrow">${esc(typeLabels[paper.type] || "Publication")}</span><h3>${title}</h3><p class="pub-authors">${esc(paper.authors)}</p><p class="pub-venue">${esc(paper.venue)}</p></div><span class="pub-arrow" aria-hidden="true">${url ? "↗" : ""}</span></article>`;
  }
  function renderPublications() {
    const query = ResearchCore.normalize(search.value);
    const filtered = catalog.publications.filter(paper =>
      (activeType === "all" || paper.type === activeType) &&
      ResearchCore.normalize([paper.title, paper.authors, paper.venue, paper.year].join(" ")).includes(query));
    filtered.sort((a, b) => sort.value === "title" ? a.title.localeCompare(b.title) :
      sort.value === "oldest" ? (a.year || 0) - (b.year || 0) : (b.year || 0) - (a.year || 0));
    list.innerHTML = filtered.length ? filtered.slice(0, visibleCount).map(paperMarkup).join("") :
      '<p class="empty-state">No publications match this search. Try another title, author, or year.</p>';
    document.getElementById("publication-results").textContent = `${filtered.length} ${filtered.length === 1 ? "publication" : "publications"} · ${activeType === "all" ? "all work" : typeLabels[activeType].toLowerCase()}`;
    loadMore.hidden = visibleCount >= filtered.length;
  }
  function renderMetrics() {
    const hasLiveCount = Number.isInteger(scholar.citations) && scholar.citations >= 0;
    document.getElementById("citation-count").textContent = (hasLiveCount ? scholar.citations : scholar.previously_recorded_citations || 0).toLocaleString();
    document.getElementById("citation-label").textContent = hasLiveCount ? "Google Scholar citations" : "Citations · previously recorded";
    const timestamp = scholar.updated_at && new Date(scholar.updated_at);
    const date = timestamp && !Number.isNaN(timestamp.valueOf()) ? timestamp.toLocaleDateString(undefined, {month:"short", day:"numeric", year:"numeric"}) : null;
    const stale = timestamp && Date.now() - timestamp.valueOf() > 7 * 86400000;
    document.getElementById("scholar-updated").textContent = hasLiveCount && date ? `${stale ? "Last successful refresh" : "Updated"} ${date}` : "Last recorded on this website; awaiting refresh.";
    document.getElementById("journal-count").textContent = catalog.publications.filter(p => p.type === "journal").length;
    document.getElementById("theme-count").textContent = String(topics.length).padStart(2, "0");
  }
  function renderProjects() {
    document.getElementById("project-grid").innerHTML = topics.map(topic => {
      const count = catalog.publications.filter(p => p.type === "journal" && p.topic === topic.id).length;
      return `<button class="project-card" data-topic="${esc(topic.id)}" aria-haspopup="dialog"><div class="project-visual"><img src="${esc(topic.image)}" alt="" loading="lazy" width="640" height="300"><span class="project-number">${esc(topic.number)}</span></div><div class="project-body"><span class="eyebrow">${esc(topic.label)}</span><h3>${esc(topic.short_title)}</h3><p>${esc(topic.summary)}</p><div class="project-bottom"><span>${count} journal ${count === 1 ? "paper" : "papers"}</span><span class="read-note">Read research note <span aria-hidden="true">↗</span></span></div></div></button>`;
    }).join("");
  }
  function openTopic(id, trigger) {
    const topic = topics.find(item => item.id === id);
    if (!topic) return;
    lastProject = trigger;
    const papers = catalog.publications.filter(paper => paper.type === "journal" && paper.topic === id);
    document.getElementById("topic-content").innerHTML = `<header class="topic-header"><span class="eyebrow">RESEARCH NOTE ${esc(topic.number)} / ${esc(topic.label)}</span><h2 id="topic-title">${esc(topic.title)}</h2><div class="topic-tags">${topic.tags.map(tag => `<span class="topic-tag">${esc(tag)}</span>`).join("")}</div></header><div class="topic-body"><h3>The problem</h3><p>${esc(topic.problem)}</p><figure><img src="${esc(topic.image)}" alt="Conceptual research pipeline for ${esc(topic.short_title)}" width="640" height="300"><figcaption>${esc(topic.image_caption)}</figcaption></figure><h3>The research approach</h3><p>${esc(topic.approach)}</p><h3>Significant findings & contributions</h3>${topic.findings.map(finding => `<div class="finding"><h4>${esc(finding.title)}</h4><p>${esc(finding.text)}</p></div>`).join("")}<h3>The broader perspective</h3><p>${esc(topic.perspective)}</p><h3>Explore the journal papers</h3><ul class="topic-sources">${papers.map(paper => `<li>${paperURL(paper) ? `<a href="${esc(paperURL(paper))}" target="_blank" rel="noopener noreferrer">${esc(paper.title)} ↗</a>` : esc(paper.title)}<br><span class="muted">${esc(paper.year)} · ${esc(paper.venue)}</span></li>`).join("")}</ul>${topic.videos.length ? `<div class="topic-videos">${topic.videos.filter(video => safeURL(video.url)).map(video => `<a class="button button-primary" href="${esc(safeURL(video.url))}" target="_blank" rel="noopener noreferrer">▶ ${esc(video.title)} ↗</a>`).join("")}</div>` : ""}</div>`;
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add("dialog-open");
  }
  document.getElementById("project-grid").addEventListener("click", event => {
    const card = event.target.closest("[data-topic]");
    if (card) openTopic(card.dataset.topic, card);
  });
  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    if (lastProject?.isConnected) lastProject.focus();
  });
  document.querySelectorAll("[data-type]").forEach(button => button.addEventListener("click", () => {
    activeType = button.dataset.type;
    visibleCount = 8;
    document.querySelectorAll("[data-type]").forEach(chip => {
      chip.classList.toggle("active", chip === button);
      chip.setAttribute("aria-pressed", String(chip === button));
    });
    renderPublications();
  }));
  search.addEventListener("input", () => {visibleCount = 8; renderPublications();});
  sort.addEventListener("change", () => {visibleCount = 8; renderPublications();});
  loadMore.addEventListener("click", () => {visibleCount += 8; renderPublications();});
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("primary-nav");
  function closeMenu() {nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Open navigation");}
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  nav.addEventListener("click", event => {if (event.target.closest("a")) closeMenu();});
  document.addEventListener("click", event => {if (!event.target.closest(".site-header")) closeMenu();});
  document.addEventListener("keydown", event => {if (event.key === "Escape") closeMenu();});
  document.getElementById("copyright-year").textContent = new Date().getFullYear();
  document.documentElement.classList.add("js-ready");
  renderPublications(); renderProjects(); renderMetrics();
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting).forEach(entry => {
        nav.querySelectorAll("a").forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, {rootMargin:"-15% 0px -65% 0px"});
    document.querySelectorAll("main > section[id]").forEach(section => observer.observe(section));
  }
  async function refresh() {
    const results = await Promise.allSettled(["publications", "topics", "scholar"].map(async name => {
      const response = await fetch(`data/${name}.json`, {cache:"no-cache"});
      if (!response.ok) throw new Error("Research data unavailable");
      return response.json();
    }));
    if (results[0].status === "fulfilled" && Array.isArray(results[0].value.publications)) catalog = results[0].value;
    if (results[1].status === "fulfilled" && Array.isArray(results[1].value)) topics = results[1].value;
    if (results[2].status === "fulfilled" && results[2].value.author_id === scholar.author_id) scholar = results[2].value;
    renderPublications(); renderProjects(); renderMetrics();
  }
  // Inline seed keeps the portfolio usable when opened directly from disk.
  if (location.protocol !== "file:") refresh().catch(() => {});
})();
