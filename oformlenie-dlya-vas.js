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
  const wide=matchMedia('(min-width: 960px) and (min-height: 760px) and (max-aspect-ratio: 2/1)');
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
    opener=button;opener.classList.add('is-previewing');slides=project.slides;slideIndex=0;
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
  lightbox.addEventListener('close',()=>{document.body.style.overflow='';preview.removeAttribute('src');slides=[];touchStart=null;opener?.classList.remove('is-previewing');opener?.focus({preventScroll:true});});

  const reviewTrack=document.querySelector('.of-review-track');
  if(reviewTrack){
    const controls=document.querySelector('.of-review-controls');
    const prev=controls.querySelector('[data-review-prev]');
    const next=controls.querySelector('[data-review-next]');
    const cards=Array.from(reviewTrack.querySelectorAll('.of-review'));
    const position=controls.querySelector('.of-review-position');
    controls.hidden=false;
    const updateReviews=()=>{
      const step=cards[1].offsetLeft-cards[0].offsetLeft;
      const current=Math.min(cards.length,Math.round(reviewTrack.scrollLeft/step)+1);
      prev.disabled=reviewTrack.scrollLeft<2;
      next.disabled=reviewTrack.scrollLeft+reviewTrack.clientWidth>=reviewTrack.scrollWidth-3;
      position.textContent=current+' / '+cards.length;
    };
    const moveReviews=direction=>reviewTrack.scrollBy({left:direction*(cards[1].offsetLeft-cards[0].offsetLeft),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    prev.addEventListener('click',()=>moveReviews(-1));
    next.addEventListener('click',()=>moveReviews(1));
    reviewTrack.addEventListener('scroll',updateReviews,{passive:true});
    reviewTrack.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();moveReviews(event.key==='ArrowRight'?1:-1);}});
    window.addEventListener('resize',updateReviews,{passive:true});
    updateReviews();
  }
  const workSection=document.querySelector('.of-works');
  const workCards=Array.from(document.querySelectorAll('.of-work-grid .of-work'));
  const workFilters=Array.from(document.querySelectorAll('[data-work-filter]'));
  workFilters.forEach(button=>button.addEventListener('click',()=>{
    workFilters.forEach(filter=>filter.setAttribute('aria-pressed',String(filter===button)));
    let visible=0;
    workCards.forEach(card=>{card.hidden=button.dataset.workFilter!=='all'&&card.dataset.workCategory!==button.dataset.workFilter;if(!card.hidden)visible++;});
    document.querySelector('.of-work-total').textContent='Показано проектов: '+visible;
  }));
  if('IntersectionObserver' in window&&!reduce.matches){
    const revealWorks=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-seen');revealWorks.unobserve(entry.target);}
    }),{threshold:0,rootMargin:'0px 0px 60px 0px'});
    workSection.classList.add('has-work-reveal');
    workCards.forEach(card=>revealWorks.observe(card));
  }
  const portfolioTitle=document.querySelector('#examples-title');
  const titleWords=Array.from(portfolioTitle.querySelectorAll('.of-reveal-word'));
  let titleFrame=0;
  const updatePortfolioTitle=()=>{
    titleFrame=0;
    workSection.classList.toggle('has-title-reveal',!reduce.matches);
    if(reduce.matches)return;
    const rect=portfolioTitle.getBoundingClientRect();
    const progress=Math.max(0,Math.min(1,(innerHeight*.92-rect.top)/(innerHeight*.42)));
    titleWords.forEach((word,index)=>word.style.setProperty('--word-fill',Math.max(0,Math.min(1,progress*titleWords.length-index))*100+'%'));
  };
  const requestTitleUpdate=()=>{if(!titleFrame)titleFrame=requestAnimationFrame(updatePortfolioTitle);};
  addEventListener('scroll',requestTitleUpdate,{passive:true});
  addEventListener('resize',requestTitleUpdate,{passive:true});
  reduce.addEventListener('change',requestTitleUpdate);
  updatePortfolioTitle();
  const workStrip=document.querySelector('#of-work-strip');
  const stripControls=document.querySelector('.of-work-strip-controls');
  const stripPrev=stripControls.querySelector('[data-work-prev]');
  const stripNext=stripControls.querySelector('[data-work-next]');
  stripControls.hidden=false;
  const updateWorkStrip=()=>{
    stripPrev.disabled=workStrip.scrollLeft<2;
    stripNext.disabled=workStrip.scrollLeft+workStrip.clientWidth>=workStrip.scrollWidth-3;
  };
  const moveWorkStrip=direction=>workStrip.scrollBy({left:direction*workStrip.clientWidth*.75,behavior:reduce.matches?'instant':'smooth'});
  stripPrev.addEventListener('click',()=>moveWorkStrip(-1));
  stripNext.addEventListener('click',()=>moveWorkStrip(1));
  workStrip.addEventListener('scroll',updateWorkStrip,{passive:true});
  workStrip.addEventListener('keydown',event=>{if(event.target!==workStrip)return;if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();moveWorkStrip(event.key==='ArrowRight'?1:-1);}});
  workFilters.forEach(button=>button.addEventListener('click',()=>{workStrip.scrollTo({left:0,behavior:'instant'});requestAnimationFrame(updateWorkStrip);}));
  window.addEventListener('resize',updateWorkStrip,{passive:true});
  updateWorkStrip();
})();
