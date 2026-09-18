import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {escapeHTML as esc, renderMarkdown, safeLink} from "./blog-renderer.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = name => fs.readFileSync(path.join(root, name), "utf8");
const topics = JSON.parse(read("data/topics.json"));
const catalog = JSON.parse(read("data/publications.json")).publications;
const brief = read("BLOG_BRIEF.md");
const template = read("templates/blog.html");
let homepage = read("index.html");
const contact = homepage.match(/class="contact-email" href="(mailto:[^"]+)"/)?.[1];
if (!contact) throw new Error("The portfolio contact link is missing.");
const blogTopics = topics.filter(topic => topic.blog_slug);
const seen = new Set();
const output = new Map();

// Keep full author credit and bibliographic wording from the supplied brief.
const briefReferences = new Map();
for (const match of brief.matchAll(/^\d+\. (.+) \((\d{4})\)\.\r?\n   Authors: (.+)\r?\n   Venue: (.+)\r?\n   Source: (.+)\r?\n   DOI: (.+)\r?\n   DOI link: (.+)/gm)) {
  const [, title, year, authors, venue, url, doi] = match;
  briefReferences.set(doi.trim(), {title, year:Number(year), authors, venue, url:url.trim(), doi:doi.trim()});
}

function externalLink(href, label) {
  const safe = safeLink(href);
  if (!/^https?:\/\//.test(safe)) throw new Error(`Invalid publication URL: ${href}`);
  return `<a href="${esc(safe)}" target="_blank" rel="noopener noreferrer">${esc(label)} <span aria-hidden="true">↗</span></a>`;
}
function bibliography(paper) {
  return `<li><h3>${externalLink(paper.url, paper.title)}</h3><p class="story-reference-authors">${esc(paper.authors)}</p><p class="story-reference-venue">${esc(paper.venue)} · ${esc(paper.year)}</p><div class="story-reference-links">${externalLink(`https://doi.org/${paper.doi}`, `DOI: ${paper.doi}`)}${externalLink(paper.url, "Publisher / source")}</div></li>`;
}
function fill(values) {
  return template.replace(/\{\{([a-z_]+)\}\}/g, (_, key) => {
    if (!Object.hasOwn(values, key)) throw new Error(`Unknown template field: ${key}`);
    return values[key];
  });
}

for (const [index, topic] of blogTopics.entries()) {
  const slug = topic.blog_slug;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || seen.has(slug)) throw new Error(`Invalid or duplicate slug: ${slug}`);
  seen.add(slug);
  if (topic.blog_markdown !== `content/blog/${slug}.md`) throw new Error(`Unexpected Markdown path for ${slug}`);
  if (!Array.isArray(topic.research_at_glance) || topic.research_at_glance.length !== 3) throw new Error(`${slug} needs exactly three takeaways.`);
  if (!Array.isArray(topic.blog_keywords) || !topic.blog_keywords.length) throw new Error(`${slug} needs keywords.`);
  if (!topic.image_alt || !/^assets\/img\/topics\/[a-z0-9_.-]+$/i.test(topic.image) || !fs.existsSync(path.join(root, topic.image))) throw new Error(`Missing figure or alt text for ${slug}`);
  const selected = (topic.blog_publication_ids || []).map(id => {
    const paper = catalog.find(item => item.id === id);
    const source = paper && briefReferences.get(paper.doi);
    if (!source || paper.type !== "journal" || paper.topic !== topic.id || source.title !== paper.title || source.year !== paper.year || source.url !== paper.url || source.authors !== paper.authors.trim() || source.venue !== paper.venue) {
      throw new Error(`Publication ${id} conflicts with BLOG_BRIEF.md or the topic catalog.`);
    }
    return source;
  });
  if (!selected.length || new Set(topic.blog_publication_ids).size !== selected.length) throw new Error(`Missing or duplicate references for ${slug}`);
  const source = read(topic.blog_markdown);
  if (!source.trim()) throw new Error(`Empty article: ${slug}`);
  const next = blogTopics[(index + 1) % blogTopics.length];
  const years = selected.map(p => p.year);
  const demos = topic.videos.map(video => {
    if (!brief.includes(video.url) || !/^https:\/\/www\.youtube\.com\/watch\?v=/.test(video.url)) throw new Error(`Unverified video for ${slug}`);
    return `<p>${esc(video.title)}</p><a class="button button-outline" href="${esc(video.url)}" target="_blank" rel="noopener noreferrer">Watch the demo <span aria-hidden="true">→</span></a>`;
  }).join("");
  const values = {
    page_title:esc(topic.blog_title), description:esc(topic.blog_summary), standfirst:esc(topic.blog_standfirst || topic.blog_summary), category:esc(topic.blog_category),
    canonical:esc(`https://ngochuynhho.github.io/blog/${slug}/`), social_image:esc(`https://ngochuynhho.github.io/${topic.image}`),
    year_range:`${Math.min(...years)}–${Math.max(...years)}`, reading_time:String(Math.max(1,Math.ceil(source.split(/\s+/).length / 210))),
    keywords:topic.blog_keywords.map(keyword => `<li>${esc(keyword)}</li>`).join(""),
    image:esc(`../../${topic.image}`), image_alt:esc(topic.image_alt), image_width:esc(topic.image_width), image_height:esc(topic.image_height),
    article_body:renderMarkdown(source), takeaways:topic.research_at_glance.map(point => `<li>${esc(point)}</li>`).join(""),
    publications:selected.map(bibliography).join(""), contact:esc(contact),
    demos:demos ? `<section class="story-demos story-text-column" aria-labelledby="demo-title"><h2 id="demo-title">See the research in action</h2>${demos}</section>` : "",
    next_url:esc(`../${next.blog_slug}/index.html`), next_title:esc(next.blog_title),
  };
  output.set(`blog/${slug}/index.html`, fill(values));
}

homepage = homepage.replace(/(<script type="application\/json" id="initial-topics">)[\s\S]*?(<\/script>)/,
  (_, start, end) => `${start}${JSON.stringify(topics).replace(/</g,"\\u003c")}${end}`);
output.set("index.html", homepage);
const urls = ["https://ngochuynhho.github.io/", ...blogTopics.map(topic => `https://ngochuynhho.github.io/blog/${topic.blog_slug}/`)];
output.set("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${esc(url)}</loc></url>`).join("\n")}\n</urlset>\n`);

if (process.argv.includes("--check")) {
  for (const [name, content] of output) {
    if (!fs.existsSync(path.join(root,name)) || read(name) !== content) throw new Error(`${name} needs rebuilding. Run node scripts/build_blog.mjs.`);
  }
  console.log(`Verified ${blogTopics.length} generated articles, homepage fallback, references, and synchronized topic data.`);
} else {
  for (const [name, content] of output) {
    const target = path.join(root,name);
    fs.mkdirSync(path.dirname(target), {recursive:true});
    fs.writeFileSync(target, content);
  }
  console.log(`Built ${blogTopics.length} research stories and updated topic fallback and sitemap.`);
}
