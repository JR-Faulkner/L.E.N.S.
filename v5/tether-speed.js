(() => {
  'use strict';

  const PREF_KEY = 'lens-tether-speed-prefs';
  const PRESET_KEY = 'lens-tether-speed-presets';
  const $ = id => document.getElementById(id);

  function readJSON(key, fallback){
    try {
      const value = JSON.parse(localStorage.getItem(key) || '');
      return value && typeof value === 'object' ? value : fallback;
    } catch (_) { return fallback; }
  }

  function prefs(){ return readJSON(PREF_KEY, {unit:'ft', plant:'Buried'}); }
  function presets(){ return readJSON(PRESET_KEY, {cord:[], tail:[]}); }

  function savePrefs(next){
    localStorage.setItem(PREF_KEY, JSON.stringify({...prefs(), ...next}));
  }

  function remember(kind, value){
    const n = Number(value);
    if(!Number.isFinite(n) || n <= 0) return;
    const data = presets();
    const list = Array.isArray(data[kind]) ? data[kind] : [];
    data[kind] = [n, ...list.filter(v => Number(v) !== n)].slice(0,3);
    localStorage.setItem(PRESET_KEY, JSON.stringify(data));
    renderPresets();
  }

  function fmt(v){
    const p = prefs();
    const digits = p.unit === 'kft' ? 3 : 1;
    return Number(v).toLocaleString(undefined,{maximumFractionDigits:digits});
  }

  function makePresetRow(inputId, kind, label){
    const input = $(inputId);
    if(!input) return;
    const field = input.closest('.field');
    if(!field || field.querySelector(`[data-presets="${kind}"]`)) return;
    const row = document.createElement('div');
    row.className = 'speed-presets';
    row.dataset.presets = kind;
    row.innerHTML = `<span>${label}</span><div></div>`;
    field.appendChild(row);
  }

  function renderPresets(){
    const data = presets();
    ['cord','tail'].forEach(kind => {
      const row = document.querySelector(`[data-presets="${kind}"]`);
      if(!row) return;
      const host = row.querySelector('div');
      const values = Array.isArray(data[kind]) ? data[kind] : [];
      row.hidden = !values.length;
      host.innerHTML = '';
      values.forEach(value => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'speed-preset';
        btn.textContent = fmt(value);
        btn.addEventListener('click', () => {
          $(kind).value = value;
          $(kind).focus();
        });
        host.appendChild(btn);
      });
    });
  }

  function applyPrefs(){
    const p = prefs();
    const unit = p.unit === 'kft' ? 'kft' : 'ft';
    const plant = ['Buried','Aerial','Mixed'].includes(p.plant) ? p.plant : 'Buried';
    const unitButton = document.querySelector(`[data-unit="${unit}"]`);
    const plantButton = document.querySelector(`[data-plant="${plant}"]`);
    if(unitButton && !unitButton.classList.contains('is-active')) unitButton.click();
    if(plantButton && !plantButton.classList.contains('is-active')) plantButton.click();
  }

  function install(){
    const style = document.createElement('style');
    style.textContent = `.speed-presets{display:flex;align-items:center;gap:6px;min-height:26px;margin-top:2px}.speed-presets[hidden]{display:none}.speed-presets>span{color:#66757f;font-size:.48rem;font-weight:900;letter-spacing:.06em}.speed-presets>div{display:flex;gap:5px;min-width:0}.speed-preset{min-height:26px;padding:3px 7px;border:1px solid #314049;border-radius:6px;background:#0b1217;color:#9fded4;font-size:.53rem;font-weight:900}.speed-preset:active{transform:translateY(1px)}`;
    document.head.appendChild(style);

    makePresetRow('cord','cord','RECENT');
    makePresetRow('tail','tail','RECENT');

    document.querySelectorAll('[data-unit]').forEach(btn => btn.addEventListener('click', () => {
      savePrefs({unit: btn.dataset.unit === 'kft' ? 'kft' : 'ft'});
      setTimeout(renderPresets,0);
    }));
    document.querySelectorAll('[data-plant]').forEach(btn => btn.addEventListener('click', () => savePrefs({plant:btn.dataset.plant})));

    $('calculateBtn')?.addEventListener('click', () => {
      remember('cord', $('cord')?.value);
      remember('tail', $('tail')?.value);
    }, true);

    applyPrefs();
    renderPresets();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();