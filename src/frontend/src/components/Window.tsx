import { Maximize2, Minimize2, Minus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const DOCK_WIDTH = 60;
const TOP_BAR_HEIGHT = 30;

export interface WindowProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (w: number, h: number) => void;
}

export default function Window({
  id,
  title,
  icon,
  isMinimized,
  isMaximized,
  zIndex,
  x,
  y,
  width,
  height,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
}: WindowProps) {
  const dragState = useRef<{
    startX: number;
    startY: number;
    winX: number;
    winY: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      winX: x,
      winY: y,
    };
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.current) return;
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      onMove(
        Math.max(DOCK_WIDTH, dragState.current.winX + dx),
        Math.max(TOP_BAR_HEIGHT, dragState.current.winY + dy),
      );
    };

    const handleMouseUp = () => {
      dragState.current = null;
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, onMove]);

  if (isMinimized) return null;

  const windowStyle = isMaximized
    ? {
        position: "fixed" as const,
        top: TOP_BAR_HEIGHT,
        left: DOCK_WIDTH,
        right: 0,
        bottom: 0,
        borderRadius: 0,
        zIndex,
      }
    : {
        position: "fixed" as const,
        left: x,
        top: y,
        width,
        height,
        borderRadius: 8,
        zIndex,
      };

  return (
    <AnimatePresence>
      <motion.div
        key={id}
        className="window-open flex flex-col overflow-hidden"
        style={{
          ...windowStyle,
          background: "oklch(0.17 0.03 300)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.93 }}
        transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        onMouseDown={onFocus}
      >
        {/* Ubuntu-style title bar */}
        <div
          className="window-drag flex items-center px-3 flex-shrink-0 relative select-none"
          style={{
            height: "36px",
            background: "oklch(0.2 0.04 300)",
            borderBottom: "1px solid rgba(0,0,0,0.35)",
            cursor: isDragging ? "grabbing" : isMaximized ? "default" : "grab",
          }}
          onMouseDown={handleTitleMouseDown}
          onDoubleClick={onMaximize}
        >
          {/* Title with icon — left-aligned in center area */}
          <div className="flex items-center gap-2 flex-1 overflow-hidden">
            {icon && (
              <span
                className="opacity-75 flex-shrink-0"
                style={{ color: "#e0d8c8" }}
              >
                {icon}
              </span>
            )}
            <span
              className="text-white/80 font-medium truncate"
              style={{ fontSize: "13px", letterSpacing: "0.01em" }}
            >
              {title}
            </span>
          </div>

          {/* Ubuntu window controls — RIGHT side */}
          {/* Order: minimize, maximize, close */}
          <div className="flex items-center gap-1 z-10 flex-shrink-0 ml-2">
            {/* Minimize */}
            <button
              type="button"
              data-ocid="window.minimize_button"
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              className="flex items-center justify-center group"
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "4px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                transition: "background 0.1s ease",
              }}
              title="Minimize"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.18)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.08)";
              }}
            >
              <Minus size={10} strokeWidth={2.5} style={{ color: "#e0d8c8" }} />
            </button>

            {/* Maximize */}
            <button
              type="button"
              data-ocid="window.maximize_button"
              onClick={(e) => {
                e.stopPropagation();
                onMaximize();
              }}
              className="flex items-center justify-center group"
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "4px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                transition: "background 0.1s ease",
              }}
              title={isMaximized ? "Restore" : "Maximize"}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.18)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.08)";
              }}
            >
              {isMaximized ? (
                <Minimize2
                  size={10}
                  strokeWidth={2.5}
                  style={{ color: "#e0d8c8" }}
                />
              ) : (
                <Maximize2
                  size={10}
                  strokeWidth={2.5}
                  style={{ color: "#e0d8c8" }}
                />
              )}
            </button>

            {/* Close */}
            <button
              type="button"
              data-ocid="window.close_button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="flex items-center justify-center group"
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "4px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                transition: "background 0.1s ease",
              }}
              title="Close"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#c01c28";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "#e01c2f";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(255,255,255,0.12)";
              }}
            >
              <X size={10} strokeWidth={2.5} style={{ color: "#e0d8c8" }} />
            </button>
          </div>
        </div>

        {/* Window content */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </motion.div>
    </AnimatePresence>
  );
}
