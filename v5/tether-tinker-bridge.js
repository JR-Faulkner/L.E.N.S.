(() => {
  'use strict';

  const KEY = 'lens-tether-history';
  const ACCENT = '#45e0c5';

  function loadUpdate30Assets(){
    if(!document.querySelector('link[data-lens-theme-system]')){
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'theme-system.css';
      link.dataset.lensThemeSystem = '30';
      document.head.appendChild(link);
    }
    if(!document.querySelector('script[data-lens-theme-system]')){
      const script = document.createElement('script');
      script.src = 'theme-system.js';
      script.dataset.lensThemeSystem = '30';
      document.body.appendChild(script);
    }
    if(!document.querySelector('script[data-tool-organization]')){
      const script = document.createElement('script');
      script.src = 'tool-organization.js';
      script.dataset.toolOrganization = '30';
      document.body.appendChild(script);
    }
  }

  function icon(){
    return `<span class="tool-icon" aria-hidden="true"><svg viewBox="0 0 64 48"><path d="M11 15h15l7 9-7 9H11L4 24z"/><path d="M53 15H38l-7 9 7 9h15l7-9z"/><path d="M24 24h16"/><path d="M14 9v6M14 33v6M50 9v6M50 33v6"/></svg></span>`;
  }

  function cardMarkup(){
    return `<button class="tool-card tool-tether" style="--tool:${ACCENT}" type="button" data-native-tool="tether" data-tool-action="tether" aria-label="Open Tether-Tinker">${icon()}<span class="tool-copy"><strong>Tether-Tinker</strong><small>Terminal / tail distance solver</small></span><span class="tool-arrow">›</span></button>`;
  }

  function installCard(grid){
    if(!grid || grid.querySelector('[data-native-tool="tether"]')) return;
    grid.insertAdjacentHTML('beforeend', cardMarkup());
  }

  function readHistory(){
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(data) ? data : [];
    } catch (_) { return []; }
  }

  function fmt(v, unit){
    if(!Number.isFinite(Number(v))) return '—';
    const n = Number(v);
    const digits = unit === 'kft' ? 3 : 1;
    return `${n.toLocaleString(undefined,{maximumFractionDigits:digits})} ${unit || 'ft'}`;
  }

  function renderRecents(){
    const host = document.getElementById('recentSessions');
    if(!host) return;
    host.querySelectorAll('[data-tether-recent]').forEach(el => el.remove());
    const entries = readHistory().slice(0, 2);
    entries.reverse().forEach(entry => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'recent-card current';
      btn.dataset.tetherRecent = entry.id;
      btn.dataset.toolAction = 'tether';
      btn.dataset.toolQuery = `load=${encodeURIComponent(entry.id)}`;
      btn.style.borderColor = 'rgba(69,224,197,.42)';
      btn.innerHTML = `<span class="recent-icon" style="color:${ACCENT}">⌁</span><span><strong>Tether-Tinker · ${fmt(entry.corrected, entry.unit)}</strong><small>${entry.plant || 'Plant'} · ${entry.directionLabel || 'Terminal → Field'}</small></span>`;
      host.prepend(btn);
    });
  }

  function install(){
    const toolsCopy = document.querySelector('#view-tools .page-heading > p:last-child');
    if(toolsCopy) toolsCopy.textContent = 'Seven field utilities, one Tool Belt.';
    installCard(document.querySelector('.quick-grid'));
    installCard(document.querySelector('.full-grid'));
    renderRecents();
    loadUpdate30Assets();

    const full = document.querySelector('.full-grid');
    if(full){
      const mo = new MutationObserver(() => installCard(full));
      mo.observe(full,{childList:true});
      setTimeout(() => mo.disconnect(), 2500);
    }
  }

  window.addEventListener('storage', e => { if(e.key === KEY) renderRecents(); });
  window.addEventListener('lens:tether-history', renderRecents);
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();