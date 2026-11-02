(() => {
  'use strict';
  const menuButton = document.querySelector('.of-menu-button');
  const menu = document.querySelector('#of-menu');
  const closeMenu = () => {menu.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');menuButton.textContent='Меню';};
  menuButton.addEventListener('click', () => {
    const open=menuButton.getAttribute('aria-expanded')!=='true';
    menu.classList.toggle('is-open',open);menuButton.setAttribute('aria-expanded',String(open));menuButton.textContent=open?'Закрыть':'Меню';
  });
  menu.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
  document.addEventListener('click',event=>{if(!event.target.closest('.of-header'))closeMenu();});

  const section=document.querySelector('.of-directions');
  const stage=document.querySelector('.of-stage');
  const cards=[...document.querySelectorAll('[data-service]')];
  const jumps=[...document.querySelectorAll('[data-service-jump]')];
  const counter=document.querySelector('[data-current]');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const wide=matchMedia('(min-width: 960px) and (min-height: 760px)');
  let enhanced=false,active=-1,queued=false;
  const activate=index=>{
    if(index===active)return;
    active=index;section.classList.toggle('is-wine',index%3===2);section.classList.toggle('is-olive',index%3===1);
    cards.forEach((card,i)=>{
      const visible=i===index;
      card.classList.toggle('is-active',visible);
      if(enhanced){card.setAttribute('aria-hidden',String(!visible));card.inert=!visible;}
      else{card.removeAttribute('aria-hidden');card.inert=false;}
    });
    jumps.forEach((button,i)=>{if(i===index)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current');});
    counter.textContent=String(index+1).padStart(2,'0');
    [cards[index],cards[index+1]].filter(Boolean).forEach(card=>{card.querySelector('img').loading='eager';});
  };
  const travel=()=>Math.max(1,section.offsetHeight-stage.offsetHeight);
  const update=()=>{
    queued=false;if(!enhanced)return;
    const top=section.getBoundingClientRect().top;
    const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header'))||96;
    const progress=Math.max(0,Math.min(.999999,(header-top)/travel()));
    activate(Math.min(cards.length-1,Math.floor(progress*cards.length)));
  };
  const requestUpdate=()=>{if(!queued){queued=true;requestAnimationFrame(update);}};
  const configure=()=>{
    enhanced=wide.matches&&!reduce.matches;
    section.classList.toggle('is-enhanced',enhanced);
    active=-1;
    if(enhanced)update();
    else{section.classList.remove('is-wine','is-olive');cards.forEach(card=>{card.removeAttribute('aria-hidden');card.inert=false;card.classList.remove('is-active');});}
    if(innerWidth>=960)closeMenu();
  };
  wide.addEventListener('change',configure);reduce.addEventListener('change',configure);
  addEventListener('resize',requestUpdate,{passive:true});addEventListener('scroll',requestUpdate,{passive:true});
  jumps.forEach((button,i)=>button.addEventListener('click',()=>{
    if(enhanced){const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header'))||96;const top=scrollY+section.getBoundingClientRect().top-header+travel()*((i+.15)/cards.length);scrollTo({top,behavior:'smooth'});}
    else cards[i].scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'start'});
  }));
  configure();

  const lightbox=document.querySelector('.of-lightbox');
  const preview=document.querySelector('#of-preview-image');
  const caption=document.querySelector('#of-preview-caption');
  const description=document.querySelector('#of-preview-description');
  const scrollArea=document.querySelector('.of-lightbox-scroll');
  const count=document.querySelector('.of-slide-count');
  const previous=document.querySelector('[data-slide-prev]');
  const next=document.querySelector('[data-slide-next]');
  const original=document.querySelector('.of-slide-original');
  const projects=JSON.parse(document.querySelector('#of-project-data').textContent);
  let opener=null,slides=[],slideIndex=0,touchStart=null;
  const renderSlide=()=>{
    const slide=slides[slideIndex];
    if(!slide)return;
    preview.src=slide.src;preview.alt=slide.alt;
    count.textContent=`${slideIndex+1} / ${slides.length}`;
    original.href=slide.src;
    previous.hidden=next.hidden=slides.length<2;
    scrollArea.scrollTop=0;
  };
  const moveSlide=direction=>{
    if(slides.length<2)return;
    slideIndex=(slideIndex+direction+slides.length)%slides.length;
    renderSlide();
  };
  const openProject=(button,project)=>{
    opener=button;slides=project.slides;slideIndex=0;
    caption.textContent=project.title;description.textContent=project.description||'';
    renderSlide();lightbox.showModal();document.body.style.overflow='hidden';
  };
  document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
    const project=projects[button.dataset.project];if(project)openProject(button,project);
  }));
  document.querySelectorAll('[data-preview]').forEach(button=>button.addEventListener('click',()=>{
    openProject(button,{title:button.dataset.caption,description:'',slides:[{src:button.dataset.preview,alt:button.dataset.caption}]});
  }));
  previous.addEventListener('click',()=>moveSlide(-1));
  next.addEventListener('click',()=>moveSlide(1));
  document.addEventListener('keydown',event=>{
    if(!lightbox.open||event.altKey||event.ctrlKey||event.metaKey)return;
    if(event.key==='ArrowRight'){event.preventDefault();moveSlide(1);}
    if(event.key==='ArrowLeft'){event.preventDefault();moveSlide(-1);}
  });
  scrollArea.addEventListener('touchstart',event=>{
    touchStart=event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY}:null;
  },{passive:true});
  scrollArea.addEventListener('touchend',event=>{
    if(!touchStart||!event.changedTouches.length)return;
    const dx=event.changedTouches[0].clientX-touchStart.x;
    const dy=event.changedTouches[0].clientY-touchStart.y;
    touchStart=null;
    if(Math.abs(dx)>65&&Math.abs(dy)<45)moveSlide(dx<0?1:-1);
  },{passive:true});
  scrollArea.addEventListener('touchcancel',()=>{touchStart=null;},{passive:true});
  const closePreview=()=>lightbox.close();
  document.querySelector('.of-lightbox-close').addEventListener('click',closePreview);
  lightbox.addEventListener('click',event=>{if(event.target===lightbox){const r=lightbox.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closePreview();}});
  lightbox.addEventListener('close',()=>{document.body.style.overflow='';preview.removeAttribute('src');slides=[];touchStart=null;opener?.focus({preventScroll:true});});

  const form=document.querySelector('.of-form');
  let draft='';
  form.addEventListener('submit',event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const data=new FormData(form);
    draft=`Здравствуйте, Марина!\n\nМеня зовут ${String(data.get('name')).trim()}.\nСвязаться со мной: ${String(data.get('contact')).trim()}\n\nЗадача:\n${String(data.get('message')).trim()}`;
    const mail='mailto:hrneiroway@yandex.ru?subject='+encodeURIComponent('Оформление для вас — новая задача')+'&body='+encodeURIComponent(draft);
    document.querySelector('.of-draft-link').href=mail;
    const result=document.querySelector('.of-form-result');result.hidden=false;result.scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'nearest'});
  });
  form.addEventListener('input',()=>{document.querySelector('.of-form-result').hidden=true;document.querySelector('.of-copy').textContent='Скопировать текст';});
  document.querySelector('.of-copy').addEventListener('click',async event=>{
    try{await navigator.clipboard.writeText(draft);event.target.textContent='Текст скопирован';}
    catch{event.target.textContent='Откройте письмо по ссылке выше';}
  });
})();
