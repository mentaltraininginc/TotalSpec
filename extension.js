const vscode = require('vscode');

// ─── Color Palette: Hot Pink Spectrum ─────────────────────────────────────

const DEPTH_COLORS = {
    5: '#FF8AD5',  // ░▒▓██  Level 5 — document title — light bubblegum pink
    4: '#FF5AC8',  // ░▒▓█   Level 4 — behavior headers, subtitles
    3: '#F030BD',  // ░▒▓    Level 3 — ALL dimension headers (D1-D15 same color)
    2: '#D930B5',  // ░▒     Level 2 — version, postconditions
    1: '#CC25AA',  // ░      Level 1 — date, deepest indent
};

const SEPARATOR_COLOR = '#FF5AC8';
const LABEL_COLOR = '#FFD580';      // Gold/amber — line-start labels ending in colon
const ACTION_COLOR = '#82AAFF';     // Slate blue — action verbs
const LOGIC_COLOR = '#FF9D00';      // Orange — logical operators (ALL CAPS)
const LOG_LEVEL_COLORS = {
    error: '#FF4444',
    warn: '#FFA500',
    info: '#4FC1FF',
    debug: '#7C7C7C',
};

// ─── Decoration Type Factories ────────────────────────────────────────────

function createDecorationType(color, bold) {
    const options = { color: color };
    if (bold) {
        options.fontWeight = 'bold';
    }
    return vscode.window.createTextEditorDecorationType(options);
}

// ─── Decoration Types ─────────────────────────────────────────────────────

// Heading hierarchy
const depthDecorations = {};
for (const [depth, color] of Object.entries(DEPTH_COLORS)) {
    depthDecorations[depth] = createDecorationType(color, true);
}
const separatorDecoration = createDecorationType(SEPARATOR_COLOR);
const dimensionDecoration = createDecorationType(DEPTH_COLORS[3]);

// Line-start labels — gold/amber
const labelDecoration = createDecorationType(LABEL_COLOR, true);

// Backtick code — dark background, monospace feel
const backtickDecoration = vscode.window.createTextEditorDecorationType({
    color: '#9CDCFE',
    backgroundColor: '#1E1E3A',
    borderRadius: '3px',
});

// Log levels
const logErrorDecoration = createDecorationType(LOG_LEVEL_COLORS.error, true);
const logWarnDecoration = createDecorationType(LOG_LEVEL_COLORS.warn, true);
const logInfoDecoration = createDecorationType(LOG_LEVEL_COLORS.info, true);
const logDebugDecoration = createDecorationType(LOG_LEVEL_COLORS.debug);

// Action verbs — slate blue
const actionDecoration = createDecorationType(ACTION_COLOR);

// Logical operators — orange, bold
const logicDecoration = createDecorationType(LOGIC_COLOR, true);

// Severity markers
const blockingDecoration = createDecorationType('#FF4444', true);
const specIssueDecoration = createDecorationType('#FF6B6B', true);
const passDecoration = createDecorationType('#00FF7F', true);
const failDecoration = createDecorationType('#FF0000', true);

// ─── Regex Patterns ───────────────────────────────────────────────────────

// Heading hierarchy
const RE_TITLE_5 = /^░▒▓██(.*)$/;
const RE_TITLE_4 = /^░▒▓█(?!\s+B\d)(.*)$/;
const RE_TITLE_3 = /^░▒▓(?!█)(?!\s+B\d+-D\d)(.*)$/;
const RE_TITLE_2 = /^░▒(?!▓)(.*)$/;
const RE_TITLE_1 = /^░(?!░)(?!▒)\s+(.*)$/;
const RE_SEPARATOR = /^░{10,}$/;
const RE_BEHAVIOR = /^(░▒▓█)\s+(B\d+)(:)(.*)$/;
const RE_DIMENSION = /^(░▒▓)\s+(B\d+-D(\d+))(:)(.*)$/;

// Line-start labels: "Word or phrase:" at start of line
const RE_LABEL = /^([A-Z][A-Za-z /]+:)/;

// Backtick inline code
const RE_BACKTICK = /`([^`]+)`/g;

// Log levels
const RE_LOG_ERROR = /\b(ERROR|FATAL)\b/g;
const RE_LOG_WARN = /\b(WARN|WARNING)\b/g;
const RE_LOG_INFO = /\bINFO\b/g;
const RE_LOG_DEBUG = /\b(DEBUG|TRACE)\b/g;

// Action verbs — past/present/gerund forms
const RE_ACTION = /\b(log|logged|logging|test|tested|testing|scan|scanned|scanning|re-scan|re-scanned|rescan|rescanned|move|moved|moving|delete|deleted|deleting|rename|renamed|renaming|remove|removed|removing|send|sent|sending|receive|received|receiving|purge|purged|purging|create|created|creating|update|updated|updating|fetch|fetched|fetching|write|written|writing|read|reading|skip|skipped|skipping|merge|merged|merging|apply|applied|applying|trigger|triggered|triggering|queue|queued|queuing|retry|retried|retrying|verify|verified|verifying|process|processed|processing|download|downloaded|downloading|upload|uploaded|uploading|import|imported|importing|export|exported|exporting|resolve|resolved|resolving|detect|detected|detecting|preserve|preserved|preserving|restore|restored|restoring|associate|associated|associating|cascade|cascaded|cascading|dismantle|dismantled|dismantling|reconcile|reconciled|reconciling)\b/gi;

// Logical operators — ALL CAPS only
const RE_LOGIC = /\b(AND|OR|NOT|NOR|ALL|NONE|BOTH|EITHER|NEITHER|ALWAYS|NEVER|ONLY|MUST|SHALL|REQUIRED|OPTIONAL|EVERY|ANY|EACH)\b/g;

// Severity markers
const RE_BLOCKING = /\bBLOCKING\b/g;
const RE_SPEC_ISSUE = /\bSPEC ISSUE\b/g;
const RE_PASS = /\bPASS\b/g;
const RE_FAIL_MARKER = /\bFAIL\b/g;

// ─── Decoration Application ───────────────────────────────────────────────

function applyDecorations(editor) {
    if (!editor || editor.document.languageId !== 'totalspec') return;

    const doc = editor.document;

    const ranges = {
        depth: { 5: [], 4: [], 3: [], 2: [], 1: [] },
        separator: [],
        dimension: [],
        label: [],
        backtick: [],
        logError: [],
        logWarn: [],
        logInfo: [],
        logDebug: [],
        action: [],
        logic: [],
        blocking: [],
        specIssue: [],
        pass: [],
        fail: [],
    };

    for (let i = 0; i < doc.lineCount; i++) {
        const line = doc.lineAt(i).text;
        let match;

        // ── Structural heading lines (mutually exclusive, use continue) ──

        if (RE_TITLE_5.test(line)) { ranges.depth[5].push(lineRange(doc, i)); continue; }
        if (RE_BEHAVIOR.test(line)) { ranges.depth[4].push(lineRange(doc, i)); continue; }
        if (RE_TITLE_4.test(line)) { ranges.depth[4].push(lineRange(doc, i)); continue; }
        if (RE_DIMENSION.test(line)) { ranges.dimension.push(lineRange(doc, i)); continue; }
        if (RE_TITLE_3.test(line)) { ranges.depth[3].push(lineRange(doc, i)); continue; }
        if (RE_SEPARATOR.test(line)) { ranges.separator.push(lineRange(doc, i)); continue; }
        if (RE_TITLE_2.test(line)) { ranges.depth[2].push(lineRange(doc, i)); continue; }
        if (RE_TITLE_1.test(line)) { ranges.depth[1].push(lineRange(doc, i)); continue; }

        // ── Body text lines — multiple patterns can match ──

        // Line-start label: "Word or phrase:" — color only the label portion
        if ((match = RE_LABEL.exec(line))) {
            ranges.label.push(charRange(doc, i, 0, match[1].length));
        }

        // Backtick code
        RE_BACKTICK.lastIndex = 0;
        while ((match = RE_BACKTICK.exec(line))) {
            ranges.backtick.push(charRange(doc, i, match.index, match.index + match[0].length));
        }

        // Log levels
        RE_LOG_ERROR.lastIndex = 0;
        while ((match = RE_LOG_ERROR.exec(line))) {
            ranges.logError.push(charRange(doc, i, match.index, match.index + match[0].length));
        }
        RE_LOG_WARN.lastIndex = 0;
        while ((match = RE_LOG_WARN.exec(line))) {
            ranges.logWarn.push(charRange(doc, i, match.index, match.index + match[0].length));
        }
        RE_LOG_INFO.lastIndex = 0;
        while ((match = RE_LOG_INFO.exec(line))) {
            ranges.logInfo.push(charRange(doc, i, match.index, match.index + match[0].length));
        }
        RE_LOG_DEBUG.lastIndex = 0;
        while ((match = RE_LOG_DEBUG.exec(line))) {
            ranges.logDebug.push(charRange(doc, i, match.index, match.index + match[0].length));
        }

        // Action verbs
        RE_ACTION.lastIndex = 0;
        while ((match = RE_ACTION.exec(line))) {
            ranges.action.push(charRange(doc, i, match.index, match.index + match[0].length));
        }

        // Logical operators (ALL CAPS)
        RE_LOGIC.lastIndex = 0;
        while ((match = RE_LOGIC.exec(line))) {
            ranges.logic.push(charRange(doc, i, match.index, match.index + match[0].length));
        }

        // Severity markers
        RE_BLOCKING.lastIndex = 0;
        while ((match = RE_BLOCKING.exec(line))) {
            ranges.blocking.push(charRange(doc, i, match.index, match.index + match[0].length));
        }
        RE_SPEC_ISSUE.lastIndex = 0;
        while ((match = RE_SPEC_ISSUE.exec(line))) {
            ranges.specIssue.push(charRange(doc, i, match.index, match.index + match[0].length));
        }
        RE_PASS.lastIndex = 0;
        while ((match = RE_PASS.exec(line))) {
            ranges.pass.push(charRange(doc, i, match.index, match.index + match[0].length));
        }
        RE_FAIL_MARKER.lastIndex = 0;
        while ((match = RE_FAIL_MARKER.exec(line))) {
            ranges.fail.push(charRange(doc, i, match.index, match.index + match[0].length));
        }
    }

    // ── Apply all decorations ──

    for (const [depth, deco] of Object.entries(depthDecorations)) {
        editor.setDecorations(deco, ranges.depth[depth] || []);
    }
    editor.setDecorations(separatorDecoration, ranges.separator);
    editor.setDecorations(dimensionDecoration, ranges.dimension);
    editor.setDecorations(labelDecoration, ranges.label);
    editor.setDecorations(backtickDecoration, ranges.backtick);
    editor.setDecorations(logErrorDecoration, ranges.logError);
    editor.setDecorations(logWarnDecoration, ranges.logWarn);
    editor.setDecorations(logInfoDecoration, ranges.logInfo);
    editor.setDecorations(logDebugDecoration, ranges.logDebug);
    editor.setDecorations(actionDecoration, ranges.action);
    editor.setDecorations(logicDecoration, ranges.logic);
    editor.setDecorations(blockingDecoration, ranges.blocking);
    editor.setDecorations(specIssueDecoration, ranges.specIssue);
    editor.setDecorations(passDecoration, ranges.pass);
    editor.setDecorations(failDecoration, ranges.fail);
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function lineRange(doc, lineNum) {
    const line = doc.lineAt(lineNum);
    return new vscode.Range(line.range.start, line.range.end);
}

function charRange(_doc, lineNum, startChar, endChar) {
    return new vscode.Range(
        new vscode.Position(lineNum, startChar),
        new vscode.Position(lineNum, endChar)
    );
}

// ─── Extension Lifecycle ──────────────────────────────────────────────────

const debounceTimers = new Map();

function decorateAllVisible() {
    for (const editor of vscode.window.visibleTextEditors) {
        applyDecorations(editor);
    }
}

function activate(context) {
    // Dispose decoration types when the extension is deactivated
    const allDecorations = [
        ...Object.values(depthDecorations),
        separatorDecoration,
        dimensionDecoration,
        labelDecoration,
        backtickDecoration,
        logErrorDecoration,
        logWarnDecoration,
        logInfoDecoration,
        logDebugDecoration,
        actionDecoration,
        logicDecoration,
        blockingDecoration,
        specIssueDecoration,
        passDecoration,
        failDecoration,
    ];
    for (const deco of allDecorations) {
        context.subscriptions.push(deco);
    }

    // Decorate all visible editors on activation
    decorateAllVisible();

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) applyDecorations(editor);
        })
    );

    context.subscriptions.push(
        vscode.window.onDidChangeVisibleTextEditors(() => {
            decorateAllVisible();
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            if (event.document.languageId !== 'totalspec') return;
            const uri = event.document.uri.toString();
            const existing = debounceTimers.get(uri);
            if (existing) clearTimeout(existing);
            debounceTimers.set(uri, setTimeout(() => {
                debounceTimers.delete(uri);
                for (const editor of vscode.window.visibleTextEditors) {
                    if (editor.document === event.document) {
                        applyDecorations(editor);
                    }
                }
            }, 150));
        })
    );
}

function deactivate() {
    for (const timer of debounceTimers.values()) {
        clearTimeout(timer);
    }
    debounceTimers.clear();
}

module.exports = { activate, deactivate };
