
document.querySelectorAll('.polaroid').forEach((card,index)=>{card.classList.add('photo-reveal');card.style.setProperty('--photo-delay',`${index%4*75}ms`);});
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver' in window&&!reduce.matches){
 document.body.classList.add('has-motion');
 const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.06});
 document.querySelectorAll('.reveal,.photo-reveal').forEach(el=>io.observe(el));
}

const phrases=["Вау! 🌟","Ты — произведение искусства!","Давай сделаем шедевр?","Ты невероятна ✨","Твоё фото уже ждёт тебя!","Каждый кадр — история","Магия близко 💫","Ты рождена для обложки!","Я уже скучаю по тебе","Красота без границ ✦"];
const kBtn=document.getElementById('kasper-btn');
const kBubble=document.getElementById('kasper-bubble');
let kTo;
kBtn.addEventListener('click',()=>{
  kBubble.textContent=phrases[Math.floor(Math.random()*phrases.length)];
  kBubble.classList.add('visible');
  clearTimeout(kTo);
  kTo=setTimeout(()=>kBubble.classList.remove('visible'),2800);
});

(function(){
  const arena=document.getElementById('arena');
  const kasper=document.getElementById('kasper-game');
  const scoreEl=document.getElementById('score');
  const recordEl=document.getElementById('record');
  const comboEl=document.getElementById('combo');
  const flash=document.getElementById('combo-flash');
  let score=0,record=0,streak=0,bones=[],kx=50,ky=70,targetBone=null,flashTo;
  const specials=['⭐','💫','✨','🎁'];
  function getS(){return{w:arena.clientWidth,h:arena.clientHeight}}
  function setPos(x,y,instant){
    const s=getS();
    const px=x/100*s.w-55,py=y/100*s.h-kasper.clientHeight;
    kasper.style.left=Math.max(0,Math.min(s.w-110,px))+'px';
    kasper.style.top=Math.max(0,Math.min(s.h-kasper.clientHeight,py))+'px';
    kasper.style.transition=instant?'left 0.1s,top 0.1s':'left 0.25s,top 0.25s';
  }
  function spawnBone(fx,fy){
    if(!fx&&bones.length>=6)return;
    const isSpec=Math.random()<0.18;
    const em=isSpec?specials[Math.floor(Math.random()*specials.length)]:'🦴';
    const px=fx!==undefined?fx:8+Math.random()*82;
    const py=fy!==undefined?fy:10+Math.random()*72;
    const el=document.createElement('div');
    el.className='bone';el.textContent=em;
    el.style.left=px+'%';el.style.top=py+'%';
    el.dataset.x=px;el.dataset.y=py;el.dataset.spec=isSpec?'1':'0';
    el.style.animationDelay=(Math.random()*1.5)+'s';
    el.addEventListener('click',ev=>{ev.stopPropagation();catchBone(el)});
    arena.appendChild(el);bones.push(el);
    el._t=setTimeout(()=>removeBone(el),5500);
  }
  function removeBone(el){
    clearTimeout(el._t);
    if(el.parentNode)el.parentNode.removeChild(el);
    bones=bones.filter(b=>b!==el);
    if(targetBone===el)targetBone=null;
  }
  function catchBone(el){
    streak++;
    const pts=(el.dataset.spec==='1'?3:1)*Math.min(streak,5);
    score+=pts;if(score>record)record=score;
    scoreEl.textContent=score;recordEl.textContent=record;
    comboEl.textContent='x'+Math.min(streak,5);
    kx=parseFloat(el.dataset.x);ky=parseFloat(el.dataset.y);
    setPos(kx,ky,true);
    if(el.dataset.spec==='1')showFlash('✨ Джекпот! +'+pts);
    else if(streak%5===0)showFlash('🔥 Серия x'+streak+'!');
    removeBone(el);
  }
  function showFlash(msg){
    flash.textContent=msg;
    flash.style.transition='none';flash.style.opacity='1';
    flash.style.transform='translate(-50%,-50%) scale(1.1)';
    clearTimeout(flashTo);
    requestAnimationFrame(()=>{
      flash.style.transition='opacity 1s,transform 1s';
      flashTo=setTimeout(()=>{flash.style.opacity='0';flash.style.transform='translate(-50%,-65%) scale(1)';},900);
    });
  }
  let lastT=0;
  function loop(ts){
    const dt=Math.min((ts-lastT)/1000,0.05);lastT=ts;
    if(bones.length>0){
      let best=null,bestD=Infinity;
      bones.forEach(b=>{const bx=parseFloat(b.dataset.x),by=parseFloat(b.dataset.y),d=Math.hypot(bx-kx,by-ky);if(d<bestD){bestD=d;best=b;}});
      targetBone=best;
      if(targetBone){
        const tx=parseFloat(targetBone.dataset.x),ty=parseFloat(targetBone.dataset.y);
        const dx=tx-kx,dy=ty-ky,dist=Math.hypot(dx,dy);
        if(dist>2.5){kx+=(dx/dist)*58*dt;ky+=(dy/dist)*58*dt;setPos(kx,ky,false);kasper.style.transform=dx<0?'scaleX(-1)':'scaleX(1)';}
        else{catchBone(targetBone);}
      }
    }else{
      const t=ts/1000;
      const wx=50+Math.sin(t*0.38)*30,wy=55+Math.cos(t*0.27)*22;
      kx+=(wx-kx)*dt*1.2;ky+=(wy-ky)*dt*1.2;
      setPos(kx,ky,false);kasper.style.transform='scaleX(1)';
    }
    requestAnimationFrame(loop);
  }
  if(!reduce.matches)requestAnimationFrame(loop);else setPos(kx,ky,true);
  spawnBone();spawnBone();
  setInterval(()=>spawnBone(),2000);
  arena.addEventListener('click',e=>{
    if(e.target===kasper||e.target.classList.contains('bone')||e.target===flash)return;
    const r=arena.getBoundingClientRect();
    streak=0;comboEl.textContent='x1';
    spawnBone((e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100);
  });
})();


const menuButton=document.querySelector('.np-menu-button'),menu=document.querySelector('#np-menu');
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menu.classList.toggle('is-open',open);menuButton.textContent=open?'Закрыть':'Меню';});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');menuButton.textContent='Меню';}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');menuButton.textContent='Меню';}});
document.querySelector('.np-kasper-close').addEventListener('click',()=>{document.querySelector('.kasper-widget').hidden=true;});
const photos=Array.from(document.querySelectorAll('[data-photo]')),viewer=document.querySelector('.np-lightbox'),large=document.querySelector('#np-large-photo');let photoIndex=0,photoOpener=null;
const showPhoto=()=>{const button=photos[photoIndex];large.src=button.dataset.photo;large.alt=button.dataset.caption;document.querySelector('#np-photo-caption').textContent=button.dataset.caption;document.querySelector('#np-photo-count').textContent=(photoIndex+1)+' / '+photos.length;};
photos.forEach((button,index)=>button.addEventListener('click',()=>{photoIndex=index;photoOpener=button;showPhoto();viewer.showModal();document.body.style.overflow='hidden';}));
const movePhoto=direction=>{photoIndex=(photoIndex+direction+photos.length)%photos.length;showPhoto();};
document.querySelector('[data-photo-prev]').addEventListener('click',()=>movePhoto(-1));document.querySelector('[data-photo-next]').addEventListener('click',()=>movePhoto(1));document.querySelector('.np-lightbox-close').addEventListener('click',()=>viewer.close());
viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close();}});
viewer.addEventListener('close',()=>{document.body.style.overflow='';large.removeAttribute('src');photoOpener?.focus({preventScroll:true});});
document.addEventListener('keydown',e=>{if(!viewer.open)return;if(e.key==='ArrowRight'){e.preventDefault();movePhoto(1);}if(e.key==='ArrowLeft'){e.preventDefault();movePhoto(-1);}});
