(function(root){
  'use strict';
  /** @type {any} */ const F=root.LittleDaysFeeding=root.LittleDaysFeeding||{};

  const MODES=Object.freeze({
    NONE:'insufficient_data',FORMULA:'exclusive_formula',EXPRESSED:'exclusive_expressed_breast_milk',BREAST:'direct_breastfeeding',BREAST_EXPRESSED:'mixed_direct_breastfeeding_expressed_milk',BREAST_FORMULA:'mixed_direct_breastfeeding_formula',EXPRESSED_FORMULA:'mixed_expressed_breast_milk_formula',OTHER:'other_or_unrecorded_bottle_feeding'
  });
  function classify(entries){
    const feeds=(entries||[]).filter(e=>e.type==='feed'),direct=feeds.some(e=>e.method==='breast'),bottles=feeds.filter(e=>e.method==='bottle'),formula=bottles.some(e=>e.milkType==='Formula'||e.milkType==='Combined / mixed'),expressed=bottles.some(e=>e.milkType==='Breast milk'||e.milkType==='Combined / mixed'),other=bottles.some(e=>!['Formula','Breast milk','Combined / mixed'].includes(e.milkType||''));
    /** @type {string} */ let mode=MODES.NONE;
    if(direct&&formula)mode=MODES.BREAST_FORMULA;else if(direct&&expressed)mode=MODES.BREAST_EXPRESSED;else if(direct&&!bottles.length)mode=MODES.BREAST;else if(!direct&&formula&&expressed)mode=MODES.EXPRESSED_FORMULA;else if(!direct&&formula&&!expressed&&!other)mode=MODES.FORMULA;else if(!direct&&expressed&&!formula&&!other)mode=MODES.EXPRESSED;else if(feeds.length)mode=MODES.OTHER;
    const hasDirectBreastfeeding=direct,isMixed=mode===MODES.BREAST_EXPRESSED||mode===MODES.BREAST_FORMULA||mode===MODES.EXPRESSED_FORMULA;
    return{mode,feeds,bottles,hasDirectBreastfeeding,hasFormula:formula,hasExpressedMilk:expressed,hasOtherBottle:other,isMixed,bottleVolumeLabel:hasDirectBreastfeeding?'Recorded bottle intake':mode===MODES.FORMULA?'Recorded formula intake':'Recorded bottle intake',mayCompareWithFormulaOnlyReference:mode===MODES.FORMULA}
  }

  F.modes={MODES,classify};
  // Singular alias retained to keep the call site readable and make the API
  // tolerant of either naming convention.
  F.mode=F.modes;
  if(typeof module!=='undefined'&&module.exports)module.exports=F.modes;
})(typeof window!=='undefined'?window:globalThis);
