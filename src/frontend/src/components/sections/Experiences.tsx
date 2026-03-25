import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase } from "lucide-react";
import type { Experience } from "../../backend.d";

const API_BASE = import.meta.env.VITE_BACKEND_API || "https://airy-spirit.railway.app/";

interface ExperiencesProps {
  data?: Experience[];
  isLoading?: boolean;
}

export default function ExperiencesSection({
  data,
  isLoading,
}: ExperiencesProps) {
  const [token, setToken] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    company: "",
    role: "",
    duration: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      try {
        const saved =
          window.sessionStorage?.getItem("adminToken") ||
          window.localStorage?.getItem("adminToken") ||
          null;
        setToken(saved);
      } catch {
        /* ignore */
      }
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  const resetForm = () => {
    setForm({ company: "", role: "", duration: "", description: "" });
    setEditingId(null);
  };

  const startEdit = (exp: Experience & { _id?: string; id?: string }) => {
    const id = (exp as any)._id || (exp as any).id;
    if (!id) {
      setSubmitError("Missing experience id; refresh and try again.");
      return;
    }
    setEditingId(id as string);
    setForm({
      company: exp.company,
      role: exp.role,
      duration: exp.duration,
      description: exp.description,
    });
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const method = modalMode === "edit" ? "PUT" : "POST";
      const url = modalMode === "edit" && editingId
        ? `${API_BASE}/api/experiences/${editingId}`
        : `${API_BASE}/api/experiences`;
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || "Failed to save experience");
      }
      resetForm();
      setModalOpen(false);
      await fetch(`${API_BASE}/api/experiences`);
      window.location.reload();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to save experience");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (exp: Experience & { _id?: string; id?: string }) => {
    const id = (exp as any)._id || (exp as any).id;
    if (!id) {
      setSubmitError("Missing experience id; refresh and try again.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/experiences/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || "Failed to delete experience");
      }
      await fetch(`${API_BASE}/api/experiences`);
      window.location.reload();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to delete experience");
    }
  };
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
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
      <div className="p-6 relative">
        {!modalOpen && submitError && (
          <div
            className="text-xs px-3 py-2 rounded-md mb-3"
            style={{
              background: "oklch(0.18 0.06 20)",
              color: "#fca5a5",
              border: "1px solid rgba(252,165,165,0.4)",
            }}
          >
            {submitError}
          </div>
        )}
        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-5 top-5 bottom-5 w-px"
            style={{ background: "oklch(0.25 0.04 295)" }}
          />

          <div className="space-y-6">
            {data.map((exp, index) => (
              <div
                key={`${exp.company}-${index}`}
                data-ocid={`experiences.item.${index + 1}`}
                className="relative flex gap-4"
              >
                {/* Timeline dot */}
                <div
                  className="relative z-10 w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{
                    background: index === 0 ? "#E95420" : "oklch(0.2 0.04 295)",
                    border:
                      index === 0
                        ? "2px solid #E95420"
                        : "2px solid oklch(0.28 0.04 295)",
                    boxShadow:
                      index === 0 ? "0 0 16px rgba(233,84,32,0.5)" : "none",
                  }}
                >
                  <Briefcase
                    size={16}
                    style={{
                      color: index === 0 ? "white" : "oklch(0.55 0.04 260)",
                    }}
                  />
                </div>

                {/* Content */}
                <div
                  className="flex-1 rounded-xl p-4 mb-1"
                  style={{
                    background: "oklch(0.17 0.03 295)",
                    border: "1px solid oklch(0.24 0.03 295)",
                  }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3
                        className="font-semibold text-white"
                        style={{ fontSize: "14px" }}
                      >
                        {exp.role}
                      </h3>
                      <p className="text-sm" style={{ color: "#E95420" }}>
                        {exp.company}
                      </p>
                    </div>
                    <span
                      className="text-xs px-2 py-1 rounded-full flex-shrink-0"
                      style={{
                        background: "oklch(0.2 0.04 295)",
                        color: "oklch(0.58 0.04 260)",
                        fontSize: "10px",
                      }}
                    >
                      {exp.duration}
                    </span>
                      {token && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => startEdit(exp as any)}
                            className="text-[11px] px-2 py-1 rounded"
                            style={{
                              background: "oklch(0.2 0.04 295)",
                              color: "white",
                              border: "1px solid oklch(0.28 0.04 295)",
                            }}
                          >
                            Modify
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(exp as any)}
                            className="text-[11px] px-2 py-1 rounded"
                            style={{
                              background: "oklch(0.16 0.03 295)",
                              color: "white",
                              border: "1px solid oklch(0.28 0.04 295)",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                  </div>
                  <p
                    className="text-xs leading-relaxed mt-2"
                    style={{ color: "oklch(0.6 0.03 260)" }}
                  >
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {token && (
          <div className="sticky bottom-4 flex justify-end pointer-events-none">
            <button
              type="button"
              onClick={() => {
                setModalMode("add");
                resetForm();
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
              aria-label="Add experience"
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
                {modalMode === "edit" ? "Modify Experience" : "Add Experience"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  resetForm();
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
                value={form.company}
                onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                placeholder="Company"
                className="text-xs px-3 py-2 rounded-md bg-transparent border"
                style={{ borderColor: "oklch(0.28 0.04 295)", color: "white" }}
              />
              <input
                value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                placeholder="Role"
                className="text-xs px-3 py-2 rounded-md bg-transparent border"
                style={{ borderColor: "oklch(0.28 0.04 295)", color: "white" }}
              />
              <input
                value={form.duration}
                onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                placeholder="Duration"
                className="text-xs px-3 py-2 rounded-md bg-transparent border"
                style={{ borderColor: "oklch(0.28 0.04 295)", color: "white" }}
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Description"
                className="text-xs px-3 py-2 rounded-md bg-transparent border"
                style={{ borderColor: "oklch(0.28 0.04 295)", color: "white" }}
                rows={3}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSubmit}
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
                    resetForm();
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
