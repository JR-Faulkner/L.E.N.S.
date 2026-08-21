(() => {
  'use strict';

  const MARK = '../assets/branding/faulkner-foundry-mark-reference.jpg';
  const ORDER = ['otdr','tether','ribbon','results','distance','loss','fire'];
  let clockTimer = null;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function installPrimaryMark(){
    const banner = $('.brand-banner');
    const brand = $('.brand-copy');
    if(!banner || !brand || $('.hc-primary-mark', banner)) return;
    const plate = document.createElement('div');
    plate.className = 'hc-primary-mark';
    plate.innerHTML = `<span class="hc-primary-mark__bolts" aria-hidden="true"></span><img src="${MARK}" alt="Faulkner Foundry mark">`;
    banner.insertBefore(plate, brand);
  }

  function installVitals(){
    const banner = $('.brand-banner');
    if(!banner || $('.hc-banner-vitals', banner)) return;
    const vitals = document.createElement('div');
    vitals.className = 'hc-banner-vitals';
    vitals.innerHTML = `<span class="hc-vital hc-vital--link"><i></i><b>LINK</b><small id="hcLinkState">ONLINE</small></span><span class="hc-vital hc-vital--sync"><i></i><b>SYNC</b><small>READY</small></span><span class="hc-vital hc-vital--local"><i></i><b>LOCAL</b><small>ARMED</small></span><span class="hc-vital hc-vital--clock"><b id="hcClock">--:--</b></span>`;
    banner.appendChild(vitals);
  }

  function installShellHardware(){
    const shell = $('.app-shell');
    if(!shell || $('.hc-shell-hardware', shell)) return;
    const hardware = document.createElement('div');
    hardware.className = 'hc-shell-hardware';
    hardware.setAttribute('aria-hidden','true');
    hardware.innerHTML = `<span class="hc-channel hc-channel--left"><i></i><i></i><i></i></span><span class="hc-channel hc-channel--right"><i></i><i></i><i></i></span>`;
    shell.appendChild(hardware);
  }

  function installWorkVitals(){
    const workbar = $('#workbarToggle');
    const main = $('.workbar-main', workbar || document);
    if(!workbar || !main || $('.hc-work-vitals', workbar)) return;
    const row = document.createElement('div');
    row.className = 'hc-work-vitals';
    row.innerHTML = `<span class="hc-work-vital hc-work-vital--green"><i></i><b>FIELD LINK</b><small id="hcWorkLink">CONNECTED</small></span><span class="hc-work-vital hc-work-vital--cyan"><i></i><b>DATA BUS</b><small>SYNCED</small></span><span class="hc-work-vital hc-work-vital--amber"><i></i><b>OFFLINE</b><small>READY</small></span>`;
    main.insertAdjacentElement('afterend', row);
  }

  function installCommandCore(){
    const workspace = $('.mobile-nav [data-view="workspace"]');
    if(!workspace || workspace.classList.contains('hc-command-core')) return;
    workspace.classList.add('hc-command-core');
    const icon = $('img', workspace);
    if(icon){ icon.src = MARK; icon.classList.add('hc-command-mark'); }
    const label = $('span', workspace);
    if(label) label.textContent = 'Work';
  }

  function installRailMark(){
    const rail = $('.rail-foundry');
    if(!rail || $('.hc-rail-mark', rail)) return;
    const img = document.createElement('img');
    img.src = MARK;
    img.alt = '';
    img.className = 'hc-rail-mark';
    rail.prepend(img);
  }

  function reorderGrid(grid){
    if(!grid) return;
    const cards = new Map();
    $$('[data-tool-action]', grid).forEach(card => cards.set(card.dataset.toolAction, card));
    ORDER.forEach(key => { const card = cards.get(key); if(card) grid.appendChild(card); });
  }

  function decorateCards(){
    $$('.tool-card').forEach(card => {
      if(card.querySelector('.hc-card-state')) return;
      const state = document.createElement('span');
      state.className = 'hc-card-state';
      state.innerHTML = '<i></i><b>READY</b>';
      card.appendChild(state);
    });
  }

  function refreshToolOrder(){ reorderGrid($('.quick-grid')); reorderGrid($('.full-grid')); decorateCards(); }

  function updateConnectivity(){
    const online = navigator.onLine;
    document.documentElement.dataset.hcNetwork = online ? 'online' : 'offline';
    const state = $('#hcLinkState');
    const work = $('#hcWorkLink');
    if(state) state.textContent = online ? 'ONLINE' : 'OFFLINE';
    if(work) work.textContent = online ? 'CONNECTED' : 'LOCAL';
  }

  function updateClock(){
    const el = $('#hcClock');
    if(el) el.textContent = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  }

  function install(){
    document.title = 'L.E.N.S. — Loss Estimator & Network Solver';
    document.documentElement.dataset.hcShell = 'heavy-command';
    installPrimaryMark();
    installVitals();
    installShellHardware();
    installWorkVitals();
    installCommandCore();
    installRailMark();
    refreshToolOrder();
    updateConnectivity();
    updateClock();
    clearInterval(clockTimer);
    clockTimer = setInterval(updateClock, 30000);
    $$('.tool-grid').forEach(grid => {
      const observer = new MutationObserver(() => refreshToolOrder());
      observer.observe(grid,{childList:true});
      setTimeout(() => observer.disconnect(), 4000);
    });
  }

  window.addEventListener('online', updateConnectivity);
  window.addEventListener('offline', updateConnectivity);
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true});
  else install();
})();