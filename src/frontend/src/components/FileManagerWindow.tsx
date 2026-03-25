import {
  ChevronRight,
  Clock,
  Folder,
  HardDrive,
  Home,
  Star,
  Trash2,
} from "lucide-react";
import type { ReactNode } from "react";

interface FileManagerWindowProps {
  breadcrumb: string[];
  children: ReactNode;
  onNavigate?: (label: string) => void;
}

const sidebarItems = [
  { icon: <Home size={14} />, label: "Home" },
  { icon: <Folder size={14} />, label: "Projects" },
  { icon: <Folder size={14} />, label: "Experiences" },
  { icon: <Folder size={14} />, label: "Achievements" },
  { icon: <Folder size={14} />, label: "Skills" },
  { icon: <Star size={14} />, label: "Starred" },
  { icon: <Clock size={14} />, label: "Recent" },
  { icon: <Trash2 size={14} />, label: "Trash" },
];

export default function FileManagerWindow({
  breadcrumb,
  children,
  onNavigate,
}: FileManagerWindowProps) {
  const activeLabel = breadcrumb[breadcrumb.length - 1];

  return (
    <div
      className="flex h-full"
      style={{ background: "oklch(0.14 0.025 295)" }}
    >
      {/* Sidebar */}
      <div
        className="flex-shrink-0 flex flex-col py-2"
        style={{
          width: "160px",
          background: "oklch(0.12 0.025 295)",
          borderRight: "1px solid oklch(0.2 0.03 295)",
        }}
      >
        <div className="px-2 mb-1">
          <p
            className="text-xs font-semibold uppercase tracking-wider px-2 py-1"
            style={{ color: "oklch(0.45 0.03 260)", fontSize: "10px" }}
          >
            Folders
          </p>
        </div>
        {sidebarItems.map((item) => {
          const isActive = item.label === activeLabel;
          return (
            <button
              type="button"
              key={item.label}
              className="flex items-center gap-2 px-3 py-1.5 mx-1 rounded-lg text-xs transition-ubuntu"
              style={{
                background: isActive ? "oklch(0.2 0.04 295)" : "transparent",
                color: isActive ? "white" : "oklch(0.62 0.03 260)",
                fontSize: "12px",
              }}
              onClick={() => onNavigate?.(item.label)}
            >
              <span
                style={{
                  color: isActive ? "#E95420" : "oklch(0.45 0.04 260)",
                }}
              >
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumb bar */}
        <div
          className="flex items-center gap-1 px-4 flex-shrink-0"
          style={{
            height: "32px",
            background: "oklch(0.13 0.025 295)",
            borderBottom: "1px solid oklch(0.2 0.03 295)",
            fontSize: "12px",
          }}
        >
          {breadcrumb.map((crumb, i) => (
            <div key={crumb} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight
                  size={12}
                  style={{ color: "oklch(0.4 0.03 260)" }}
                />
              )}
              <span
                style={{
                  color:
                    i === breadcrumb.length - 1
                      ? "white"
                      : "oklch(0.55 0.03 260)",
                }}
              >
                {crumb}
              </span>
            </div>
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
