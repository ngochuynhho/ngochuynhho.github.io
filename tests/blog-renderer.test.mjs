import test from "node:test";
import assert from "node:assert/strict";
import {renderMarkdown, safeLink} from "../scripts/blog-renderer.mjs";

test("editorial Markdown supports headings, emphasis, lists, quotes, tables, images, and rules", () => {
  const source = '# Heading\n\n## Section\n\n### Detail\n\nA **bold** and *italic* paragraph with [a DOI](https://doi.org/10.1234/example).\n\n> A quotation\n\n- One\n- Two\n\n1. First\n2. Second\n\n| Question | Evidence |\n| --- | --- |\n| A | B |\n\n![Research figure](assets/img/topics/Research_topic.png)\n\n---';
  const html = renderMarkdown(source);
  for (const tag of ["h1", "h2", "h3", "p", "strong", "em", "blockquote", "ul", "ol", "table", "hr"]) {
    assert.match(html, new RegExp(`<${tag}(?:>|[ />])`));
  }
  assert.match(html, /href="https:\/\/doi.org\/10.1234\/example" target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /class="story-table" tabindex="0" role="region"/);
  assert.match(html, /src="\.\.\/\.\.\/assets\/img\/topics\/Research_topic.png" alt="Research figure"/);
});

test("raw HTML and executable links cannot become executable article markup", () => {
  const source = '<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n[bad](javascript:alert(1))\n\n[data](data:text/html,test)\n\n[remote](//evil.example/test)';
  const html = renderMarkdown(source);
  assert(!html.includes("<script>"));
  assert(!html.includes("<img"));
  assert(!html.includes("href="));
  assert.match(html, /&lt;script&gt;/);
  for (const href of ["javascript:alert(1)", "data:text/html,test", "//evil.example", "file:///tmp/test", "\\\\evil.example"]) assert.equal(safeLink(href), "");
});

test("Markdown figures stay in the local image collection and have escaped alt text", () => {
  const html = renderMarkdown('![remote](https://example.com/track.png)\n\n![traversal](assets/img/topics/../../../private.png)\n\n![<unsafe>](assets/img/topics/Research_topic.png)');
  assert.equal((html.match(/<img /g) || []).length, 1);
  assert(!html.includes('src="https://'));
  assert.match(html, /alt="&lt;unsafe&gt;"/);
});

test("internal links preserve normal navigation while publisher links are visibly external", () => {
  const html = renderMarkdown('[section](#question) and [all stories](../../index.html#scientific-blog) and [paper](https://www.nature.com/articles/example)');
  assert.match(html, /href="#question">section/);
  assert.match(html, /href="\.\.\/\.\.\/index.html#scientific-blog">all stories/);
  assert.equal((html.match(/target="_blank"/g) || []).length, 1);
  assert.match(html, /class="external-link"/);
});
