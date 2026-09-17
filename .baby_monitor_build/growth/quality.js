(function(root){
  'use strict';
  /** @type {any} */ const G=root.LittleDaysGrowth=root.LittleDaysGrowth||{};
  G.quality={check(measurements,birthTimestamp){
    const issues=[],birth=new Date(birthTimestamp),seen=new Map(),sorted=[...(measurements||[])].sort((a,b)=>+new Date(a.at)-+new Date(b.at));
    sorted.forEach((m,i)=>{
      if(new Date(m.at)<birth)issues.push({id:m.id,kind:m.kind,code:'before-birth',message:'Measurement is dated before birth. Verify the timestamp.'});
      const impossible=m.kind==='weight'&&(m.value<.3||m.value>30)||m.kind==='length'&&(m.value<25||m.value>120)||m.kind==='head'&&(m.value<20||m.value>70);
      if(impossible)issues.push({id:m.id,kind:m.kind,code:'implausible',message:'This value or unit looks unlikely. Verify the measurement and unit.'});
      if(m.unitValid===false)issues.push({id:m.id,kind:m.kind,code:'invalid-unit',message:'The saved measurement unit is not recognized. Verify the value and unit.'});
      const key=`${m.kind}|${m.at}|${m.value.toFixed(4)}`;if(seen.has(key))issues.push({id:m.id,kind:m.kind,code:'duplicate',message:'This appears to duplicate another measurement.'});seen.set(key,true);
      const prior=sorted.slice(0,i).reverse().find(p=>p.kind===m.kind);if(prior){const days=(+new Date(m.at)-+new Date(prior.at))/86400000,change=Math.abs(m.value-prior.value);if(m.kind==='weight'&&days<=3&&change/prior.value>.2)issues.push({id:m.id,kind:m.kind,code:'jump',message:'This value differs substantially from a nearby weight. Verify the value and unit.'});if((m.kind==='length'||m.kind==='head')&&days<=7&&change>5)issues.push({id:m.id,kind:m.kind,code:'jump',message:'This value differs substantially from a nearby measurement. Verify the value and unit.'})}
    });return issues
  }};
})(typeof window!=='undefined'?window:globalThis);
