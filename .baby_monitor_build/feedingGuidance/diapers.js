(function(root){
  'use strict';
  /** @type {any} */ const F=root.LittleDaysFeeding=root.LittleDaysFeeding||{},R=F.reference;

  function wetExpectation(babyDay){const day=Math.floor(Number(babyDay));if(!Number.isFinite(day)||day<1)return null;if(day<=3)return R.diapers.wetMinimumByBabyDay[day];if(day<=R.diapers.earlyNewbornMaxDays)return R.diapers.wetMinimumDay4Onward;return null}
  function stoolExpectation(babyDay){const day=Math.floor(Number(babyDay));if(!Number.isFinite(day)||day<1)return null;if(day<=3)return{minimum:R.diapers.stoolMinimumByBabyDay[day],importance:'intake_signal'};if(day<=R.diapers.stoolSupportingMaxBabyDay)return{minimum:R.diapers.stoolSupportingDay4To7,importance:'supporting_only'};return{minimum:null,importance:day>R.diapers.earlyNewbornMaxDays?'low_after_six_weeks':'context_only'}}
  function wetSignal(count,babyDay,complete=true){const observed=Number(count),expected=wetExpectation(babyDay);if(!complete)return{signal:'not_assessed',observed,expected,reason:'Diaper tracking for a complete Baby Day has not been confirmed.'};if(expected===null)return{signal:'context_only',observed,expected:null};const low=observed<expected,veryLow=observed===0;return{signal:low?'low':'adequate',observed,expected,veryLow}}
  function stoolSignal(count,babyDay,complete=true){const observed=Number(count),expectation=stoolExpectation(babyDay);if(!complete)return{signal:'not_assessed',observed,...expectation};if(expectation.minimum===null)return{signal:'context_only',observed,...expectation};const below=observed<expectation.minimum;return{signal:below&&expectation.importance==='intake_signal'?'low':below?'observe':'adequate',observed,...expectation}}

  F.diapers={wetExpectation,stoolExpectation,wetSignal,stoolSignal};
  if(typeof module!=='undefined'&&module.exports)module.exports=F.diapers;
})(typeof window!=='undefined'?window:globalThis);
