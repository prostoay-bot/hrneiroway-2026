const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const source=fs.readFileSync('assets/js/site-analytics.js','utf8');
const key='hrneiroway-analytics-choice-v1';
function setup(initial=null,{blocked=false,path='/neurophoto.html',host='hrneiroway.ru'}={}){
 const calls=[],scripts=[],documentEvents={},windowEvents={},made=[];let reloads=0;
 const values=new Map(initial?[[key,initial]]:[]);
 class El{
  constructor(tag){this.tagName=tag;this.attrs={};this.events={};this.hidden=false;this.isConnected=true;made.push(this);}
  setAttribute(k,v){this.attrs[k]=v} getAttribute(k){return this.attrs[k]??null}
  addEventListener(k,f){this.events[k]=f} append(x){} after(x){} focus(){}
  querySelector(){return {focus(){}}} matches(){return false} closest(){return null}
 }
 const main=new El('main');const head=new El('head');head.append=x=>scripts.push(x);
 const document={head,body:new El('body'),referrer:'https://example.org/path?email=private#secret',querySelector:q=>q==='main'?main:scripts.find(x=>x.attrs['data-hr-metrika']!==undefined),createElement:t=>new El(t),addEventListener:(k,f)=>documentEvents[k]=f};
 const location={hostname:host,pathname:path,href:'https://hrneiroway.ru'+path+'?name=PRIVATE#secret',reload(){reloads++}};
 const localStorage={getItem(k){if(blocked)throw Error('blocked');return values.get(k)||null},setItem(k,v){if(blocked)throw Error('blocked');values.set(k,v)}};
 const window={addEventListener:(k,f)=>windowEvents[k]=f,ym(...args){calls.push(args)}};
 const context={window,document,location,localStorage,URL,Date,Object};vm.runInNewContext(source,context);
 const panel=made.find(x=>x.className==='hr-analytics-panel');const settings=made.find(x=>x.className==='hr-analytics-settings');
 function choose(value){panel.events.click({target:{closest:()=>({getAttribute:()=>value})}})}
 function click(target){documentEvents.click({target})}
 function contact(href){const t={id:'',getAttribute:()=>href,matches:q=>q==='a[href]',closest:q=>q==='a,button'?t:null};click(t)}
 function button(id,{project=false}={}){const t={id,getAttribute:()=>null,matches:q=>project&&q.includes('[data-project]'),closest:q=>q==='a,button'?t:null};click(t)}
 return {calls,scripts,panel,settings,choose,contact,button,values,context,windowEvents,get reloads(){return reloads}};
}
let t=setup();assert.equal(t.scripts.length,0);assert.equal(t.panel.hidden,false);t.contact('mailto:private@example.com');assert.equal(t.calls.length,0);t.choose('declined');assert.equal(t.scripts.length,0);assert.equal(t.values.get(key),'declined');assert.equal(t.panel.hidden,true);
t=setup('declined');assert.equal(t.scripts.length,0);assert.equal(t.panel.hidden,true);t.settings.events.click();assert.equal(t.panel.hidden,false);t.choose('accepted');assert.equal(t.scripts.length,1);assert.equal(t.calls[0][0],111505107);const config=t.calls[0][2];assert.equal(config.webvisor,false);assert.equal(config.clickmap,false);assert.equal(config.trackLinks,false);assert.equal(config.sendTitle,false);assert.equal(config.url,'https://hrneiroway.ru/neurophoto.html');assert.equal(config.referrer,'https://example.org/path');
t.choose('accepted');assert.equal(t.scripts.length,1);t.contact('mailto:private@example.com?subject=PRIVATE');let goal=t.calls.at(-1);assert.equal(goal[1],'reachGoal');assert.equal(goal[2],'contact_click');assert.equal(goal[3].category,'email');assert.equal(JSON.stringify(goal).includes('PRIVATE'),false);assert.equal(JSON.stringify(goal).includes('private@example'),false);
let n=t.calls.length;t.contact('https://t.me/addstickers/hr_ne_v_resurse');assert.equal(t.calls.length,n);t.contact('https://t.me/Marina_x6');assert.equal(t.calls.at(-1)[3].category,'telegram');
t.button('print-document');assert.equal(t.calls.at(-1)[2],'tool_export');assert.equal(t.calls.at(-1)[3].category,'print');t.button('',{project:true});assert.equal(t.calls.at(-1)[2],'project_open');
t.choose('declined');assert.equal(t.context.window.disableYaCounter111505107,true);assert.equal(t.calls.at(-1)[1],'destruct');assert.equal(t.reloads,1);n=t.calls.length;t.contact('mailto:private@example.com');assert.equal(t.calls.length,n);
t=setup(null,{blocked:true});assert.equal(t.scripts.length,0);t.choose('accepted');assert.equal(t.scripts.length,1);t.choose('declined');assert.equal(t.reloads,1);
t=setup('accepted',{path:'/peredacha-del/'});assert.equal(t.scripts.length,1);t.button('copy-text');assert.equal(t.calls.at(-1)[3].category,'copy');assert.equal(t.calls.at(-1)[3].page,'/peredacha-del/');
t=setup('accepted',{path:'/privacy.html'});assert.equal(t.scripts.length,0);
t=setup('accepted');t.values.set(key,'declined');t.windowEvents.storage({key});assert.equal(t.reloads,1);assert.equal(t.context.window.hrSiteAnalytics.getChoice(),'declined');
t=setup('accepted',{host:'127.0.0.1'});assert.equal(t.scripts.length,0);
console.log('PASS: default/declined consent, opt-in once, settings, revoke, cross-tab, blocked storage, sanitized URLs/events, tools, legal page');
