(function(root){
  'use strict';
  /** @type {any} */ const F=root.LittleDaysFeeding=root.LittleDaysFeeding||{};
  if(typeof module!=='undefined'&&module.exports){
    if(!F.reference)require('./reference.js');
    if(!F.windows)require('./windows.js');
    if(!F.modes)require('./modes.js');
    if(!F.formula)require('./formula.js');
    if(!F.breastfeeding)require('./breastfeeding.js');
    if(!F.diapers)require('./diapers.js');
    if(!F.decisionEngine)require('./decisionEngine.js');
    if(!F.analysis)require('./analysis.js');
    module.exports=F;
  }
})(typeof window!=='undefined'?window:globalThis);
