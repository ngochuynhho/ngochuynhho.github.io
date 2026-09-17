(function(root){
  'use strict';
  /** @type {any} */ const G=root.LittleDaysGrowth=root.LittleDaysGrowth||{};
  const KG_PER_LB=0.45359237,CM_PER_IN=2.54,ML_PER_FLOZ=29.5735295625;
  G.units={
    kgToLb:kg=>Number(kg)/KG_PER_LB,
    lbToKg:lb=>Number(lb)*KG_PER_LB,
    gToOz:g=>Number(g)/28.349523125,
    ozToG:oz=>Number(oz)*28.349523125,
    cmToIn:cm=>Number(cm)/CM_PER_IN,
    inToCm:inch=>Number(inch)*CM_PER_IN,
    mlToFlOz:ml=>Number(ml)/ML_PER_FLOZ,
    flOzToMl:oz=>Number(oz)*ML_PER_FLOZ,
    weightKg(value,unit='kg'){const n=Number(value);if(!Number.isFinite(n))return null;return unit==='lb'?n*KG_PER_LB:unit==='g'?n/1000:unit==='oz'?n*28.349523125/1000:n},
    lengthCm(value,unit='cm'){const n=Number(value);if(!Number.isFinite(n))return null;return unit==='in'?n*CM_PER_IN:n},
    displayWeight(kg,unit='kg'){return unit==='lb'?{value:Number(kg)/KG_PER_LB,unit:'lb'}:{value:Number(kg),unit:'kg'}},
    displayLength(cm,unit='cm'){return unit==='in'?{value:Number(cm)/CM_PER_IN,unit:'in'}:{value:Number(cm),unit:'cm'}}
  };
})(typeof window!=='undefined'?window:globalThis);
