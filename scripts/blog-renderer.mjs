import "../assets/js/research-core.js";
import "../assets/js/story-cards.js";
import MarkdownIt from "../tools/vendor/markdown-it/markdown-it.mjs";

export const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g,
  char => ({"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"}[char]));

export function safeLink(value) {
  const href = String(value || "");
  if (!href || /[\s\\\u0000-\u001f]/.test(href) || href.startsWith("//")) return "";
  if (href.startsWith("#") || /^(?:\.\.\/)*[a-z0-9_./-]+(?:#[a-z0-9_-]+)?$/i.test(href)) return href;
  try {
    const url = new URL(href);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch { return ""; }
}

export function renderMarkdown(source) {
  const md = new MarkdownIt({html:false, linkify:false, typographer:false});
  md.validateLink = href => Boolean(safeLink(href));
  const renderLink = md.renderer.rules.link_open || ((tokens, index, options, env, self) => self.renderToken(tokens, index, options));
  md.renderer.rules.link_open = (tokens, index, options, env, self) => {
    const token = tokens[index];
    const href = token.attrGet("href");
    if (/^https?:\/\//i.test(href)) {
      token.attrSet("target", "_blank");
      token.attrSet("rel", "noopener noreferrer");
      token.attrSet("class", "external-link");
    }
    return renderLink(tokens, index, options, env, self);
  };
  md.renderer.rules.image = (tokens, index, options, env, self) => {
    const token = tokens[index];
    const src = safeLink(token.attrGet("src"));
    // Keep figures local, and resolve portfolio-relative assets from an article.
    if (!/^(?:\.\.\/)*assets\/img\/[a-z0-9_./-]+$/i.test(src) || src.includes("/../")) {
      return escapeHTML(token.content);
    }
    token.attrSet("src", src.startsWith("assets/") ? `../../${src}` : src);
    token.attrSet("alt", self.renderInlineAsText(token.children, options, env));
    token.attrSet("loading", "lazy");
    token.attrSet("decoding", "async");
    return self.renderToken(tokens, index, options);
  };
  md.renderer.rules.table_open = () => '<div class="story-table" tabindex="0" role="region" aria-label="Research comparison table"><table>\n';
  md.renderer.rules.table_close = () => "</table></div>\n";
  return md.render(source);
}

export const storyCard = globalThis.StoryCards.render;
