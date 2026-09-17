'use strict';

const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const root=path.join(__dirname,'..');
[
  'growth/referenceData/who-lms.js','growth/units.js','growth/age.js','growth/lms.js',
  'growth/newbornWeight.js','growth/velocity.js','growth/trajectory.js',
  'growth/careContext.js','growth/quality.js','growth/analysis.js'
].forEach(file=>require(path.join(root,file)));

const G=globalThis.LittleDaysGrowth;
const close=(actual,expected,tolerance=1e-6)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} ≉ ${expected}`);

test('exact age uses elapsed milliseconds at birth, 23h, and 24h',()=>{
  const birth='2026-01-01T10:00:00.000Z';
  assert.equal(G.age.exact(birth,birth).babyDay,1);
  close(G.age.exact(birth,'2026-01-02T09:00:00.000Z').hours,23);
  assert.equal(G.age.exact(birth,'2026-01-02T10:00:00.000Z').babyDay,2);
});

test('exact age is stable across a DST boundary',()=>{
  const age=G.age.exact('2026-03-08T07:30:00.000Z','2026-03-09T07:30:00.000Z');
  close(age.hours,24);assert.equal(age.babyDay,2);
});

test('corrected and postmenstrual age for preterm infant',()=>{
  const age=G.age.corrected('2026-01-01T00:00:00Z','2026-03-12T00:00:00Z',32,0);
  assert.equal(age.isPreterm,true);close(age.chronologicalWeeks??age.weeks,10);close(age.correctedWeeks,2);close(age.postmenstrualAgeWeeks,42);
});

test('unit conversion round trips',()=>{
  close(G.units.lbToKg(G.units.kgToLb(3.17)),3.17);close(G.units.inToCm(G.units.cmToIn(51.2)),51.2);close(G.units.flOzToMl(G.units.mlToFlOz(90)),90);close(G.units.ozToG(G.units.gToOz(170)),170);
});

test('birth-weight change example is -170 g and about -5.36%',()=>{
  const result=G.newbornWeight.analyze(3.170,[{kg:3.000,at:'2026-01-03T00:00:00Z'}],'2026-01-01T00:00:00Z','2026-01-04T00:00:00Z');
  close(result.changeGrams,-170);close(result.percentChange,-5.362776,1e-5);assert.equal(result.regained,false);
});

test('birth-weight analysis finds nadir, >10% loss, and first regain',()=>{
  const weights=[{kg:2.8,at:'2026-01-02T00:00:00Z'},{kg:2.6,at:'2026-01-03T00:00:00Z'},{kg:3.01,at:'2026-01-10T00:00:00Z'}],r=G.newbornWeight.analyze(3,weights,'2026-01-01T00:00:00Z','2026-01-11T00:00:00Z');
  assert.equal(r.lowestKg,2.6);assert.equal(r.overTenPercentLoss,true);assert.equal(r.regained,true);assert.equal(r.regainedAge.babyDay,10);
});

test('LMS supports nonzero L, zero L, percentile, interpolation, and inverse curves',()=>{
  close(G.lms.zScore(10,{L:0,M:10,S:.1}),0);close(G.lms.zScore(9.7,{L:-.1600954,M:9.476500305,S:.11218624}),.207,0.001);
  close(G.lms.percentile(.207),58.2,.2);const rows=[[0,1,3,.1],[1,3,5,.2]],mid=G.lms.interpolate(rows,.5);close(mid.L,2);close(mid.M,4);close(G.lms.referenceValue({L:1,M:4,S:.1},1),4.4);
});

test('bundled WHO data has expected coverage and known 9-month WHO row',()=>{
  const row=globalThis.WHO_LMS_DATA.weightForAge.male.find(r=>r[0]===9);assert.deepEqual(row,[9,.0917,8.9014,.10881]);const result=G.lms.calculate('weightForAge','male',9,9.7);close(result.z,.7927,.001);close(result.percentile,78.6,.2);
  assert.equal(globalThis.WHO_LMS_DATA.weightForLength.female[0][0],45);assert.equal(globalThis.WHO_LMS_DATA.weightForLength.female.at(-1)[0],110);
});

test('weight velocity handles sorting, loss, and identical timestamps',()=>{
  const result=G.velocity.weight([{kg:3.2,at:'2026-01-08T00:00:00Z'},{kg:3,at:'2026-01-01T00:00:00Z'}]);close(result.grams,200);close(result.gramsPerDay,28.571428,1e-5);
  assert.ok(G.velocity.weight([{kg:3.1,at:'2026-01-02T00:00:00Z'},{kg:3.2,at:'2026-01-01T00:00:00Z'}]).grams<0);assert.equal(G.velocity.weight([{kg:3,at:'2026-01-01T00:00:00Z'},{kg:3.1,at:'2026-01-01T00:00:00Z'}]),null);
});

test('care context separates breastfeeding, bottles, and output',()=>{
  const entries=[{type:'feed',method:'breast',duration:'20',side:'Left',at:'2026-01-01T01:00:00Z'},{type:'feed',method:'bottle',amount:'60',milkType:'Formula',at:'2026-01-01T04:00:00Z'},{type:'wet',at:'2026-01-01T05:00:00Z'},{type:'soiled',at:'2026-01-01T06:00:00Z'}],c=G.careContext.summarize(entries,new Date('2026-01-01T00:00:00Z'),new Date('2026-01-02T00:00:00Z'));
  assert.equal(c.breastSessions,1);assert.equal(c.bottleMl,60);assert.equal(c.wet,1);assert.equal(c.soiled,1);close(c.averageHoursBetweenFeeds,3);
});

test('Baby Day care context provides current, previous, 3-day, and 7-day windows',()=>{
  const birth='2026-01-01T06:00:00Z',entries=[{type:'feed',method:'bottle',amount:'30',at:'2026-01-01T07:00:00Z'},{type:'wet',at:'2026-01-02T07:00:00Z'}];assert.equal(G.careContext.babyDay(entries,birth,1).bottleMl,30);assert.equal(G.careContext.babyDay(entries,birth,2).wet,1);close(G.careContext.rollingBabyDays(entries,birth,3,3).feedsPerDay,1/3);
});

test('quality checks duplicates, prebirth records, and short-interval jumps',()=>{
  const list=[{id:'a',kind:'weight',value:3,at:'2026-01-01T00:00:00Z'},{id:'b',kind:'weight',value:3,at:'2026-01-01T00:00:00Z'},{id:'c',kind:'weight',value:4,at:'2026-01-02T00:00:00Z'}],issues=G.quality.check(list,'2026-01-01T12:00:00Z');assert.ok(issues.some(i=>i.code==='duplicate'));assert.ok(issues.some(i=>i.code==='before-birth'));assert.ok(issues.some(i=>i.code==='jump'));
});

test('quality flags invalid units without deleting a measurement',()=>{
  const issues=G.quality.check([{id:'u',kind:'weight',value:3.2,unitValid:false,at:'2026-01-02T00:00:00Z'}],'2026-01-01T00:00:00Z');assert.ok(issues.some(i=>i.code==='invalid-unit'));
});

test('migration preserves legacy entries and adds canonical metric values',()=>{
  const original={baby:{date:'2026-01-01',time:'00:00'},entries:[{id:'x',type:'growth',at:'2026-01-02T00:00:00Z',weight:'7',weightUnit:'lb',height:'20',heightUnit:'in',notes:'keep'}]},m=G.analysis.normalizeState(structuredClone(original));assert.equal(m.entries[0].notes,'keep');close(m.entries[0].weightKg,3.17514659);close(m.entries[0].lengthCm,50.8);assert.equal(m.entries[0].includeInGrowthAnalysis,true);
});

test('analysis recomputes after add, edit, delete and suppresses preterm WHO',()=>{
  const state={baby:{date:'2026-01-01',time:'00:00',birthAt:'2026-01-01T00:00:00Z',sex:'male',gestationalWeeks:40,gestationalDays:0,birthWeightKg:3.2,birthLengthCm:50},entries:[]};let a=G.analysis.analyze(state,'2026-01-05T00:00:00Z');assert.equal(a.included.weight.length,1);state.entries.push({id:'g',type:'growth',at:'2026-01-03T00:00:00Z',weightKg:3.1,lengthCm:51,includeInGrowthAnalysis:true});a=G.analysis.analyze(state,'2026-01-05T00:00:00Z');assert.equal(a.latestWeight.kg,3.1);state.entries[0].weightKg=3.3;a=G.analysis.analyze(state,'2026-01-05T00:00:00Z');assert.equal(a.latestWeight.kg,3.3);state.entries=[];assert.equal(G.analysis.analyze(state,'2026-01-05T00:00:00Z').included.weight.length,1);state.baby.gestationalWeeks=35;assert.equal(G.analysis.analyze(state,'2026-01-05T00:00:00Z').percentilesAvailable,false);
});

test('missing profile and measurement data returns insufficient-data states',()=>{
  const noBirth=G.analysis.analyze({baby:{},entries:[]});assert.equal(noBirth.ready,false);const state={baby:{date:'2026-01-01',time:'00:00',birthAt:'2026-01-01T00:00:00Z'},entries:[]},a=G.analysis.analyze(state,'2026-01-02T00:00:00Z');assert.match(a.percentileReason,/sex at birth/i);assert.equal(a.velocity,null);assert.equal(a.latestLength,null);
});
