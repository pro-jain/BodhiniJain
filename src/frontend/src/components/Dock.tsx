import {
  Code2,
  Settings,
  Folder,
  Globe,
  LayoutGrid,
  Terminal,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export interface DockApp {
  id: string;
  label: string;
  icon: React.ReactNode;
  isOpen?: boolean;
  onClick: () => void;
}

interface DockProps {
  openApps: { id: string; title: string; minimized: boolean }[];
  onAppClick: (id: string) => void;
  onTerminalOpen: () => void;
  onFolderOpen: (type: string) => void;
  onBrowserOpen: () => void;
  onCalculatorOpen: () => void;
  onVSCodeOpen: () => void;
}

const ChromeMark = () => (
  <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="32" cy="32" r="30" fill="#ea4335" />
    <path d="M32 2a30 30 0 0 1 25.7 15H32Z" fill="#fbbc05" />
    <path d="M14.4 18A30 30 0 0 1 32 2v31.5Z" fill="#4285f4" />
    <path d="M57.7 47.8A30 30 0 0 1 6.6 20h25.4Z" fill="#34a853" />
    <circle cx="32" cy="32" r="11" fill="#1a73e8" stroke="white" strokeWidth="2.5" />
  </svg>
);


const CalculatorMark = () => (
  <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true">
    <rect x="8" y="6" width="48" height="52" rx="10" fill="#f3f4f6" stroke="#1f2937" strokeWidth="3" />
    <rect x="16" y="12" width="32" height="12" rx="4" fill="#111827" />
    <rect x="16" y="28" width="10" height="10" rx="2.5" fill="#1f2937" />
    <rect x="27" y="28" width="10" height="10" rx="2.5" fill="#1f2937" />
    <rect x="38" y="28" width="10" height="10" rx="2.5" fill="#ef4444" />
    <rect x="16" y="40" width="10" height="10" rx="2.5" fill="#1f2937" />
    <rect x="27" y="40" width="10" height="10" rx="2.5" fill="#1f2937" />
    <rect x="38" y="40" width="10" height="10" rx="2.5" fill="#10b981" />
  </svg>
);

const ALL_DRAWER_APPS = [
  {
    id: "about",
    label: "About Me",
    color: "#E95420",
    ocid: "dock.drawer.about.button,icon",
    iconSrc: "user-home.png",
  },
  { id: "projects", label: "Projects", color: "#ffffff", ocid: "dock.drawer.projects.button", iconSrc: "projects.png" },
  { id: "experiences", label: "Experiences", color: "#ffffff", ocid: "dock.drawer.experiences.button", iconSrc: "experience.png" },
  { id: "skills", label: "Skills", color: "#ffffff", ocid: "dock.drawer.skills.button", iconSrc: "skills.png" },
  { id: "achievements", label: "Achievements", color: "#ffffff", ocid: "dock.drawer.achievements.button", iconSrc: "achievements.png" },
  { id: "browser", label: "Browser", color: "#ffffff", ocid: "dock.drawer.browser.button", iconSrc: "chrome.png" },
  { id: "terminal", label: "Terminal", color: "#ffffff", ocid: "dock.drawer.terminal.button", iconSrc: "bash.png" },
  { id: "calculator", label: "Calculator", color: "#ffffff", ocid: "dock.drawer.calculator.button", icon: <CalculatorMark /> },
  { id: "vscode", label: "VS Code", color: "#ffffff", ocid: "dock.drawer.vscode.button", iconSrc: "vscode.png" },
  { id: "gedit", label: "Gedit", color: "#ffffff", ocid: "dock.drawer.gedit.button", iconSrc: "gedit.png" },

];

export default function Dock({
  openApps,
  onAppClick,
  onTerminalOpen,
  onFolderOpen,
  onBrowserOpen,
  onCalculatorOpen,
  onVSCodeOpen,
}: DockProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState("");

  const baseApps: DockApp[] = [
    {
      id: "browser",
      label: "Browser",
      icon: (<img
      src="chrome.png"
      alt="chrome"
      width={35}
      height={35}
      draggable={false}
      style={{ objectFit: "contain" }}
    />),
      onClick: onBrowserOpen,
    },
    {
      id: "files",
      label: "Files",
      icon: ( <img
      src="user-home.png"
      alt="me"
      width={35}
      height={35}
      draggable={false}
      style={{ objectFit: "contain" }}
    />),
      onClick: () => onFolderOpen("about"),
    },
    {
      id: "terminal",
      label: "Terminal",
      icon: ( <img
      src="bash.png"
      alt="terminal"
      width={38}
      height={38}
      draggable={false}
      style={{ objectFit: "contain" }}
    />),
      onClick: onTerminalOpen,
    },
    {
      id: "calculator",
      label: "Calculator",
      icon: <CalculatorMark />,
      onClick: onCalculatorOpen,
    },
    {
      id: "vscode",
      label: "VS Code",
      icon: (<img
      src="vscode.png"
      alt="vscode"
      width={28}
      height={28}
      draggable={false}
      style={{ objectFit: "contain" }}
    />
       
      ),
      onClick: onVSCodeOpen,
    },
  
     { id: "gedit", label: "Gedit",
       icon: (<img
       src="gedit.png"
       alt="gedit"
       width={35}
       height={35}
       draggable={false}
       style={{ objectFit: "contain" }}
     />),
       onClick: () => onFolderOpen("gedit")  },

  ];

  const openAppDockItems = openApps
    .filter((app) => !baseApps.find((b) => b.id === app.id))
    .map((app) => ({
      id: app.id,
      label: app.title,
      icon: <Globe size={26} strokeWidth={1.5} />,
      isOpen: true,
      onClick: () => onAppClick(app.id),
    }));

  const allApps = [...baseApps, ...openAppDockItems];

  const isAppOpen = (id: string) => openApps.some((a) => a.id === id);

  const filteredDrawerApps = ALL_DRAWER_APPS.filter(
    (a) => !drawerSearch || a.label.toLowerCase().includes(drawerSearch.toLowerCase()),
  );

  return (
    <>
      {/* Vertical left dock */}
      <div
        className="fixed left-0 top-0 bottom-0 flex flex-col items-center py-2 z-[999]"
        style={{
          width: "60px",
          top: "36px",
          background: "rgba(18,18,22,0.82)",
          backdropFilter: "blur(18px)",
          boxShadow:
            "2px 0 14px rgba(0,0,0,0.6), inset -1px 0 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Scrollable apps section */}
        <div
          className="flex-1 flex flex-col items-center gap-1 overflow-y-auto overflow-x-hidden w-full px-1 py-1"
          style={{ scrollbarWidth: "none" }}
        >
          {allApps.map((app) => {
            const open = isAppOpen(app.id) || app.isOpen;
            const isHovered = hoveredId === app.id;

            return (
              <div
                key={app.id}
                className="relative flex items-center w-full"
                onMouseEnter={() => setHoveredId(app.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Open app indicator — orange dot on LEFT edge */}
                {open && (
                  <div
                    className="absolute left-0 rounded-r-full"
                    style={{
                      width: "3px",
                      height: "20px",
                      background: "#E95420",
                      boxShadow: "0 0 6px rgba(233,84,32,0.7)",
                    }}
                  />
                )}

                <motion.button
                  type="button"
                  data-ocid={`dock.${app.id}.button`}
                  onClick={app.onClick}
                  className="flex items-center justify-center mx-auto rounded-xl"
                  style={{
                    width: "44px",
                    height: "44px",
                    background: isHovered
                      ? "rgba(255,255,255,0.14)"
                      : open
                        ? "rgba(255,255,255,0.09)"
                        : "rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.85)",
                    transition: "background 0.12s ease, transform 0.12s ease",
                    boxShadow: isHovered
                      ? "0 10px 30px rgba(0,0,0,0.35)"
                      : "0 6px 16px rgba(0,0,0,0.32)",
                  }}
                  whileHover={{ x: 3, scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                >
                  {app.icon}
                </motion.button>

                {/* Tooltip on hover — appears to the RIGHT */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.12 }}
                      className="absolute left-[58px] px-2.5 py-1 rounded-md text-white text-xs whitespace-nowrap pointer-events-none"
                      style={{
                        background: "rgba(30,30,30,0.95)",
                        fontSize: "12px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        zIndex: 9999,
                      }}
                    >
                      {app.label}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div
          className="w-8 my-1"
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.12)",
          }}
        />

        {/* Show Applications button */}
        <div
          className="relative flex items-center w-full"
          onMouseEnter={() => setHoveredId("__drawer__")}
          onMouseLeave={() => setHoveredId(null)}
        >
          <motion.button
            type="button"
            data-ocid="dock.show_apps.button"
            onClick={() => setShowDrawer(true)}
            className="flex items-center justify-center mx-auto rounded-xl mb-1"
            style={{
              width: "44px",
              height: "44px",
              background:
                hoveredId === "__drawer__"
                  ? "rgba(255,255,255,0.12)"
                  : "transparent",
              transition: "background 0.12s ease",
            }}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.92 }}
            title="Show Applications"
          >
            <LayoutGrid
              size={22}
              strokeWidth={1.5}
              style={{ color: "rgba(255,255,255,0.75)" }}
            />
          </motion.button>

          <AnimatePresence>
            {hoveredId === "__drawer__" && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.12 }}
                className="absolute left-[58px] px-2.5 py-1 rounded-md text-white text-xs whitespace-nowrap pointer-events-none"
                style={{
                  background: "rgba(30,30,30,0.95)",
                  fontSize: "12px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  zIndex: 9999,
                }}
              >
                Show Applications
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* App Drawer Overlay */}
      <AnimatePresence>
        {showDrawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center"
            style={{
              background: "rgba(16,16,16,0.92)",
              backdropFilter: "blur(20px)",
            }}
            data-ocid="dock.apps.modal"
          >
            {/* Close button */}
            <button
              type="button"
              data-ocid="dock.apps.close_button"
              onClick={() => {
                setShowDrawer(false);
                setDrawerSearch("");
              }}
              className="absolute top-6 right-6 flex items-center justify-center rounded-full"
              style={{
                width: "36px",
                height: "36px",
                background: "rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <X size={16} />
            </button>

            <h2
              className="font-semibold mb-6"
              style={{ color: "rgba(255,255,255,0.9)", fontSize: "22px" }}
            >
              All Applications
            </h2>

            {/* Search */}
            <input
              type="text"
              data-ocid="dock.apps.search_input"
              value={drawerSearch}
              onChange={(e) => setDrawerSearch(e.target.value)}
              placeholder="Search applications..."
              className="mb-8 outline-none"
              style={{
                width: "320px",
                padding: "10px 16px",
                borderRadius: "24px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "white",
                fontSize: "14px",
              }}
            />

            {/* App grid */}
            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))",
                maxWidth: "640px",
                justifyContent: "center",
              }}
            >
              {filteredDrawerApps.map((app) => (
                <motion.button
                  key={app.id}
                  type="button"
                  data-ocid={`dock.drawer.${app.id}.button`}
                  onClick={() => {
                    if (
                        [
                          "about",
                          "projects",
                          "experiences",
                          "skills",
                        ].includes(app.id)
                      ) {
                        onFolderOpen(app.id === "skills" ? "skills" : app.id);
                    } else if (app.id === "achievements") {
                      onFolderOpen("achievements");
                    }else if (app.id === "terminal") {
                      onTerminalOpen();
                    } else if (app.id === "browser") {
                      onBrowserOpen();
                    } else if (app.id === "calculator") {
                      onCalculatorOpen();
                    } else if (app.id === "vscode") {
                      onVSCodeOpen();
                    } else if (app.id === "gedit") {
                      onFolderOpen("gedit");
                    }
                    setShowDrawer(false);
                    setDrawerSearch("");
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl"
                  style={{
                    background: "transparent",
                    transition: "background 0.12s ease",
                  }}
                  whileHover={{
                    background: "rgba(255,255,255,0.1)",
                    scale: 1.05,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className="flex items-center justify-center rounded-xl overflow-hidden"
                    style={{
                      width: "52px",
                      height: "52px",
                      background: `${app.color}25`,
                      border: `1px solid ${app.color}40`,
                      color: app.color,
                    }}
                  >
                    {app.iconSrc ? (
                      <img
                        src={app.iconSrc}
                        alt={app.label}
                        width={46}
                        height={46}
                        draggable={false}
                        style={{ objectFit: "contain" }}
                      />
                    ) : app.icon ? (
                      app.icon
                    ) : (
                      <Folder size={26} strokeWidth={1.5} />
                    )}
                  </div>
                  <span
                    className="text-center leading-tight"
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      fontSize: "11px",
                      wordBreak: "break-word",
                    }}
                  >
                    {app.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
