'use strict';

const CACHE_NAME='little-days-v5';
const APP_ASSETS=[
  './','index.html','styles.css','temperature.css','feeding-guidance.css','family.js','sync.js','app.js','manifest.webmanifest','icons/little-days.svg','icons/little-days-180.png','icons/little-days-192.png','icons/little-days-512.png',
  'growth/referenceData/who-lms.js','growth/units.js','growth/age.js','growth/lms.js','growth/newbornWeight.js','growth/velocity.js','growth/trajectory.js','growth/careContext.js','growth/quality.js','growth/analysis.js',
  'feedingGuidance/reference.js','feedingGuidance/windows.js','feedingGuidance/modes.js','feedingGuidance/formula.js','feedingGuidance/breastfeeding.js','feedingGuidance/diapers.js','feedingGuidance/decisionEngine.js','feedingGuidance/analysis.js'
];

self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.includes('/api/'))return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(response=>{const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put('./',copy));return response}).catch(()=>caches.match('./')));return
  }
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,copy))}return response})))
});
