(() => {
  'use strict';

  const TETHER_KEY = 'lens-tether-history';
  const $ = id => document.getElementById(id);

  function countTether(){
    try {
      const data = JSON.parse(localStorage.getItem(TETHER_KEY) || '[]');
      return Array.isArray(data) ? data.length : 0;
    } catch (_) { return 0; }
  }

  function statusText(){ return navigator.onLine ? 'ONLINE' : 'OFFLINE'; }

  function updateStatus(){
    const badge = $('offlineLibraryStatus');
    const note = $('offlineLibraryStatusNote');
    if(badge){
      badge.textContent = statusText();
      badge.classList.toggle('is-offline', !navigator.onLine);
    }
    if(note){
      note.textContent = navigator.onLine
        ? 'Connection available. Built-in and local items remain usable if service drops.'
        : 'No connection. Built-in references and device-local data remain available.';
    }
    const tetherCount = $('offlineTetherCount');
    if(tetherCount) tetherCount.textContent = `${countTether()} SAVED`;
  }

  function jump(name){
    const button = document.querySelector(`[data-view="${name}"]`) || document.querySelector(`[data-view-jump="${name}"]`);
    if(button) button.click();
  }

  function installStyles(){
    if(document.getElementById('offlineLibraryStyles')) return;
    const style = document.createElement('style');
    style.id = 'offlineLibraryStyles';
    style.textContent = `
      .offline-library{margin-top:14px;border:1px solid #2c3741;border-radius:12px;background:linear-gradient(180deg,#151d24,#0f151a);overflow:hidden}
      .offline-library__head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:14px;border-bottom:1px solid #28343d}
      .offline-library__head h2{margin:4px 0 3px;font-size:1rem}.offline-library__head p{margin:0;color:#87949e;font-size:.68rem;line-height:1.4}
      .offline-status{flex:0 0 auto;padding:6px 8px;border:1px solid #38665c;border-radius:999px;background:rgba(69,224,197,.08);color:#9ef1e2;font-size:.55rem;font-weight:950;letter-spacing:.08em}
      .offline-status.is-offline{border-color:#745f32;background:rgba(255,201,40,.08);color:#ffd978}
      .offline-library__grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;padding:12px}
      .offline-item{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;min-height:82px;padding:11px;border:1px solid #2d3942;border-radius:9px;background:#0c1318;color:#e8eeee;text-align:left}
      .offline-item strong,.offline-item small{display:block}.offline-item strong{font-size:.75rem}.offline-item small{margin-top:4px;color:#7e8c96;font-size:.58rem;line-height:1.35}
      .offline-item__state{align-self:start;padding:4px 6px;border-radius:5px;border:1px solid #37454e;color:#93a0a8;font-size:.48rem;font-weight:950;letter-spacing:.06em;white-space:nowrap}
      .offline-item__state.ready{border-color:#35685d;color:#8cebd9}.offline-item__state.local{border-color:#4f5f72;color:#b9cee8}.offline-item__state.slot{border-color:#675b3b;color:#d9c37e}
      button.offline-item{cursor:pointer}.offline-library__foot{padding:0 12px 12px;color:#687680;font-size:.57rem;line-height:1.45}
      @media(max-width:680px){.offline-library__grid{grid-template-columns:1fr}.offline-library__head{padding:12px}.offline-item{min-height:72px}}
    `;
    document.head.appendChild(style);
  }

  function install(){
    const settings = document.querySelector('#view-settings');
    if(!settings || settings.querySelector('.offline-library')) return;
    installStyles();

    const section = document.createElement('section');
    section.className = 'offline-library';
    section.innerHTML = `
      <div class="offline-library__head">
        <div><p class="eyebrow">FIELD RESILIENCE</p><h2>Offline Library</h2><p id="offlineLibraryStatusNote">Checking connection…</p></div>
        <span class="offline-status" id="offlineLibraryStatus">CHECKING</span>
      </div>
      <div class="offline-library__grid">
        <button class="offline-item" type="button" data-offline-jump="reference"><span><strong>Fiber Reference</strong><small>TIA-598 colors and built-in field reference.</small></span><span class="offline-item__state ready">BUILT IN</span></button>
        <button class="offline-item" type="button" data-offline-jump="history"><span><strong>Saved Field Results</strong><small>Tether-Tinker results currently stored on this device.</small></span><span class="offline-item__state local" id="offlineTetherCount">0 SAVED</span></button>
        <div class="offline-item"><span><strong>Reference Pack Downloads</strong><small>Reserved for loss, reflectance, splitter and field cheat-sheet bundles.</small></span><span class="offline-item__state slot">PACK SLOT</span></div>
        <div class="offline-item"><span><strong>Field Documents</strong><small>Reserved for offline PDFs, exports, reports and job documents.</small></span><span class="offline-item__state slot">PACK SLOT</span></div>
      </div>
      <div class="offline-library__foot">Pack slots are intentionally not download buttons yet. Update 29 establishes the library and status model; service-worker caching and actual downloadable packs come in a later wiring pass.</div>`;

    settings.appendChild(section);
    section.querySelectorAll('[data-offline-jump]').forEach(btn => btn.addEventListener('click', () => jump(btn.dataset.offlineJump)));
    updateStatus();
  }

  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);
  window.addEventListener('storage', e => { if(e.key === TETHER_KEY) updateStatus(); });
  window.addEventListener('lens:tether-history', updateStatus);
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();