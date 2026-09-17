(function(root){
  'use strict';
  /** @type {any} */ const F=root.LittleDaysFeeding=root.LittleDaysFeeding||{},R=F.reference;

  function validDate(value){const date=new Date(value);return Number.isNaN(+date)?null:date}
  function exactAge(birthTimestamp,atTimestamp){const birth=validDate(birthTimestamp),at=validDate(atTimestamp);if(!birth||!at)return null;const milliseconds=+at-+birth;return{milliseconds,hours:milliseconds/R.hourMs,days:milliseconds/R.dayMs,babyDay:Math.floor(milliseconds/R.dayMs)+1}}
  function inWindow(entries,start,end){return(entries||[]).filter(entry=>{const at=validDate(entry.at);return at&&at>=start&&at<end})}
  function summarize(entries,startTimestamp,endTimestamp,complete=true){
    const start=validDate(startTimestamp),end=validDate(endTimestamp);if(!start||!end||end<=start)return null;
    const list=inWindow(entries,start,end).sort((a,b)=>+new Date(a.at)-+new Date(b.at)),feeds=list.filter(e=>e.type==='feed'),breastfeeds=feeds.filter(e=>e.method==='breast'),bottles=feeds.filter(e=>e.method==='bottle'),formula=bottles.filter(e=>e.milkType==='Formula'),expressed=bottles.filter(e=>e.milkType==='Breast milk'),mixed=bottles.filter(e=>e.milkType==='Combined / mixed'),unknown=bottles.filter(e=>!e.milkType||!['Formula','Breast milk','Combined / mixed'].includes(e.milkType)),elapsedHours=(+end-+start)/R.hourMs,elapsedDays=elapsedHours/24,intervals=feeds.slice(1).map((feed,index)=>(+new Date(feed.at)-+new Date(feeds[index].at))/R.hourMs).filter(Number.isFinite);
    const total=items=>items.reduce((sum,e)=>sum+(Number(e.amount)||0),0),minutes=breastfeeds.reduce((sum,e)=>sum+(Number(e.duration)||0),0);
    return{start:start.toISOString(),end:end.toISOString(),complete,elapsedHours,elapsedDays,entries:list,feeds,feedCount:feeds.length,feedsPerDay:feeds.length/elapsedDays,breastfeeds,breastfeedingSessions:breastfeeds.length,breastfeedingSessionsPerDay:breastfeeds.length/elapsedDays,breastfeedingMinutes:minutes,breastfeedingMinutesPerDay:minutes/elapsedDays,averageBreastfeedingMinutes:breastfeeds.length?minutes/breastfeeds.length:null,bottles,bottleFeeds:bottles.length,bottleMl:total(bottles),bottleMlPerDay:total(bottles)/elapsedDays,averageBottleMl:bottles.length?total(bottles)/bottles.length:null,formulaMl:total(formula),formulaMlPerDay:total(formula)/elapsedDays,expressedMilkMl:total(expressed),combinedMilkMl:total(mixed),unknownBottleMl:total(unknown),wet:list.filter(e=>e.type==='wet').length,soiled:list.filter(e=>e.type==='soiled').length,averageHoursBetweenFeeds:intervals.length?intervals.reduce((a,b)=>a+b,0)/intervals.length:null}
  }
  function rolling(entries,birthTimestamp,endTimestamp,hours){
    const birth=validDate(birthTimestamp),end=validDate(endTimestamp);if(!birth||!end||end<birth||!(hours>0))return null;
    const requestedStart=new Date(+end-hours*R.hourMs),start=requestedStart<birth?birth:requestedStart,complete=+end-+birth>=hours*R.hourMs;
    return summarize(entries,start,end,complete)
  }
  function currentBabyDay(entries,birthTimestamp,nowTimestamp){
    const birth=validDate(birthTimestamp),now=validDate(nowTimestamp),age=exactAge(birth,now);if(!birth||!now||!age||age.milliseconds<0)return null;
    const start=new Date(+birth+(age.babyDay-1)*R.dayMs),end=new Date(Math.min(+now,+start+R.dayMs));return{babyDay:age.babyDay,partial:+end-+start<R.dayMs,...summarize(entries,start,end,false)}
  }
  function babyDay(entries,birthTimestamp,day){const birth=validDate(birthTimestamp),n=Number(day);if(!birth||!Number.isInteger(n)||n<1)return null;const start=new Date(+birth+(n-1)*R.dayMs),end=new Date(+start+R.dayMs);return{babyDay:n,partial:false,...summarize(entries,start,end,true)}}
  function analyze(entries,birthTimestamp,nowTimestamp=Date.now()){
    const age=exactAge(birthTimestamp,nowTimestamp);if(!age||age.milliseconds<0)return null;
    return{age,current:currentBabyDay(entries,birthTimestamp,nowTimestamp),previousBabyDay:age.babyDay>1?babyDay(entries,birthTimestamp,age.babyDay-1):null,hours24:rolling(entries,birthTimestamp,nowTimestamp,24),hours48:rolling(entries,birthTimestamp,nowTimestamp,48),hours72:rolling(entries,birthTimestamp,nowTimestamp,72),days3:age.hours>=72?rolling(entries,birthTimestamp,nowTimestamp,72):null,days7:age.hours>=168?rolling(entries,birthTimestamp,nowTimestamp,168):null}
  }

  F.windows={validDate,exactAge,summarize,rolling,babyDay,currentBabyDay,analyze};
  if(typeof module!=='undefined'&&module.exports)module.exports=F.windows;
})(typeof window!=='undefined'?window:globalThis);
