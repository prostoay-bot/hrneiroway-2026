(() => {
  'use strict';
  if (window.hrSiteAnalytics) return;
  const counter = 111505107;
  const storageKey = 'hrneiroway-analytics-choice-v1';
  const isLegalPage = location.pathname === '/privacy.html';
  const isProduction = ['hrneiroway.ru', 'www.hrneiroway.ru'].includes(location.hostname);
  const allowedChoices = ['accepted', 'declined'];
  const safeUrl = value => {
    try { const url = new URL(value); return url.origin + url.pathname; }
    catch (_) { return ''; }
  };
  const readChoice = () => {
    try { const value = localStorage.getItem(storageKey); return allowedChoices.includes(value) ? value : null; }
    catch (_) { return null; }
  };
  let choice = readChoice();
  let started = false;
  let panel;
  let settingsButton;
  let returnFocus;

  function startAnalytics() {
    if (choice !== 'accepted' || started || isLegalPage || !isProduction) return;
    started = true;
    window['disableYaCounter' + counter] = false;
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = Date.now();
    window.ym(counter, 'init', {
      webvisor: false, clickmap: false, trackLinks: false, trackHash: false,
      ecommerce: false, accurateTrackBounce: true, sendTitle: false, disableYtm: true,
      url: safeUrl(location.href), referrer: safeUrl(document.referrer)
    });
    if (!document.querySelector('script[data-hr-metrika]')) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://mc.yandex.ru/metrika/tag.js?id=' + counter;
      script.setAttribute('data-hr-metrika', '');
      document.head.append(script);
    }
  }

  function setChoice(value, reloadAfter = true) {
    if (!allowedChoices.includes(value)) return;
    const wasStarted = started;
    choice = value;
    try { localStorage.setItem(storageKey, value); } catch (_) { /* Choice still applies in this tab. */ }
    panel.hidden = true;
    settingsButton.setAttribute('aria-expanded', 'false');
    if (returnFocus?.isConnected) returnFocus.focus({preventScroll: true});
    if (choice === 'accepted') startAnalytics();
    else if (wasStarted) {
      window['disableYaCounter' + counter] = true;
      if (typeof window.ym === 'function') window.ym(counter, 'destruct');
      started = false;
      if (reloadAfter) location.reload();
    }
  }

  // Only fixed event names and categories; never collect field values or link URLs.
  function goal(name, category) {
    if (choice !== 'accepted' || !started || typeof window.ym !== 'function') return;
    const names = ['contact_click', 'project_open', 'tool_export'];
    const categories = ['telegram', 'email', 'max', 'whatsapp', 'vk', 'instagram', 'pinterest', 'phone', 'portfolio', 'print', 'download', 'copy'];
    if (!names.includes(name) || !categories.includes(category)) return;
    window.ym(counter, 'reachGoal', name, {category, page: location.pathname});
  }

  function makeInterface() {
    panel = document.createElement('section');
    panel.className = 'hr-analytics-panel';
    panel.setAttribute('aria-labelledby', 'hr-analytics-title');
    panel.setAttribute('aria-describedby', 'hr-analytics-description');
    panel.hidden = !!choice;
    panel.innerHTML = '<h2 id="hr-analytics-title">Помочь сделать сайт удобнее?</h2><p id="hr-analytics-description">С вашего разрешения Яндекс Метрика учитывает посещения и нажатия на кнопки. Запись экрана и полей отключена. Без аналитики сайт тоже работает.</p><div class="hr-analytics-actions"><button type="button" data-analytics-choice="accepted">Разрешить аналитику</button><button type="button" data-analytics-choice="declined">Без аналитики</button><a href="/privacy.html#cookies">Подробнее</a></div>';
    settingsButton = document.createElement('button');
    settingsButton.type = 'button';
    settingsButton.className = 'hr-analytics-settings';
    settingsButton.textContent = 'Настройки аналитики';
    settingsButton.setAttribute('aria-controls', 'hr-analytics-panel');
    settingsButton.setAttribute('aria-expanded', String(!choice));
    panel.id = 'hr-analytics-panel';
    const main = document.querySelector('main');
    if (main) main.after(settingsButton); else document.body.append(settingsButton);
    document.body.append(panel);
    settingsButton.addEventListener('click', () => {
      returnFocus = settingsButton;
      panel.hidden = !panel.hidden;
      settingsButton.setAttribute('aria-expanded', String(!panel.hidden));
      if (!panel.hidden) panel.querySelector('button').focus({preventScroll: true});
    });
    panel.addEventListener('click', event => {
      const button = event.target.closest('[data-analytics-choice]');
      if (button) setChoice(button.getAttribute('data-analytics-choice'));
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !panel.hidden) {
        if (!choice) setChoice('declined');
        else { panel.hidden = true; settingsButton.setAttribute('aria-expanded', 'false'); returnFocus?.focus({preventScroll:true}); }
      }
    });
    window.addEventListener('storage', event => {
      if (event.key !== storageKey && event.key !== null) return;
      const next = readChoice();
      if (next) setChoice(next);
      else {
        if (started) { window['disableYaCounter' + counter] = true; window.ym?.(counter, 'destruct'); location.reload(); return; }
        choice = null; panel.hidden = false; settingsButton.setAttribute('aria-expanded','true');
      }
    });
  }

  document.addEventListener('click', event => {
    const target = event.target.closest('a,button');
    if (!target || target.closest('.hr-analytics-panel')) return;
    if (target.matches('a[href]')) {
      let url;
      try { url = new URL(target.getAttribute('href'), location.href); } catch (_) { return; }
      const host = url.hostname.toLowerCase();
      let category;
      if (url.protocol === 'mailto:') category = 'email';
      else if (url.protocol === 'tel:') category = 'phone';
      else if (host === 't.me' && url.pathname.toLowerCase() === '/marina_x6') category = 'telegram';
      else if (host === 'max.ru') category = 'max';
      else if (['wa.me','api.whatsapp.com'].includes(host)) category = 'whatsapp';
      else if (['vk.ru','vk.com'].includes(host)) category = 'vk';
      else if (['instagram.com','www.instagram.com'].includes(host)) category = 'instagram';
      else if (host === 'pinterest.com' || host.endsWith('.pinterest.com')) category = 'pinterest';
      if (category) { goal('contact_click',category); return; }
    }
    if (target.matches('[data-project],[data-preview],[data-photo],[data-gallery-open],[data-pdf-open],[data-project-tab],.project-link') || target.closest('[data-portfolio-card]') || /^(gallery-|kasper-dialog$|constructor-dialog$)/.test(target.getAttribute('data-dialog-open') || '')) goal('project_open','portfolio');
    if (['print-document','printBtn'].includes(target.id)) goal('tool_export','print');
    else if (['export-draft','downloadBtn'].includes(target.id)) goal('tool_export','download');
    else if (['copy-text','copyBtn'].includes(target.id)) goal('tool_export','copy');
  }, true);

  makeInterface();
  startAnalytics();
  window.hrSiteAnalytics = Object.freeze({getChoice: () => choice});
})();
