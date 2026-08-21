(() => {
  'use strict';

  const KEY = 'lens-theme';
  const THEMES = {
    foundry: { name:'Foundry Ember', note:'Dark steel + ember orange', swatch:'#ff7900' },
    redline: { name:'Redline', note:'Black + forged red', swatch:'#ff3b3b' },
    circuit: { name:'Circuit Lime', note:'Black + light green', swatch:'#9dfc53' },
    aqua: { name:'Aqua Core', note:'Black + aqua', swatch:'#25d9e8' }
  };

  function readTheme(){
    const saved = localStorage.getItem(KEY);
    return THEMES[saved] ? saved : 'foundry';
  }

  function applyTheme(key, persist = true){
    const next = THEMES[key] ? key : 'foundry';
    document.documentElement.dataset.lensTheme = next;
    if(persist) localStorage.setItem(KEY, next);
    document.querySelectorAll('[data-theme-choice]').forEach(btn => btn.classList.toggle('is-active', btn.dataset.themeChoice === next));
    const current = document.getElementById('themeCurrent');
    if(current) current.textContent = THEMES[next].name.toUpperCase();
    const legacyStatus = document.querySelector('#view-settings .status-list > div:first-child strong');
    if(legacyStatus) legacyStatus.textContent = THEMES[next].name.toUpperCase();
    window.dispatchEvent(new CustomEvent('lens:theme-change', {detail:{theme:next}}));
  }

  function installMarkHook(){
    const banner = document.querySelector('.brand-banner');
    const brand = document.querySelector('.brand-copy');
    if(!banner || !brand || banner.querySelector('.foundry-mark-host')) return;
    const host = document.createElement('div');
    host.className = 'foundry-mark-host';
    host.setAttribute('aria-label','Faulkner Foundry mark');
    const img = document.createElement('img');
    img.alt = '';
    img.hidden = true;
    img.src = '../assets/branding/faulkner-foundry-mark.svg';
    img.addEventListener('load', () => { img.hidden = false; host.classList.add('has-mark'); });
    img.addEventListener('error', () => { img.hidden = true; host.classList.remove('has-mark'); });
    host.appendChild(img);
    banner.insertBefore(host, brand);
  }

  function installPicker(){
    const settings = document.getElementById('view-settings');
    if(!settings || settings.querySelector('.theme-panel')) return;
    const offline = settings.querySelector('.offline-library');
    const panel = document.createElement('section');
    panel.className = 'theme-panel';
    panel.innerHTML = `
      <div class="theme-panel__head">
        <div><p class="eyebrow">FOUNDRY SHELL</p><h2>Color Theme</h2><p>Changes the L.E.N.S. workstation shell while each field tool keeps its own identity color.</p></div>
        <span class="theme-current" id="themeCurrent"></span>
      </div>
      <div class="theme-grid">
        ${Object.entries(THEMES).map(([key,t]) => `<button class="theme-choice" type="button" data-theme-choice="${key}" style="--swatch:${t.swatch}"><span class="theme-choice__swatch" aria-hidden="true"></span><span><strong>${t.name}</strong><small>${t.note}</small></span></button>`).join('')}
      </div>
      <div class="theme-mark-note"><b>Foundry mark:</b> banner hook is wired to <code>assets/branding/faulkner-foundry-mark.svg</code>. It stays hidden until the approved standalone asset is added, so L.E.N.S. never substitutes an imitation mark.</div>`;
    if(offline) settings.insertBefore(panel, offline); else settings.appendChild(panel);
    panel.querySelectorAll('[data-theme-choice]').forEach(btn => btn.addEventListener('click', () => applyTheme(btn.dataset.themeChoice)));
    applyTheme(readTheme(), false);
  }

  function install(){
    installMarkHook();
    installPicker();
    applyTheme(readTheme(), false);
  }

  window.addEventListener('storage', e => { if(e.key === KEY) applyTheme(readTheme(), false); });
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
