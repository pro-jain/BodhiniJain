import { Blocks, Files, GitBranch, Search } from "lucide-react";

export default function VsCodeWindow() {
  const sidebarIcons = [
    { Icon: Files, label: "Explorer" },
    { Icon: Search, label: "Search" },
    { Icon: GitBranch, label: "Source Control" },
    { Icon: Blocks, label: "Extensions" },
  ];

  return (
    <div className="h-full w-full bg-[#0f1525] text-white flex flex-col select-none">
      {/* Title bar mock */}
      <div className="flex items-center px-4 h-9" style={{ background: "#1f2435", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="text-sm font-medium text-white/80">VS Code — readonly mock</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar mock */}
        <div
          className="flex flex-col items-center gap-3 py-4 px-2"
          style={{ width: "54px", background: "#151b2d", borderRight: "1px solid rgba(255,255,255,0.06)", pointerEvents: "none" }}
        >
          {sidebarIcons.map(({ Icon, label }, idx) => (
            <div
              key={label}
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: idx === 0 ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.9)",
              }}
              title={label}
            >
              <Icon size={18} strokeWidth={1.7} />
            </div>
          ))}
        </div>

        {/* Explorer + editor mock */}
        <div className="flex-1 flex" style={{ pointerEvents: "none" }}>
          <div
            className="w-52 border-r border-white/5 p-3 space-y-2"
            style={{ background: "#0f1525" }}
          >
            <div className="text-xs uppercase tracking-wide text-white/50">Explorer</div>
            <div className="text-sm text-white/80">HELLO_WORLD.md</div>
            <div className="text-sm text-white/50">readme.txt</div>
            <div className="text-sm text-white/50">notes.md</div>
          </div>
          <div className="flex-1 flex flex-col" style={{ background: "#0f111c" }}>
            <div className="h-9 px-3 flex items-center gap-3 border-b border-white/5" style={{ background: "#0f1525" }}>
              <div className="text-sm text-white/70">HELLO_WORLD.md</div>
            </div>
            <div className="flex-1 flex items-right justify-right">
              <div className="text-l text-white/50">1 </div>
              <div className="text-l text-white/90">print("Hello, World!")</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
