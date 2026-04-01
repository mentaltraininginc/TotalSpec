![TotalSpec](TotalSpec.logo.jpg)

# TotalSpec — VS Code Extension

Syntax highlighting for `.totalspec` files — a 15-dimension behavioral specification format designed for AI-assisted software development.

## What is TotalSpec?

TotalSpec is a structured specification format where each behavior is described across 15 dimensions (D1–D15), covering aspects like triggers, preconditions, actions, postconditions, error handling, logging, and more. It uses a gradient heading system with Unicode block characters (`░▒▓█`) to create a visual hierarchy that's both human-readable and machine-parseable.

## What This Extension Does

- **Gradient heading system** — 5 levels of hot pink gradient from light bubblegum (`░▒▓██`) to deep magenta (`░`), making the document structure immediately visible
- **Semantic coloring for action verbs** — verbs like `create`, `delete`, `send`, `fetch` are highlighted in slate blue
- **Logical operators** — ALL CAPS operators (`AND`, `OR`, `NOT`, `MUST`, `SHALL`, `EVERY`, etc.) stand out in orange
- **Log level indicators** — `ERROR`/`FATAL`, `WARN`, `INFO`, `DEBUG`/`TRACE` each get their own severity color
- **Cross-references** — `B1-D3` style references are tagged for easy navigation
- **Conditionals** — `If`, `When`, `Unless`, `While`, `For each` at line starts
- **Severity markers** — `BLOCKING`, `SPEC ISSUE`, `PASS`, `FAIL`
- **Inline code** — backtick-wrapped code gets a dark background with light blue text
- **Line-start labels** — `Label:` patterns at the beginning of lines highlighted in gold
- **Bracket conditions** — `[true]`, `[false]`, `[found]`, `[not found]`, etc.

## Color Palette

### Heading Gradient (Hot Pink Spectrum)

| Level | Prefix | Color | Hex | Use |
|-------|--------|-------|-----|-----|
| 5 | `░▒▓██` | Light bubblegum pink | `#FF8AD5` | Document title |
| 4 | `░▒▓█` | Bright pink | `#FF5AC8` | Behavior headers, subtitles |
| 3 | `░▒▓` | Hot pink | `#F030BD` | Dimension headers (D1–D15) |
| 2 | `░▒` | Deep pink | `#CC20A8` | Version, postconditions |
| 1 | `░` | Deep magenta | `#AA1590` | Date, deepest indent |

### Semantic Colors

**Line-start labels** — Gold/Amber `#FFD580`
Any `CamelCase Label:` pattern at the start of a line.

**Action verbs** — Slate Blue `#82AAFF`
`log` `logged` `logging` `test` `tested` `testing` `scan` `scanned` `scanning` `re-scan` `re-scanned` `rescan` `rescanned` `move` `moved` `moving` `delete` `deleted` `deleting` `rename` `renamed` `renaming` `remove` `removed` `removing` `send` `sent` `sending` `receive` `received` `receiving` `purge` `purged` `purging` `create` `created` `creating` `update` `updated` `updating` `fetch` `fetched` `fetching` `write` `written` `writing` `read` `skip` `skipped` `skipping` `merge` `merged` `merging` `apply` `applied` `applying` `trigger` `triggered` `triggering` `queue` `queued` `queuing` `retry` `retried` `retrying` `fail` `failed` `failing` `verify` `verified` `verifying` `process` `processed` `processing` `download` `downloaded` `downloading` `upload` `uploaded` `uploading` `import` `imported` `importing` `export` `exported` `exporting` `resolve` `resolved` `resolving` `detect` `detected` `detecting` `preserve` `preserved` `preserving` `restore` `restored` `restoring` `associate` `associated` `associating` `cascade` `cascaded` `cascading` `dismantle` `dismantled` `dismantling` `reconcile` `reconciled` `reconciling`

**Logical operators (ALL CAPS)** — Orange `#FF9D00`
`AND` `OR` `NOT` `NOR` `ALL` `NONE` `BOTH` `EITHER` `NEITHER` `ALWAYS` `NEVER` `ONLY` `MUST` `SHALL` `REQUIRED` `OPTIONAL` `EVERY` `ANY` `EACH`

**Log levels**
| Level | Words | Color | Hex |
|-------|-------|-------|-----|
| Error | `ERROR` `FATAL` | Red | `#FF4444` |
| Warn | `WARN` `WARNING` | Orange | `#FFA500` |
| Info | `INFO` | Blue | `#4FC1FF` |
| Debug | `DEBUG` `TRACE` | Gray | `#7C7C7C` |

**Severity markers**
| Marker | Color | Hex |
|--------|-------|-----|
| `BLOCKING` | Red | `#FF4444` |
| `SPEC ISSUE` | Light red | `#FF6B6B` |
| `PASS` | Green | `#00FF7F` |
| `FAIL` | Red | `#FF0000` |

**Conditionals** — Keyword purple (TextMate scope)
`If` `When` `Unless` `While` `For each` `For all` `On` (at start of line or after list marker)

**Bracket conditions** — Keyword purple (TextMate scope)
`[true]` `[false]` `[found]` `[not found]` `[yes]` `[no]` `[exists]` `[gone]` `[drifted]` `[no drift]` `[missing]` `[present]` `[ambiguous]`

**Cross-references** — Tag blue (TextMate scope)
`B1-D3` style dimension references (pattern: `B<number>-D<number>`)

**Inline code** — Light blue `#9CDCFE` on dark `#1E1E3A`
Any text wrapped in backticks.

**Booleans** — Boolean constant (TextMate scope)
`true` `false` `null` `none` `None` `YES` `NO`

**HTTP methods** — Keyword (TextMate scope)
`GET` `POST` `PUT` `DELETE` `PATCH`

## Installation

### From VS Code Marketplace

Search for **"Total Spec Language"** in the Extensions panel, or:

```
ext install mentaltraininginc.totalspec-language
```

### From VSIX

1. Download the `.vsix` file from [Releases](https://github.com/mentaltraininginc/TotalSpec/releases)
2. In VS Code: `Extensions` → `...` menu → `Install from VSIX...`

### From Source

```bash
git clone https://github.com/mentaltraininginc/TotalSpec.git
cd TotalSpec
code --install-extension .
```

## File Structure

```
├── package.json                    — Extension manifest
├── extension.js                    — Programmatic decoration engine (gradient, labels, verbs, etc.)
├── syntaxes/totalspec.tmLanguage.json — TextMate grammar (conditionals, strings, cross-refs, etc.)
└── language-configuration.json     — Bracket pairs, auto-close, word patterns
```

## License

MIT — Copyright Mental Training Inc.
