(() => {
  'use strict';

  const KEY = 'lens-tether-history';
  const SESSION_KEY = 'lens-session';
  const TAIL_PREF_KEY = 'lens-tether-tail-included';
  const $ = id => document.getElementById(id);
  let unit = 'ft';
  let plant = 'Buried';
  let tailIncluded = localStorage.getItem(TAIL_PREF_KEY) === 'yes';
  let current = null;
  let toastTimer = null;

  const hints = {
    Buried: '<strong>Buried check:</strong> compare this footage with handholes, pedestals, splice points, slack locations, bore/road crossings, recent excavation, and crush/kink zones. Actual cable footage can be longer than straight-line or map distance.',
    Aerial: '<strong>Aerial check:</strong> compare this footage with pole spans, splice cases, slack storage, terminal locations, and major bends or transitions.',
    Mixed: '<strong>Mixed-plant check:</strong> pay extra attention to buried/aerial transitions, handholes, pole risers, splice cases, and slack where route footage can change abruptly.'
  };

  function n(id){
    const v = parseFloat($(id).value);
    return Number.isFinite(v) ? v : 0;
  }

  function fmt(v, u = unit){
    const digits = u === 'kft' ? 3 : 1;
    return `${Number(v).toLocaleString(undefined,{maximumFractionDigits:digits})} ${u}`;
  }

  function secondary(v){
    const converted = unit === 'ft' ? v / 1000 : v * 1000;
    return unit === 'ft' ? `≈ ${fmt(converted,'kft')}` : `≈ ${fmt(converted,'ft')}`;
  }

  function directionLabel(){
    return $('direction').value === 'field-terminal' ? 'Field → Terminal' : 'Terminal → Field';
  }

  function toast(message){
    const el = $('toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
  }

  function error(message){
    $('error').textContent = message;
    $('error').hidden = !message;
  }

  function setUnit(next){
    unit = next === 'kft' ? 'kft' : 'ft';
    document.querySelectorAll('[data-unit]').forEach(b => b.classList.toggle('is-active', b.dataset.unit === unit));
  }

  function setPlant(next){
    plant = next;
    document.querySelectorAll('[data-plant]').forEach(b => b.classList.toggle('is-active', b.dataset.plant === plant));
  }

  function setTailIncluded(next, persist = true){
    tailIncluded = next === true || next === 'yes';
    document.querySelectorAll('[data-tail-included]').forEach(b => b.classList.toggle('is-active', (b.dataset.tailIncluded === 'yes') === tailIncluded));
    if(persist) localStorage.setItem(TAIL_PREF_KEY, tailIncluded ? 'yes' : 'no');
  }

  function updateDirectionUI(){
    const reverse = $('direction').value === 'field-terminal';
    $('tailPath').hidden = !reverse;
    $('directionCaution').hidden = true;
  }

  function calculate(){
    error('');
    const measured = n('measured');
    const cord = n('cord');
    const tail = n('tail');
    const direction = $('direction').value;
    const useTail = direction === 'terminal-field' ? true : tailIncluded;
    const effectiveTail = useTail ? tail : 0;

    if(measured <= 0){ error('Enter the measured tester distance first.'); $('measured').focus(); return; }
    if(cord < 0 || tail < 0){ error('Cord and tail distances cannot be negative.'); return; }
    const corrected = measured - cord - effectiveTail;
    if(corrected < 0){ error('The included cord/tail footage is longer than the measured distance. Check the inputs.'); return; }

    const removedText = useTail ? 'tester cord and terminal tail' : 'tester cord only; terminal tail excluded from this trace';
    const phrase = direction === 'terminal-field'
      ? `The event is approximately <strong>${fmt(corrected)}</strong> beyond the terminal into the field route after removing the known tester cord and terminal tail.`
      : `The corrected event distance is approximately <strong>${fmt(corrected)}</strong> along the measured path toward the terminal after removing the ${removedText}.`;

    $('resultDistance').textContent = fmt(corrected);
    $('resultSecondary').textContent = secondary(corrected);
    $('resultPhrase').innerHTML = phrase;
    $('bMeasured').textContent = fmt(measured);
    $('bCord').textContent = fmt(cord);
    $('bTail').textContent = useTail ? fmt(tail) : `${fmt(0)} · OUT`;
    $('bPlant').textContent = fmt(corrected);
    $('fieldNote').innerHTML = hints[plant];

    const refDistanceRaw = $('refDistance').value.trim();
    const refDistance = parseFloat(refDistanceRaw);
    const refLabel = $('refLabel').value.trim() || 'reference point';
    if(direction === 'terminal-field' && refDistanceRaw && Number.isFinite(refDistance) && refDistance >= 0){
      const delta = corrected - refDistance;
      let text;
      if(Math.abs(delta) < 0.05) text = `The corrected event lands essentially at <strong>${escapeHtml(refLabel)}</strong> (${fmt(refDistance)} from the terminal).`;
      else if(delta > 0) text = `The corrected event is approximately <strong>${fmt(Math.abs(delta))} beyond ${escapeHtml(refLabel)}</strong>, using ${fmt(refDistance)} as that point's distance from the terminal.`;
      else text = `The corrected event is approximately <strong>${fmt(Math.abs(delta))} before ${escapeHtml(refLabel)}</strong>, using ${fmt(refDistance)} as that point's distance from the terminal.`;
      $('referenceResult').innerHTML = text;
      $('referenceResult').hidden = false;
    } else if(direction === 'field-terminal' && refDistanceRaw){
      $('referenceResult').textContent = 'Reference comparison skipped in Field → Terminal mode because this reference is measured from the terminal origin.';
      $('referenceResult').hidden = false;
    } else $('referenceResult').hidden = true;

    $('directionCaution').hidden = direction !== 'field-terminal';
    $('directionCaution').textContent = useTail
      ? 'Field → Terminal: terminal tail is INCLUDED because you marked it as part of this measured optical path.'
      : 'Field → Terminal: terminal tail is NOT subtracted because you marked it outside this measured optical path.';

    current = {
      id: String(Date.now()), ts: Date.now(), measured, cord, tail, tailIncluded: useTail, corrected, unit, plant,
      direction, directionLabel: directionLabel(), refLabel: $('refLabel').value.trim(),
      refDistance: Number.isFinite(refDistance) ? refDistance : null
    };
    $('resultPanel').hidden = false;
    $('resultPanel').scrollIntoView({behavior:'smooth',block:'start'});
  }

  function escapeHtml(value){
    return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function readHistory(){
    try { const x = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(x) ? x : []; }
    catch (_) { return []; }
  }

  function writeHistory(entries){
    localStorage.setItem(KEY, JSON.stringify(entries.slice(0, 12)));
    window.dispatchEvent(new CustomEvent('lens:tether-history'));
  }

  function saveCurrent(){
    if(!current){ toast('Calculate a distance first'); return; }
    const entries = readHistory().filter(e => e.id !== current.id);
    entries.unshift(current);
    writeHistory(entries);
    renderHistory();
    toast('Tether-Tinker result saved');
  }

  function copyCurrent(){
    if(!current){ toast('Calculate a distance first'); return; }
    const tailLine = current.direction === 'field-terminal' && !current.tailIncluded
      ? `Terminal tail: ${fmt(current.tail,current.unit)} (not in measured path; not subtracted)`
      : `Terminal tail: ${fmt(current.tail,current.unit)} (subtracted)`;
    const lines = [
      `Tether-Tinker — ${current.plant} / ${current.directionLabel}`,
      `Measured: ${fmt(current.measured,current.unit)}`,
      `Tester cord: ${fmt(current.cord,current.unit)}`,
      tailLine,
      `Estimated plant location: ${fmt(current.corrected,current.unit)}`
    ];
    if(current.refDistance != null) lines.push(`Reference: ${current.refLabel || 'Reference'} @ ${fmt(current.refDistance,current.unit)}`);
    const text = lines.join('\n');
    if(navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => toast('Result copied')).catch(() => fallbackCopy(text));
    else fallbackCopy(text);
  }

  function fallbackCopy(text){
    const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText='position:fixed;opacity:0';
    document.body.appendChild(ta); ta.select(); try{document.execCommand('copy'); toast('Result copied');}catch(_){toast('Copy failed');} ta.remove();
  }

  function loadEntry(entry){
    if(!entry) return;
    setUnit(entry.unit === 'kft' ? 'kft' : 'ft'); setPlant(entry.plant || 'Buried');
    $('measured').value = entry.measured ?? '';
    $('cord').value = entry.cord ?? '';
    $('tail').value = entry.tail ?? '';
    $('direction').value = entry.direction || 'terminal-field';
    if($('direction').value === 'field-terminal') setTailIncluded(entry.tailIncluded === true, false);
    $('refLabel').value = entry.refLabel || '';
    $('refDistance').value = entry.refDistance ?? '';
    updateDirectionUI();
    calculate();
    current.id = entry.id || String(Date.now());
    current.ts = entry.ts || Date.now();
  }

  function renderHistory(){
    const host = $('historyList');
    const entries = readHistory();
    if(!entries.length){ host.innerHTML = '<div class="empty">No saved results yet.</div>'; return; }
    host.innerHTML = entries.map(e => `<button class="history-item" type="button" data-load="${escapeHtml(e.id)}"><span><strong>${escapeHtml(e.plant || 'Plant')} · ${escapeHtml(e.directionLabel || 'Terminal → Field')}</strong><small>${new Date(e.ts).toLocaleString()} · ${fmt(e.measured,e.unit === 'kft' ? 'kft' : 'ft')} measured</small></span><b>${fmt(e.corrected,e.unit === 'kft' ? 'kft' : 'ft')}</b></button>`).join('');
    host.querySelectorAll('[data-load]').forEach(btn => btn.addEventListener('click', () => loadEntry(entries.find(e => e.id === btn.dataset.load))));
  }

  function reset(){
    ['measured','cord','tail','refLabel','refDistance'].forEach(id => $(id).value = '');
    $('direction').value = 'terminal-field'; setUnit('ft'); setPlant('Buried'); updateDirectionUI(); current = null; error(''); $('resultPanel').hidden = true; $('measured').focus();
  }

  function loadJob(){
    try {
      const s = JSON.parse(localStorage.getItem(SESSION_KEY) || '{}');
      const bits = [s.project, s.cable, s.structure].filter(Boolean);
      if(bits.length) $('jobPill').textContent = bits.join(' · ');
    } catch (_) {}
  }

  document.querySelectorAll('[data-unit]').forEach(b => b.addEventListener('click', () => setUnit(b.dataset.unit)));
  document.querySelectorAll('[data-plant]').forEach(b => b.addEventListener('click', () => setPlant(b.dataset.plant)));
  document.querySelectorAll('[data-tail-included]').forEach(b => b.addEventListener('click', () => setTailIncluded(b.dataset.tailIncluded)));
  $('direction').addEventListener('change', updateDirectionUI);
  $('calculateBtn').addEventListener('click', calculate);
  $('saveBtn').addEventListener('click', saveCurrent);
  $('copyBtn').addEventListener('click', copyCurrent);
  $('resetBtn').addEventListener('click', reset);
  $('clearHistoryBtn').addEventListener('click', () => { if(confirm('Clear saved Tether-Tinker results?')){ writeHistory([]); renderHistory(); toast('Tether history cleared'); } });
  ['measured','cord','tail','refDistance'].forEach(id => $(id).addEventListener('keydown', e => { if(e.key === 'Enter') calculate(); }));

  setTailIncluded(tailIncluded, false);
  updateDirectionUI();
  loadJob();
  renderHistory();
  const loadId = new URLSearchParams(location.search).get('load');
  if(loadId) loadEntry(readHistory().find(e => e.id === loadId));
})();
