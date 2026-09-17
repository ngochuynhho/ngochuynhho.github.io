'use strict';

const test=require('node:test');
const assert=require('node:assert/strict');
const Family=require('../family.js');

class MemoryStorage{
  constructor(values={}){this.values=new Map(Object.entries(values))}
  getItem(key){return this.values.has(key)?this.values.get(key):null}
  setItem(key,value){this.values.set(key,String(value))}
  removeItem(key){this.values.delete(key)}
}

test('legacy state becomes the first Baby ID without losing entries',()=>{
  const legacy={schemaVersion:3,baby:{name:'Mia',date:'2026-08-01',time:'10:00'},entries:[{id:'feed-1',type:'feed',at:'2026-08-01T12:00:00Z',notes:'keep me'}]},storage=new MemoryStorage({'little-days-v1':JSON.stringify(legacy)}),store=Family.create({storage});
  assert.equal(store.list().length,1);assert.equal(store.currentRecord().baby.name,'Mia');assert.equal(store.currentRecord().entries[0].notes,'keep me');assert.match(store.activeId(),/^BABY-/);assert.ok(storage.getItem('little-days-family-v1'))
});

test('baby selection keeps records isolated',()=>{
  const storage=new MemoryStorage(),store=Family.create({storage}),first=store.activeId(),firstRecord=store.currentRecord();firstRecord.baby={id:first,name:'First',date:'2026-08-01',time:'10:00'};firstRecord.entries.push({id:'first-feed',type:'feed',at:'2026-08-01T12:00:00Z'});store.saveCurrent(firstRecord);
  store.addBaby();store.renameActive('BABY-TWO');const second=store.currentRecord();second.baby={id:'BABY-TWO',name:'Second',date:'2026-08-02',time:'10:00'};store.saveCurrent(second);assert.equal(store.list().length,2);assert.equal(store.currentRecord().entries.length,0);store.setActive(first);assert.equal(store.currentRecord().entries[0].id,'first-feed')
});

test('merge keeps concurrent entries and honors deletion tombstones',()=>{
  const storageA=new MemoryStorage(),storeA=Family.create({storage:storageA}),id=storeA.activeId(),base=storeA.currentRecord();base.baby={id,name:'Shared',date:'2026-08-01',time:'10:00'};storeA.saveCurrent(base);
  const storageB=new MemoryStorage({'little-days-family-v1':JSON.stringify({schemaVersion:1,activeBabyId:id,babies:storeA.snapshot().babies})}),storeB=Family.create({storage:storageB});
  const a=storeA.currentRecord();a.entries.push({id:'a',type:'wet',at:'2026-08-01T11:00:00Z',updatedAt:'2026-08-01T11:00:01Z'});storeA.saveCurrent(a);const b=storeB.currentRecord();b.entries.push({id:'b',type:'soiled',at:'2026-08-01T11:05:00Z',updatedAt:'2026-08-01T11:05:01Z'});storeB.saveCurrent(b);storeA.mergeSnapshot(storeB.snapshot());assert.deepEqual(storeA.currentRecord().entries.map(entry=>entry.id),['a','b']);
  storeA.markEntryDeleted('a');storeB.mergeSnapshot(storeA.snapshot());assert.deepEqual(storeB.currentRecord().entries.map(entry=>entry.id),['b'])
});
