(() => {
  'use strict';
  const kind = document.body.dataset.tool;
  const $ = id => document.getElementById(id);
  const clone = value => JSON.parse(JSON.stringify(value));
  const icon = name => `<svg class="ui-icon" aria-hidden="true" focusable="false" width="20" height="20"><use href="/tools/icons.svg?v=20261027#${name}"></use></svg>`;
  function memoIcon(heading) { if (/контакт|ссылк/i.test(heading)) return 'address-book'; if (/уточн|вопрос/i.test(heading)) return 'chat-circle-text'; if (/поезд|командиров/i.test(heading)) return 'suitcase'; if (/день|возвращ/i.test(heading)) return 'sun'; if (/до выхода|уход|выход/i.test(heading)) return 'door-open'; if (/соглас|оформл/i.test(heading)) return 'calendar-check'; return 'note'; }
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const lines = value => escape(value).replace(/\n/g, '<br>');
  const date = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value + 'T00:00:00').valueOf()) ? new Intl.DateTimeFormat('ru-RU').format(new Date(value + 'T00:00:00')) : escape(value);
  const statusOptions = ['В работе','Ожидает ответа','Нужно начать','Завершено'];
  const task = () => ({task:'',owner:'',due:'',status:'В работе',next:'',link:''});
  const material = () => ({name:'',link:'',note:''});
  const block = () => ({heading:'',text:'',enabled:true});
  const blankHandover = {title:'Передача дел',company:'',role:'',outgoing:'',incoming:'',from:'',until:'',contacts:'',systems:'',risks:'',notes:'',tasks:[task()],materials:[material()],tone:'wine'};
  const blankMemo = {title:'Памятка сотруднику',company:'',audience:'',contact:'',updated:'',footer:'',blocks:[block()],tone:'wine'};
  const templates = kind === 'handover' ? {
    blank: {label:'Чистый документ', value:blankHandover},
    vacation: {label:'Пример: перед отпуском',value:{...blankHandover,title:'Передача дел на время отпуска',company:'Пример компании',role:'Специалист по персоналу',outgoing:'Анна',incoming:'Ольга',contacts:'Вопросы по выплатам: бухгалтерия\nОрганизационные вопросы: руководитель отдела',systems:'Общая папка отдела: запросить доступ у администратора\nРабочая доска задач: права согласует руководитель',risks:'По заявке на обучение ещё нет подтверждения от поставщика. Если ответа не будет, согласовать следующий шаг с руководителем.',tasks:[{task:'Собрать заявки на обучение',owner:'Ольга',due:'',status:'В работе',next:'Получить ответы от руководителей и обновить общий список',link:''},{task:'Подготовить первый день нового сотрудника',owner:'Ольга',due:'',status:'Ожидает ответа',next:'Уточнить дату выхода и подтвердить готовность рабочего места',link:''}],materials:[{name:'План адаптации',link:'',note:'Актуальная версия в общей папке отдела'},{name:'Список заявок на обучение',link:'',note:'Проверить статус перед отправкой руководителю'}]}},
    role: {label:'Пример: смена роли',value:{...blankHandover,title:'Передача задач при смене роли',tasks:[{...task(),task:'Передать текущие проекты',next:'Провести встречу и согласовать ответственных'},{...task(),task:'Проверить доступы к рабочим материалам',next:'Запросить права для принимающего сотрудника'}],materials:[{name:'Реестр проектов',link:'',note:'Добавить ссылку на актуальную версию'}],notes:'После обсуждения подтвердить список принятых задач и оставшихся вопросов.'}}
  } : {
    blank: {label:'Чистый документ',value:blankMemo},
    firstday: {label:'Первый рабочий день',value:{...blankMemo,title:'Ваш первый рабочий день',audience:'Для новых сотрудников',blocks:[{heading:'До выхода',text:'Уточните время и место встречи, имя встречающего и способ связи. Подготовьте документы по согласованному с HR перечню.',enabled:true},{heading:'В день выхода',text:'Познакомьтесь с командой и руководителем. Проверьте доступы к рабочим инструментам и узнайте, где искать инструкции.',enabled:true},{heading:'Что уточнить у руководителя',text:'Какая первая задача? Какой результат ожидается? Где задавать вопросы и когда обсудить первые итоги?',enabled:true},{heading:'Контакты и ссылки',text:'Добавьте контакт HR, технической поддержки и ссылку на базу знаний вашей компании.',enabled:true}]}},
    vacation: {label:'Как подготовиться к отпуску',value:{...blankMemo,title:'Подготовка к отпуску',audience:'Для сотрудников',blocks:[{heading:'Уточните порядок оформления',text:'Проверьте согласованные даты. Узнайте у HR, какие действия нужны в вашей ситуации и где найти формы.',enabled:true},{heading:'Подготовьте передачу дел',text:'Запишите текущие задачи, ответственных, сроки и ближайшие действия. Дайте коллегам ссылки на нужные материалы.',enabled:true},{heading:'Перед уходом',text:'Обсудите незавершённые вопросы с замещающим коллегой. При необходимости настройте ответ об отсутствии и укажите рабочий контакт на время отпуска.',enabled:true}]}},
    trip: {label:'Подготовка к командировке',value:{...blankMemo,title:'Перед командировкой',audience:'Для командируемых сотрудников',blocks:[{heading:'Согласуйте поездку',text:'Уточните цель, даты, маршрут и порядок оформления у ответственного сотрудника вашей компании.',enabled:true},{heading:'Подготовьте поездку',text:'Проверьте билеты, бронирования и контакты принимающей стороны. Уточните порядок оплаты расходов и документы, которые нужно сохранить.',enabled:true},{heading:'После возвращения',text:'Передайте документы и информацию о поездке по принятому в компании порядку. Добавьте сюда ответственного и внутренние сроки.',enabled:true}]}},
    illness: {label:'Если вы заболели',value:{...blankMemo,title:'Если вы заболели',audience:'Для сотрудников',blocks:[{heading:'Сообщите об отсутствии',text:'Уведомите руководителя и HR по принятому в компании каналу. Добавьте сюда конкретные контакты и порядок уведомления.',enabled:true},{heading:'Передайте срочные задачи',text:'Если состояние позволяет, сообщите, какие задачи требуют внимания и где лежат рабочие материалы.',enabled:true},{heading:'Уточните дальнейшие действия',text:'Узнайте у HR порядок обмена необходимыми сведениями и уведомления о возвращении к работе.',enabled:true}]}}
  };
  const initial = kind === 'handover' ? 'blank' : 'firstday';
  let state = clone(templates[initial].value);
  let dirty = false;
  const storageKey = 'neiroway:' + kind + ':v1';
  const schema = kind === 'handover' ? blankHandover : blankMemo;
  let notificationTimer;
  function notify(message) { clearTimeout(notificationTimer); $('status').textContent = message; notificationTimer = setTimeout(() => { $('status').textContent = ''; }, 10000); }
  function countLabel(n, forms) { const last=n%10, lastTwo=n%100; return n+' '+forms[last===1&&lastTwo!==11?0:last>=2&&last<=4&&(lastTwo<12||lastTwo>14)?1:2]; }
  function field(key, label, type='text', placeholder='') {
    const value = escape(state[key]);
    const control = type === 'textarea' ? `<textarea id="field-${key}" data-key="${key}" rows="3" maxlength="6000" placeholder="${escape(placeholder)}">${value}</textarea>` : `<input id="field-${key}" data-key="${key}" type="${type}" maxlength="300" value="${value}" placeholder="${escape(placeholder)}">`;
    return `<div class="field"><label for="field-${key}">${label}</label>${control}</div>`;
  }
  function repeatField(list,index,key,label,multiline=false) {
    const id = `${list}-${index}-${key}`;
    const attrs = `id="${id}" data-list="${list}" data-index="${index}" data-cell="${key}"`;
    const value = escape(state[list][index][key]);
    if (key === 'enabled') return `<label class="check-label"><input ${attrs} type="checkbox" ${state[list][index].enabled ? 'checked' : ''}>Показывать в памятке</label>`;
    if (key === 'status') return `<div class="field"><label for="${id}">${label}</label><select ${attrs}>${statusOptions.map(x=>`<option ${x===state[list][index][key]?'selected':''}>${x}</option>`).join('')}</select></div>`;
    return `<div class="field"><label for="${id}">${label}</label>${multiline?`<textarea ${attrs} rows="3" maxlength="6000">${value}</textarea>`:`<input ${attrs} type="${key==='due'?'date':'text'}" maxlength="600" value="${value}">`}</div>`;
  }
  function repeatEditor(list, title, makeFields) {
    return `<section class="form-section"><div class="form-section-heading"><h3>${icon(list==='tasks'?'list-checks':list==='materials'?'files':'note-pencil')}${title}</h3><button type="button" class="small" data-add="${list}">${icon('plus')}Добавить</button></div><div class="repeat-list">${state[list].map((row,i)=>`<div class="repeat-item"><div class="repeat-top"><span>${list==='blocks'?'Блок':list==='tasks'?'Задача':'Материал'} ${i+1}</span><div>${list==='blocks'?`<button type="button" class="quiet small" data-move="${i}" data-dir="-1" ${i===0?'disabled':''} aria-label="Переместить блок ${i+1} выше">${icon('arrow-up')}Выше</button><button type="button" class="quiet small" data-move="${i}" data-dir="1" ${i===state[list].length-1?'disabled':''} aria-label="Переместить блок ${i+1} ниже">${icon('arrow-down')}Ниже</button>`:''}<button type="button" class="quiet small" data-remove="${list}" data-index="${i}" aria-label="Удалить ${list==='tasks'?'задачу':list==='blocks'?'блок':'материал'} ${i+1}">${icon('trash')}Удалить</button></div></div>${makeFields(i)}</div>`).join('') || '<p class="empty">Пока ничего нет. Добавьте первый пункт.</p>'}</div></section>`;
  }
  function renderEditor() {
    let html = `<section class="form-section"><h3>${icon('buildings')}Основное</h3>${field('title','Название документа')}${field('company','Компания','text','Название вашей компании')}`;
    if (kind === 'handover') {
      html += field('role','Должность / направление')+field('outgoing','Кто передаёт')+field('incoming','Кто принимает')+`<div class="two-fields">${field('from','С даты','date')}${field('until','По дату','date')}</div><p id="period-error" class="form-error" role="alert"></p></section>`;
      html += repeatEditor('tasks','Текущие задачи',i=>repeatField('tasks',i,'task','Задача')+`<div class="two-fields">${repeatField('tasks',i,'owner','Ответственный')}${repeatField('tasks',i,'due','Срок')}</div>`+repeatField('tasks',i,'status','Статус')+repeatField('tasks',i,'next','Следующий шаг',true)+repeatField('tasks',i,'link','Ссылка на задачу или папку'));
      html += repeatEditor('materials','Материалы',i=>repeatField('materials',i,'name','Название')+repeatField('materials',i,'link','Ссылка')+repeatField('materials',i,'note','Что важно знать',true));
      html += `<section class="form-section"><h3>${icon('handshake')}Договорённости и доступы</h3>${field('contacts','К кому обратиться','textarea','Имя, роль, рабочий контакт')}${field('systems','Рабочие системы и порядок доступа','textarea','Название системы и к кому обратиться за доступом. Без паролей.')}${field('risks','Риски и открытые вопросы','textarea')}${field('notes','Итоги передачи и договорённости','textarea')}</section>`;
    } else {
      html += field('audience','Для кого памятка')+field('contact','Контакт для вопросов')+field('updated','Дата обновления','date')+'</section>';
      html += repeatEditor('blocks','Блоки памятки',i=>repeatField('blocks',i,'enabled','')+repeatField('blocks',i,'heading','Заголовок')+repeatField('blocks',i,'text','Содержание',true));
      html += `<section class="form-section"><h3>${icon('note')}В конце документа</h3>${field('footer','Примечание или полезная ссылка','textarea')}</section>`;
    }
    html += `<section class="form-section"><h3>${icon('palette')}Оформление</h3><label for="tone">Цвет акцента</label><select id="tone" data-key="tone"><option value="wine" ${state.tone==='wine'?'selected':''}>Винный</option><option value="green" ${state.tone==='green'?'selected':''}>Зелёный</option></select></section>`;
    $('tool-form').innerHTML = html;
    renderPreview();
  }
  function textSection(heading,value) {return value.trim()?`<section class="doc-section"><h3>${icon(heading==='Рабочие контакты'?'address-book':heading==='Системы и доступы'?'key':heading==='Риски и открытые вопросы'?'warning-circle':'handshake')}${heading}</h3><p>${lines(value)}</p></section>`:'';}
  function safeLink(value) {
    const trimmed=value.trim();
    if (!trimmed) return '';
    try { const url=new URL(trimmed); if (['https:','http:'].includes(url.protocol)) return `<a href="${escape(url.href)}" target="_blank" rel="noopener noreferrer">${escape(trimmed)}</a>`; } catch (_) { /* Non-URL text is kept as plain text. */ }
    return escape(trimmed);
  }
  function renderPreview() {
    const title = state.title.trim() || (kind==='handover'?'Передача дел':'Памятка сотруднику');
    let html=`<div class="doc-brand">${escape(state.company.trim()||'Ваша компания')}</div><h2>${escape(title)}</h2>`;
    if (kind==='handover') {
      html += `<div class="doc-meta">${state.role?`<p>${escape(state.role)}</p>`:''}${state.outgoing?`<p><b>Передаёт:</b> ${escape(state.outgoing)}</p>`:''}${state.incoming?`<p><b>Принимает:</b> ${escape(state.incoming)}</p>`:''}${state.from||state.until?`<p><b>Период:</b> ${state.from?date(state.from):'не указан'}${state.until?' / '+date(state.until):''}</p>`:''}</div>`;
      const active=state.tasks.filter(x=>Object.entries(x).some(([k,v])=>k!=='status'&&v.trim()));
      html += active.length?`<section class="doc-section"><h3>${icon('list-checks')}Текущие задачи</h3>${active.map((x,i)=>`<div class="doc-task"><div class="doc-task-heading"><span>${String(i+1).padStart(2,'0')}</span><h4>${escape(x.task||'Задача без названия')}</h4></div><p class="doc-task-meta">${escape(x.owner||'Ответственный не указан')} · ${x.due?date(x.due):'Срок не указан'} · ${escape(x.status)}</p>${x.next?`<p><b>Следующий шаг:</b> ${lines(x.next)}</p>`:''}${x.link?`<p>${safeLink(x.link)}</p>`:''}</div>`).join('')}</section>`:'<p class="preview-empty">Добавьте задачи слева: здесь появятся сроки, ответственные и следующие шаги.</p>';
      const materials=state.materials.filter(x=>x.name.trim()||x.link.trim()||x.note.trim());
      if(materials.length) html+=`<section class="doc-section"><h3>${icon('files')}Материалы</h3>${materials.map(x=>`<div class="doc-material"><h4>${escape(x.name||'Материал')}</h4>${x.note?`<p>${lines(x.note)}</p>`:''}${x.link?`<p>${safeLink(x.link)}</p>`:''}</div>`).join('')}</section>`;
      html+=textSection('Рабочие контакты',state.contacts)+textSection('Системы и доступы',state.systems)+textSection('Риски и открытые вопросы',state.risks)+textSection('Договорённости',state.notes);
      $('editor-count').textContent=countLabel(active.length,['задача','задачи','задач']);
      const wrongPeriod=Boolean(state.from&&state.until&&state.from>state.until);
      $('period-error').textContent=wrongPeriod?'Дата окончания должна быть не раньше даты начала.':'';
      $('print-document').disabled=wrongPeriod;
      $('document-note').textContent='Рабочий документ для передачи информации. Порядок согласования и подтверждения передачи определяет компания.';
    } else {
      html+=`<div class="doc-meta">${state.audience?`<p>${escape(state.audience)}</p>`:''}${state.updated?`<p>Обновлено: ${date(state.updated)}</p>`:''}</div>`;
      const blocks=state.blocks.filter(x=>x.enabled&&(x.heading.trim()||x.text.trim()));
      html+=blocks.length?blocks.map((x,i)=>`<section class="doc-section memo-block"><span class="doc-step">${icon(memoIcon(x.heading))}</span><div>${x.heading?`<h3>${escape(x.heading)}</h3>`:''}${x.text?`<p>${lines(x.text)}</p>`:''}</div></section>`).join(''):'<p class="preview-empty">Добавьте блоки или выберите готовую основу. Здесь появится памятка.</p>';
      if(state.contact)html+=`<section class="doc-contact"><h3>${icon('chat-circle-text')}Есть вопросы?</h3><p>${lines(state.contact)}</p></section>`;
      if(state.footer)html+=`<p class="doc-footnote">${lines(state.footer)}</p>`;
      $('editor-count').textContent=countLabel(blocks.length,['блок','блока','блоков']);
      $('document-note').textContent='Готовые блоки служат основой. Перед распространением уточните правила, контакты и сроки вашей компании. Памятка не заменяет официальные документы.';
    }
    $('document-preview').className='paper tone-'+state.tone;
    $('document-preview').innerHTML=html;
  }
  function validateState(value) {
    if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Неверный формат черновика.');
    const result={};
    for(const [key,defaultValue] of Object.entries(schema)) {
      if(Array.isArray(defaultValue)) {
        if(!Array.isArray(value[key])||value[key].length>60)throw Error('Проверьте список в черновике. Допустимо до 60 пунктов.');
        result[key]=value[key].map(row=>{
          if(!row||typeof row!=='object'||Array.isArray(row))throw Error('Повреждён пункт черновика.');
          const clean={};
          for(const [k,v] of Object.entries(defaultValue[0])) {
            if(typeof row[k]!==typeof v)throw Error('Неверные поля черновика.');
            if(typeof v==='string'&&row[k].length>6000)throw Error('В черновике слишком длинное поле.');
            clean[k]=row[k];
          }
          if(key==='tasks'&&!statusOptions.includes(clean.status))throw Error('Неизвестный статус задачи.');
          return clean;
        });
      } else {
        if(typeof value[key]!=='string'||value[key].length>6000)throw Error('Проверьте текстовые поля черновика.');
        result[key]=value[key];
      }
    }
    if(!['wine','green'].includes(result.tone))throw Error('Неизвестный цвет оформления.');
    return result;
  }
  function readDraft(raw) { const data=JSON.parse(raw); if(data.version!==1||data.kind!==kind)throw Error('Этот файл создан для другого инструмента или имеет неподдерживаемый формат.');return validateState(data.state); }
  function envelope() {return JSON.stringify({version:1,kind,state},null,2);}
  function updateStorageButtons() {
    let exists=false;try{exists=localStorage.getItem(storageKey)!==null;}catch(_){}
    $('restore-draft').disabled=!exists;$('delete-draft').disabled=!exists;
  }
  function replaceState(next,message) {state=clone(next);dirty=false;renderEditor();notify(message);}
  $('template').innerHTML=Object.entries(templates).map(([key,x])=>`<option value="${key}" ${key===initial?'selected':''}>${x.label}</option>`).join('');
  $('apply-template').addEventListener('click',()=>{
    if(dirty&&!window.confirm('Заменить содержимое формы выбранной основой? Несохранённые изменения будут потеряны.'))return;
    replaceState(templates[$('template').value].value,'Основа загружена. Замените примеры и подсказки сведениями вашей компании.');
  });
  $('tool-form').addEventListener('submit',event=>event.preventDefault());
  $('tool-form').addEventListener('input',event=>{
    const target=event.target;
    if(target.dataset.key)state[target.dataset.key]=target.value;
    else if(target.dataset.list)state[target.dataset.list][Number(target.dataset.index)][target.dataset.cell]=target.type==='checkbox'?target.checked:target.value;
    else return;
    dirty=true;renderPreview();
  });
  $('tool-form').addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.add) {
      const list=button.dataset.add;if(state[list].length>=60){notify('В одном документе можно добавить до 60 пунктов каждого типа.');return;}
      state[list].push(list==='tasks'?task():list==='materials'?material():block());
      dirty=true;renderEditor();
      const items=document.querySelectorAll('.repeat-list');const section=[...items].find(x=>x.closest('section').querySelector('[data-add]').dataset.add===list);section?.lastElementChild?.querySelector('input,textarea')?.focus();
    } else if(button.dataset.remove) {
      const list=button.dataset.remove;const i=Number(button.dataset.index);
      if(Object.entries(state[list][i]).some(([k,v])=>typeof v==='string'&&k!=='status'&&v.trim())&&!window.confirm('Удалить этот заполненный пункт?'))return;
      state[list].splice(i,1);dirty=true;renderEditor();
    } else if(button.dataset.move!==undefined) {
      const i=Number(button.dataset.move),j=i+Number(button.dataset.dir);if(j<0||j>=state.blocks.length)return;
      [state.blocks[i],state.blocks[j]]=[state.blocks[j],state.blocks[i]];dirty=true;renderEditor();
    }
  });
  $('save-draft').addEventListener('click',()=>{try{localStorage.setItem(storageKey,envelope());dirty=false;updateStorageButtons();notify('Черновик сохранён в этом браузере. На другом устройстве он не появится.');}catch(_){notify('Не удалось сохранить в браузере. Скачайте черновик файлом.');}});
  $('restore-draft').addEventListener('click',()=>{try{const next=readDraft(localStorage.getItem(storageKey));if(dirty&&!window.confirm('Открыть сохранённый черновик вместо текущего?'))return;replaceState(next,'Сохранённый черновик открыт.');}catch(e){notify('Не удалось открыть черновик: '+e.message);}});
  $('delete-draft').addEventListener('click',()=>{if(!window.confirm('Удалить сохранённый в этом браузере черновик? Текущая форма останется.'))return;try{localStorage.removeItem(storageKey);updateStorageButtons();notify('Сохранённый черновик удалён.');}catch(_){notify('Браузер не разрешил удалить черновик.');}});
  $('export-draft').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([envelope()],{type:'application/json;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=kind==='handover'?'peredacha-del.json':'pamyatka.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Файл черновика подготовлен. Его можно открыть здесь позже.');});
  $('import-open').addEventListener('click',()=> $('import-draft').click());
  $('import-draft').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>700000)throw Error('Файл слишком большой. Допустимо до 700 КБ.');const next=readDraft(await file.text());if(dirty&&!window.confirm('Заменить текущий документ содержимым файла?'))return;replaceState(next,'Черновик из файла открыт.');}catch(e){notify('Не удалось открыть файл: '+e.message);}finally{event.target.value='';}});
  $('copy-text').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('document-preview').innerText);notify('Текст скопирован.');}catch(_){notify('Не удалось скопировать автоматически. Выделите текст в предпросмотре и скопируйте его.');}});
  $('print-document').addEventListener('click',()=>{const old=document.title;document.title=state.title.trim()||'Документ';window.print();document.title=old;});
  $('workspace').hidden=false;renderEditor();updateStorageButtons();
})();
