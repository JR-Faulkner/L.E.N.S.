# Update 27 Release Notes

## L.E.N.S. v5 Live Tool Bridge

Update 27 turns the approved v5 shell from a visual preview into a working field launcher.

### What changed

- All six v5 tool cards now open the **real production tool**.
- The selected v4 tool runs inside a contained v5 Tool Runner instead of sending the technician back through the old launcher.
- Legacy banner/navigation/tile chrome is hidden inside the runner so the chosen utility is the first thing visible.
- A compact runner bar provides quick **Tools** and **Home** exits.
- Mobile bottom navigation remains available.

### Production logic remains authoritative

No tool logic was copied. OTDR, Results Corrector, Distance Converter, Ribbon Finder, Loss Calculator, and ACE Fire still execute from the current production document, preserving current local data, export behavior, Test Log state, and calculations.

### Preserved

- Tools-first mobile hierarchy
- Expandable Work Bar
- Current production tool colors
- `lens-session` / Waldo context behavior
- Root v4 production file unchanged

### Validation

- Bridge JavaScript syntax check passed.
- v5 HTML parser check passed.
- Six production tool IDs mapped one-for-one.
