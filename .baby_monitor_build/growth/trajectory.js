(function(root){
  'use strict';
  /** @type {any} */ const G=root.LittleDaysGrowth=root.LittleDaysGrowth||{};
  G.trajectory={analyze(points){const list=(points||[]).filter(p=>Number.isFinite(p.z)).sort((a,b)=>+new Date(a.at)-+new Date(b.at));if(list.length<2)return{classification:'insufficient data',deltaZ:null,days:null};const previous=list[0],latest=list[list.length-1],deltaZ=latest.z-previous.z,days=(+new Date(latest.at)-+new Date(previous.at))/86400000;return{previous,latest,deltaZ,days,classification:Math.abs(deltaZ)<.5?'relatively stable':deltaZ>0?'trending upward':'trending downward'}}};
})(typeof window!=='undefined'?window:globalThis);
