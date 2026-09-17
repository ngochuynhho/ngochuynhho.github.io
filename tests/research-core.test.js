const test = require("node:test");
const assert = require("node:assert/strict");
require("../assets/js/research-core.js");
const {normalize, keys, pending, safeURL, escapeHTML} = globalThis.ResearchCore;

test("titles match across Scholar punctuation and accented authors", () => {
  assert.equal(normalize("Alzheimer’s disease: MRI & clinical data"), normalize("Alzheimer's disease — MRI and clinical data"));
  assert.equal(normalize("José"), "jose");
});
test("published and ignored records stay out of the review queue", () => {
  const snapshot = {articles:[{title:"Existing paper"}, {title:"Corrected paper", scholar_id:"owner:1"},
    {title:"New paper"}, {title:"New paper"}]};
  const catalog = {publications:[{title:"Existing paper"}], ignored:["scholar:owner:1"]};
  assert.deepEqual(pending(snapshot, catalog), [{title:"New paper"}]);
});
test("corrected imported titles retain their original identity", () => {
  assert.deepEqual(pending({articles:[{title:"Original title"}]}, {
    publications:[{title:"Fixed title", scholar_title:"Original title"}]}), []);
  assert(keys({doi:"https://doi.org/10.1234/Example."}).includes("doi:10.1234/example"));
});
test("source metadata cannot inject executable URLs or markup", () => {
  for (const value of ["javascript:alert(1)", "data:text/html,test", "file:///tmp/test", "/relative", "not a URL"])
    assert.equal(safeURL(value), "");
  assert.equal(safeURL("https://www.nature.com/articles/test"), "https://www.nature.com/articles/test");
  assert.equal(escapeHTML('<img src=x onerror="alert(1)">'), "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
});
