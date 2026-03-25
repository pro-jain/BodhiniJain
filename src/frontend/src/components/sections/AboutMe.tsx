import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Github, Globe, Linkedin, Mail } from "lucide-react";
import type { AboutMe } from "../../backend.d";

interface AboutMeProps {
  data?: AboutMe;
  isLoading?: boolean;
}

export default function AboutMeSection({ data, isLoading }: AboutMeProps) {
  const API_BASE = import.meta.env.VITE_BACKEND_API || "http://localhost:5000";
  const [token, setToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<string | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const syncFromStorage = () => {
      try {
        if (typeof window !== "undefined") {
          const savedToken =
            window.sessionStorage?.getItem("adminToken") ||
            window.localStorage?.getItem("adminToken") ||
            null;
          const savedUser =
            window.sessionStorage?.getItem("adminUser") ||
            window.localStorage?.getItem("adminUser") ||
            null;
          setToken(savedToken);
          setAdminUser(savedUser);
        }
      } catch {
        // Ignore storage access errors (e.g., privacy mode or blocked storage)
      }
    };

    syncFromStorage();

    window.addEventListener("storage", syncFromStorage);
    window.addEventListener("focus", syncFromStorage);
    return () => {
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener("focus", syncFromStorage);
    };
  }, []);

  const handleLogin = async () => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });

      const json = await res.json();
      if (!res.ok) {
        setAuthError(json?.message || "Login failed");
        return;
      }

      setToken(json.token);
      setAdminUser(json.username);
      setPasswordInput("");
      setShowLogin(false);

      try {
        if (typeof window !== "undefined") {
          window.sessionStorage?.setItem("adminToken", json.token);
          window.sessionStorage?.setItem("adminUser", json.username);
          window.localStorage?.setItem("adminToken", json.token);
          window.localStorage?.setItem("adminUser", json.username);
        }
      } catch {
        // Storage may be blocked; still allow in-memory use for this session
      }
    } catch (err) {
      setAuthError("Could not reach the server");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage?.removeItem("adminToken");
        window.sessionStorage?.removeItem("adminUser");
        window.localStorage?.removeItem("adminToken");
        window.localStorage?.removeItem("adminUser");
      }
    } catch {
      // ignore storage errors
    }
    setToken(null);
    setAdminUser(null);
    setUsernameInput("");
    setPasswordInput("");
    setAuthError(null);
    setShowLogin(false);
  };

  const displayName = "Bodhini Jain";
  const profileImage = "/profile.png"; 

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!data) return null;

  return (
    
    <div
      className="h-full overflow-y-auto"
      style={{ background: "oklch(0.14 0.025 295)" }}
    >
       <div className="mt-3 flex flex-col gap-2 justify-end px-10">
         {!token ? (
           <div className="flex items-center justify-end">
             <button
               type="button"
               onClick={() => setShowLogin(true)}
               className="text-xs px-3 py-1 rounded-md"
               style={{
                 background: "oklch(0.2 0.04 295)",
                 color: "white",
                 border: "1px solid oklch(0.28 0.04 295)",
               }}
             >
               Admin Login
             </button>
           </div>
         ) : (
           <div className="flex items-center gap-2 text-xs justify-end" style={{ color: "oklch(0.7 0.04 260)" }}>
             <span>Admin mode: {adminUser ?? ""}</span>
             <button
               type="button"
               onClick={handleLogout}
               className="px-2 py-0.5 rounded-md"
               style={{
                 background: "oklch(0.16 0.03 295)",
                 color: "white",
                 border: "1px solid oklch(0.28 0.04 295)",
               }}
             >
               Logout
             </button>
           </div>
         )}
         {authError && (
           <div className="text-xs text-red-300 text-right">{authError}</div>
         )}
       </div>

       {showLogin && (
         <div
           className="fixed inset-0 z-50 flex items-center justify-center px-4"
           style={{ background: "rgba(0,0,0,0.55)" }}
         >
           <div
             className="w-full max-w-sm rounded-xl p-5"
             style={{
               background: "oklch(0.16 0.03 295)",
               border: "1px solid oklch(0.28 0.04 295)",
             }}
           >
             <div className="flex items-center justify-between mb-3">
               <h3 className="text-sm font-semibold" style={{ color: "white" }}>
                 Admin Login
               </h3>
               <button
                 type="button"
                 onClick={() => setShowLogin(false)}
                 className="text-xs px-2 py-1 rounded"
                 style={{ color: "oklch(0.7 0.04 260)" }}
               >
                 Close
               </button>
             </div>
             <div className="space-y-2">
               <input
                 type="text"
                 placeholder="Username"
                 value={usernameInput}
                 onChange={(e) => setUsernameInput(e.target.value)}
                 className="w-full text-xs px-3 py-2 rounded-md bg-transparent border"
                 style={{ borderColor: "oklch(0.28 0.04 295)", color: "white" }}
               />
               <input
                 type="password"
                 placeholder="Password"
                 value={passwordInput}
                 onChange={(e) => setPasswordInput(e.target.value)}
                 className="w-full text-xs px-3 py-2 rounded-md bg-transparent border"
                 style={{ borderColor: "oklch(0.28 0.04 295)", color: "white" }}
               />
               <button
                 type="button"
                 onClick={handleLogin}
                 disabled={isSubmitting}
                 className="w-full text-xs px-3 py-2 rounded-md"
                 style={{
                   background: "oklch(0.2 0.04 295)",
                   color: "white",
                   border: "1px solid oklch(0.28 0.04 295)",
                   opacity: isSubmitting ? 0.6 : 1,
                 }}
               >
                 {isSubmitting ? "Signing in..." : "Login"}
               </button>
               {authError && (
                 <div className="text-xs" style={{ color: "#fca5a5" }}>
                   {authError}
                 </div>
               )}
             </div>
           </div>
         </div>
       )}
      <div className="p-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-start gap-6 mb-8">
          {/* Avatar */}
          <Avatar className="w-32 h-32">
            <AvatarImage src={profileImage} alt={displayName} />
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{displayName}</h1>
            <div className="flex flex-wrap gap-1">
              {["Robotics", "AI/ML", "Computer Vision"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "oklch(0.2 0.04 295)",
                    color: "oklch(0.7 0.05 260)",
                    border: "1px solid oklch(0.28 0.04 295)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
           
          </div>
        </div>

        {/* Bio */}
        <div className="mb-8">
          <h2
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "#E95420" }}
          >
            About
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "oklch(0.75 0.03 260)" }}
          >
            {data.bio}
          </p>
        </div>

       <div><h2
            className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: "#E95420" }}
          >
            Volunteering
          </h2>
             
            </div>
        <div className="mb-8 space-y-3">
          <div className="rounded-lg border border-white/5 bg-white/5 p-3">
            <div className="text-xs leading-relaxed space-y-1" style={{ color: "oklch(0.68 0.03 260)" }}>
              {data.volunteering.split("\n").map((line) => (
                <div key={line.trim()}>{line.trim()}</div>
              ))}
            </div>
          </div>
           <div><h2
            className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: "#E95420" }}
          >
             Positions of Responsibility
          </h2>
             
            </div>
          <div className="rounded-lg border border-white/5 bg-white/5 p-3">
           
            <div className="text-xs leading-relaxed space-y-1" style={{ color: "oklch(0.68 0.03 260)" }}>
              {data.positionsOfResponsibility.split("\n").map((line) => (
                <div key={line.trim()}>
                  {(() => {
                    const [role, org] = line.split("—");
                    if (!org) return line.trim();
                    return (
                      <>
                        <span className="font-semibold" style={{ color: "oklch(0.78 0.04 260)" }}>
                          {role.trim()}
                        </span>
                        {" — "}
                        {org.trim()}
                      </>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h2
            className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: "#E95420" }}
          >
            Contact
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {[
              {
                icon: <Mail size={14} />,
                label: data.contactInfo.email,
                href: `mailto:${data.contactInfo.email}`,
              },
              {
                icon: <Github size={14} />,
                label: data.contactInfo.github,
                href: data.contactInfo.github,
              },
              {
                icon: <Linkedin size={14} />,
                label: data.contactInfo.linkedin,
                href: data.contactInfo.linkedin,
              },
              {
                icon: <Globe size={14} />,
                label: data.contactInfo.website,
                href: data.contactInfo.website,
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs p-2 rounded-lg transition-ubuntu hover:bg-white/5"
                style={{ color: "oklch(0.65 0.04 260)" }}
              >
                <span style={{ color: "#E95420" }}>{item.icon}</span>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
