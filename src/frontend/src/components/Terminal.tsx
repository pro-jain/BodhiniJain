import { useCallback, useEffect, useRef, useState } from "react";

interface TerminalLine {
  id: number;
  type: "prompt" | "output" | "error" | "system";
  content: string;
}

interface TerminalProps {
  onOpenWindow: (type: string) => void;
  onCloseWindow?: (type: string) => void;
  closedSection?: string | null;
  portfolioData: {
    name: string;
    bio: string;
    projects: { name: string; description: string; techStack: string[] }[];
    experiences: { company: string; role: string; duration: string }[];
    interests: { name: string }[];
    skills: { name: string; proficiency: bigint }[];
  };
}

let lineId = 0;
const mkLine = (type: TerminalLine["type"], content: string): TerminalLine => ({
  id: ++lineId,
  type,
  content,
});

const HOME = "/home/bodhini";
const VALID_SECTIONS = ["about", "projects", "experiences", "skills"];

function dirToDisplay(dir: string): string {
  if (dir === HOME) return "~";
  if (dir.startsWith(`${HOME}/`)) return `~${dir.slice(HOME.length)}`;
  return dir;
}

export default function Terminal({
  onOpenWindow,
  onCloseWindow,
  closedSection,
  portfolioData,
}: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    mkLine("system", "Welcome to Portfolio Terminal v1.0.0"),
    mkLine("system", `Last login: ${new Date().toDateString()} on tty1`),
    mkLine("system", ""),
    mkLine("system", 'Type "help" to see available commands.'),
    mkLine("system", ""),
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [scrollTick, setScrollTick] = useState(0);
  const [cwd, setCwd] = useState(HOME);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastHandledClose = useRef<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scrollTick is an intentional trigger dep
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [scrollTick]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // When a section window is closed externally, reset cwd to home and clear active section.
  useEffect(() => {
    if (
      closedSection &&
      closedSection === activeSection &&
      closedSection !== lastHandledClose.current
    ) {
      lastHandledClose.current = closedSection;
      setCwd(HOME);
      setActiveSection(null);
      setLines((prev) => [
        ...prev,
        mkLine("system", `Closed ${closedSection} window.`),
        mkLine("output", ""),
      ]);
      setScrollTick((t) => t + 1);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [closedSection, activeSection]);

  const processCommand = useCallback(
    (cmd: string, currentCwd: string) => {
      const push = (...newLines: TerminalLine[]) => {
        setLines((prev) => [...prev, ...newLines]);
        setScrollTick((t) => t + 1);
      };
      const trimmed = cmd.trim();
      const parts = trimmed.split(" ");
      const command = parts[0].toLowerCase();
      const args = parts.slice(1);
      const promptLine = mkLine("prompt", trimmed);

      if (!trimmed) {
        push(promptLine, mkLine("output", ""));
        return;
      }

      const C = String.fromCharCode(27);

      switch (command) {
        case "help": {
          push(
            promptLine,
            mkLine("output", ""),
            mkLine(
              "output",
              `${C}[1;33m╔══════════════════════════════════════╗`,
            ),
            mkLine("output", "║       Portfolio Terminal Commands    ║"),
            mkLine("output", `╚══════════════════════════════════════╝${C}[0m`),
            mkLine("output", ""),
            mkLine("output", `  ${C}[1;32mNavigation${C}[0m`),
            mkLine("output", "  ls [flags]         List directory contents"),
            mkLine("output", "  cd <dir>           Change directory"),
            mkLine("output", "  pwd                Print working directory"),
            mkLine("output", "  cat <section>      View section content"),
            mkLine("output", ""),
            mkLine("output", `  ${C}[1;32mSections${C}[0m`),
            mkLine("output", "  about, projects, experiences, skills"),
            mkLine("output", ""),
            mkLine("output", `  ${C}[1;32mSystem${C}[0m`),
            mkLine("output", "  whoami              Show current user"),
            mkLine("output", "  uname [-a]          System information"),
            mkLine("output", "  date                Current date and time"),
            mkLine("output", "  uptime              System uptime"),
            mkLine("output", "  history             Command history"),
            mkLine("output", "  echo <text>         Print text"),
            mkLine("output", "  man <cmd>           Manual page"),
            mkLine("output", "  sudo <cmd>          Run as superuser"),
            mkLine("output", "  neofetch            System information art"),
            mkLine("output", "  clear               Clear the terminal"),
            mkLine("output", "  exit                Log out"),
            mkLine("output", ""),
          );
          break;
        }
        case "clear": {
          setLines([]);
          setScrollTick((t) => t + 1);
          break;
        }
        case "whoami": {
          push(promptLine, mkLine("output", "bodhini"), mkLine("output", ""));
          break;
        }
        case "pwd": {
          push(promptLine, mkLine("output", currentCwd), mkLine("output", ""));
          break;
        }
        case "ls": {
          const flag = args[0]?.toLowerCase();
          const isLong = flag === "-l" || flag === "-la" || flag === "-al";
          const section = currentCwd.replace(`${HOME}/`, "");
          const isHome = currentCwd === HOME;

          if (isLong) {
            const date = "Mar 15 10:30";
            const longLines: TerminalLine[] = [mkLine("output", "")];
            longLines.push(
              mkLine("output", `drwxr-xr-x  2 bodhini bodhini 4096 ${date} .`),
              mkLine("output", `drwxr-xr-x  6 bodhini bodhini 4096 ${date} ..`),
            );
            if (isHome) {
              for (const s of VALID_SECTIONS) {
                longLines.push(
                  mkLine(
                    "output",
                    `${C}[1;34mdrwxr-xr-x  2 bodhini bodhini 4096 ${date} ${s}${C}[0m`,
                  ),
                );
              }
            } else {
              const files = getSectionFiles(section);
              for (const f of files) {
                longLines.push(
                  mkLine("output", `-rw-r--r--  1 bodhini bodhini  512 ${date} ${f}`),
                );
              }
            }
            longLines.push(mkLine("output", ""));
            push(promptLine, ...longLines);
          } else {
            if (isHome) {
              push(
                promptLine,
                mkLine("output", ""),
                mkLine(
                  "output",
                  `${C}[1;34mabout${C}[0m   ${C}[1;34mprojects${C}[0m   ${C}[1;34mexperiences${C}[0m   ${C}[1;34mskills${C}[0m`,
                ),
                mkLine("output", ""),
              );
            } else {
              const files = getSectionFiles(section);
              push(
                promptLine,
                mkLine("output", ""),
                mkLine("output", files.join("   ")),
                mkLine("output", ""),
              );
            }
          }
          break;
        }
        case "cd": {
          const target = args[0];
          if (!target || target === "~" || target === HOME) {
            setCwd(HOME);
            setActiveSection(null);
            push(promptLine, mkLine("output", ""));
          } else if (target === "..") {
            if (currentCwd === HOME) {
              push(promptLine, mkLine("output", ""));
            } else {
              setCwd(HOME);
              setActiveSection(null);
              push(promptLine, mkLine("output", ""));
            }
          } else {
            const sectionName = target.replace(/^~\//, "");
            const normalized = sectionName === "interests" ? "skills" : sectionName;
            if (VALID_SECTIONS.includes(normalized)) {
              const newDir = `${HOME}/${normalized}`;
              setCwd(newDir);
              setActiveSection(normalized);
              lastHandledClose.current = null;
              onOpenWindow(normalized);
              // Keep keyboard focus in the terminal after opening another window.
              setTimeout(() => inputRef.current?.focus(), 0);
              push(promptLine, mkLine("output", ""));
            } else {
              push(
                promptLine,
                mkLine(
                  "error",
                  `bash: cd: ${target}: No such file or directory`,
                ),
                mkLine("output", ""),
              );
            }
          }
          break;
        }
        case "cat": {
          const section = args[0]?.toLowerCase();
          if (!section) {
            push(
              promptLine,
              mkLine("error", "cat: missing operand"),
              mkLine("output", ""),
            );
            break;
          }
          if (section === "about") {
            push(
              promptLine,
              mkLine("output", ""),
              mkLine(
                "output",
                `${C}[1;33m━━━ ABOUT ME ━━━━━━━━━━━━━━━━━━━━━━━━━${C}[0m`,
              ),
              mkLine("output", ""),
              mkLine("output", `Name:  ${portfolioData.name}`),
              mkLine("output", ""),
              mkLine("output", portfolioData.bio),
              mkLine("output", ""),
              mkLine("output", `${C}[1;32mSkills:${C}[0m`),
              ...portfolioData.skills
                .slice(0, 5)
                .map((s) =>
                  mkLine("output", `  • ${s.name} (${s.proficiency}%)`),
                ),
              mkLine("output", ""),
            );
          } else if (section === "projects") {
            push(
              promptLine,
              mkLine("output", ""),
              mkLine(
                "output",
                `${C}[1;33m━━━ PROJECTS ━━━━━━━━━━━━━━━━━━━━━━━━━${C}[0m`,
              ),
              mkLine("output", ""),
              ...portfolioData.projects.flatMap((p, i) => [
                mkLine("output", `${C}[1;36m${i + 1}. ${p.name}${C}[0m`),
                mkLine("output", `   ${p.description}`),
                mkLine("output", `   Tech: ${p.techStack.join(", ")}`),
                mkLine("output", ""),
              ]),
            );
          } else if (section === "experiences") {
            push(
              promptLine,
              mkLine("output", ""),
              mkLine(
                "output",
                `${C}[1;33m━━━ EXPERIENCES ━━━━━━━━━━━━━━━━━━━━━━${C}[0m`,
              ),
              mkLine("output", ""),
              ...portfolioData.experiences.flatMap((e) => [
                mkLine(
                  "output",
                  `${C}[1;36m${e.role}${C}[0m at ${C}[1;32m${e.company}${C}[0m`,
                ),
                mkLine("output", `   ${e.duration}`),
                mkLine("output", ""),
              ]),
            );
          } else if (section === "skills" || section === "interests") {
            push(
              promptLine,
              mkLine("output", ""),
              mkLine(
                "output",
                `${C}[1;33m━━━ SKILLS ━━━━━━━━━━━━━━━━━━━━━━━━━━━${C}[0m`,
              ),
              mkLine("output", ""),
              ...portfolioData.interests.map((i) =>
                mkLine("output", `  • ${i.name}`),
              ),
              mkLine("output", ""),
            );
          } else {
            push(
              promptLine,
              mkLine("error", `cat: ${section}: No such file or directory`),
              mkLine("output", ""),
            );
          }
          break;
        }
        case "echo": {
          let text = args.join(" ");
          if (text === "$USER") text = "bodhini";
          else if (text === "$HOME") text = HOME;
          else if (text === "$PWD") text = currentCwd;
          else if (text.startsWith("$")) text = "";
          push(promptLine, mkLine("output", text), mkLine("output", ""));
          break;
        }
        case "uname": {
          const flag = args[0];
          if (flag === "-a" || flag === "-r" || flag === "-s") {
            push(
              promptLine,
              mkLine(
                "output",
                "Linux portfolio 5.15.0-58-generic #64-Ubuntu SMP x86_64 GNU/Linux",
              ),
              mkLine("output", ""),
            );
          } else {
            push(promptLine, mkLine("output", "Linux"), mkLine("output", ""));
          }
          break;
        }
        case "date": {
          push(
            promptLine,
            mkLine("output", new Date().toString()),
            mkLine("output", ""),
          );
          break;
        }
        case "uptime": {
          push(
            promptLine,
            mkLine(
              "output",
              " 10:30:42 up 42 days,  7:13,  1 user,  load average: 0.42, 0.31, 0.28",
            ),
            mkLine("output", ""),
          );
          break;
        }
        case "history": {
          push(
            promptLine,
            mkLine("output", ""),
            ...history
              .slice(0, 20)
              .map((h, i) =>
                mkLine("output", `  ${String(i + 1).padStart(3)}  ${h}`),
              ),
            mkLine("output", ""),
          );
          break;
        }
        case "man": {
          const manCmd = args[0]?.toLowerCase();
          const manuals: Record<string, string[]> = {
            ls: [
              "ls - list directory contents",
              "",
              "USAGE: ls [OPTION]",
              "  -l    use a long listing format",
              "  -la   long listing including hidden files",
            ],
            cd: [
              "cd - change the shell working directory",
              "",
              "USAGE: cd [DIR]",
              "  cd ~      go to home",
              "  cd ..     go up one level",
              "  cd <dir>  enter directory",
            ],
            cat: [
              "cat - concatenate files and print on the standard output",
              "",
              "USAGE: cat <section>",
            ],
            pwd: ["pwd - print name of current/working directory"],
            echo: [
              "echo - display a line of text",
              "",
              "USAGE: echo [STRING]",
              "  echo $USER   current user",
              "  echo $HOME   home directory",
            ],
            uname: [
              "uname - print system information",
              "",
              "USAGE: uname [OPTION]",
              "  -a  print all information",
            ],
            whoami: ["whoami - print effective userid"],
            neofetch: [
              "neofetch - A fast, highly customizable system info script",
            ],
            sudo: ["sudo - execute a command as another user"],
            history: [
              "history - GNU History Library",
              "",
              "Display the command history list",
            ],
            date: ["date - print or set the system date and time"],
            uptime: ["uptime - tell how long the system has been running"],
          };
          if (!manCmd) {
            push(
              promptLine,
              mkLine("error", "man: what manual page do you want?"),
              mkLine("output", ""),
            );
          } else if (manuals[manCmd]) {
            push(
              promptLine,
              mkLine("output", ""),
              ...manuals[manCmd].map((l) => mkLine("output", l)),
              mkLine("output", ""),
            );
          } else {
            push(
              promptLine,
              mkLine("error", `No manual entry for ${manCmd}`),
              mkLine("output", ""),
            );
          }
          break;
        }
        case "sudo": {
          push(promptLine, mkLine("output", "[sudo] password for bodhini: "));
          setTimeout(() => {
            setLines((prev) => [
              ...prev,
              mkLine(
                "error",
                "bodhini is not in the sudoers file. This incident will be reported.",
              ),
              mkLine("output", ""),
            ]);
            setScrollTick((t) => t + 1);
          }, 800);
          break;
        }
        case "touch": {
          push(
            promptLine,
            mkLine(
              "error",
              `touch: cannot touch '${args[0] || "file"}': Read-only file system`,
            ),
            mkLine("output", ""),
          );
          break;
        }
        case "rm": {
          push(
            promptLine,
            mkLine(
              "error",
              `rm: cannot remove '${args[0] || "file"}': Permission denied`,
            ),
            mkLine("output", ""),
          );
          break;
        }
        case "mkdir": {
          push(
            promptLine,
            mkLine(
              "error",
              `mkdir: cannot create directory '${args[0] || "dir"}': Read-only file system`,
            ),
            mkLine("output", ""),
          );
          break;
        }
        case "exit": {
          push(
            promptLine,
            mkLine("output", "logout"),
            mkLine("system", ""),
            mkLine("system", "Thanks for visiting! Session closed."),
            mkLine("system", ""),
          );
          break;
        }
        case "neofetch": {
          push(
            promptLine,
            mkLine("output", ""),
            mkLine(
              "output",
              `       .-.         ${C}[1;33mbodhini${C}[0m@${C}[1;33mportfolio${C}[0m`,
            ),
            mkLine("output", "      (o o)        ─────────────────────────"),
            mkLine(
              "output",
              `      | O |        ${C}[1;32mOS:${C}[0m     PortfolioOS 22.04 LTS`,
            ),
            mkLine(
              "output",
              `     /|   |\\       ${C}[1;32mHost:${C}[0m   alexrivera.dev`,
            ),
            mkLine(
              "output",
              `    (_|   |_)       ${C}[1;32mKernel:${C}[0m React 19.0`,
            ),
            mkLine(
              "output",
              `                   ${C}[1;32mShell:${C}[0m  bash 5.1.16`,
            ),
            mkLine(
              "output",
              `  ██████████       ${C}[1;32mDE:${C}[0m     GNOME 42.5`,
            ),
            mkLine(
              "output",
              `  ██████████       ${C}[1;32mTheme:${C}[0m  Yaru-dark`,
            ),
            mkLine(
              "output",
              `  ██████████       ${C}[1;32mIcons:${C}[0m  Yaru`,
            ),
            mkLine(
              "output",
              `  ██████████       ${C}[1;32mProjects:${C}[0m ${portfolioData.projects.length} completed`,
            ),
            mkLine(
              "output",
              `                   ${C}[1;32mExp:${C}[0m    ${portfolioData.experiences.length} companies`,
            ),
            mkLine(
              "output",
              `                   ${C}[1;32mCPU:${C}[0m    Brain @ 3.5GHz`,
            ),
            mkLine(
              "output",
              `                   ${C}[1;32mMemory:${C}[0m ∞ / ∞ MiB`,
            ),
            mkLine(
              "output",
              `                   ${C}[1;32mCWD:${C}[0m    ${dirToDisplay(currentCwd)}`,
            ),
            mkLine("output", ""),
          );
          break;
        }
        default: {
          push(
            promptLine,
            mkLine("error", `bash: ${command}: command not found`),
            mkLine("output", 'Type "help" for available commands.'),
            mkLine("output", ""),
          );
        }
      }
    },
    [portfolioData, onOpenWindow, history],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "c" && e.ctrlKey) {
      e.preventDefault();
      if (activeSection) {
        onCloseWindow?.(activeSection);
        lastHandledClose.current = activeSection;
        setActiveSection(null);
        setCwd(HOME);
        setLines((prev) => [
          ...prev,
          mkLine("system", `Closed ${activeSection} window.`),
          mkLine("prompt", input),
          mkLine("output", "^C"),
          mkLine("output", ""),
        ]);
      } else {
        setLines((prev) => [
          ...prev,
          mkLine("prompt", input),
          mkLine("output", "^C"),
          mkLine("output", ""),
        ]);
      }
      setScrollTick((t) => t + 1);
      setInput("");
      setHistoryIndex(-1);
    } else if (e.key === "Enter") {
      processCommand(input, cwd);
      if (input.trim()) setHistory((prev) => [input, ...prev]);
      setInput("");
      setHistoryIndex(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(newIndex);
      if (history[newIndex]) setInput(history[newIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIndex);
      setInput(newIndex === -1 ? "" : history[newIndex]);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const parseAnsi = (text: string) => {
    const ESC = String.fromCharCode(27);
    if (!text.includes(ESC)) return <span>{text}</span>;
    const colorMap: Record<string, string> = {
      "1;33m": "#f5c542",
      "1;32m": "#50fa7b",
      "1;36m": "#8be9fd",
      "1;34m": "#6272a4",
      "1;31m": "#ff5555",
    };
    type Seg = { id: string; color: string; text: string };
    const segs: Seg[] = [];
    let currentColor = "";
    const rawSegs = text.split(`${ESC}[`);
    for (let i = 0; i < rawSegs.length; i++) {
      const seg = rawSegs[i];
      if (i === 0) {
        if (seg) segs.push({ id: crypto.randomUUID(), color: "", text: seg });
        continue;
      }
      const mIdx = seg.indexOf("m");
      if (mIdx === -1) {
        if (seg)
          segs.push({
            id: crypto.randomUUID(),
            color: currentColor,
            text: seg,
          });
        continue;
      }
      const code = seg.substring(0, mIdx + 1);
      const segText = seg.substring(mIdx + 1);
      if (colorMap[code]) currentColor = colorMap[code];
      else if (code === "0m") currentColor = "";
      if (segText)
        segs.push({
          id: crypto.randomUUID(),
          color: currentColor,
          text: segText,
        });
    }
    return (
      <span>
        {segs.map((p) => (
          <span key={p.id} style={{ color: p.color || undefined }}>
            {p.text}
          </span>
        ))}
      </span>
    );
  };

  const promptDisplay = dirToDisplay(cwd);

  const renderLine = (line: TerminalLine) => (
    <div
      key={line.id}
      className="leading-5"
      style={{ fontSize: "13px", minHeight: "20px" }}
    >
      {line.type === "prompt" ? (
        <div className="flex">
          <span style={{ color: "#50fa7b" }}>bodhini</span>
          <span style={{ color: "#6272a4" }}>@</span>
          <span style={{ color: "#8be9fd" }}>portfolio</span>
          <span style={{ color: "#6272a4" }}>:{promptDisplay}$ </span>
          <span style={{ color: "#f8f8f2" }}>{line.content}</span>
        </div>
      ) : (
        <span
          style={{
            color:
              line.type === "error"
                ? "#ff5555"
                : line.type === "system"
                  ? "#6272a4"
                  : "#f8f8f2",
          }}
        >
          {parseAnsi(line.content)}
        </span>
      )}
    </div>
  );

  return (
    <div
      className="flex flex-col h-full font-mono"
      style={{ background: "oklch(0.08 0.015 270)" }}
      onClick={() => inputRef.current?.focus()}
      onKeyDown={() => {}}
    >
      {/* Tab bar */}
      <div
        className="flex items-center px-2 flex-shrink-0"
        style={{
          height: "28px",
          background: "oklch(0.1 0.02 270)",
          borderBottom: "1px solid oklch(0.2 0.02 270)",
        }}
      >
        <div
          className="flex items-center gap-1.5 px-3 py-0.5 rounded-t text-xs"
          style={{
            background: "oklch(0.08 0.015 270)",
            color: "#f8f8f2",
            fontSize: "11px",
            border: "1px solid oklch(0.2 0.02 270)",
            borderBottom: "none",
          }}
        >
          <span style={{ color: "#50fa7b" }}>●</span>
          bash
        </div>
      </div>

      {/* Terminal output */}
      <div className="flex-1 overflow-y-auto p-3" style={{ color: "#f8f8f2" }}>
        {lines.map(renderLine)}
        <div className="flex" style={{ fontSize: "13px" }}>
          <span style={{ color: "#50fa7b" }}>bodhini</span>
          <span style={{ color: "#6272a4" }}>@</span>
          <span style={{ color: "#8be9fd" }}>portfolio</span>
          <span style={{ color: "#6272a4" }}>:{promptDisplay}$ </span>
          <div className="relative flex items-center flex-1">
            <input
              ref={inputRef}
              data-ocid="terminal.input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none flex-1 caret-transparent"
              style={{
                color: "#f8f8f2",
                fontSize: "13px",
                fontFamily: "inherit",
              }}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
            <span
              className="cursor-blink absolute pointer-events-none"
              style={{
                left: `${input.length}ch`,
                top: 0,
                width: "8px",
                height: "15px",
                background: "#f8f8f2",
                opacity: 0.8,
              }}
            />
          </div>
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function getSectionFiles(section: string): string[] {
  switch (section) {
    case "about":
      return ["README.md", "bio.txt", "skills.json", "contact.md"];
    case "projects":
      return ["README.md", "project1.md", "project2.md", "project3.md"];
    case "experiences":
      return ["README.md", "resume.pdf", "timeline.md"];
    case "skills":
      return ["README.md", "hobbies.txt", "music.md", "travel.md"];
    default:
      return ["README.md"];
  }
}
