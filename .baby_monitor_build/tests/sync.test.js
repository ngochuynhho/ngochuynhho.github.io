'use strict';

const test=require('node:test');
const assert=require('node:assert/strict');
const Family=require('../family.js');
const Sync=require('../sync.js');

class MemoryStorage{
  constructor(values={}){this.values=new Map(Object.entries(values))}
  getItem(key){return this.values.has(key)?this.values.get(key):null}
  setItem(key,value){this.values.set(key,String(value))}
  removeItem(key){this.values.delete(key)}
}

test('encrypted recovery-key sync links two device stores',async()=>{
  const remote=new Map();
  global.fetch=async(url,options={})=>{
    const id=String(url).split('/').at(-1),authorization=options.headers.Authorization,current=remote.get(id);
    if(options.method==='GET'){
      if(!current||current.authorization!==authorization)return new Response(JSON.stringify({error:'not found'}),{status:404});
      return Response.json({version:current.version,...current.payload})
    }
    const expected=Number(options.headers['If-Match']);if(current&&current.authorization!==authorization)return new Response(JSON.stringify({error:'not found'}),{status:404});if((current?.version||0)!==expected)return new Response(JSON.stringify({version:current?.version||0}),{status:409});
    const payload=JSON.parse(options.body),version=expected+1;remote.set(id,{authorization,version,payload});return new Response(JSON.stringify({version}),{status:expected===0?201:200,headers:{'content-type':'application/json'}})
  };
  const first=Family.create({storage:new MemoryStorage()}),id=first.activeId(),record=first.currentRecord();record.baby={id,name:'Encrypted Baby',date:'2026-09-01',time:'08:00'};record.entries.push({id:'feed-one',type:'feed',at:'2026-09-01T09:00:00Z',updatedAt:'2026-09-01T09:00:01Z'});first.saveCurrent(record);
  const config=await Sync.create(first),stored=remote.get(config.spaceId);assert.ok(stored);assert.doesNotMatch(stored.payload.ciphertext,/Encrypted Baby|feed-one/);
  const second=Family.create({storage:new MemoryStorage()});await Sync.join(second,config.recoveryKey);const imported=second.list().find(item=>item.id===id);assert.equal(imported.name,'Encrypted Baby');assert.equal(second.activeId(),id);assert.equal(second.currentRecord().entries[0].id,'feed-one');
  const update=first.currentRecord();update.entries.push({id:'wet-two',type:'wet',at:'2026-09-01T10:00:00Z',updatedAt:'2026-09-01T10:00:01Z'});first.saveCurrent(update);await Sync.syncNow(first);await Sync.syncNow(second);assert.deepEqual(second.currentRecord().entries.map(entry=>entry.id),['feed-one','wet-two'])
});
