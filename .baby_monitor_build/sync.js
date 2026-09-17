(function(root){
  'use strict';

  const encoder=new TextEncoder(),decoder=new TextDecoder(),PREFIX='LD1';
  function bytesToBase64(bytes){let binary='';bytes.forEach(value=>{binary+=String.fromCharCode(value)});return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
  function base64ToBytes(value){const normalized=value.replace(/-/g,'+').replace(/_/g,'/'),padded=normalized+'='.repeat((4-normalized.length%4)%4),binary=atob(padded);return Uint8Array.from(binary,char=>char.charCodeAt(0))}
  function randomBytes(length){const value=new Uint8Array(length);crypto.getRandomValues(value);return value}
  function recoveryKey(spaceId,secret){return `${PREFIX}.${spaceId}.${secret}`}
  function parseRecoveryKey(value){
    const parts=String(value||'').trim().split('.');if(parts.length!==3||parts[0]!==PREFIX||!/^[A-Za-z0-9_-]{12,32}$/.test(parts[1]))throw new Error('Enter a valid Little Days recovery key.');
    const secret=base64ToBytes(parts[2]);if(secret.length!==32)throw new Error('Enter a valid Little Days recovery key.');return{spaceId:parts[1],secret:parts[2],recoveryKey:recoveryKey(parts[1],parts[2])}
  }
  async function derive(config){
    if(!crypto.subtle)throw new Error('Encrypted sync requires HTTPS, or localhost during local testing.');
    const secret=base64ToBytes(config.secret),material=await crypto.subtle.importKey('raw',secret,'HKDF',false,['deriveBits','deriveKey']),salt=encoder.encode(`Little Days ${config.spaceId}`),authBits=await crypto.subtle.deriveBits({name:'HKDF',hash:'SHA-256',salt,info:encoder.encode('sync authentication')},material,256),encryptionKey=await crypto.subtle.deriveKey({name:'HKDF',hash:'SHA-256',salt,info:encoder.encode('snapshot encryption')},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
    return{auth:bytesToBase64(new Uint8Array(authBits)),encryptionKey}
  }
  async function encrypt(snapshot,config,key){const iv=randomBytes(12),plain=encoder.encode(JSON.stringify(snapshot)),encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:encoder.encode(config.spaceId)},key,plain);return{iv:bytesToBase64(iv),ciphertext:bytesToBase64(new Uint8Array(encrypted))}}
  async function decrypt(payload,config,key){
    try{const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:base64ToBytes(payload.iv),additionalData:encoder.encode(config.spaceId)},key,base64ToBytes(payload.ciphertext));return JSON.parse(decoder.decode(plain))}catch{throw new Error('The recovery key could not decrypt this family data.')}
  }
  async function request(config,method,body,version){
    const keys=await derive(config),headers={Authorization:`Bearer ${keys.auth}`};if(body){headers['Content-Type']='application/json';headers['If-Match']=String(version)}
    const response=await fetch(`/api/sync/${encodeURIComponent(config.spaceId)}`,{method,headers,body:body?JSON.stringify(body):undefined,cache:'no-store'}),json=await response.json().catch(()=>({}));
    if(response.status===409){const error=/** @type {any} */(new Error('The family changed on another device. Retrying…'));error.code='conflict';error.version=json.version;throw error}
    if(response.status===404)throw new Error('This family sync space was not found, or the recovery key is incorrect.');
    if(!response.ok)throw new Error(json.error||`Sync failed (${response.status}).`);
    return{json,keys}
  }
  async function create(store){
    const spaceId=bytesToBase64(randomBytes(12)),secret=bytesToBase64(randomBytes(32)),config={spaceId,secret,recoveryKey:recoveryKey(spaceId,secret),version:0},keys=await derive(config),payload=await encrypt(store.snapshot(),config,keys.encryptionKey),result=await request(config,'PUT',payload,0);
    config.version=result.json.version;config.lastSyncedAt=new Date().toISOString();store.setSyncConfig(config);return config
  }
  async function join(store,value){
    const config=parseRecoveryKey(value),result=await request(config,'GET'),remote=await decrypt(result.json,config,result.keys.encryptionKey);store.mergeSnapshot(remote);config.version=result.json.version;config.lastSyncedAt=new Date().toISOString();store.setSyncConfig(config);return syncNow(store)
  }
  async function syncNow(store){
    const config=store.syncConfig();if(!config)throw new Error('Connect this device to family sync first.');
    for(let attempt=0;attempt<3;attempt++){
      const fetched=await request(config,'GET'),remote=await decrypt(fetched.json,config,fetched.keys.encryptionKey);store.mergeSnapshot(remote);const payload=await encrypt(store.snapshot(),config,fetched.keys.encryptionKey);
      try{const saved=await request(config,'PUT',payload,fetched.json.version);config.version=saved.json.version;config.lastSyncedAt=new Date().toISOString();store.setSyncConfig(config);return config}catch(error){if(error.code!=='conflict'||attempt===2)throw error}
    }
    throw new Error('Sync could not resolve a simultaneous update. Try again.')
  }
  function disconnect(store){store.setSyncConfig(null)}

  root.LittleDaysSync={create,join,syncNow,disconnect,parseRecoveryKey};
  if(typeof module!=='undefined')module.exports=root.LittleDaysSync
})(typeof window!=='undefined'?window:globalThis);
