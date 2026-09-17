'use strict';

const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const root=path.join(__dirname,'..');
const scripts=['growth/referenceData/who-lms.js','growth/units.js','growth/age.js','growth/lms.js','growth/newbornWeight.js','growth/velocity.js','growth/trajectory.js','growth/careContext.js','growth/quality.js','growth/analysis.js','feedingGuidance/reference.js','feedingGuidance/windows.js','feedingGuidance/modes.js','feedingGuidance/formula.js','feedingGuidance/breastfeeding.js','feedingGuidance/diapers.js','feedingGuidance/decisionEngine.js','feedingGuidance/analysis.js','family.js','sync.js','app.js'];

function readyApp(){
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8'),dom=new JSDOM(html,{url:'http://localhost:8766/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
  w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')};w.HTMLElement.prototype.scrollIntoView=()=>{};w.confirm=()=>true;w.alert=()=>{};w.print=()=>{w.__printed=true};w.crypto.randomUUID=()=>`test-${Date.now()}`;w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;
  const birth=new Date(Date.now()-5*86400000),parts={date:`${birth.getFullYear()}-${String(birth.getMonth()+1).padStart(2,'0')}-${String(birth.getDate()).padStart(2,'0')}`,time:`${String(birth.getHours()).padStart(2,'0')}:${String(birth.getMinutes()).padStart(2,'0')}`};
  w.localStorage.setItem('little-days-v1',JSON.stringify({baby:{name:'Test Baby',...parts,sex:'female',gestationalWeeks:40,gestationalDays:0,birthWeightKg:3.1,birthLengthCm:49},entries:[{id:'legacy-growth',type:'growth',at:new Date(+birth+86400000).toISOString(),weight:'7',weightUnit:'lb',height:'20',heightUnit:'in',notes:'legacy stays'}]}));
  scripts.forEach(file=>w.eval(fs.readFileSync(path.join(root,file),'utf8')));return dom
}

test('clinical analysis modules do not transmit health data',()=>{
  const source=scripts.filter(file=>file.startsWith('feedingGuidance/')||file.startsWith('growth/')).map(file=>fs.readFileSync(path.join(root,file),'utf8')).join('\n');assert.doesNotMatch(source,/\bfetch\s*\(|new\s+XMLHttpRequest|sendBeacon\s*\(|new\s+WebSocket|new\s+EventSource/)
});

test('legacy single-baby data migrates and multiple Baby IDs remain isolated',()=>{
  const dom=readyApp(),w=dom.window,d=w.document,originalId=d.querySelector('#babySelector').value;
  assert.match(d.querySelector('#babySelector').textContent,/Test Baby/);assert.match(d.querySelector('#activeBabyId').textContent,new RegExp(originalId));
  d.querySelector('#addBaby').click();const secondId=d.querySelector('#babyId').value;assert.notEqual(secondId,originalId);d.querySelector('#babyName').value='Second Baby';const birth=new Date(Date.now()-86400000);d.querySelector('#birthDate').value=`${birth.getFullYear()}-${String(birth.getMonth()+1).padStart(2,'0')}-${String(birth.getDate()).padStart(2,'0')}`;d.querySelector('#birthTime').value='08:00';d.querySelector('#saveSetup').click();assert.match(d.querySelector('#babySelector').textContent,/Second Baby/);
  d.querySelector('#babySelector').value=originalId;d.querySelector('#babySelector').dispatchEvent(new w.Event('change',{bubbles:true}));assert.equal(d.querySelector('#babyName').value,'Test Baby');assert.equal(JSON.parse(w.localStorage.getItem('little-days-family-v1')).babies[originalId].record.entries[0].notes,'legacy stays');dom.window.close()
});

test('browser UI migrates legacy data and supports growth add/edit/delete/chart/PDF',()=>{
  const dom=readyApp(),w=dom.window,d=w.document;
  assert.match(d.querySelector('#growthAnalysis').textContent,/Growth/);assert.ok(d.querySelector('#growthChart svg'));
  d.querySelector('#chartFeature').value='weight';d.querySelector('#chartFeature').dispatchEvent(new w.Event('change',{bubbles:true}));assert.ok([...d.querySelectorAll('#chart .chart-point')].some(point=>point.dataset.tip.includes('Birth weight: 3.100 kg')));
  d.querySelector('#chartFeature').value='height';d.querySelector('#chartFeature').dispatchEvent(new w.Event('change',{bubbles:true}));assert.ok([...d.querySelectorAll('#chart .chart-point')].some(point=>point.dataset.tip.includes('Birth length: 49.0 cm')));
  d.querySelector('[data-action="growth"]').click();d.querySelector('#weight').value='3.4';d.querySelector('#weightUnit').value='kg';d.querySelector('#height').value='51';d.querySelector('#heightUnit').value='cm';d.querySelector('#headCircumference').value='35';d.querySelector('#entryForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  let saved=JSON.parse(w.localStorage.getItem('little-days-v1')),added=saved.entries.at(-1);assert.equal(saved.schemaVersion,3);assert.equal(saved.entries[0].notes,'legacy stays');assert.ok(saved.entries[0].weightKg>3);assert.equal(added.weightKg,3.4);assert.equal(added.lengthCm,51);assert.equal(added.headCm,35);
  d.querySelector(`[data-edit="${added.id}"]`).click();d.querySelector('#weight').value='3.45';d.querySelector('#entryForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));saved=JSON.parse(w.localStorage.getItem('little-days-v1'));assert.equal(saved.entries.length,2);assert.equal(saved.entries.find(e=>e.id===added.id).weightKg,3.45);
  d.querySelector('#exportButton').click();assert.equal(w.__printed,true);assert.match(d.querySelector('#printReport').innerHTML,/Growth Summary/);assert.match(d.querySelector('#printReport').innerHTML,/screening and tracking tools/);
  d.querySelector(`[data-delete="${added.id}"]`).click();saved=JSON.parse(w.localStorage.getItem('little-days-v1'));assert.equal(saved.entries.length,1);dom.window.close()
});

test('feeding observations, guidance, clinical plan, trends, editing and PDF stay local',()=>{
  const dom=readyApp(),w=dom.window,d=w.document;
  assert.match(d.querySelector('#feedingGuidance').textContent,/Feeding guidance/i);assert.ok(d.querySelector('#feedingTrendChart svg'));
  d.querySelector('[data-action="feed"]').click();d.querySelector('#duration').value='18';d.querySelector('#side').value='Both';d.querySelector('#swallowing').value='yes';d.querySelector('#latch').value='comfortable';d.querySelector('#afterFeed').value='satisfied';d.querySelector('[name="hungerCue"][value="rooting"]').checked=true;d.querySelector('[name="fullnessCue"][value="relaxed"]').checked=true;d.querySelector('#entryForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  let saved=JSON.parse(w.localStorage.getItem('little-days-v1')),feed=saved.entries.at(-1);assert.equal(saved.schemaVersion,3);assert.equal(feed.type,'feed');assert.equal(feed.swallowing,'yes');assert.equal(feed.latch,'comfortable');assert.deepEqual(feed.hungerCues,['rooting']);assert.deepEqual(feed.fullnessCues,['relaxed']);assert.doesNotMatch(JSON.stringify(feed),/estimatedMilk/i);
  d.querySelector('#feedingTrackingComplete').checked=true;d.querySelector('#feedingTrackingComplete').dispatchEvent(new w.Event('change',{bubbles:true}));d.querySelector('#diaperTrackingComplete').checked=true;d.querySelector('#diaperTrackingComplete').dispatchEvent(new w.Event('change',{bubbles:true}));saved=JSON.parse(w.localStorage.getItem('little-days-v1'));assert.equal(saved.feedingGuidance.tracking.feedingComplete,true);assert.equal(saved.feedingGuidance.tracking.diaperComplete,true);
  assert.match(d.querySelector('#timeline').textContent,/Swallowing observed/);assert.match(d.querySelector('#timeline').textContent,/Hunger cues: rooting/);
  d.querySelector(`[data-edit="${feed.id}"]`).click();assert.equal(d.querySelector('#swallowing').value,'yes');assert.equal(d.querySelector('[name="hungerCue"][value="rooting"]').checked,true);d.querySelector('#afterFeed').value='still_hungry';d.querySelector('#entryForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));saved=JSON.parse(w.localStorage.getItem('little-days-v1'));assert.equal(saved.entries.length,2);assert.equal(saved.entries.find(entry=>entry.id===feed.id).afterFeed,'still_hungry');
  d.querySelector('#openFeedingPlan').click();d.querySelector('#planTargetBottle').value='70';d.querySelector('#planMinimumFeeds').value='8';d.querySelector('#planNotes').value='Use paced bottles as discussed.';d.querySelector('#planProvider').value='Newborn clinic';d.querySelector('#feedingPlanForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));saved=JSON.parse(w.localStorage.getItem('little-days-v1'));assert.equal(saved.baby.clinicalFeedingPlan.targetBottleMl,70);assert.equal(saved.baby.clinicalFeedingPlan.minimumFeedsPerDay,8);assert.match(d.querySelector('#clinicalPlanBanner').textContent,/Following your baby's clinical feeding plan/);
  d.querySelector('#feedingTrendMetric').value='breastSessions';d.querySelector('#feedingTrendMetric').dispatchEvent(new w.Event('change',{bubbles:true}));assert.ok(d.querySelector('#feedingTrendChart svg'));const point=d.querySelector('#feedingTrendChart .feeding-trend-point');point.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));assert.equal(d.querySelector('#feedingTrendTooltip').classList.contains('hidden'),false);assert.match(d.querySelector('#feedingTrendTooltip').textContent,/Baby Day \d+.*Breastfeeding sessions/);point.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));assert.equal(d.querySelector('#feedingTrendTooltip').classList.contains('hidden'),false);d.body.click();assert.equal(d.querySelector('#feedingTrendTooltip').classList.contains('hidden'),true);
  d.querySelector('#exportButton').click();assert.equal(w.__printed,true);const report=d.querySelector('#printReport').innerHTML;assert.match(report,/Feeding Summary/);assert.match(report,/Breastfeeding minutes are not converted to milk volume/);assert.match(report,/Recorded bottle intake/);assert.match(report,/Swallowing observed/);assert.match(report,/Still hungry after feed/);assert.ok(report.indexOf('report-summary')<report.indexOf('Baby Day Summary'));assert.ok(report.indexOf('Baby Day Summary')<report.indexOf('Feeding Summary'));assert.ok(report.indexOf('Feeding Summary')<report.indexOf('report-day'));
  d.querySelector(`[data-delete="${feed.id}"]`).click();saved=JSON.parse(w.localStorage.getItem('little-days-v1'));assert.equal(saved.entries.length,1);assert.equal(saved.entries[0].notes,'legacy stays');assert.equal(saved.baby.clinicalFeedingPlan.targetBottleMl,70);dom.window.close()
});
