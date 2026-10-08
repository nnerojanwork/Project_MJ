"use client";

import Editor from "@monaco-editor/react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onCheck: () => void;
  running: boolean;
}

export function EditorPanel({ value, onChange, onRun, onCheck, running }: Props) {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          defaultLanguage="sql"
          theme="vs-dark"
          value={value}
          onChange={(v) => onChange(v ?? "")}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            renderLineHighlight: "none",
            automaticLayout: true,
          }}
        />
      </div>
      <div className="flex shrink-0 items-center gap-2 border-t border-ink-700 bg-ink-900 px-4 py-2.5">
        <button
          onClick={onRun}
          disabled={running}
          className="rounded-md border border-ink-600 bg-ink-800 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-ink-700 disabled:opacity-50"
        >
          Run Query
        </button>
        <button
          onClick={onCheck}
          disabled={running}
          className="rounded-md bg-accent px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-accent-light disabled:opacity-50"
        >
          Check Answer
        </button>
        <span className="ml-auto text-[11px] text-slate-500">⌘/Ctrl + Enter to run</span>
      </div>
    </div>
  );
}
