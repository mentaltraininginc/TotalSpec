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

| Element | Color | Hex |
|---------|-------|-----|
| Line-start labels (`Label:`) | Gold/Amber | `#FFD580` |
| Action verbs (`create`, `delete`, `send`) | Slate Blue | `#82AAFF` |
| Logical operators (`AND`, `OR`, `MUST`) | Orange | `#FF9D00` |
| Log level: ERROR/FATAL | Red | `#FF4444` |
| Log level: WARN | Orange | `#FFA500` |
| Log level: INFO | Blue | `#4FC1FF` |
| Log level: DEBUG/TRACE | Gray | `#7C7C7C` |
| Inline code (`` `code` ``) | Light blue on dark | `#9CDCFE` on `#1E1E3A` |
| PASS / Checkmarks | Green | `#00FF7F` |
| FAIL / BLOCKING | Red | `#FF0000` / `#FF4444` |
| Cross-references (`B1-D3`) | Tag blue | TextMate scope |
| Conditionals (`If`, `When`) | Keyword purple | TextMate scope |

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
