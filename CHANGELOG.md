# Changelog

## [2.3.0] — 2026-04-01

Hardening release. Fixes from adversarial review process.

### Fixed
- Windows CRLF line-ending bug that broke all heading detection
- Contrast improvements for L1 and L2 heading colors on dark themes
- Removed CSS injection hack in decoration factory — uses proper VS Code API
- Split editors now retain decorations across all visible panes
- Per-document debounce timers prevent cross-file decoration staleness
- Empty dimension lines (`░▒▓ B1-D1:`) now receive heading decoration
- `FAIL` no longer gets conflicting action-verb decoration
- Decoration types properly disposed on extension deactivation

### Changed
- `DELETE` is now an action verb only (removed from HTTP method keywords)
- Removed `On` from conditional keywords (too broad for natural English)
- README logo now uses GitHub raw URL for marketplace compatibility

### Added
- `keywords`, `galleryBanner`, `activationEvents` in package.json for marketplace polish
- Sample `.totalspec` file for reference
- `reading` added to action verb list

## [2.2.18] — 2026-03-31

Initial standalone release. Extracted from neffflix project where it was developed and battle-tested.

### Includes

- 5-level hot pink gradient heading system (`░▒▓██` through `░`)
- Semantic coloring for action verbs, logical operators, log levels
- TextMate grammar for conditionals, cross-references, inline code, file paths, arrows
- Language configuration with bracket pairs and word patterns
- Editor defaults: JetBrains Mono, 13px, Unicode-safe
