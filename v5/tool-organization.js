(() => {
  'use strict';

  const HOME_ORDER = ['otdr','tether','ribbon','results','distance','loss','fire'];
  const GROUPS = [
    { key:'test', label:'TEST', note:'Capture and correct', tools:['otdr','results'] },
    { key:'locate', label:'LOCATE', note:'Find the fiber and event', tools:['tether','ribbon'] },
    { key:'calculate', label:'CALCULATE', note:'Distance and loss', tools:['distance','loss'] },
    { key:'workflow', label:'FIELD WORKFLOW', note:'Structured field execution', tools:['fire'] }
  ];

  function byTool(root, tool){ return root?.querySelector(`[data-tool-action="${tool}"]`) || null; }

  function reorderHome(){
    const grid = document.querySelector('.quick-grid');
    if(!grid) return false;
    const cards = HOME_ORDER.map(tool => byTool(grid, tool)).filter(Boolean);
    if(cards.length < 7) return false;
    cards.forEach(card => grid.appendChild(card));
    const heading = document.getElementById('toolsHeading');
    if(heading) heading.textContent = 'Field utilities, ordered for the work.';
    return true;
  }

  function organizeFull(){
    const grid = document.querySelector('.full-grid');
    if(!grid || grid.dataset.organized === '30') return grid?.dataset.organized === '30';
    const cards = {};
    HOME_ORDER.forEach(tool => { const card = byTool(grid, tool); if(card) cards[tool] = card; });
    if(Object.keys(cards).length < 7) return false;

    const headingCopy = document.querySelector('#view-tools .page-heading > p:last-child');
    if(headingCopy) headingCopy.textContent = 'Seven utilities grouped by the field task they help you finish.';

    grid.innerHTML = '';
    grid.dataset.organized = '30';
    GROUPS.forEach(group => {
      const section = document.createElement('section');
      section.className = 'tool-group';
      section.dataset.toolGroup = group.key;
      section.innerHTML = `<div class="tool-group__head"><strong>${group.label}</strong><span>${group.note}</span></div><div class="tool-group__grid"></div>`;
      const host = section.querySelector('.tool-group__grid');
      group.tools.forEach(tool => { if(cards[tool]) host.appendChild(cards[tool]); });
      grid.appendChild(section);
    });
    return true;
  }

  function apply(){ return reorderHome() && organizeFull(); }

  function install(){
    if(apply()) return;
    const roots = [document.querySelector('.quick-grid'), document.querySelector('.full-grid')].filter(Boolean);
    if(!roots.length) return;
    const observer = new MutationObserver(() => { if(apply()) observer.disconnect(); });
    roots.forEach(root => observer.observe(root,{childList:true,subtree:true}));
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if(apply() || tries > 20){ clearInterval(timer); observer.disconnect(); }
    },100);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
