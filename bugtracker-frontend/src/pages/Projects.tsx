import React, { useEffect, useState } from "react";
import { FolderOpen } from "lucide-react";
import api from "../api/axiosConfig";

type Project = {
  id: number;
  name: string;
  description?: string;
};

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadProjects = () => {
    setLoading(true);
    api
      .get<Project[]>("/projects")
      .then((res) => setProjects(res.data || []))
      .catch((err) => {
        console.error(err);
        setError("Failed to load projects. Are you authenticated?");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => loadProjects(), []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await api.post("/projects", { name: newName.trim(), description: newDesc.trim() });
      setNewName("");
      setNewDesc("");
      setShowForm(false);
      loadProjects();
    } catch (err: unknown) {
      setError(err && typeof err === "object" && "response" in err
        ? String((err as { response?: { data?: unknown } }).response?.data) || "Failed to create"
        : "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this project? This may affect related issues.")) return;
    try {
      await api.delete(`/projects/${id}`);
      loadProjects();
    } catch {
      setError("Failed to delete project");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Projects</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
        >
          {showForm ? "Cancel" : "+ New Project"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mt-6 p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-lg animate-scale-in">
          <h3 className="font-semibold text-slate-800 mb-4">Create Project</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Project name"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Brief description"
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium disabled:opacity-50 transition-all duration-300 hover:shadow-md"
            >
              {submitting ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm animate-fade-in">{error}</div>
      )}

      {loading ? (
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 bg-white rounded-2xl border border-slate-200">
              <div className="skeleton h-6 w-3/4 mb-3" />
              <div className="skeleton h-4 w-full mb-2" />
              <div className="skeleton h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="mt-6 sm:mt-8 p-8 sm:p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mb-4">
            <FolderOpen className="w-8 h-8" strokeWidth={1.5} />
          </div>
          No projects yet. Create one to get started.
        </div>
      ) : (
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((p, idx) => (
            <div
              key={p.id}
              className="p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-slate-300/80 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.05}s`, animationFillMode: "both" } as React.CSSProperties}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-800">{p.name}</h3>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">{p.description || "—"}</p>
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-slate-400 hover:text-red-600 text-sm transition-colors duration-200"
                  title="Delete project"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
