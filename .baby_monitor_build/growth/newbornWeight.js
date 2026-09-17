(function(root){
  'use strict';
  /** @type {any} */ const G=root.LittleDaysGrowth=root.LittleDaysGrowth||{};
  G.newbornWeight={analyze(birthKg,weights,birthTimestamp,now=Date.now()){
    const birth=Number(birthKg),birthAt=new Date(birthTimestamp);if(!Number.isFinite(birth)||birth<=0||Number.isNaN(+birthAt))return null;
    const valid=(weights||[]).filter(w=>Number.isFinite(w.kg)&&w.kg>0&&new Date(w.at)>=birthAt).sort((a,b)=>+new Date(a.at)-+new Date(b.at)),latest=valid[valid.length-1]||{kg:birth,at:birthAt.toISOString()},lowest=valid.reduce((low,w)=>w.kg<low.kg?w:low,{kg:birth,at:birthAt.toISOString()}),changeKg=latest.kg-birth,percentChange=changeKg/birth*100,maxLossPercent=(lowest.kg-birth)/birth*100;
    const lossOccurred=valid.some(w=>w.kg<birth),regained=lossOccurred?valid.find(w=>new Date(w.at)>new Date(lowest.at)&&w.kg>=birth):valid.find(w=>w.kg>=birth),ageNow=(+new Date(now)-+birthAt)/86400000;
    return{birthKg:birth,latestKg:latest.kg,latestAt:latest.at,changeGrams:changeKg*1000,percentChange,lowestKg:lowest.kg,maxLossPercent,lowestAt:lowest.at,lowestAge:G.age.exact(birthAt,lowest.at),regained:!!regained,regainedAt:regained?.at||null,regainedAge:regained?G.age.exact(birthAt,regained.at):null,ageNowDays:ageNow,showCard:ageNow<=14.999||!regained,overTenPercentLoss:maxLossPercent<-10,notRegainedAround14:ageNow>=13.5&&!regained,status:regained?'Birth weight regained':changeKg<0?'Recovering toward birth weight':'Tracking from birth weight'}
  }};
})(typeof window!=='undefined'?window:globalThis);
