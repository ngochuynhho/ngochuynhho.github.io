/* Shared static/live Scientific Blog card markup. */
(() => {
  "use strict";
  const esc = ResearchCore.escapeHTML;
function render(topic, publications) {
  const selected = publications.filter(p => (topic.blog_publication_ids || []).includes(p.id));
  const years = selected.map(p => p.year).filter(Number.isInteger);
  const range = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : "Research story";
  const href = `blog/${topic.blog_slug}/index.html`;
  return `<article class="story-card"><a class="story-card-image" href="${esc(href)}" tabindex="-1" aria-hidden="true"><img src="${esc(topic.image)}" alt="${esc(topic.image_alt)}" width="${esc(topic.image_width)}" height="${esc(topic.image_height)}" loading="lazy"></a><div class="story-card-body"><span class="eyebrow">${esc(topic.blog_category)}</span><h3><a href="${esc(href)}">${esc(topic.blog_title)}</a></h3><p>${esc(topic.blog_summary)}</p><div class="story-card-keywords">${esc(topic.blog_keywords.join(" · "))}</div><div class="story-card-footer"><span>${esc(range)} · ${esc(selected.length)} journal papers</span><a href="${esc(href)}" aria-label="Read research story: ${esc(topic.blog_title)}">Read research story <span aria-hidden="true">→</span></a></div></div></article>`;
}

  globalThis.StoryCards = Object.freeze({render});
})();
