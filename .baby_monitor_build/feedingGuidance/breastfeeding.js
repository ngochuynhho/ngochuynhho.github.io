(function(root){
  'use strict';
  /** @type {any} */ const F=root.LittleDaysFeeding=root.LittleDaysFeeding||{},R=F.reference;

  const normalized=value=>String(value||'').trim().toLowerCase().replace(/[\s/_]+/g,'-');
  const hasValue=(value,values)=>values.includes(normalized(value));
  function observedSignals(feed){
    const hunger=Array.isArray(feed.hungerCues)?feed.hungerCues:[],fullness=Array.isArray(feed.fullnessCues)?feed.fullnessCues:[],continued=hunger.some(cue=>normalized(cue)==='continued-searching-after-feed');
    const postFeedHunger=continued||hunger.some(cue=>normalized(cue)==='continued-searching')||hasValue(feed.afterFeed,['still-hungry'])||hasValue(feed.bottleResponse,['finished-hungry','finished-and-still-hungry']),earlyHunger=hunger.some(cue=>['hands-to-mouth','rooting','lip-smacking'].includes(normalized(cue)));
    return{hunger:earlyHunger||postFeedHunger,earlyHunger,postFeedHunger,fullness:fullness.length>0||hasValue(feed.afterFeed,['satisfied'])||hasValue(feed.bottleResponse,['finished-satisfied','finished-and-satisfied','stopped-before-finishing']),latchConcern:hasValue(feed.latch,['difficulty','painful']),swallowingConcern:hasValue(feed.swallowing,['no']),stoppedWhenFull:hasValue(feed.bottleResponse,['stopped-before-finishing'])}
  }
  function pattern(entries,options={}){
    const feeds=(entries||[]).filter(e=>e.type==='feed'&&e.method==='breast'),durations=feeds.map(e=>Number(e.duration)).filter(n=>Number.isFinite(n)&&n>0),signals=feeds.map(observedSignals),count=durations.length,shortCount=durations.filter(n=>n<R.breastfeeding.contextualShortMinutes).length,longCount=durations.filter(n=>n>R.breastfeeding.contextualLongMinutes).length,consistentShort=count>=R.breastfeeding.minimumPatternFeeds&&shortCount/count>=R.breastfeeding.consistentPatternRatio,consistentLong=count>=R.breastfeeding.minimumPatternFeeds&&longCount/count>=R.breastfeeding.consistentPatternRatio,hungerCount=signals.filter(s=>s.hunger).length,latchConcernCount=signals.filter(s=>s.latchConcern).length,swallowingConcernCount=signals.filter(s=>s.swallowingConcern).length,fullnessCount=signals.filter(s=>s.fullness).length,structuredConcern=latchConcernCount>=R.breastfeeding.persistentConcernCount||swallowingConcernCount>=R.breastfeeding.persistentConcernCount||hungerCount>=R.breastfeeding.persistentConcernCount,otherConcern=!!options.otherConcern||structuredConcern;
    return{feeds:feeds.length,durations,averageMinutes:count?durations.reduce((a,b)=>a+b,0)/count:null,shortCount,longCount,consistentShort,consistentLong,hungerCount,fullnessCount,latchConcernCount,swallowingConcernCount,durationConcern:(consistentShort||consistentLong)&&otherConcern,effectivenessConcern:structuredConcern||((consistentShort||consistentLong)&&otherConcern),durationIsContextOnly:true,estimatedMilkMl:null}
  }
  function frequency(sessions,ageDays,complete=true){const count=Number(sessions),age=Number(ageDays);if(!complete||!Number.isFinite(count)||!Number.isFinite(age)||age<0)return{signal:'not_assessed',reason:'A complete 24-hour window is needed.'};if(age>R.breastfeeding.newbornMaxAgeDays)return{signal:'context_only',sessions:count};const min=R.breastfeeding.feedsPerDay[0],max=R.breastfeeding.feedsPerDay[1];return{signal:count<min?'low':'on_track',sessions:count,referenceMin:min,referenceMax:max,clusterFeedingAllowed:true}}

  F.breastfeeding={observedSignals,pattern,frequency};
  if(typeof module!=='undefined'&&module.exports)module.exports=F.breastfeeding;
})(typeof window!=='undefined'?window:globalThis);
