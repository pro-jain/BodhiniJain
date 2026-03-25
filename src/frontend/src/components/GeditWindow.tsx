import { useState } from "react";

export default function GeditWindow() {
  const [content, setContent] = useState(
    `// Untitled Document (read-only workspace)
// Changes are temporary and not saved to disk.

function helloWorld() {
  console.log("Hello from Gedit mock!");
}
`
  );

  return (
    <div className="h-full flex flex-col" style={{ background: "oklch(0.12 0.02 260)", color: "white" }}>
      <div
        className="flex items-center justify-between px-3 py-2 text-xs"
        style={{
          background: "oklch(0.14 0.02 260)",
          borderBottom: "1px solid oklch(0.22 0.02 260)",
          letterSpacing: "0.01em",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold">Gedit</span>
          <span className="opacity-60">•</span>
          <span className="opacity-80">Unsaved Document</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span style={{ color: "#fbbf24" }}>Read-only sandbox</span>
          <span className="opacity-60">Changes are not persisted</span>
        </div>
      </div>

      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          spellCheck={false}
          className="w-full h-full resize-none p-4 font-mono text-sm leading-6 outline-none"
          style={{
            background: "oklch(0.1 0.02 260)",
            color: "oklch(0.92 0.02 260)",
            border: "none",
          }}
        />
      </div>

      <div
        className="flex items-center justify-between px-3 py-2 text-[11px]"
        style={{
          background: "oklch(0.14 0.02 260)",
          borderTop: "1px solid oklch(0.22 0.02 260)",
        }}
      >
        <div className="flex items-center gap-2 opacity-75">
          <span>Ln {content.split("\n").length}, Col {content.split("\n").slice(-1)[0]?.length ?? 0}</span>
          <span>•</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <span>Save disabled (read-only)</span>
        </div>
      </div>
    </div>
  );
}
