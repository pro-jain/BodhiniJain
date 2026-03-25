import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Book,
  Camera,
  Coins,
  Cpu,
  GitBranch,
  Heart,
  Keyboard,
  Mountain,
  Music,
  Star,
} from "lucide-react";
import type { Interest } from "../../backend.d";

const API_BASE = import.meta.env.VITE_BACKEND_API || "http://localhost:5000";

interface InterestsProps {
  data?: Interest[];
  isLoading?: boolean;
}

type InterestWithId = Interest & { _id?: string; id?: string };

// Optional front-end image mapping; backend-provided image field overrides this
const interestImages: Record<string, string> = {
  "Core Areas": "/Core_area.png",
  "Programming Languages": "programmin_languages.png",
  "Robotics & UAV Stack":"Robotics.png",
  "Computer Vision & AI": "Computer_vision.png",
  "Web & Database": "WebD.png",
  "Tools & Platforms": "Tools.png",
};

const interestIcons: Record<string, React.ReactNode> = {
  "Open Source": <GitBranch size={22} />,
  "Web3 & Blockchain": <Coins size={22} />,
  "Machine Learning": <Cpu size={22} />,
  Photography: <Camera size={22} />,
  "Rock Climbing": <Mountain size={22} />,
  "Mechanical Keyboards": <Keyboard size={22} />,
  Music: <Music size={22} />,
  Reading: <Book size={22} />,
};

const interestColors = [
  "#E95420",
  "#50fa7b",
  "#8be9fd",
  "#f1fa8c",
  "#ff79c6",
  "#bd93f9",
  "#ffb86c",
  "#ff5555",
];

export default function InterestsSection({ data, isLoading }: InterestsProps) {
  const [token, setToken] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });
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
    setForm({ name: "", description: "" });
    setEditingId(null);
  };

  const startAdd = () => {
    resetForm();
    setModalMode("add");
    setModalOpen(true);
  };

  const startEdit = (interest: InterestWithId) => {
    const id = interest._id || interest.id;
    if (!id) {
      setSubmitError("Missing skill id; refresh and try again.");
      return;
    }
    setEditingId(id);
    setForm({ name: interest.name, description: interest.description });
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
          ? `${API_BASE}/api/interests/${editingId}`
          : `${API_BASE}/api/interests`;
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
        throw new Error(json.message || "Failed to save skill");
      }
      resetForm();
      setModalOpen(false);
      // TODO: replace reload with react-query invalidation
      window.location.reload();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to save skill");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (interest: InterestWithId) => {
    const id = interest._id || interest.id;
    if (!id) {
      setSubmitError("Missing skill id; refresh and try again.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/interests/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || "Failed to delete skill");
      }
      // TODO: replace reload with react-query invalidation
      window.location.reload();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to delete skill");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 grid grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
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
        <div className="grid grid-cols-2 gap-3">
          {data.map((interest, index) => {
            const color = interestColors[index % interestColors.length];
            const icon = interestIcons[interest.name] || <Heart size={22} />;
            const imgSrc = interest.image || interestImages[interest.name] || interestImages.default;

            return (
              <div
                key={interest.name}
                data-ocid={`skills.item.${index + 1}`}
                className="group rounded-xl p-4 transition-ubuntu hover:-translate-y-0.5 cursor-default"
                style={{
                  background: "oklch(0.17 0.03 295)",
                  border: "1px solid oklch(0.24 0.03 295)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: `${color}18`,
                    color,
                    border: `1px solid ${color}30`,
                  }}
                >
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={interest.name}
                      className="w-full h-full object-cover rounded-xl"
                      loading="lazy"
                    />
                  ) : (
                    icon
                  )}
                </div>
                <h3
                  className="font-semibold text-white mb-1"
                  style={{ fontSize: "13px" }}
                >
                  {interest.name}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "oklch(0.58 0.03 260)", fontSize: "11px" }}
                >
                  {interest.description}
                </p>
                {token ? (
                  <div className="mt-3 flex gap-3 text-xs">
                    <button
                      onClick={() => startEdit(interest)}
                      className="text-blue-300 hover:text-white"
                    >
                      Modify
                    </button>
                    <button
                      onClick={() => handleDelete(interest)}
                      className="text-red-300 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      {token ? (
        <div className="sticky bottom-4 flex justify-end pointer-events-none pr-6">
          <button
            onClick={startAdd}
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl pointer-events-auto"
              style={{
                background: "oklch(0.2 0.04 295)",
                color: "white",
                border: "1px solid oklch(0.28 0.04 295)",
                boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
              }}
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
                {modalMode === "add" ? "Add Interest" : "Edit Interest"}
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
                <label className="text-sm text-gray-700">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="Interest name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="What you enjoy"
                  rows={3}
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
