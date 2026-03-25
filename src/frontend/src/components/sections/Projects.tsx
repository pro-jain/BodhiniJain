import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Code2, ExternalLink } from "lucide-react";
import type { Project } from "../../backend.d";

interface ProjectsProps {
  data?: Project[];
  isLoading?: boolean;
}

const API_BASE = import.meta.env.VITE_BACKEND_API || "http://localhost:5000";

const techColors: Record<string, string> = {
  TypeScript: "#3178c6",
  React: "#61dafb",
  Python: "#ffd343",
  Rust: "#ce4a00",
  "Node.js": "#3c873a",
  "Next.js": "#aaa",
  Docker: "#2496ed",
  GraphQL: "#e10098",
  WebRTC: "#fc7c00",
  Redis: "#dc382c",
  FastAPI: "#059669",
  PyTorch: "#ee4c2c",
  "Y.js": "#7c3aed",
  WebSockets: "#f59e0b",
  ONNX: "#005a9e",
  gRPC: "#4285f4",
};

export default function ProjectsSection({ data, isLoading }: ProjectsProps) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const getProjectId = (project: Project) =>
    ((project as any)._id as string | undefined) || (project as any).id || null;
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    techStack: "",
    link: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const syncToken = () => {
      try {
        if (typeof window !== "undefined") {
          const saved =
            window.sessionStorage?.getItem("adminToken") ||
            window.localStorage?.getItem("adminToken") ||
            null;
          setToken(saved);
        }
      } catch {
        // ignore storage issues
      }
    };

    syncToken();
    window.addEventListener("storage", syncToken);
    window.addEventListener("focus", syncToken);
    return () => {
      window.removeEventListener("storage", syncToken);
      window.removeEventListener("focus", syncToken);
    };
  }, []);

  const handleAddProject = async () => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const payload = {
        name: newProject.name,
        description: newProject.description,
        techStack: newProject.techStack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        link: newProject.link,
      };

      const res = await fetch(`${API_BASE}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || "Failed to add project");
      }

      setNewProject({ name: "", description: "", techStack: "", link: "" });
      setModalOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to add project");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (project: Project) => {
    const id = getProjectId(project);
    if (!id) {
      setSubmitError("Missing project id (backend data not loaded). Start backend, refresh, then try again.");
      return;
    }
    setEditingId(id);
    setNewProject({
      name: project.name,
      description: project.description,
      techStack: project.techStack.join(", "),
      link: project.link,
    });
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleUpdateProject = async () => {
    if (!editingId) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const payload = {
        name: newProject.name,
        description: newProject.description,
        techStack: newProject.techStack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        link: newProject.link,
      };

      const res = await fetch(`${API_BASE}/api/projects/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || "Failed to update project");
      }

      setNewProject({ name: "", description: "", techStack: "", link: "" });
      setEditingId(null);
      setModalOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to update project");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    setSubmitError(null);
    try {
      const res = await fetch(`${API_BASE}/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || "Failed to delete project");
      }
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div
      className="relative h-full overflow-y-auto"
      style={{ background: "oklch(0.14 0.025 295)" }}
    >
      <div className="p-6 space-y-4 relative">
        {!modalOpen && submitError && (
          <div
            className="text-xs px-3 py-2 rounded-md"
            style={{
              background: "oklch(0.18 0.06 20)",
              color: "#fca5a5",
              border: "1px solid rgba(252,165,165,0.4)",
            }}
          >
            {submitError}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4">
          {data.map((project, index) => {
            const pid = getProjectId(project) || project.name || `project-${index}`;
            const hasId = Boolean(getProjectId(project));
            return (
            <div
              key={pid}
              data-ocid={`projects.item.${index + 1}`}
              className="group rounded-xl p-4 transition-ubuntu hover:-translate-y-0.5"
              style={{
                background: "oklch(0.17 0.03 295)",
                border: "1px solid oklch(0.24 0.03 295)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "oklch(0.22 0.05 295)" }}
                  >
                    <Code2 size={16} style={{ color: "#E95420" }} />
                  </div>
                  <h3
                    className="font-semibold text-white"
                    style={{ fontSize: "14px" }}
                  >
                    {project.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-ubuntu"
                    style={{
                      background: "oklch(0.22 0.05 295)",
                      color: "#E95420",
                    }}
                  >
                    <ExternalLink size={13} />
                  </a>
                  {token && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-ubuntu">
                      <button
                        type="button"
                        onClick={() => startEdit(project)}
                        disabled={!hasId}
                        className="text-[11px] px-2 py-1 rounded"
                        style={{
                          background: "oklch(0.2 0.04 295)",
                          color: hasId ? "white" : "oklch(0.65 0.02 260)",
                          border: "1px solid oklch(0.28 0.04 295)",
                          opacity: hasId ? 1 : 0.5,
                        }}
                      >
                        Modify
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const id = getProjectId(project);
                          if (!id) {
                            setSubmitError("Missing project id (backend data not loaded). Start backend, refresh, then try again.");
                            return;
                          }
                          handleDeleteProject(id);
                        }}
                        disabled={!hasId}
                        className="text-[11px] px-2 py-1 rounded"
                        style={{
                          background: "oklch(0.16 0.03 295)",
                          color: hasId ? "white" : "oklch(0.65 0.02 260)",
                          border: "1px solid oklch(0.28 0.04 295)",
                          opacity: hasId ? 1 : 0.5,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p
                className="text-xs leading-relaxed mb-3"
                style={{ color: "oklch(0.62 0.03 260)" }}
              >
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: `${techColors[tech] || "#666"}18`,
                      color: techColors[tech] || "oklch(0.65 0.04 260)",
                      border: `1px solid ${techColors[tech] || "#666"}33`,
                      fontSize: "10px",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            );
          })}
        </div>
        {token && (
          <div className="sticky bottom-4 flex justify-end pointer-events-none">
            <button
              type="button"
              onClick={() => {
                setModalMode("add");
                setEditingId(null);
                setNewProject({ name: "", description: "", techStack: "", link: "" });
                setSubmitError(null);
                setModalOpen(true);
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl pointer-events-auto"
              style={{
                background: "oklch(0.2 0.04 295)",
                color: "white",
                border: "1px solid oklch(0.28 0.04 295)",
                boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
              }}
              aria-label="Add project"
            >
              +
            </button>
          </div>
        )}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div
            className="w-full max-w-md rounded-xl p-4"
            style={{
              background: "oklch(0.17 0.03 295)",
              border: "1px solid oklch(0.24 0.03 295)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: "white" }}>
                {modalMode === "edit" ? "Modify Project" : "Add Project"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setEditingId(null);
                  setSubmitError(null);
                }}
                className="text-sm px-2 py-1 rounded"
                style={{ background: "oklch(0.16 0.03 295)", color: "white" }}
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <input
                value={newProject.name}
                onChange={(e) => setNewProject((p) => ({ ...p, name: e.target.value }))}
                placeholder="Name"
                className="text-xs px-3 py-2 rounded-md bg-transparent border"
                style={{ borderColor: "oklch(0.28 0.04 295)", color: "white" }}
              />
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject((p) => ({ ...p, description: e.target.value }))}
                placeholder="Description"
                className="text-xs px-3 py-2 rounded-md bg-transparent border"
                style={{ borderColor: "oklch(0.28 0.04 295)", color: "white" }}
                rows={3}
              />
              <input
                value={newProject.techStack}
                onChange={(e) => setNewProject((p) => ({ ...p, techStack: e.target.value }))}
                placeholder="Tech stack (comma separated)"
                className="text-xs px-3 py-2 rounded-md bg-transparent border"
                style={{ borderColor: "oklch(0.28 0.04 295)", color: "white" }}
              />
              <input
                value={newProject.link}
                onChange={(e) => setNewProject((p) => ({ ...p, link: e.target.value }))}
                placeholder="Link"
                className="text-xs px-3 py-2 rounded-md bg-transparent border"
                style={{ borderColor: "oklch(0.28 0.04 295)", color: "white" }}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={modalMode === "edit" ? handleUpdateProject : handleAddProject}
                  disabled={submitting}
                  className="text-xs px-3 py-2 rounded-md"
                  style={{
                    background: "oklch(0.2 0.04 295)",
                    color: "white",
                    border: "1px solid oklch(0.28 0.04 295)",
                    opacity: submitting ? 0.6 : 1,
                  }}
                >
                  {submitting ? "Saving..." : modalMode === "edit" ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setEditingId(null);
                    setNewProject({ name: "", description: "", techStack: "", link: "" });
                    setSubmitError(null);
                  }}
                  className="text-xs px-3 py-2 rounded-md"
                  style={{
                    background: "oklch(0.16 0.03 295)",
                    color: "white",
                    border: "1px solid oklch(0.28 0.04 295)",
                  }}
                >
                  Cancel
                </button>
                {submitError && (
                  <span className="text-xs" style={{ color: "#fca5a5" }}>
                    {submitError}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
