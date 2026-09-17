'use strict';

const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const localAssets=[...html.matchAll(/<(?:script|link)\b[^>]+(?:src|href)="([^"]+)"/g)]
  .map(match=>match[1])
  .filter(value=>!value.startsWith('http'));

assert.ok(localAssets.length>0,'index.html should load local assets');
for(const relative of localAssets){
  assert.ok(fs.existsSync(path.join(root,relative)),'Missing static asset: '+relative);
}
assert.doesNotMatch(html,/<script\b[^>]+src="https?:/i,'Production must not load remote scripts');
assert.match(html,/feedingGuidance\/decisionEngine\.js/);
assert.match(html,/feeding-guidance\.css/);
assert.match(html,/manifest\.webmanifest/);
assert.match(html,/family\.js/);
assert.match(html,/sync\.js/);
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
assert.equal(manifest.display,'standalone');
for(const icon of manifest.icons)assert.ok(fs.existsSync(path.join(root,icon.src)),'Missing PWA icon: '+icon.src);
const serviceWorker=fs.readFileSync(path.join(root,'sw.js'),'utf8');
for(const asset of [...serviceWorker.matchAll(/'([^']+)'/g)].map(match=>match[1]).filter(value=>/\.(?:js|css|html|webmanifest|svg|png)$/.test(value)))assert.ok(fs.existsSync(path.join(root,asset)),'Service worker asset is missing: '+asset);
console.log('Static production build verified: '+localAssets.length+' local assets present.');
