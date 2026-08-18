(() => {
  'use strict';

  const SESSION_KEY = 'lens-session';
  const SESSION_FIELDS = ['project', 'cable', 'span', 'fiber', 'structure'];
  const COLORS = [
    ['1','Blue','#0057B8',false],['2','Orange','#FF7A00',false],['3','Green','#00843D',false],
    ['4','Brown','#6F4E37',false],['5','Slate','#7C878E',false],['6','White','#F1F1ED',true],
    ['7','Red','#D22630',false],['8','Black','#191919',false],['9','Yellow','#F3D03E',true],
    ['10','Violet','#6338A5',false],['11','Rose','#D25B73',false],['12','Aqua','#00A6A6',false]
  ];
  const TOOL_LABELS = {
    otdr:'OTDR Note Maker', results:'Results Corrector', distance:'Distance Converter',
    ribbon:'Fiber Ribbon Finder', loss:'Fiber Loss Calculator', fire:'ACE Fire Tool'
  };

  const $ = id => document.getElementById(id);
  let toastTimer = null;

  function toast(message){
    const el = $('toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2100);
  }

  function blankSession(){
    return SESSION_FIELDS.reduce((out, key) => { out[key] = ''; return out; }, {});
  }

  function readSession(){
    const out = blankSession();
    try {
      const raw = JSON.parse(localStorage.getItem(SESSION_KEY) || '{}');
      SESSION_FIELDS.forEach(key => { if (typeof raw[key] === 'string') out[key] = raw[key]; });
    } catch (_) {}
    return out;
  }

  function writeSession(next){
    const safe = blankSession();
    SESSION_FIELDS.forEach(key => safe[key] = String(next[key] || '').trim());
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(safe)); } catch (_) {}
    window.dispatchEvent(new CustomEvent('lens:session-change', { detail: safe }));
    return safe;
  }

  function hasContext(session){ return SESSION_FIELDS.some(key => session[key]); }
  function display(value){ return value || '—'; }

  function refreshWorkbench(){
    const s = readSession();
    const active = hasContext(s);
    const metaParts = [s.structure, s.cable && `Cable ${s.cable}`, s.span && `Span ${s.span}`, s.fiber && `Fiber ${s.fiber}`].filter(Boolean);

    $('sessionStatus').textContent = active ? 'ACTIVE' : 'READY';
    $('workbarSessionBadge').textContent = active ? 'SESSION ACTIVE' : 'READY';
    $('workbarProject').textContent = s.project || 'No active work';
    $('workbarMeta').textContent = active ? (metaParts.join('  •  ') || 'Active field context loaded') : 'Set project context when you need the connected workflow.';
    $('projectHeading').textContent = s.project || 'No active project';
    $('projectMeta').textContent = active ? (metaParts.join('  •  ') || 'Active field context loaded') : 'Set job context in Workspace when you want tools linked together.';

    $('ctxProject').textContent = display(s.project);
    $('ctxCable').textContent = display(s.cable);
    $('ctxSpan').textContent = display(s.span);
    $('ctxFiber').textContent = display(s.fiber);
    $('ctxStructure').textContent = display(s.structure);

    $('recentProject').textContent = s.project || 'No active session';
    $('recentMeta').textContent = active ? (metaParts.slice(0,3).join('  •  ') || 'Current work context') : 'Your active job will appear here.';

    SESSION_FIELDS.forEach(key => {
      const input = $(`ws${key[0].toUpperCase()}${key.slice(1)}`);
      if (input && document.activeElement !== input) input.value = s[key];
    });
  }

  function setWorkbench(open){
    const toggle = $('workbarToggle');
    const drawer = $('workbenchDrawer');
    toggle.setAttribute('aria-expanded', String(open));
    drawer.hidden = !open;
    if (open) requestAnimationFrame(() => drawer.scrollIntoView({ block:'nearest', behavior:'smooth' }));
  }

  function showView(name){
    document.querySelectorAll('[data-view-panel]').forEach(panel => panel.classList.toggle('is-active', panel.dataset.viewPanel === name));
    document.querySelectorAll('[data-view]').forEach(button => {
      const on = button.dataset.view === name;
      button.classList.toggle('is-active', on);
      if (button.classList.contains('rail-item')) {
        if (on) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
      }
    });
    if (name !== 'home') setWorkbench(false);
    window.scrollTo({ top:0, behavior:'instant' });
  }

  function saveWorkspace(){
    const next = {};
    SESSION_FIELDS.forEach(key => {
      const input = $(`ws${key[0].toUpperCase()}${key.slice(1)}`);
      next[key] = input ? input.value : '';
    });
    writeSession(next);
    refreshWorkbench();
    showView('home');
    setWorkbench(true);
    toast('Work context saved');
  }

  function clearWorkspace(){
    writeSession(blankSession());
    refreshWorkbench();
    toast('Work context cleared');
  }

  function openLegacyTool(tool){
    const label = TOOL_LABELS[tool] || 'Tool';
    toast(`${label} is staged for live routing in the next v5 migration pass`);
  }

  function sendToWaldo(){
    const s = readSession();
    if (!s.project) {
      toast('Add a Project Code first');
      showView('workspace');
      $('wsProject').focus();
      return;
    }
    const url = `waldoprod://findItems/?searchCategory=${encodeURIComponent('Project Number')}&searchString=${encodeURIComponent(s.project)}`;
    const a = document.createElement('a');
    a.href = url;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast('Opening Waldo by Project Number');
  }

  function buildFiberStrip(){
    const strip = $('fiberStrip');
    COLORS.forEach(([n,name,color,light]) => {
      const item = document.createElement('div');
      item.className = `fiber-color${light ? ' light' : ''}`;
      item.style.background = color;
      item.innerHTML = `<b>${n}</b><span>${name}</span>`;
      strip.appendChild(item);
    });
  }

  function cloneToolGrid(){
    const source = document.querySelector('.quick-grid');
    const target = document.querySelector('.full-grid');
    source.querySelectorAll('.tool-card').forEach(card => target.appendChild(card.cloneNode(true)));
  }

  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => showView(button.dataset.view)));
  document.querySelectorAll('[data-view-jump]').forEach(button => button.addEventListener('click', () => showView(button.dataset.viewJump)));
  document.querySelectorAll('[data-tool-action]').forEach(button => button.addEventListener('click', () => openLegacyTool(button.dataset.toolAction)));

  $('workbarToggle').addEventListener('click', () => setWorkbench($('workbarToggle').getAttribute('aria-expanded') !== 'true'));
  $('drawerClose').addEventListener('click', event => { event.stopPropagation(); setWorkbench(false); });
  $('saveWorkspaceBtn').addEventListener('click', saveWorkspace);
  $('clearWorkspaceBtn').addEventListener('click', clearWorkspace);
  $('sendWaldoBtn').addEventListener('click', sendToWaldo);
  $('currentSessionCard').addEventListener('click', () => setWorkbench(true));

  cloneToolGrid();
  document.querySelectorAll('.full-grid [data-tool-action]').forEach(button => button.addEventListener('click', () => openLegacyTool(button.dataset.toolAction)));

  window.addEventListener('storage', event => { if (event.key === SESSION_KEY) refreshWorkbench(); });
  window.addEventListener('lens:session-change', refreshWorkbench);

  buildFiberStrip();
  refreshWorkbench();
  setWorkbench(false);
})();
