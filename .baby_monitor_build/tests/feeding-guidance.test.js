'use strict';

const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const F=require(path.join(__dirname,'..','feedingGuidance','index.js'));
const close=(actual,expected,tolerance=1e-9)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} ≉ ${expected}`);

const BIRTH='2026-01-01T00:00:00.000Z';
const atHours=hours=>new Date(+new Date(BIRTH)+hours*3600000).toISOString();
const atDays=days=>atHours(days*24);
let fixtureId=0;
const feed=(at,method,fields={})=>({id:`f-${++fixtureId}`,type:'feed',method,at,...fields});
const wet=(at)=>({id:`w-${++fixtureId}`,type:'wet',at});
const soiled=(at)=>({id:`s-${++fixtureId}`,type:'soiled',at});
function reliableGrowth(nowDays=10,kg=3.5,extra={}){const measurement={id:'weight-recent',entryId:'weight-recent',kg,at:atDays(nowDays-1),include:true};return{latestWeight:measurement,included:{weight:[measurement]},quality:[],signals:[],birthRecovery:{percentChange:0,regained:true},...extra}}
function recentTimes(nowDays,count){return Array.from({length:count},(_,i)=>atHours(nowDays*24-23+i*(22/Math.max(1,count-1))))}
function formulaScenario({nowDays=10,count=8,amount=50,response='',wetCount=6,growth=reliableGrowth(nowDays),milkType='Formula',extraEntries=[],baby={},tracking={feedingComplete:true,diaperComplete:true}}={}){const feeds=recentTimes(nowDays,count).map((at,index)=>feed(at,'bottle',{amount:String(amount),milkType,bottleResponse:index<2?response:''})),diapers=recentTimes(nowDays,wetCount).map(wet);return{baby:{birthAt:BIRTH,gestationalWeeks:40,gestationalDays:0,birthWeightKg:3.5,...baby},entries:[...feeds,...diapers,...extraEntries],growth,tracking,now:atDays(nowDays)}}
function breastScenario({nowDays=10,count=8,duration=20,wetCount=6,feedFields={},growth=reliableGrowth(nowDays),extraEntries=[],baby={},tracking={feedingComplete:true,diaperComplete:true}}={}){const feeds=recentTimes(nowDays,count).map(at=>feed(at,'breast',{duration:String(duration),...feedFields})),diapers=recentTimes(nowDays,wetCount).map(wet);return{baby:{birthAt:BIRTH,gestationalWeeks:40,gestationalDays:0,birthWeightKg:3.5,...baby},entries:[...feeds,...diapers,...extraEntries],growth,tracking,now:atDays(nowDays)}}

test('exact age and expressed-milk ranges use half-open timestamp boundaries',()=>{
  const expected=[[23,2,10],[24,5,15],[47,5,15],[48,15,30],[71,15,30],[72,30,60],[95,30,60]];
  for(const [hours,min,max] of expected){const age=F.windows.exactAge(BIRTH,atHours(hours)),range=F.formula.expressedMilkRange(age.hours);close(age.hours,hours);assert.equal(range.minMl,min);assert.equal(range.maxMl,max)}
  assert.equal(F.formula.expressedMilkRange(96),null);
});

test('exact age is elapsed-time based across DST offsets',()=>{
  const age=F.windows.exactAge('2026-03-08T01:30:00-06:00','2026-03-09T02:30:00-05:00');close(age.hours,24);assert.equal(age.babyDay,2);
});

test('rolling windows expose partial current Baby Day without full-day comparison',()=>{
  const entries=[wet(atHours(2)),wet(atHours(3))],windows=F.windows.analyze(entries,BIRTH,atHours(4));assert.equal(windows.current.partial,true);assert.equal(windows.hours24.complete,false);assert.equal(windows.hours24.wet,2);assert.equal(windows.previousBabyDay,null);
});

test('24, 48, 72 hour and multi-day windows are deterministic',()=>{
  const entries=[feed(atHours(30),'bottle',{amount:'30',milkType:'Formula'}),feed(atHours(54),'bottle',{amount:'40',milkType:'Formula'}),feed(atHours(78),'bottle',{amount:'50',milkType:'Formula'})],w=F.windows.analyze(entries,BIRTH,atHours(96));assert.equal(w.hours24.bottleMl,50);assert.equal(w.hours48.bottleMl,90);assert.equal(w.hours72.bottleMl,120);assert.equal(w.days3.bottleMl,120);assert.equal(w.days7,null);assert.equal(w.previousBabyDay.bottleMl,50);
});

test('window end is exclusive so boundary entries are counted once',()=>{
  const entries=[wet(atHours(24))];assert.equal(F.windows.babyDay(entries,BIRTH,1).wet,0);assert.equal(F.windows.babyDay(entries,BIRTH,2).wet,1);
});

test('feeding modes distinguish the six supported patterns',()=>{
  const breast=feed(atHours(1),'breast',{duration:'15'}),formula=feed(atHours(2),'bottle',{amount:'30',milkType:'Formula'}),expressed=feed(atHours(3),'bottle',{amount:'30',milkType:'Breast milk'});
  assert.equal(F.modes.classify([formula]).mode,F.modes.MODES.FORMULA);assert.equal(F.modes.classify([expressed]).mode,F.modes.MODES.EXPRESSED);assert.equal(F.modes.classify([breast]).mode,F.modes.MODES.BREAST);assert.equal(F.modes.classify([breast,expressed]).mode,F.modes.MODES.BREAST_EXPRESSED);assert.equal(F.modes.classify([breast,formula]).mode,F.modes.MODES.BREAST_FORMULA);assert.equal(F.modes.classify([expressed,formula]).mode,F.modes.MODES.EXPRESSED_FORMULA);
});

test('combined/mixed and unknown bottles never become formula-only comparisons',()=>{
  const combined=F.modes.classify([feed(atHours(1),'bottle',{amount:'30',milkType:'Combined / mixed'})]),unknown=F.modes.classify([feed(atHours(1),'bottle',{amount:'30',milkType:''})]);assert.equal(combined.mayCompareWithFormulaOnlyReference,false);assert.equal(unknown.mayCompareWithFormulaOnlyReference,false);
});

test('formula weight reference for 3.5 kg is 577.5 mL/day',()=>{const result=F.formula.weightReference(3.5);close(result.calculatedMlDay,577.5);close(result.referenceMlDay,577.5);assert.equal(result.capped,false)});

test('formula daily reference stays approximate and caps displays above 960 mL',()=>{const near=F.formula.weightReference(5.5),over=F.formula.weightReference(6);assert.equal(near.nearCap,false);assert.equal(near.message,null);close(over.calculatedMlDay,990);assert.equal(over.referenceMlDay,960);assert.equal(over.capped,true);assert.match(over.message,/upper daily formula range/i)});

test('planning reference uses recent frequency and parent-friendly increments',()=>{const plan=F.formula.planningReference(3.5,8);assert.equal(plan.minMl,70);assert.equal(plan.maxMl,75);assert.equal(plan.label,'~70–75 mL/feed');assert.equal(F.formula.planningReference(3.5,2),null)});

test('first-week formula guidance takes priority over a large weight-based bottle',()=>{const first=F.formula.ageAppropriate(167.99,6,8),later=F.formula.ageAppropriate(168,6,8);assert.equal(first.kind,'first_week');assert.deepEqual([first.minMlPerFeed,first.maxMlPerFeed],[30,60]);assert.equal(later.kind,'weight_based');assert.equal(later.weightReference.referenceMlDay,960)});

test('breastfeeding frequency handles 6, 8, 12, and cluster feeding without rigid upper limit',()=>{assert.equal(F.breastfeeding.frequency(6,10,true).signal,'low');assert.equal(F.breastfeeding.frequency(8,10,true).signal,'on_track');assert.equal(F.breastfeeding.frequency(12,10,true).signal,'on_track');assert.equal(F.breastfeeding.frequency(15,10,true).signal,'on_track');assert.equal(F.breastfeeding.frequency(2,2,false).signal,'not_assessed')});

test('short or long feeds alone never trigger an effectiveness concern',()=>{const short=F.breastfeeding.pattern(Array.from({length:4},(_,i)=>feed(atHours(i+1),'breast',{duration:'5'}))),long=F.breastfeeding.pattern(Array.from({length:4},(_,i)=>feed(atHours(i+1),'breast',{duration:'55'})));assert.equal(short.consistentShort,true);assert.equal(short.effectivenessConcern,false);assert.equal(long.consistentLong,true);assert.equal(long.effectivenessConcern,false);assert.equal(short.estimatedMilkMl,null)});

test('duration pattern becomes context only when another intake concern exists',()=>{const entries=Array.from({length:4},(_,i)=>feed(atHours(i+1),'breast',{duration:'5'}));assert.equal(F.breastfeeding.pattern(entries,{otherConcern:true}).effectivenessConcern,true);entries.forEach(e=>e.duration='55');assert.equal(F.breastfeeding.pattern(entries,{otherConcern:true}).effectivenessConcern,true)});

test('structured swallowing, latch, hunger, satisfaction and stopping values match UI storage',()=>{const observations=['finished_hungry','finished_satisfied','stopped_before_finishing'].map(bottleResponse=>F.breastfeeding.observedSignals({bottleResponse}));assert.equal(observations[0].hunger,true);assert.equal(observations[1].fullness,true);assert.equal(observations[2].stoppedWhenFull,true);assert.equal(F.breastfeeding.observedSignals({hungerCues:['continued_searching']}).hunger,true);assert.equal(F.breastfeeding.observedSignals({swallowing:'no',latch:'difficulty'}).swallowingConcern,true)});

test('wet diaper expectations follow Baby Days and partial windows are not judged',()=>{assert.equal(F.diapers.wetExpectation(1),1);assert.equal(F.diapers.wetExpectation(2),2);assert.equal(F.diapers.wetExpectation(3),3);assert.equal(F.diapers.wetExpectation(4),6);assert.equal(F.diapers.wetExpectation(42),6);assert.equal(F.diapers.wetExpectation(43),null);assert.equal(F.diapers.wetSignal(2,4,false).signal,'not_assessed');assert.equal(F.diapers.wetSignal(5,4,true).signal,'low');assert.equal(F.diapers.wetSignal(6,4,true).signal,'adequate')});

test('stool output loses decision weight with age',()=>{assert.equal(F.diapers.stoolSignal(0,2,true).signal,'low');assert.equal(F.diapers.stoolSignal(0,5,true).signal,'observe');assert.equal(F.diapers.stoolSignal(0,43,true).signal,'context_only')});

test('formula-only repeated hunger plus low recorded intake can return consider_more',()=>{const result=F.decisionEngine.evaluate(formulaScenario({response:'finished_hungry'}));assert.equal(result.level,'consider_more');assert.equal(result.mode,F.modes.MODES.FORMULA);assert.ok(result.referenceAmount);assert.match(result.actions.join(' '),/Do not force/i)});

test('finished satisfied and fullness cues prevent a routine increase',()=>{const scenario=formulaScenario({amount:70});scenario.entries.filter(e=>e.type==='feed').forEach(e=>e.bottleResponse='finished_satisfied');const result=F.decisionEngine.evaluate(scenario);assert.equal(result.level,'on_track');assert.equal(result.referenceAmount.kind,'weight_based')});

test('stopping before bottle is finished is treated as a possible fullness response',()=>{const scenario=formulaScenario({amount:70});scenario.entries.find(e=>e.type==='feed').bottleResponse='stopped_before_finishing';const result=F.decisionEngine.evaluate(scenario);assert.equal(result.level,'on_track');assert.match(result.title,/stopped before finishing/i)});

test('mixed direct breastfeeding plus bottles never receives a formula deficit comparison',()=>{const scenario=formulaScenario({count:3,amount:100});scenario.entries.push(...recentTimes(10,8).map(at=>feed(at,'breast',{duration:'15'})));const result=F.decisionEngine.evaluate(scenario);assert.equal(result.mode,F.modes.MODES.BREAST_FORMULA);assert.equal(result.referenceAmount,null);assert.equal(result.level,'on_track');assert.match(result.explanation,/not treated as total milk intake/i);assert.doesNotMatch(JSON.stringify(result),/below the.*weight-based reference/i)});

test('mixed feeding with persistent hunger requests assessment, not a formula target',()=>{const scenario=formulaScenario({count:3,amount:100,response:'finished_hungry'});scenario.entries.push(...recentTimes(10,8).map(at=>feed(at,'breast',{duration:'15'})));const result=F.decisionEngine.evaluate(scenario);assert.equal(result.level,'feeding_assessment');assert.equal(result.referenceAmount,null)});

test('six breastfeeding sessions suggests more opportunities while 8 and 12 are on track',()=>{assert.equal(F.decisionEngine.evaluate(breastScenario({count:6})).level,'increase_frequency');assert.equal(F.decisionEngine.evaluate(breastScenario({count:8})).level,'on_track');assert.equal(F.decisionEngine.evaluate(breastScenario({count:12})).level,'on_track')});

test('breastfeeding duration is never converted to mL or prescribed as extra minutes',()=>{const result=F.decisionEngine.evaluate(breastScenario({count:8,duration:18})),text=JSON.stringify(result);assert.equal(result.metrics.breastfeeding.estimatedMilkMl,null);assert.doesNotMatch(text,/estimated milk/i);assert.doesNotMatch(text,/increase breastfeeding.*minutes|add .*minutes/i)});

test('short feeds with adequate output do not trigger feeding assessment',()=>{const result=F.decisionEngine.evaluate(breastScenario({count:8,duration:5}));assert.equal(result.level,'on_track')});

test('short feeds plus low output trigger assessment without a minutes prescription',()=>{const result=F.decisionEngine.evaluate(breastScenario({count:8,duration:5,wetCount:4}));assert.equal(result.level,'feeding_assessment');assert.doesNotMatch(result.actions.join(' '),/minutes/i)});

test('repeated latch or swallowing concerns trigger feeding-effectiveness assessment',()=>{const latch=F.decisionEngine.evaluate(breastScenario({count:8,feedFields:{latch:'difficulty'}})),swallow=F.decisionEngine.evaluate(breastScenario({count:8,feedFields:{swallowing:'no'}}));assert.equal(latch.level,'feeding_assessment');assert.equal(swallow.level,'feeding_assessment');assert.match(latch.title,/effectiveness/i)});

test('more than 10 percent birth-weight loss overrides all routine suggestions',()=>{const scenario=formulaScenario({response:'finished_hungry'});scenario.growth.birthRecovery={percentChange:-10.1,overTenPercentLoss:true,regained:false};const result=F.decisionEngine.evaluate(scenario);assert.equal(result.level,'medical_review');assert.match(result.explanation,/more than 10%/i);assert.equal(result.referenceAmount,null)});

test('8–10 percent loss around day 5+ requests feeding assessment',()=>{const scenario=formulaScenario({nowDays:6,growth:reliableGrowth(6)});scenario.growth.birthRecovery={percentChange:-9,overTenPercentLoss:false,regained:false};assert.equal(F.decisionEngine.evaluate(scenario).level,'feeding_assessment')});

test('birth weight regained does not create a safety override',()=>{const scenario=formulaScenario({amount:70});scenario.growth.birthRecovery={percentChange:1,overTenPercentLoss:false,regained:true};assert.equal(F.decisionEngine.evaluate(scenario).level,'on_track')});

test('not regained around 14 days remains feeding_assessment, not medical_review',()=>{const scenario=formulaScenario({nowDays:14,growth:reliableGrowth(14)});scenario.growth.birthRecovery={percentChange:-1,regained:false,notRegainedAround14:true};scenario.growth.signals=[{code:'birth_weight_not_regained',level:'review'}];assert.equal(F.decisionEngine.evaluate(scenario).level,'feeding_assessment')});

test('concerning growth codes override quantitative bottle guidance',()=>{for(const code of ['low_weight_for_length','wfa_decline','wfl_decline']){const scenario=formulaScenario({response:'finished_hungry'});scenario.growth.signals=[{code,level:'review'}];assert.equal(F.decisionEngine.evaluate(scenario).level,'medical_review')}});

test('confirmed zero urine output is medical review while moderately low output is assessment',()=>{assert.equal(F.decisionEngine.evaluate(formulaScenario({wetCount:0})).level,'medical_review');assert.equal(F.decisionEngine.evaluate(formulaScenario({wetCount:5})).level,'feeding_assessment')});

test('structured vomiting, poor willingness, lethargy, and jaundice concerns are safety overrides',()=>{for(const concern of ['repeated_large_vomiting','poor_willingness','lethargy','jaundice']){const scenario=formulaScenario({extraEntries:[feed(atHours(239),'bottle',{amount:'50',milkType:'Formula',feedingConcerns:[concern]})]});assert.equal(F.decisionEngine.evaluate(scenario).level,'medical_review')}});

test('feeding intolerance blocks consider_more and requests assessment',()=>{const scenario=formulaScenario({response:'finished_hungry'});scenario.entries.find(e=>e.type==='feed').feedingConcerns=['feeding_intolerance'];assert.equal(F.decisionEngine.evaluate(scenario).level,'feeding_assessment')});

test('preterm infant receives individualized-plan guidance without formula reference',()=>{const scenario=formulaScenario({baby:{gestationalWeeks:36,gestationalDays:6},response:'finished_hungry'}),result=F.decisionEngine.evaluate(scenario);assert.equal(result.level,'feeding_assessment');assert.match(result.title,/preterm feeding plan/i);assert.equal(result.referenceAmount,null)});

test('unknown gestational status withholds healthy-term quantitative references',()=>{const scenario=formulaScenario({baby:{gestationalWeeks:null,gestationalDays:0},response:'finished_hungry'}),result=F.decisionEngine.evaluate(scenario);assert.equal(result.level,'insufficient_data');assert.match(result.title,/gestational age/i);assert.equal(result.referenceAmount,null)});

test('parent-entered clinical plan takes priority over generic term guidance',()=>{const scenario=formulaScenario({response:'finished_hungry',baby:{clinicalFeedingPlan:{targetBottleMl:70,dateProvided:'2026-01-10',notes:'Clinic plan'}}}),result=F.decisionEngine.evaluate(scenario);assert.equal(result.level,'clinical_plan');assert.equal(result.clinicalPlan.targetBottleMl,70);assert.equal(result.referenceAmount,null)});

test('outdated weight produces limited-data guidance',()=>{const old={id:'old',kg:3.5,at:atDays(1),include:true},scenario=formulaScenario({nowDays:20,growth:{latestWeight:old,included:{weight:[old]},quality:[],signals:[],birthRecovery:{regained:true}}}),result=F.decisionEngine.evaluate(scenario);assert.equal(result.level,'insufficient_data');assert.equal(result.dataCoverage.level,'limited');assert.match(result.explanation,/enough confirmed recent information/i)});

test('latest flagged weight falls back to the newest earlier reliable weight',()=>{const prior={id:'prior',kg:3.4,at:atDays(8),include:true},flagged={id:'flagged',kg:5.5,at:atDays(9),include:true},growth={latestWeight:flagged,included:{weight:[prior,flagged]},quality:[{id:'flagged',code:'jump'}]},result=F.decisionEngine.latestReliableWeight({},growth,{birthAt:BIRTH},atDays(10),10);assert.equal(result.measurement.id,'prior');assert.equal(result.measurement.kg,3.4)});

test('missing birth details and incomplete early records return insufficient data',()=>{assert.equal(F.decisionEngine.evaluate({baby:{},entries:[]}).level,'insufficient_data');const early=F.decisionEngine.evaluate({baby:{birthAt:BIRTH,birthWeightKg:3.5,gestationalWeeks:40},entries:[feed(atHours(6),'breast',{duration:'15'})],now:atHours(12)});assert.equal(early.level,'insufficient_data');assert.equal(early.windows.hours24.complete,false)});

test('no diaper records are unknown unless completeness is explicitly confirmed',()=>{const scenario=formulaScenario({tracking:{feedingComplete:true}});scenario.entries=scenario.entries.filter(entry=>entry.type!=='wet'&&entry.type!=='soiled');const result=F.decisionEngine.evaluate(scenario);assert.equal(result.level,'insufficient_data');assert.equal(result.metrics.wetDiapers.signal,'not_assessed');assert.match(result.dataCoverage.reasons.join(' '),/diaper tracking/i)});

test('an old wet or a stool-only entry never proves current wet tracking is complete',()=>{for(const extra of [wet(atHours(190)),soiled(atHours(230))]){const scenario=formulaScenario({wetCount:0,tracking:{feedingComplete:true},extraEntries:[extra]}),result=F.decisionEngine.evaluate(scenario);assert.equal(result.level,'insufficient_data');assert.equal(result.metrics.wetDiapers.signal,'not_assessed')}});

test('unknown tracking completeness cannot return consider-more, increase-frequency, or on-track',()=>{for(const scenario of [formulaScenario({response:'finished_hungry',tracking:{}}),breastScenario({count:6,tracking:{}}),formulaScenario({tracking:{}})]){assert.equal(F.decisionEngine.evaluate(scenario).level,'insufficient_data')}});

test('a sparse confirmed formula record is reviewed and never described as on track',()=>{const scenario=formulaScenario({count:1,amount:10});assert.equal(F.decisionEngine.evaluate(scenario).level,'feeding_assessment')});

test('first-day term formula reference remains educational while adequacy is unavailable',()=>{const scenario=formulaScenario({nowDays:.5,count:3,amount:20,wetCount:0,growth:{included:{weight:[]},quality:[],signals:[],birthRecovery:{}},tracking:{}}),result=F.decisionEngine.evaluate(scenario);assert.equal(result.level,'insufficient_data');assert.equal(result.referenceAmount.kind,'first_week');assert.deepEqual([result.referenceAmount.minMlPerFeed,result.referenceAmount.maxMlPerFeed],[30,60])});

test('healthy-term expressed-milk reference is withheld for preterm or unknown gestation',()=>{for(const gestationalWeeks of [36,null]){const scenario=formulaScenario({nowDays:2,count:8,amount:10,milkType:'Breast milk',baby:{gestationalWeeks},tracking:{feedingComplete:true,diaperComplete:true}}),result=F.decisionEngine.evaluate(scenario);assert.equal(result.referenceAmount,null);assert.notEqual(result.level,'on_track')}});

test('acute recorded symptoms take priority over birth-weight loss',()=>{const scenario=formulaScenario();scenario.safety={concerningTemperature:true};scenario.growth.birthRecovery={percentChange:-11,overTenPercentLoss:true};const result=F.decisionEngine.evaluate(scenario);assert.equal(result.level,'medical_review');assert.match(result.title,/safety concern/i);assert.match(result.reasons.join(' '),/temperature/i)});

test('birth weight alone is never treated as a reliable current feeding weight',()=>{const result=F.decisionEngine.latestReliableWeight({},null,{birthAt:BIRTH,birthWeightKg:3.5},atDays(1),1);assert.equal(result.measurement,null);assert.match(result.reason,/post-birth weight/i)});

test('wet expectations use the matching previous completed Baby Day',()=>{const scenario=formulaScenario({nowDays:3,wetCount:3,growth:reliableGrowth(3)}),result=F.decisionEngine.evaluate(scenario);assert.equal(result.metrics.output.babyDay,3);assert.equal(result.metrics.wetDiapers.expected,3);assert.equal(result.metrics.wetDiapers.signal,'adequate')});

test('add, edit, and delete immediately change derived guidance',()=>{const scenario=breastScenario({count:6});assert.equal(F.decisionEngine.evaluate(scenario).level,'increase_frequency');const added=recentTimes(10,2).map((at,index)=>feed(atHours(217+index),'breast',{duration:'15'}));scenario.entries.push(...added);assert.equal(F.decisionEngine.evaluate(scenario).level,'on_track');added[0].latch='difficulty';added[1].latch='painful';assert.equal(F.decisionEngine.evaluate(scenario).level,'feeding_assessment');scenario.entries=scenario.entries.filter(entry=>!added.includes(entry));assert.equal(F.decisionEngine.evaluate(scenario).level,'increase_frequency')});

test('decision output is transparent and has no opaque nutrition score',()=>{const result=F.decisionEngine.evaluate(formulaScenario());assert.ok(result.considered.length>=4);assert.ok(result.reasons.length);assert.deepEqual(result.references,['American Academy of Pediatrics','CDC Infant & Toddler Nutrition','Academy of Breastfeeding Medicine']);assert.equal(Object.hasOwn(result,'score'),false)});
