# L.E.N.S. Changelog

This changelog is the detailed release record for L.E.N.S. GitHub updates. Git commit messages remain intentionally terse and numbered (`Update 26`, `Update 27`, and so on).

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
