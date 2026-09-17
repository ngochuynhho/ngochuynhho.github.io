(function(root){
  'use strict';
  /** @type {any} */ const F=root.LittleDaysFeeding=root.LittleDaysFeeding||{},R=F.reference;

  function expressedMilkRange(ageHours){const age=Number(ageHours);if(!Number.isFinite(age)||age<0)return null;const row=R.expressedMilk.find(item=>age>=item.minHours&&age<item.maxHours);return row?{...row,kind:'expressed_milk_per_feed',isReference:true}:null}
  function weightReference(weightKg){const weight=Number(weightKg);if(!Number.isFinite(weight)||weight<=0)return null;const calculatedMlDay=weight*R.formula.mlPerKgDay,capped=calculatedMlDay>R.formula.maxMlDay,nearCap=calculatedMlDay>=R.formula.maxMlDay;return{weightKg:weight,calculatedMlDay,referenceMlDay:Math.min(calculatedMlDay,R.formula.maxMlDay),capped,nearCap,maxMlDay:R.formula.maxMlDay,message:capped?"Your baby's calculated weight-based reference is approaching the usual upper daily formula range. If your baby consistently seems to need more, discuss feeding with the pediatrician.":null}}
  function friendlyRange(value){if(!Number.isFinite(value)||value<=0)return null;let min=Math.floor(value/5)*5,max=Math.ceil(value/5)*5;if(min===max){min=Math.max(5,min-5);max+=5}return{minMl:min,maxMl:max,midpointMl:value,label:`~${min}\u2013${max} mL/feed`}}
  function planningReference(weightKg,feedsPerDay){const feeds=Number(feedsPerDay),bounds=R.formula.reasonableFeedCount;if(!Number.isFinite(feeds)||feeds<bounds[0]||feeds>bounds[1])return null;const daily=weightReference(weightKg);if(!daily)return null;const value=daily.referenceMlDay/feeds;return{...friendlyRange(value),feedsPerDay:feeds,referenceMlDay:daily.referenceMlDay,notATarget:true}}
  function ageAppropriate(ageHours,weightKg,feedsPerDay){const age=Number(ageHours);if(!Number.isFinite(age)||age<0)return null;if(age<R.formula.firstWeekHours)return{kind:'first_week',ageHours:age,minMlPerFeed:R.formula.firstWeekMlPerFeed[0],maxMlPerFeed:R.formula.firstWeekMlPerFeed[1],feedsPerDay:R.formula.firstWeekFeedsPerDay,intervalHours:R.formula.firstWeekIntervalHours,weightReference:weightReference(weightKg),planning:null,notATarget:true};if(age/24>R.formula.weightReferenceMaxAgeDays)return null;const daily=weightReference(weightKg);return daily?{kind:'weight_based',ageHours:age,weightReference:daily,planning:planningReference(weightKg,feedsPerDay),notATarget:true}:null}

  F.formula={expressedMilkRange,weightReference,friendlyRange,planningReference,ageAppropriate};
  if(typeof module!=='undefined'&&module.exports)module.exports=F.formula;
})(typeof window!=='undefined'?window:globalThis);
