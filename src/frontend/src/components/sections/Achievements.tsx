import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase } from "lucide-react";
import type { achievements } from "../../backend.d";

const API_BASE = import.meta.env.VITE_BACKEND_API || "https://bodhini-jain.vercel.app/";

interface AchievementsProps {
  data?: achievements[];
  isLoading?: boolean;
}

type AchievementWithId = achievements & { _id?: string; id?: string };

export default function AchievementsSection({
  data,
  isLoading,
}: AchievementsProps) {
  const [token, setToken] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", date: "" });
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
    setForm({ title: "", description: "", date: "" });
    setEditingId(null);
  };

  const startAdd = () => {
    resetForm();
    setModalMode("add");
    setModalOpen(true);
  };

  const startEdit = (ach: AchievementWithId) => {
    const id = ach._id || ach.id;
    if (!id) {
      setSubmitError("Missing achievement id; refresh and try again.");
      return;
    }
    setEditingId(id);
    setForm({ title: ach.title, description: ach.description, date: ach.date });
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const method = modalMode === "edit" ? "PUT" : "POST";
      const url =
        modalMode === "edit" && editingId
          ? `${API_BASE}/api/achievements/${editingId}`
          : `${API_BASE}/api/achievements`;
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
        throw new Error(json.message || "Failed to save achievement");
      }
      resetForm();
      setModalOpen(false);
      // TODO: replace reload with react-query invalidation
      window.location.reload();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to save achievement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (ach: AchievementWithId) => {
    const id = ach._id || ach.id;
    if (!id) {
      setSubmitError("Missing achievement id; refresh and try again.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/achievements/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || "Failed to delete achievement");
      }
      // TODO: replace reload with react-query invalidation
      window.location.reload();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to delete achievement");
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
      <div className="p-6">
        <div className="relative">
          <div
            className="absolute left-5 top-5 bottom-5 w-px"
            style={{ background: "oklch(0.25 0.04 295)" }}
          />

          <div className="space-y-6">
            {data.map((ach, index) => (
              <div
                key={`${ach.title}-${index}`}
                data-ocid={`Achievements.item.${index + 1}`}
                className="relative flex gap-4"
              >
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
                        {ach.title}
                      </h3>
                      <p className="text-xs" style={{ color: "#E95420" }}>
                        {ach.date}
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
                      {ach.date}
                    </span>
                  </div>
                  <p
                    className="text-xs leading-relaxed mt-2"
                    style={{ color: "oklch(0.6 0.03 260)" }}
                  >
                    {ach.description}
                  </p>
                  {token ? (
                    <div className="mt-3 flex gap-3 text-xs">
                      <button
                        onClick={() => startEdit(ach)}
                        className="text-blue-300 hover:text-white"
                      >
                        Modify
                      </button>
                      <button
                        onClick={() => handleDelete(ach)}
                        className="text-red-300 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {token ? (
        <div className="sticky bottom-4 flex justify-end pointer-events-none pr-2">
          <button
            onClick={startAdd}
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl pointer-events-auto"
              style={{
                background: "oklch(0.2 0.04 295)",
                color: "white",
                border: "1px solid oklch(0.28 0.04 295)",
                boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
              }}
            aria-label="Add achievement"
          >
            +
          </button>
        </div>
      ) : null}

      {modalOpen ? (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {modalMode === "add" ? "Add Achievement" : "Edit Achievement"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                X
              </button>
            </div>
            {submitError ? (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
                {submitError}
              </div>
            ) : null}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm text-gray-700">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="Achievement title"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="What you accomplished"
                  rows={3}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-700">Date</label>
                <input
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="Jan 2024"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  resetForm();
                  setModalOpen(false);
                }}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? "Saving..." : modalMode === "add" ? "Add" : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
