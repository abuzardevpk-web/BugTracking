import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

type Project = { id: number; name: string };
type User = { id: number; name: string; email: string };

const CreateIssue: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [priority, setPriority] = useState("MEDIUM");
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get<Project[]>("/projects"),
      api.get<User[]>("/users"),
    ])
      .then(([pRes, uRes]) => {
        setProjects(pRes.data || []);
        setUsers(uRes.data || []);
        if ((pRes.data?.length ?? 0) > 0 && !projectId) setProjectId(String(pRes.data![0].id));
        if ((uRes.data?.length ?? 0) > 0 && !userId) setUserId(String(uRes.data![0].id));
      })
      .catch(() => setError("Failed to load projects or users"))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId || !userId) {
      setError("Please fill in title, project, and assignee.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await api.post(
        `/issues?projectId=${projectId}&userId=${userId}`,
        { title: title.trim(), description: description.trim(), priority }
      );
      navigate("/issues");
    } catch (err: unknown) {
      setError(
        err && typeof err === "object" && "response" in err
          ? String((err as { response?: { data?: unknown } }).response?.data) || "Failed to create issue"
          : "Failed to create issue"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
        <div className="space-y-4 animate-pulse-soft">
          <div className="skeleton h-8 w-1/2" />
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-12 w-full" />
          <div className="skeleton h-24 w-full" />
        </div>
      </div>
    );
  }

  if (projects.length === 0 || users.length === 0) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto animate-fade-in">
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800">
          You need at least one project and one user to create issues.{" "}
          <Link to="/projects" className="underline font-medium">Create a project</Link> first.
        </div>
        <Link to="/issues" className="mt-4 inline-block text-blue-600 hover:underline font-medium">
          ← Back to Issues
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
      <div className="animate-fade-in-up">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Create Issue</h1>
        <p className="mt-1 text-slate-600 text-sm">Add a new bug or task.</p>
      </div>

      <form onSubmit={handleCreate} className="mt-8 space-y-6 animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "both" } as React.CSSProperties}>
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief title"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Project *</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
            >
              <option value="">Select project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Assignee *</label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
            >
              <option value="">Select assignee</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full sm:w-48 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium disabled:opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
          >
            {submitting ? "Creating..." : "Create Issue"}
          </button>
          <Link
            to="/issues"
            className="w-full sm:w-auto text-center px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-all duration-200"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CreateIssue;
