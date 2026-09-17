/* Shared publication identity rules. No credentials or network access. */
(() => {
  "use strict";
  const normalize = value => String(value || "").normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/&/g, " and ")
    .replace(/['’‘]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  const keys = paper => [paper.scholar_id && `scholar:${paper.scholar_id}`,
    paper.doi && `doi:${paper.doi.toLowerCase().replace(/^https?:\/\/doi.org\//, "").replace(/\.$/, "")}`,
    paper.title && `title:${normalize(paper.title)}`,
    paper.scholar_title && `title:${normalize(paper.scholar_title)}`].filter(Boolean);
  const pending = (snapshot, catalog) => {
    const known = new Set([...(catalog.ignored || []),
      ...catalog.publications.flatMap(keys)]);
    return (snapshot.articles || []).filter(paper => {
      const identities = keys(paper);
      if (identities.some(key => known.has(key))) return false;
      identities.forEach(key => known.add(key));
      return true;
    });
  };
  const safeURL = value => {
    try {
      const url = new URL(value);
      return ["https:", "http:"].includes(url.protocol) ? url.href : "";
    } catch { return ""; }
  };
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g,
    char => ({"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"}[char]));
  const typeLabels = {journal:"Journal articles", conference:"Conferences", domestic:"Korean publications",
    patent:"Patents", thesis:"Thesis", poster:"Posters & abstracts", other:"Other"};
  globalThis.ResearchCore = Object.freeze({normalize, keys, pending, safeURL, escapeHTML, typeLabels});
})();
