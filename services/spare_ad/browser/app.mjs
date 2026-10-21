import {BrowserAPI} from "./browser-api.mjs";
'use strict';
const $ = id => document.getElementById(id);
let config, reference = [], uploaded = [], norm = null, refWarnings = [], uploadWarnings = [], selectedModel = '', busy = false, referenceTrends = null, referenceLines = null;
const colors = {CN:'#164c63', MCI:'#8c620d', DA:'#822e4b', Unlabeled:'#56636d'};
const overlayColors = {CN:'#168eae', MCI:'#df9b19', DA:'#d64975', Unlabeled:'#77838d'};
const groups = {diagnosis:'Diagnosis', ethnicity:'Ethnicity'};
const browserAPI = new BrowserAPI(message => {
  $('calculation-status').textContent = message;
  $('calculation-status').hidden = !message;
  $('cancel-calculation').hidden = !message;
});
async function api(path, options) { return browserAPI.request(path, options); }
$('cancel-calculation').addEventListener('click', () => browserAPI.cancel());
function error(message) { $('error').hidden = !message; $('error').textContent = message || ''; }
function state(value) {
  busy = value;
  $('model').disabled = value;
  $('file').disabled = value;
  $('score').disabled = value;
  $('trend').disabled = value;
  $('predict').disabled = value || !$('file').files.length || !$('harmonized').checked;
  $('predict').textContent = value ? 'Processing…' : 'Generate scores ↗';
  $('clear').disabled = value || !uploaded.length;
  $('download').disabled = value || !uploaded.length;
}
function warnings() {
  $('warnings').replaceChildren();
  for (const message of [...refWarnings, ...uploadWarnings]) {
    const el = document.createElement('p'); el.className='warning'; el.textContent=message; $('warnings').append(el);
  }
}
function makeFilters() {
  const previous = {};
  document.querySelectorAll('[data-group]').forEach(el => { previous[`${el.dataset.group}:${el.value}`] = el.checked; });
  $('filterGroups').replaceChildren();
  for (const [key, title] of Object.entries(groups)) {
    const block=document.createElement('div'), h=document.createElement('h3'); h.textContent=title; block.append(h);
    const values=[...new Set([...reference,...uploaded].map(row=>row[key]))].sort();
    for (const val of values) {
      const label=document.createElement('label'), box=document.createElement('input');
      label.className='check'; box.type='checkbox'; box.value=val; box.dataset.group=key;
      box.checked=previous[`${key}:${val}`] ?? true; box.addEventListener('change', render);
      label.append(box,document.createTextNode(val));block.append(label);
    }
    $('filterGroups').append(block);
  }
}
function visible(row, score) {
  if (!Number.isFinite(row.age) || !Number.isFinite(row[score])) return false;
  if (row.age < Number($('ageMin').value) || row.age > Number($('ageMax').value)) return false;
  for (const key of Object.keys(groups)) {
    const boxes=[...document.querySelectorAll(`[data-group="${key}"]`)];
    if (!boxes.some(box => box.checked && box.value === row[key])) return false;
  }
  return true;
}
function scatter(rows, name, color, overlay, score) {
  return {type:'scatter', mode:'markers', name,
    x:rows.map(r=>r.age), y:rows.map(r=>r[score]),
    marker:{color, size:overlay?14:7, opacity:overlay?.95:Number($('opacity').value),
      symbol:overlay?'diamond':'circle', line:{width:overlay?1.5:0,color:overlay?'#fff':color}},
    customdata:rows.map(r=>[overlay?r.id:'Reference scan',r.diagnosis,r.ethnicity,r.p,r.prediction,r.binary_prediction??r.prediction,r.trend_status??'reference']),
    hovertemplate:'<b>%{customdata[0]}</b><br>Age: %{x:.1f}<br>Score: %{y:.3f}<br>DX: %{customdata[1]}<br>Ethnicity: %{customdata[2]}<br>Model output: %{customdata[3]:.4f}<br>Trend prediction: %{customdata[4]}<br>Binary prediction: %{customdata[5]}<br>%{customdata[6]}<extra>%{fullData.name}</extra>'};
}
function trend(label,color,score) {
  const kind=$('trend').value;
  const trace=referenceLines?.[score]?.[kind]?.find(line=>line.diagnosis===label);
  if(!trace)return null;
  const low=Number($('ageMin').value),high=Number($('ageMax').value);
  const selected=trace.x.map((x,i)=>[x,trace.y[i]]).filter(([x])=>x>=low&&x<=high);
  if(!selected.length)return null;
  return {type:'scatter',mode:'lines',name:`${label} trend`,x:selected.map(v=>v[0]),y:selected.map(v=>v[1]),line:{color,width:4},hoverinfo:'skip'};
}
function render() {
  if (!config) return;
  if(reference.length)$('mciInfo').textContent=`MCI reference: ${reference.filter(r=>r.diagnosis==='MCI').length.toLocaleString()} scans. Predictions use fixed ${$('trend').value==='curve'?'quadratic curves':'straight lines'} at the same age; filters only change visibility.`;
  const score=$('score').value, definition=config.scores[score];
  $('formula').textContent=definition.formula;$('description').textContent=definition.description;
  $('chartTitle').textContent=definition.name+' vs age';
  const ref=reference.filter(r=>visible(r,score)), input=uploaded.filter(r=>visible(r,score));
  const traces=[];
  if ($('showReference').checked) {
    for (const dx of ['CN','MCI','DA','Unlabeled']) {
      const rows=ref.filter(r=>r.diagnosis===dx); if(!rows.length)continue;
      traces.push(scatter(rows, `Reference ${dx} · ${rows.length.toLocaleString()}`,colors[dx],false,score));
      if ($('showTrends').checked && ['CN','MCI','DA'].includes(dx)) {const line=trend(dx,colors[dx],score);if(line)traces.push(line);}
    }
  }
  if ($('showInput').checked) {
    for (const dx of ['CN','MCI','DA','Unlabeled']) {
      const rows=input.filter(r=>r.diagnosis===dx); if(!rows.length)continue;
      traces.push(scatter(rows, `Uploaded ${dx} · ${rows.length.toLocaleString()}`, overlayColors[dx],true,score));
    }
  }
  $('refCount').textContent=reference.length.toLocaleString();$('inputCount').textContent=uploaded.length.toLocaleString();
  $('chartNote').textContent=`Visible with current filters: ${$('showReference').checked?ref.length.toLocaleString():0} reference scans · ${$('showInput').checked?input.length.toLocaleString():0} uploaded scans. ${score==='age_z'&&!norm?'Age-Z is unavailable: insufficient CN reference data.':''}`;
  const compact=window.innerWidth<=800;
  const layout={autosize:true,margin:{l:compact?70:85,r:compact?16:25,t:25,b:compact?220:100},paper_bgcolor:'#fff',plot_bgcolor:'#fff',
    font:{family:'system-ui, sans-serif',size:18,color:'#142f3a'},
    xaxis:{title:{text:'Age (years)',font:{size:22},standoff:20},gridcolor:'#e9eeee',zeroline:false},
    yaxis:{title:{text:definition.name,font:{size:20}},gridcolor:'#e9eeee',zerolinecolor:'#bdcbce',...(score==='index'?{range:[-1.08,1.08]}:{})},
    legend:{orientation:'h',x:0,y:compact?-.24:-.2,font:{size:compact?14:15}},hoverlabel:{font:{size:16}},
    uirevision:selectedModel+score,shapes:[{type:'line',xref:'paper',x0:0,x1:1,y0:0,y1:0,line:{color:'#879b9e',dash:'dot',width:1}}],
    annotations:traces.length?[]:[{text:'No plottable rows match these filters',xref:'paper',yref:'paper',x:.5,y:.5,showarrow:false,font:{size:22}}]};
  Plotly.react('chart',traces,layout,{responsive:true,displaylogo:false,toImageButtonOptions:{format:'png',filename:`fair_spare_ad_${selectedModel}_${score}`,scale:2}});
}
function table() {
  $('results').replaceChildren();
  for (const row of uploaded.slice(0,500)) {
    const tr=document.createElement('tr');
    for (const value of [row.id,row.age,row.diagnosis,row.index,row.logit,row.age_z,row.prediction,row.binary_prediction,row.trend_status]) {
      const td=document.createElement('td');td.textContent=typeof value==='number'?value.toFixed(3):value??'—';tr.append(td);
    }
    $('results').append(tr);
  }
  $('resultInfo').textContent=uploaded.length?`${uploaded.length.toLocaleString()} scored rows. Showing the first ${Math.min(500,uploaded.length)}; download includes every row and all three scores. Prediction uses the selected score and trend type. Chart filters do not change predictions or exports.`:'Upload a CSV to return all three scores, the model output and the three-way trend prediction and original binary prediction.';
}
async function loadModel() {
  const requested=$('model').value;
  state(true);error('');
  try {
    const data=await api('/api/reference?model='+encodeURIComponent(requested));
    selectedModel=requested;reference=data.rows;norm=data.norm;refWarnings=data.warnings;referenceTrends=data.trends;referenceLines=data.trend_lines;
    uploaded=[];uploadWarnings=[];table();$('file').value='';$('fileInfo').textContent='No file selected';$('harmonized').checked=false;
    $('threshold').textContent=data.threshold.toFixed(2);
    const choice=config.models.find(m=>m.id===requested);
    $('runBadge').textContent=choice.name+' · '+data.feature_count+' features';
    $('modelDescription').textContent=choice.description;
    $('normInfo').textContent=norm?`${norm.n.toLocaleString()} CN reference scans; ages ${norm.age_min}–${norm.age_max}. Expected logit = ${norm.intercept.toFixed(4)} + ${norm.slope.toFixed(4)} × age; residual SD ${norm.sd.toFixed(4)}. This fixed fit is exploratory.`:'Age-Z is unavailable because the reference has insufficient CN age variation.';
    const ages=reference.map(r=>r.age).filter(Number.isFinite);$('ageMin').value=Math.floor(Math.min(...ages));$('ageMax').value=Math.ceil(Math.max(...ages));
    $('mciInfo').textContent=`MCI reference: ${data.mci_count.toLocaleString()} scans selected across age bands. Predictions use fixed ${$('trend').value==='curve'?'quadratic curves':'straight lines'} at the same age.`;
    makeFilters();warnings();render();
  } catch(e) {error(e.message);$('model').value=selectedModel||requested;} finally {state(false);}
}
$('file').addEventListener('change',()=>{$('fileInfo').textContent=$('file').files[0]?.name||'No file selected';state(busy);});
$('harmonized').addEventListener('change',()=>state(busy));
$('model').addEventListener('change',loadModel);
$('predict').addEventListener('click',async()=>{
  const file=$('file').files[0];if(!file||!selectedModel)return;
  if(file.size>18*1024*1024){error('Please choose a CSV smaller than 18 MB.');return;}
  state(true);error('');
  try {
    const data=await api('/api/predict',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:selectedModel,csv:await file.text(),score:$('score').value,trend:$('trend').value})});
    uploaded=data.rows;uploadWarnings=data.warnings;makeFilters();warnings();table();render();
  }catch(e){error(e.message);}finally{state(false);}
});
$('clear').addEventListener('click',()=>{uploaded=[];uploadWarnings=[];$('file').value='';$('fileInfo').textContent='No file selected';makeFilters();warnings();table();render();state(false);});
$('download').addEventListener('click',()=>{
  if(!uploaded.length)return;
  const columns=Object.keys(uploaded[0]);
  const escape=value=>{let s=value==null?'':String(value);if(typeof value==='string'&&/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};
  const csv=[columns.map(escape).join(','),...uploaded.map(r=>columns.map(k=>escape(r[k])).join(','))].join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`fair_spare_ad_${selectedModel}_scores.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
for(const id of ['showReference','showInput','showTrends','ageMin','ageMax','opacity'])$(id).addEventListener('change',render);
let plotResizeTimer;
window.addEventListener('resize',()=>{clearTimeout(plotResizeTimer);plotResizeTimer=setTimeout(render,150);});
async function refreshClassification() {
  if (busy) return;
  if (!uploaded.length) { render(); return; }
  const previousScore=uploaded[0].trend_score, previousTrend=uploaded[0].trend_kind;
  state(true);error('');
  try {
    const data=await api('/api/classify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:selectedModel,rows:uploaded,score:$('score').value,trend:$('trend').value})});
    uploaded=data.rows;table();render();
  } catch(e) {
    $('score').value=previousScore;$('trend').value=previousTrend;render();error(e.message);
  } finally {state(false);}
}
$('score').addEventListener('change',refreshClassification);
$('trend').addEventListener('change',refreshClassification);
(async()=>{
  if (!window.Plotly && document.readyState !== 'complete') await new Promise(resolve => window.addEventListener('load', resolve, {once:true}));
  try{config=await api('/api/config');for(const model of config.models){const option=document.createElement('option');option.value=model.id;option.textContent=model.name;$('model').append(option);}$('model').value=config.default_model;for(const [key,val]of Object.entries(config.scores)){const option=document.createElement('option');option.value=key;option.textContent=val.name;$('score').append(option);}await loadModel();}
  catch(e){error(e.message);}
})();
