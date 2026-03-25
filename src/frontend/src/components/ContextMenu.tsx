import {
  FolderPlus,
  Monitor,
  RefreshCw,
  Settings,
  Terminal,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onOpenTerminal: () => void;
  onNextWallpaper: () => void;
}

export default function ContextMenu({
  x,
  y,
  onClose,
  onOpenTerminal,
  onNextWallpaper,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [onClose]);

  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - 250);

  const menuItems = [
    {
      icon: <Monitor size={14} />,
      label: "Change Wallpaper",
      onClick: () => {
        onNextWallpaper();
        onClose();
      },
    },
    {
      icon: <Terminal size={14} />,
      label: "Open Terminal",
      onClick: () => {
        onOpenTerminal();
        onClose();
      },
    },
    {
      icon: <FolderPlus size={14} />,
      label: "New Folder",
      onClick: onClose,
      sep: true,
    },
    {
      icon: <RefreshCw size={14} />,
      label: "Reload Desktop",
      onClick: onClose,
    },
    {
      icon: <Monitor size={14} />,
      label: "Display Settings",
      onClick: onClose,
    },
    { icon: <Settings size={14} />, label: "Settings", onClick: onClose },
  ];

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className="fixed z-[2000] rounded-xl overflow-hidden py-1"
        style={{
          left: adjustedX,
          top: adjustedY,
          minWidth: "180px",
          background: "oklch(0.16 0.035 300 / 0.97)",
          backdropFilter: "blur(20px)",
          border: "1px solid oklch(0.26 0.04 295)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        {menuItems.map((item) => (
          <div key={item.label}>
            {item.sep && (
              <div
                className="my-1 mx-2"
                style={{ height: "1px", background: "oklch(0.24 0.03 295)" }}
              />
            )}
            <button
              type="button"
              onClick={item.onClick}
              className="w-full flex items-center gap-3 px-3 py-1.5 text-left text-xs transition-ubuntu hover:bg-white/5"
              style={{ color: "oklch(0.82 0.03 260)", fontSize: "13px" }}
            >
              <span style={{ color: "oklch(0.55 0.04 260)" }}>{item.icon}</span>
              {item.label}
            </button>
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
