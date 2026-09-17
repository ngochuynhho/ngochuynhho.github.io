(function(root){
  'use strict';
  /** @type {any} */ const F=root.LittleDaysFeeding=root.LittleDaysFeeding||{};
  // Stable facade for callers that prefer an analysis-oriented API name.
  F.analysis={analyze(input){return F.decisionEngine.evaluate(input)}};
  if(typeof module!=='undefined'&&module.exports)module.exports=F.analysis;
})(typeof window!=='undefined'?window:globalThis);
