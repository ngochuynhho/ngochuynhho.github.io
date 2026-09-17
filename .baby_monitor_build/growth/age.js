(function(root){
  'use strict';
  /** @type {any} */ const G=root.LittleDaysGrowth=root.LittleDaysGrowth||{},DAY=86400000,WEEK=7*DAY,MONTH=365.2425/12*DAY;
  G.age={
    DAY,WEEK,MONTH,
    exact(birthTimestamp,measurementTimestamp){const birth=new Date(birthTimestamp),at=new Date(measurementTimestamp),ms=+at-+birth;if(!Number.isFinite(ms))return null;return{milliseconds:ms,hours:ms/3600000,days:ms/DAY,weeks:ms/WEEK,months:ms/MONTH,babyDay:Math.floor(ms/DAY)+1}},
    gestationalWeeks(weeks,days=0){if(weeks===null||weeks===undefined||weeks==='')return null;const w=Number(weeks),d=Number(days||0);return Number.isFinite(w)?w+d/7:null},
    corrected(birthTimestamp,measurementTimestamp,gestWeeks,gestDays=0){const chronological=this.exact(birthTimestamp,measurementTimestamp),gestational=this.gestationalWeeks(gestWeeks,gestDays);if(!chronological||gestational===null)return null;const weeksEarly=Math.max(0,40-gestational),correctedMs=chronological.milliseconds-weeksEarly*WEEK;return{...chronological,gestationalAgeWeeks:gestational,weeksEarly,isPreterm:gestational<37,postmenstrualAgeWeeks:gestational+chronological.weeks,correctedMilliseconds:correctedMs,correctedDays:correctedMs/DAY,correctedWeeks:correctedMs/WEEK,correctedMonths:correctedMs/MONTH}}
  };
})(typeof window!=='undefined'?window:globalThis);
