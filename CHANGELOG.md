# L.E.N.S. Changelog

This changelog is the detailed release record for L.E.N.S. GitHub updates. Git commit messages remain intentionally terse and numbered (`Update 26`, `Update 27`, and so on).

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
