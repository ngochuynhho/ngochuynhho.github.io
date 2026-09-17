(function(root){
  'use strict';
  /** @type {any} */ const G=root.LittleDaysGrowth=root.LittleDaysGrowth||{};
  function interpolate(rows,x){
    if(!rows?.length||!Number.isFinite(Number(x)))return null;
    const n=Number(x);if(n<rows[0][0]||n>rows[rows.length-1][0])return null;
    if(n===rows[0][0])return{x:n,L:rows[0][1],M:rows[0][2],S:rows[0][3]};
    for(let i=1;i<rows.length;i++)if(n<=rows[i][0]){const a=rows[i-1],b=rows[i],t=(n-a[0])/(b[0]-a[0]||1);return{x:n,L:a[1]+(b[1]-a[1])*t,M:a[2]+(b[2]-a[2])*t,S:a[3]+(b[3]-a[3])*t}}
    return null
  }
  function zScore(value,lms){const x=Number(value);if(!lms||!Number.isFinite(x)||x<=0)return null;return Math.abs(lms.L)<1e-12?Math.log(x/lms.M)/lms.S:(Math.pow(x/lms.M,lms.L)-1)/(lms.L*lms.S)}
  function erf(x){const sign=x<0?-1:1,a=Math.abs(x),t=1/(1+0.3275911*a),y=1-(((((1.061405429*t-1.453152027)*t+1.421413741)*t-0.284496736)*t+0.254829592)*t)*Math.exp(-a*a);return sign*y}
  function percentile(z){return Number.isFinite(z)?100*(.5*(1+erf(z/Math.SQRT2))):null}
  function referenceValue(lms,z){if(!lms||!Number.isFinite(z))return null;return Math.abs(lms.L)<1e-12?lms.M*Math.exp(lms.S*z):lms.M*Math.pow(1+lms.L*lms.S*z,1/lms.L)}
  function lookup(metric,sex,coordinate){const rows=root.WHO_LMS_DATA?.[metric]?.[sex];return interpolate(rows,coordinate)}
  function calculate(metric,sex,coordinate,value){const lms=lookup(metric,sex,coordinate),z=zScore(value,lms);return lms&&z!==null?{z,percentile:percentile(z),lms}:null}
  function curves(metric,sex,coordinates,zValues=[-2,-1,0,1,2]){return zValues.map(z=>({z,points:coordinates.map(x=>{const lms=lookup(metric,sex,x);return{x,y:referenceValue(lms,z)}}).filter(p=>p.y!==null)}))}
  G.lms={interpolate,zScore,percentile,referenceValue,lookup,calculate,curves};
})(typeof window!=='undefined'?window:globalThis);
