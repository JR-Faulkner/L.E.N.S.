# L.E.N.S. Changelog

This changelog is the detailed release record for L.E.N.S. GitHub updates. Git commit messages remain intentionally terse and numbered (`Update 26`, `Update 27`, and so on).

## Update 30 — Foundry Shell + Tool Re-Top

### Foundry shell themes

- Adds four persistent v5 workstation themes: **Foundry Ember**, **Redline**, **Circuit Lime**, and **Aqua Core**.
- Themes change the shell accent system, banner glow, navigation state, Work Bar accents, borders, and major shell controls while preserving each field tool's individual production color.
- Theme selection lives under More / Settings and is stored locally in `lens-theme`.
- The current theme is reflected in the existing Settings status area.

### Faulkner Foundry banner hook

- Adds a compact banner asset host for the approved Faulkner Foundry anvil / mirrored-F mark.
- The host targets `assets/branding/faulkner-foundry-mark.svg` and stays completely hidden if that canonical asset is absent.
- No substitute, traced approximation, or recreated logo is used. The existing text lockup remains authoritative until the approved standalone mark is added to the repository.

### Tool re-top and organization

- Reorders Home around field workflow: **OTDR Note Maker → Tether-Tinker → Fiber Ribbon Finder → Results Corrector → Distance Converter → Fiber Loss Calculator → ACE Fire Tool**.
- Keeps all seven Home utilities directly accessible without adding another launcher layer or extra Quick Rack scroll.
- Groups the full Tool Belt with light task separators: **Test**, **Locate**, **Calculate**, and **Field Workflow**.
- Category treatment is intentionally lightweight so the Tool Belt remains fast rather than becoming an accordion or menu maze.

### Preserved

- Update 29 Offline Library and Tether-Tinker speed preferences remain intact.
- Tool Runner behavior and all seven tool launch routes remain intact.
- `lens-session`, Work Bar, Waldo handoff, Recent Sessions, and root v4 production logic remain untouched.
- No production PWA/service-worker cache version changes are made in this shell-only pass.

### Review target

- On iPhone, verify all four themes switch immediately and survive reload.
- Verify Home shows the seven tools in the new workflow order with no new scrolling launcher above them.
- Verify the full Tool Belt groups tools cleanly without slowing access.
- Verify the banner remains clean and text-based while the approved standalone Foundry mark asset is absent.

---

## Update 29 — Field Speed + Offline Library

### Tether-Tinker speed polish

- Remembers the last-used feet / kilofeet selection and Buried / Aerial / Mixed plant type.
- Automatically captures the last three non-zero tester-cord values as one-tap recent-value chips.
- Automatically captures the last three non-zero terminal-tail values the same way.
- Recent values are learned from normal calculations; no separate preset form or naming workflow is added.
- Keeps the Update 28 fast path intact: measured distance, cord, tail, calculate.
- Field → Terminal retains the single Tail Included? Yes / No control and remembered preference.

### Offline Library foundation

- Adds an **Offline Library** section under More / Settings without adding another Home launcher or extra scrolling above the tools.
- Shows live **ONLINE / OFFLINE** connection state.
- Clearly distinguishes **BUILT IN**, **LOCAL**, and future **PACK SLOT** content so unavailable downloads are never presented as working buttons.
- Built-in Fiber Reference can be opened directly from the library.
- Device-local Tether-Tinker saved-result count is surfaced and can jump to History.
- Reserves future pack slots for downloadable field-reference bundles and field documents / exports.
- Service-worker caching and actual downloadable packs remain intentionally deferred to a later wiring pass.

### Removed after phone review

- The experimental three-tool Quick Rack was removed before merge review.
- The existing Home tool grid is already fast enough on phone, and duplicating tool access added unnecessary visual weight and scroll.
- The full seven-tool Tool Belt remains the single clear launcher model.

### Preserved

- Update 28 Tether-Tinker calculations, saved sessions, Recent Sessions integration, and Tool Runner behavior remain intact.
- Root v4 `index.html` remains unchanged.
- `lens-session`, Work Bar, Waldo handoff, and existing production tool colors remain intact.
- No service-worker or production PWA cache version changes are made in this foundation pass.

### Review target

- Verify the Home tool layout remains unchanged and no Quick Rack appears.
- Verify Tether-Tinker remembers unit / plant preferences and offers recent cord / tail chips after normal use.
- Verify More opens the Offline Library with correct online/offline state, built-in/local labels, and future pack slots.

---

## Update 28 — Tether-Tinker

### New native field tool

- Adds **Tether-Tinker — Terminal / Tail Distance Solver** as the seventh L.E.N.S. field utility.
- Core field math: measured tester distance minus known tester/launch cord minus included terminal-tail footage.
- Supports feet and kilofeet (`1 kft = 1,000 ft`).
- Supports **Buried**, **Aerial**, and **Mixed** plant context with concise route-specific field guidance.
- Supports Terminal → Field and Field → Terminal test direction.
- Field → Terminal uses one inline **TAIL INCLUDED? YES / NO** control instead of assuming terminal-tail compensation.
- First Field → Terminal use defaults to **NO** unless a prior preference exists; the last-used choice is remembered locally.
- Terminal → Field keeps the fast path: enter the three distances and calculate with no extra prompt.
- Optional known-route comparison can show before / at / beyond a handhole, pedestal, pole, splice point, or other terminal-origin reference.
- Terminal-origin reference comparison is intentionally skipped in Field → Terminal mode to avoid mixing incompatible origins.

### v5 workstation integration

- Tether-Tinker opens inside the same v5 Tool Runner used by the original six utilities instead of leaving the shell.
- Native v5 tools and bridged v4 production tools share the same Tools / Home exits and mobile navigation behavior.
- Tether-Tinker saved sessions can reopen inside the Tool Runner from Recent Sessions.
- Embedded Tether-Tinker hides its standalone header so the runner remains the single navigation layer.

### Field workflow

- Reads existing `lens-session` context for active project/cable/structure display.
- Saved results are stored locally in `lens-tether-history`.
- Recent Tether-Tinker saves are injected into the v5 **Recent Sessions** strip.
- Copy output records whether terminal-tail footage was subtracted or intentionally excluded.

### Preserved

- Update 27 Tool Runner behavior remains authoritative for OTDR Note Maker, Results Corrector, Distance Converter, Fiber Ribbon Finder, Fiber Loss Calculator, and ACE Fire Tool.
- Root v4 `index.html` remains unchanged.
- Tools-first mobile hierarchy and expandable Work Bar remain intact.
- `lens-session` and Waldo handoff remain intact.

### Review target

- Update 28 remains one numbered commit directly on top of Update 27.
- Review focus is deliberately small: fast three-number Terminal → Field use, one-tap Field → Terminal tail inclusion, in-runner navigation, saved Recent Sessions reopen, and mobile usability.

---

## Update 27 — Live Tool Bridge

### Production tool wiring

- Connected all six v5 tool cards to the **real current v4 production implementations** instead of duplicate or mock tool logic.
- Added a contained v5 Tool Runner that opens the selected production tool inside the approved v5 shell.
- The runner strips the legacy banner, navigation rail, tile launcher, theme strip, and footer inside the embedded document so the technician lands directly in the selected tool.
- Added one-tap **TOOLS** and **HOME** exits above the running tool while preserving the mobile bottom navigation.
- Tool selection remains immediate from the tools-first home screen and the full Tool Belt view.
- The bridge uses same-origin access on GitHub Pages / branch preview hosts and leaves the v4 tool source untouched.

### Why this bridge exists

- v4 remains the single source of truth for OTDR Note Maker, Results Corrector, Distance Converter, Fiber Ribbon Finder, Fiber Loss Calculator, and ACE Fire Tool while the v5 shell migration continues.
- This avoids maintaining two copies of field logic during the transition.
- Existing localStorage, exports, uploads, downloads, OTDR Test Log behavior, settings, and tool-specific calculations continue to run inside the production document.

### Preserved

- Update 26 visual direction: **tools first, Work Bar on demand**.
- Current production tool colors and card identities.
- `lens-session` job context compatibility and Waldo handoff.
- The root v4 `index.html` is unchanged in this update.
- The approved Faulkner Foundry icon remains deferred until the canonical asset is present.

### Validation

- New bridge JavaScript passes `node --check`.
- Updated v5 HTML parses successfully.
- All six v5 tool identifiers are mapped to the matching v4 tool IDs.
- The bridge uses a clean iframe document for every tool launch so switching tools does not carry stale in-document UI state.

---

## Update 26 — v5 Shell Foundation

### Direction correction after mobile review

- Revised the v5 mobile shell around the selected **Mock #3** direction.
- Restored **tools-first priority on phone**. The six core utilities now occupy the main home view immediately, without requiring the technician to scroll through a Workbench first.
- Reframed Workbench as a compact **Work Bar** above the tools. The Work Bar is collapsed by default and expands on demand into connected job context and Waldo handoff controls.
- Preserved the existing tool identities and their production accent colors from the current L.E.N.S. SVG assets:
  - OTDR Note Maker — `#ff443d`
  - Results Corrector — `#6fe83a`
  - Distance Converter — `#18c9ff`
  - Fiber Ribbon Finder — `#a65cff`
  - Fiber Loss Calculator — `#ffc928`
  - ACE Fire Tool — `#ff7a18`
- Added a compact Recent Sessions strip below the tool grid so active/recent work can be resumed without displacing the tools.
- Retained the persistent five-item mobile navigation for Home, Tools, Workspace, History, and More.
- Reworked the banner into a text-driven Foundry-style header using the corrected **Loss Estimator & Network Solver** expansion. The outdated production banner text is not reused.
- Kept the approved Faulkner Foundry icon slot deferred. No substitute mark is recreated in this build.

### Foundation behavior retained

- The v5 preview remains additive under `v5/`; current v4 production `index.html` is unchanged.
- Workspace reads and writes the existing v4 `lens-session` localStorage record (`project`, `cable`, `span`, `fiber`, `structure`).
- The one-way Waldo Project Number handoff remains available from expanded Work Bar context.
- Dashboard-style context is now intentionally secondary on mobile rather than the default opening experience.
- Existing v4 tools, local data, exports, PWA files, service worker, and GitHub Pages production behavior remain untouched.

### Deferred to the next migration pass

- Route the six v5 tool cards into the real v4 production tool implementations.
- Surface existing v4 History and Settings data inside their v5 views.
- Feed the Work Bar with live OTDR/Test Log state and recent-job activity.
- Install the approved Faulkner Foundry anvil / mirrored-F asset when the canonical file is available in the repository.

### Validation

- JavaScript syntax checked with Node.js.
- HTML parsed successfully.
- Dependency-free and GitHub Pages-compatible.
- Mobile layout keeps the six core tools visible as the primary home content with field-sized touch targets.

---

## Legacy release record

The earlier L.E.N.S. release package used a separate `CHANGELOG.md` for detailed notes while source commits continued independently. The historical v3.1 record below is retained from that release package; missing intermediate notes are not reconstructed here to avoid inventing history.

### v3.1 — Accordion Stability Fix

#### Fixed
- Removed the duplicate mobile activation path that used both `touchend` and `click` for the same header tap.
- Replaced inline-height guessing as the source of accordion state with explicit state.
- Added reliable open and close animation handling for rapid repeated taps.
- Open sections settle to natural height so dynamic content can grow without clipping.
- Preserved keyboard activation using Enter and Space and synchronized accessibility state.

#### Preserved
- OTDR Note Maker
- Results Corrector
- Distance Converter
- Fiber Ribbon Finder
- Fiber Loss Calculator
- ACE Fire Tool
- Theme mode
- Existing save, copy, upload, and download behavior
- GitHub Pages deployment
