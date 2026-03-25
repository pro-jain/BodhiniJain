import {
  Calculator as CalculatorIcon,
  Code2,
  Folder,
  Globe,
  FileText,
  Terminal as TerminalIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { usePortfolio, useProjects, useExperiences, useInterests, useAchievements } from "../hooks/useQueries";
import ContextMenu from "./ContextMenu";
import Dock from "./Dock";
import Calculator from "./Calculator";
import VsCodeWindow from "./VsCodeWindow";
import BrowserWindow from "./BrowserWindow";
import FileManagerWindow from "./FileManagerWindow";
import LockScreen from "./LockScreen";
import Terminal from "./Terminal";
import TopBar from "./TopBar";
import Window from "./Window";
import AboutMeSection from "@/components/sections/AboutMe";
import AchievementsSection from "@/components/sections/Achievements";
import ExperiencesSection from "@/components/sections/Experiences";
import InterestsSection from "@/components/sections/Interests";
import ProjectsSection from "@/components/sections/Projects";
import GeditWindow from "./GeditWindow";

interface WindowState {
  id: string;
  type:
    | "about"
    | "projects"
    | "experiences"
    | "achievements"
    | "skills"
    | "terminal"
    | "calculator"
    | "browser"
    | "vscode"
    | "gedit";
  title: string;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DesktopIconDef {
  id: string;
  type:
    | "about"
    | "projects"
    | "experiences"
    | "skills"
    | "terminal"
    | "calculator"
    | "browser"
    | "vscode"
    | "achievements";
  label: string;
  color: string;
  ocid: string;
  iconSrc: string;
}

let zCounter = 100;

type Wallpaper = {
  name: string;
  base: string;
  image?: string;
  asset?: string;
  overlay?: string;
};

const wallpapers: Wallpaper[] = [
   
  {
    name: "Ubuntu 22.04",
    base: "#0f0a1c",
    asset: "/wallpapers/ubuntu-22-04-5.png",
    overlay: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(18,8,24,0.65) 80%)",
  },
];

const desktopIcons: DesktopIconDef[] = [];

const windowDefaults: Record<
  string,
  { title: string; width: number; height: number }
> = {
  about: { title: "About Me — File Manager", width: 700, height: 500 },
  projects: { title: "Projects — File Manager", width: 760, height: 560 },
  experiences: { title: "Experiences — File Manager", width: 700, height: 520 },
  achievements: { title: "Achievements — File Manager", width: 680, height: 480 },
  skills: { title: "Skills — File Manager", width: 680, height: 500 },
  terminal: { title: "bodhini@portfolio: ~", width: 680, height: 460 },
  calculator: { title: "Calculator", width: 320, height: 420 },
  browser: { title: "Web", width: 960, height: 640 },
  vscode: { title: "VS Code", width: 1024, height: 680 },
  gedit: { title: "Gedit — Text Editor", width: 820, height: 560 },
};

const sectionBreadcrumbs: Record<string, string[]> = {
  about: ["Home", "About Me"],
  projects: ["Home", "Projects"],
  experiences: ["Home", "Experiences"],
  achievements: ["Home", "Achievements"],
  skills: ["Home", "Skills"],
};

export default function Desktop() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [lastClosedSection, setLastClosedSection] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const { data: portfolio, isLoading } = usePortfolio();
  const {
    data: projects,
    isLoading: projectsLoading,
  } = useProjects();
  const { data: experiences, isLoading: experiencesLoading } = useExperiences();
  const { data: interests, isLoading: interestsLoading } = useInterests();
  const { data: achievements, isLoading: achievementsLoading } = useAchievements();

  const currentWallpaper = wallpapers[wallpaperIndex];
  const wallpaperLayers = currentWallpaper.asset
    ? `${currentWallpaper.image ? `${currentWallpaper.image}, ` : ""}url('${currentWallpaper.asset}')`
    : currentWallpaper.image;

  const nextWallpaper = useCallback(() => {
    setWallpaperIndex((idx) => (idx + 1) % wallpapers.length);
  }, []);

  const openWindow = useCallback((type: string) => {
    const winType = type as WindowState["type"];
    setLastClosedSection(null);
    setWindows((prev) => {
      const existing = prev.find((w) => w.type === winType);
      if (existing) {
        return prev.map((w) =>
          w.id === existing.id
            ? { ...w, minimized: false, zIndex: ++zCounter }
            : w,
        );
      }
      const defaults = windowDefaults[winType];
      const offset = prev.length * 24;
      return [
        ...prev,
        {
          id: `${winType}-${Date.now()}`,
          type: winType,
          title: defaults.title,
          minimized: false,
          maximized: false,
          zIndex: ++zCounter,
          x: 100 + offset,
          y: 60 + offset,
          width: defaults.width,
          height: defaults.height,
        },
      ];
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const win = prev.find((w) => w.id === id);
      if (win && ["about", "projects", "experiences", "achievements", "skills"].includes(win.type)) {
        setLastClosedSection(win.type);
      }
      return prev.filter((w) => w.id !== id);
    });
  }, []);

  const closeSectionWindow = useCallback((type: string) => {
    setWindows((prev) => {
      const target = prev.find((w) => w.type === type);
      if (!target) return prev;
      setLastClosedSection(type);
      return prev.filter((w) => w.id !== target.id);
    });
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)),
    );
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: ++zCounter } : w)),
    );
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const portfolioForTerminal = {
    name: "Bodhini Jain",
    bio: portfolio?.aboutMe.bio || "",
    projects: portfolio?.projects || [],
    experiences: portfolio?.experiences || [],
    interests: portfolio?.interests || [],
    skills: portfolio?.aboutMe.skills || [],
  };

  const handleSidebarNavigate = useCallback(
    (label: string, windowId: string) => {
      const map: Record<string, WindowState["type"]> = {
        Home: "about",
        Projects: "projects",
        Experiences: "experiences",
        Achievements: "achievements",
        Skills: "skills",
      };
      const target = map[label];
      if (!target) return;

      setWindows((prev) =>
        prev.map((w) =>
          w.id === windowId
            ? {
                ...w,
                type: target,
                title: windowDefaults[target].title,
                minimized: false,
              }
            : w,
        ),
      );
    },
    [],
  );

  const renderWindowContent = (win: WindowState) => {
    if (win.type === "terminal") {
      return (
        <Terminal
          onOpenWindow={openWindow}
          onCloseWindow={closeSectionWindow}
          closedSection={lastClosedSection}
          portfolioData={portfolioForTerminal}
        />
      );
    }
    if (win.type === "calculator") {
      return <Calculator />;
    }
    if (win.type === "browser") {
      return <BrowserWindow url="https://www.google.com/webhp?igu=1" />;
    }
    if (win.type === "vscode") {
      return <VsCodeWindow />;
    }
    if (win.type === "gedit") {
      return <GeditWindow />;
    }
    const breadcrumb = sectionBreadcrumbs[win.type] || ["Home", "Portfolio"];
    return (
      <FileManagerWindow
        breadcrumb={breadcrumb}
        onNavigate={(label) => handleSidebarNavigate(label, win.id)}
      >
        {win.type === "about" && (
          <AboutMeSection data={portfolio?.aboutMe} isLoading={isLoading} />
        )}
        {win.type === "projects" && (
          <ProjectsSection data={projects} isLoading={projectsLoading} />
        )}
        {win.type === "experiences" && (
          <ExperiencesSection
            data={experiences}
            isLoading={experiencesLoading}
          />
        )}
        {win.type === "achievements" && (
          <AchievementsSection
            data={achievements}
            isLoading={achievementsLoading}
          />
        )}
        {win.type === "skills" && (
          <InterestsSection data={interests} isLoading={interestsLoading} />
        )}
      </FileManagerWindow>
    );
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: currentWallpaper.base,
        filter: `brightness(${Math.max(25, brightness) / 100})`,
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
      }}
      onClick={() => {
        setSelectedIcon(null);
        setContextMenu(null);
      }}
      onKeyDown={() => {}}
    >
      {/* Wallpaper */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: wallpaperLayers,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: currentWallpaper.overlay,
          mixBlendMode: "screen",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 16% 50%, rgba(255,255,255,0.045), transparent 30%), radial-gradient(circle at 78% 68%, rgba(255,255,255,0.04), transparent 28%)",
        }}
      />

      <TopBar
        onActivitiesClick={() => {}}
        onPowerClick={() => setIsLocked(true)}
        brightness={brightness}
        onBrightnessChange={setBrightness}
      />

      {/* Desktop icons — LEFT side, offset from dock */}
      <div
        className="absolute top-10 flex flex-col gap-1 pt-2"
        style={{ left: "72px", zIndex: 10 }}
      >
        {desktopIcons.map((icon) => {
          const isSelected = selectedIcon === icon.id;
          return (
            <motion.button
              type="button"
              key={icon.id}
              data-ocid={icon.ocid}
              className="desktop-icon flex flex-col items-center gap-1 cursor-pointer px-2 py-1.5 rounded-lg"
              style={{
                width: "76px",
                background: isSelected
                  ? "rgba(190, 232, 4, 0.9)"
                  : "rgba(255,255,255,0.04)",
                border: isSelected
                  ? "1px solid rgba(233,84,32,0.5)"
                  : "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
                backdropFilter: "blur(14px)",
                transition: "all 0.14s ease",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIcon(icon.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                openWindow(icon.type);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") openWindow(icon.type);
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <div
                className="w-12 h-12 rounded-lg overflow-hidden border flex items-center justify-center bg-black/30"
                style={{
                  borderColor: `${icon.color}45`,
                  boxShadow: isSelected
                    ? `0 0 16px ${icon.color}45`
                    : "0 3px 10px rgb(221, 254, 9)",
                }}
              >
                <img
                  src={icon.iconSrc}
                  alt={icon.label}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
              <span
                className="text-center leading-tight font-medium"
                style={{
                  fontSize: "11px",
                  color: "white",
                  textShadow: "0 1px 4px rgba(0,0,0,0.9)",
                  wordBreak: "break-word",
                }}
              >
                {icon.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Mobile notice */}
      <div
        className="absolute inset-0 flex items-center justify-center z-[3000] md:hidden"
        style={{ background: "oklch(0.1 0.04 295 / 0.97)" }}
      >
        <div className="text-center p-8 max-w-sm">
          <div className="text-5xl mb-4">🖥️</div>
          <h2 className="text-xl font-bold text-white mb-2">
            Desktop Experience
          </h2>
          <p className="text-sm" style={{ color: "oklch(0.65 0.04 260)" }}>
            This portfolio is best experienced on a desktop browser.
          </p>
        </div>
      </div>

      {/* Windows */}
      <AnimatePresence>
        {windows.map((win) => (
          <Window
            key={win.id}
            {...win}
            isMinimized={win.minimized}
            isMaximized={win.maximized}
            icon={
              win.type === "terminal" ? (
                <TerminalIcon size={13} />
              ) : win.type === "calculator" ? (
                <CalculatorIcon size={13} />
              ) : win.type === "browser" ? (
                <Globe size={13} />
              ) : win.type === "vscode" ? (
                <Code2 size={13} />
              ) : win.type === "gedit" ? (
                <FileText size={13} />
              ) : (
                <Folder size={13} />
              )
            }
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => maximizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onMove={(x, y) => moveWindow(win.id, x, y)}
            onResize={() => {}}
          >
            {renderWindowContent(win)}
          </Window>
        ))}
      </AnimatePresence>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onOpenTerminal={() => openWindow("terminal")}
          onNextWallpaper={nextWallpaper}
        />
      )}

      <Dock
        openApps={windows.map((w) => ({
          id: w.id,
          title: w.title,
          minimized: w.minimized,
        }))}
        onAppClick={(id) => {
          const win = windows.find((w) => w.id === id);
          if (win?.minimized) {
            setWindows((prev) =>
              prev.map((w) =>
                w.id === id
                  ? { ...w, minimized: false, zIndex: ++zCounter }
                  : w,
              ),
            );
          } else {
            focusWindow(id);
          }
        }}
        onTerminalOpen={() => openWindow("terminal")}
        onFolderOpen={openWindow}
        onBrowserOpen={() => openWindow("browser")}
        onCalculatorOpen={() => openWindow("calculator")}
        onVSCodeOpen={() => openWindow("vscode")}
      />

      {/* Lock Screen */}
      <LockScreen isLocked={isLocked} onUnlock={() => setIsLocked(false)} />

      {/* Footer */}
      <div
        className="fixed bottom-3 left-16 flex items-center gap-2 text-xs pointer-events-auto"
        style={{ zIndex: 12 }}
      >
        <button
          type="button"
          onClick={nextWallpaper}
          className="px-2.5 py-1 rounded-lg"
          style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.75)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
          }}
        >
          {currentWallpaper.name}
        </button>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 1, paddingBottom: "4px" }}
      >
        <p
          className="text-xs"
          style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}
        >
          © {new Date().getFullYear()}. Crafted with care.
        </p>
      </div>
    </div>
  );
}
