(() => {
  'use strict';

  const TOOL_MAP = {
    otdr:     { label: 'OTDR Note Maker', accent: '#ff443d' },
    results:  { label: 'Results Corrector', accent: '#6fe83a' },
    distance: { label: 'Distance Converter', accent: '#18c9ff' },
    ribbon:   { label: 'Fiber Ribbon Finder', accent: '#a65cff' },
    loss:     { label: 'Fiber Loss Calculator', accent: '#ffc928' },
    fire:     { label: 'ACE Fire Tool', accent: '#ff7a18' },
    tether:   { label: 'Tether-Tinker', accent: '#45e0c5', native: true, src: 'tether-tinker.html' }
  };

  let activeTool = null;
  let previousView = 'home';
  let runner = null;
  let frame = null;
  let loading = null;

  function getActiveView(){
    const panel = document.querySelector('[data-view-panel].is-active');
    return panel ? panel.dataset.viewPanel : 'home';
  }

  function setNavForRunner(on){
    document.querySelectorAll('[data-view]').forEach(btn => {
      if(on){
        const active = btn.dataset.view === 'tools';
        btn.classList.toggle('is-active', active);
        if(btn.classList.contains('rail-item')){
          if(active) btn.setAttribute('aria-current','page');
          else btn.removeAttribute('aria-current');
        }
      }
    });
  }

  function buildRunner(){
    if(document.getElementById('toolRunner')) return;
    const stage = document.querySelector('.stage');
    if(!stage) return;

    runner = document.createElement('section');
    runner.id = 'toolRunner';
    runner.className = 'tool-runner';
    runner.setAttribute('aria-live','polite');
    runner.innerHTML = `
      <div class="tool-runner__bar">
        <button class="tool-runner__back" id="toolRunnerBack" type="button">‹ TOOLS</button>
        <div class="tool-runner__title"><small>LIVE FIELD TOOL</small><strong id="toolRunnerTitle">Tool</strong></div>
        <button class="tool-runner__home" id="toolRunnerHome" type="button">HOME</button>
      </div>
      <div class="tool-runner__frame-wrap">
        <div class="tool-runner__loading" id="toolRunnerLoading"><span>Loading field tool…</span></div>
        <iframe class="tool-runner__frame" id="toolRunnerFrame" title="L.E.N.S. field tool" src="about:blank"></iframe>
      </div>`;
    stage.appendChild(runner);
    frame = document.getElementById('toolRunnerFrame');
    loading = document.getElementById('toolRunnerLoading');

    document.getElementById('toolRunnerBack').addEventListener('click', () => closeRunner('tools'));
    document.getElementById('toolRunnerHome').addEventListener('click', () => closeRunner('home'));
    frame.addEventListener('load', prepareTool);
  }

  function showOnlyRunner(){
    document.querySelectorAll('[data-view-panel]').forEach(panel => panel.classList.remove('is-active'));
    runner.classList.add('is-active');
    document.body.classList.add('v5-tool-open');
    setNavForRunner(true);
    window.scrollTo({top:0,behavior:'instant'});
  }

  function restoreView(name){
    runner.classList.remove('is-active');
    document.body.classList.remove('v5-tool-open');
    const target = document.querySelector(`[data-view-panel="${name}"]`) || document.querySelector('[data-view-panel="home"]');
    if(target) target.classList.add('is-active');
    document.querySelectorAll('[data-view]').forEach(btn => {
      const active = btn.dataset.view === (target ? target.dataset.viewPanel : 'home');
      btn.classList.toggle('is-active', active);
      if(btn.classList.contains('rail-item')){
        if(active) btn.setAttribute('aria-current','page');
        else btn.removeAttribute('aria-current');
      }
    });
    window.scrollTo({top:0,behavior:'instant'});
  }

  function closeRunner(destination){
    if(!runner) return;
    activeTool = null;
    if(frame) frame.src = 'about:blank';
    restoreView(destination || previousView || 'home');
  }

  function openTool(tool, query = ''){
    const meta = TOOL_MAP[tool];
    if(!meta) return;
    buildRunner();
    if(!runner || !frame) return;

    previousView = getActiveView();
    activeTool = tool;
    const title = document.getElementById('toolRunnerTitle');
    title.textContent = meta.label;
    title.style.color = meta.accent;
    loading.hidden = false;
    showOnlyRunner();

    if(meta.native){
      const params = new URLSearchParams(query || '');
      params.set('embedded','1');
      params.set('t',String(Date.now()));
      frame.src = `${meta.src}?${params.toString()}`;
      return;
    }

    frame.src = `../legacy-v4.html?v5tool=${encodeURIComponent(tool)}&bridge=30&t=${Date.now()}`;
  }

  function prepareTool(){
    if(!activeTool || !frame || frame.src === 'about:blank') return;
    const meta = TOOL_MAP[activeTool];
    if(meta?.native){
      loading.hidden = true;
      return;
    }

    let doc;
    try { doc = frame.contentDocument || frame.contentWindow.document; }
    catch (_) {
      loading.querySelector('span').textContent = 'Production tool could not be embedded on this host.';
      return;
    }
    if(!doc) return;

    try {
      const style = doc.createElement('style');
      style.dataset.v5Bridge = '27';
      style.textContent = `
        .lens-hero,.lens-rail,.theme-bar,#toolsTileGrid,.lens-footer{display:none!important}
        html,body{background:#0a0e13!important;min-height:100%!important}
        body{padding:0!important;margin:0!important;display:block!important}
        .tool{margin:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;min-height:100vh!important;padding:14px 12px 34px!important}
        @media(max-width:760px){.tool{padding:12px 10px 30px!important}}
      `;
      doc.head.appendChild(style);

      doc.querySelectorAll('.tool').forEach(el => { el.style.display = el.id === activeTool ? 'block' : 'none'; });
      const tile = doc.querySelector(`.tile[data-tool="${activeTool}"]`);
      if(tile) tile.click();
      const tool = doc.getElementById(activeTool);
      if(tool){
        tool.style.display = 'block';
        tool.scrollIntoView({block:'start'});
      }
      if(doc.defaultView) doc.defaultView.scrollTo(0,0);
      loading.hidden = true;
    } catch (_) {
      loading.querySelector('span').textContent = 'Tool loaded, but the v5 bridge could not finish the layout.';
    }
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-tool-action]');
    if(!button) return;
    const tool = button.dataset.toolAction;
    if(!TOOL_MAP[tool]) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    openTool(tool, button.dataset.toolQuery || '');
  }, true);

  document.addEventListener('click', event => {
    if(!runner || !runner.classList.contains('is-active')) return;
    const nav = event.target.closest('[data-view]');
    if(!nav) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    closeRunner(nav.dataset.view);
  }, true);

  buildRunner();
})();
