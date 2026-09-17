(function(root){
  'use strict';

  const FAMILY_STORAGE_KEY='little-days-family-v1';
  const LEGACY_STORAGE_KEY='little-days-v1';
  const SYNC_STORAGE_KEY='little-days-sync-v1';

  function clone(value){return JSON.parse(JSON.stringify(value))}
  function nowIso(){return new Date().toISOString()}
  function randomCharacters(length){
    const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',bytes=new Uint8Array(length);
    if(root.crypto?.getRandomValues)root.crypto.getRandomValues(bytes);else for(let i=0;i<length;i++)bytes[i]=Math.floor(Math.random()*256);
    return Array.from(bytes,value=>alphabet[value%alphabet.length]).join('')
  }
  function createBabyId(){return `BABY-${randomCharacters(6)}`}
  function normalizeBabyId(value){return String(value||'').trim().toUpperCase().replace(/[^A-Z0-9_-]/g,'-').replace(/-+/g,'-').slice(0,32)}
  function validBabyId(value){return /^[A-Z0-9][A-Z0-9_-]{2,31}$/.test(value)}
  function emptyRecord(id){return{schemaVersion:3,baby:{id},entries:[],feedingGuidance:{tracking:{}}}}
  function hasMeaningfulData(record){
    const baby=record?.baby||{};
    return !!(baby.birthAt||baby.date||baby.time||baby.name||(record?.entries||[]).length||Object.keys(record?.feedingGuidance||{}).some(key=>key!=='tracking'||Object.keys(record.feedingGuidance.tracking||{}).length))
  }
  function timestamp(value,fallback='1970-01-01T00:00:00.000Z'){return Number.isNaN(+new Date(value))?fallback:value}
  function latestTimestamp(...values){return values.map(value=>timestamp(value)).sort().at(-1)}
  function entryTimestamp(entry,fallback){return timestamp(entry?.updatedAt, timestamp(entry?.at,fallback))}
  function envelope(id,record,draft=false,at=nowIso()){
    const copy=clone(record||emptyRecord(id));copy.baby=copy.baby||{};copy.baby.id=id;copy.entries=Array.isArray(copy.entries)?copy.entries:[];copy.feedingGuidance=copy.feedingGuidance||{};
    copy.entries=copy.entries.map(item=>({...item,updatedAt:entryTimestamp(item,at)}));
    return{id,record:copy,draft,createdAt:at,updatedAt:at,profileUpdatedAt:at,guidanceUpdatedAt:at,deletedAt:null,deletedEntries:{}}
  }
  function activeBabies(registry){return Object.values(registry.babies||{}).filter(item=>item&&!item.deletedAt)}
  function parse(storage,key){try{return JSON.parse(storage.getItem(key))}catch{return null}}
  function persist(storage,registry){storage.setItem(FAMILY_STORAGE_KEY,JSON.stringify(registry))}
  function normalizeEnvelope(item,id){
    const normalizedId=normalizeBabyId(item?.id||id)||createBabyId(),at=timestamp(item?.updatedAt,nowIso()),result=envelope(normalizedId,item?.record||emptyRecord(normalizedId),!!item?.draft,at);
    result.createdAt=timestamp(item?.createdAt,at);result.profileUpdatedAt=timestamp(item?.profileUpdatedAt,at);result.guidanceUpdatedAt=timestamp(item?.guidanceUpdatedAt,at);result.deletedAt=item?.deletedAt?timestamp(item.deletedAt,at):null;result.deletedEntries=item?.deletedEntries&&typeof item.deletedEntries==='object'?{...item.deletedEntries}:{};
    return result
  }
  function initialRegistry(storage){
    const saved=parse(storage,FAMILY_STORAGE_KEY),registry={schemaVersion:1,activeBabyId:'',babies:{}};
    if(saved?.babies&&typeof saved.babies==='object')Object.entries(saved.babies).forEach(([id,item])=>{const normalized=normalizeEnvelope(item,id);registry.babies[normalized.id]=normalized});
    if(!Object.keys(registry.babies).length){
      const legacy=parse(storage,LEGACY_STORAGE_KEY),id=normalizeBabyId(legacy?.baby?.id)||createBabyId(),draft=!hasMeaningfulData(legacy);
      registry.babies[id]=envelope(id,legacy||emptyRecord(id),draft);registry.activeBabyId=id
    }else registry.activeBabyId=normalizeBabyId(saved?.activeBabyId);
    if(!registry.babies[registry.activeBabyId]||registry.babies[registry.activeBabyId].deletedAt)registry.activeBabyId=activeBabies(registry)[0]?.id||'';
    if(!registry.activeBabyId){const id=createBabyId();registry.babies[id]=envelope(id,emptyRecord(id),true);registry.activeBabyId=id}
    persist(storage,registry);return registry
  }
  function comparable(value){return JSON.stringify(value||{})}
  function mergeEntries(local,remote,deletedEntries,fallbackLocal,fallbackRemote){
    const choices=new Map();
    [...(local||[]).map(entry=>({entry,source:'local'})),...(remote||[]).map(entry=>({entry,source:'remote'}))].forEach(({entry,source})=>{
      if(!entry?.id)return;const fallback=source==='local'?fallbackLocal:fallbackRemote,current=choices.get(entry.id),candidate={...clone(entry),updatedAt:entryTimestamp(entry,fallback)};
      if(!current||+new Date(candidate.updatedAt)>=+new Date(current.updatedAt))choices.set(entry.id,candidate)
    });
    return [...choices.values()].filter(entry=>+new Date(timestamp(deletedEntries[entry.id]))<+new Date(entry.updatedAt)).sort((a,b)=>+new Date(a.at)-+new Date(b.at))
  }
  function mergeEnvelope(local,remote){
    if(!local)return normalizeEnvelope(remote,remote.id);if(!remote)return normalizeEnvelope(local,local.id);
    const l=normalizeEnvelope(local,local.id),r=normalizeEnvelope(remote,remote.id),deletedAt=latestTimestamp(l.deletedAt,r.deletedAt),latestUpdate=latestTimestamp(l.updatedAt,r.updatedAt);
    if(+new Date(deletedAt)>=+new Date(latestUpdate)){const winner=+new Date(l.deletedAt||0)>=+new Date(r.deletedAt||0)?l:r;return{...winner,deletedAt}}
    const profileSource=+new Date(l.profileUpdatedAt)>=+new Date(r.profileUpdatedAt)?l:r,guidanceSource=+new Date(l.guidanceUpdatedAt)>=+new Date(r.guidanceUpdatedAt)?l:r,base=+new Date(l.updatedAt)>=+new Date(r.updatedAt)?l:r,deletedEntries={...l.deletedEntries};
    Object.entries(r.deletedEntries).forEach(([id,at])=>{if(+new Date(timestamp(at))>+new Date(timestamp(deletedEntries[id])))deletedEntries[id]=at});
    const record={...clone(base.record),baby:clone(profileSource.record.baby||{}),feedingGuidance:clone(guidanceSource.record.feedingGuidance||{}),entries:mergeEntries(l.record.entries,r.record.entries,deletedEntries,l.updatedAt,r.updatedAt)};
    record.baby.id=l.id;
    return{...base,id:l.id,record,draft:l.draft&&r.draft,createdAt:+new Date(l.createdAt)<=+new Date(r.createdAt)?l.createdAt:r.createdAt,updatedAt:latestUpdate,profileUpdatedAt:latestTimestamp(l.profileUpdatedAt,r.profileUpdatedAt),guidanceUpdatedAt:latestTimestamp(l.guidanceUpdatedAt,r.guidanceUpdatedAt),deletedAt:null,deletedEntries}
  }

  function create(options={}){
    const storage=options.storage||root.localStorage,registry=initialRegistry(storage);
    function save(){persist(storage,registry)}
    function currentEnvelope(){return registry.babies[registry.activeBabyId]}
    function currentRecord(){return clone(currentEnvelope().record)}
    function list(){return activeBabies(registry).sort((a,b)=>+new Date(a.createdAt)-+new Date(b.createdAt)).map(item=>({id:item.id,name:item.record.baby?.name||'',configured:hasMeaningfulData(item.record)&&!!(item.record.baby?.birthAt||item.record.baby?.date),draft:item.draft}))}
    function setActive(id){id=normalizeBabyId(id);if(!registry.babies[id]||registry.babies[id].deletedAt)return false;registry.activeBabyId=id;save();storage.setItem(LEGACY_STORAGE_KEY,JSON.stringify(registry.babies[id].record));return true}
    function addBaby(){let id=createBabyId();while(registry.babies[id])id=createBabyId();registry.babies[id]=envelope(id,emptyRecord(id),true);registry.activeBabyId=id;save();return id}
    function renameActive(value){
      const id=normalizeBabyId(value),current=currentEnvelope();if(!validBabyId(id))throw new Error('Baby ID must be 3–32 letters, numbers, hyphens, or underscores.');if(id===current.id)return id;if(!current.draft)throw new Error('A saved Baby ID cannot be changed.');if(registry.babies[id]&&!registry.babies[id].deletedAt)throw new Error('That Baby ID is already in use.');
      delete registry.babies[current.id];current.id=id;current.record.baby.id=id;registry.babies[id]=current;registry.activeBabyId=id;save();return id
    }
    function saveCurrent(record){
      const current=currentEnvelope(),at=nowIso(),copy=clone(record);copy.baby=copy.baby||{};copy.baby.id=current.id;copy.entries=Array.isArray(copy.entries)?copy.entries:[];copy.feedingGuidance=copy.feedingGuidance||{};
      copy.entries=copy.entries.map(entry=>({...entry,updatedAt:entryTimestamp(entry,current.updatedAt)}));
      if(comparable(copy.baby)!==comparable(current.record.baby))current.profileUpdatedAt=at;
      if(comparable(copy.feedingGuidance)!==comparable(current.record.feedingGuidance))current.guidanceUpdatedAt=at;
      current.record=copy;current.updatedAt=at;current.draft=!hasMeaningfulData(copy);save();storage.setItem(LEGACY_STORAGE_KEY,JSON.stringify(copy));return currentRecord()
    }
    function markEntryDeleted(id){const current=currentEnvelope(),at=nowIso();current.deletedEntries[id]=at;current.record.entries=(current.record.entries||[]).filter(entry=>entry.id!==id);current.updatedAt=at;save();storage.setItem(LEGACY_STORAGE_KEY,JSON.stringify(current.record))}
    function deleteActive(){
      const current=currentEnvelope(),at=nowIso();current.deletedAt=at;current.updatedAt=at;
      const next=activeBabies(registry).find(item=>item.id!==current.id);if(next)registry.activeBabyId=next.id;else addBaby();save();storage.setItem(LEGACY_STORAGE_KEY,JSON.stringify(currentEnvelope().record));return registry.activeBabyId
    }
    function snapshot(){const babies={};Object.entries(registry.babies).forEach(([id,item])=>{if(item.deletedAt||!item.draft||hasMeaningfulData(item.record))babies[id]=clone(item)});return{schemaVersion:1,babies}}
    function mergeSnapshot(remote){
      if(!remote?.babies||typeof remote.babies!=='object')throw new Error('The synchronized data is not a valid Little Days family.');
      const previousActive=registry.activeBabyId,discardEmptyDraft=!!currentEnvelope()?.draft&&!hasMeaningfulData(currentEnvelope().record)&&Object.keys(remote.babies).length>0;
      Object.entries(remote.babies).forEach(([id,value])=>{const normalized=normalizeEnvelope(value,id);registry.babies[normalized.id]=mergeEnvelope(registry.babies[normalized.id],normalized)});
      if(discardEmptyDraft){delete registry.babies[previousActive];registry.activeBabyId=activeBabies(registry)[0]?.id||''}
      if(!registry.babies[registry.activeBabyId]||registry.babies[registry.activeBabyId].deletedAt)registry.activeBabyId=activeBabies(registry)[0]?.id||addBaby();
      save();storage.setItem(LEGACY_STORAGE_KEY,JSON.stringify(currentEnvelope().record));return currentRecord()
    }
    function syncConfig(){return parse(storage,SYNC_STORAGE_KEY)}
    function setSyncConfig(config){if(config)storage.setItem(SYNC_STORAGE_KEY,JSON.stringify(config));else storage.removeItem(SYNC_STORAGE_KEY)}
    return{currentRecord,list,setActive,addBaby,renameActive,saveCurrent,markEntryDeleted,deleteActive,snapshot,mergeSnapshot,syncConfig,setSyncConfig,activeId:()=>registry.activeBabyId,isDraft:()=>!!currentEnvelope().draft,normalizeBabyId,validBabyId}
  }

  root.LittleDaysFamily={create,normalizeBabyId,validBabyId,mergeEnvelope,keys:{family:FAMILY_STORAGE_KEY,legacy:LEGACY_STORAGE_KEY,sync:SYNC_STORAGE_KEY}};
  if(typeof module!=='undefined')module.exports=root.LittleDaysFamily
})(typeof window!=='undefined'?window:globalThis);
