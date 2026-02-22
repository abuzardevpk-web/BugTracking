import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bug } from "lucide-react";
import api from "../api/axiosConfig";

type Issue = {
  id: number;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  project?: { id: number; name: string };
  assignedUser?: { id: number; name: string; email: string };
};

const statusColors: Record<string, string> = {
  OPEN: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  RESOLVED: "bg-green-100 text-green-800",
  CLOSED: "bg-slate-100 text-slate-700",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-blue-100 text-blue-800",
  HIGH: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-800",
};

const ISSUE_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const Issues: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<number | null>(null);

  const loadIssues = () => {
    setLoading(true);
    api
      .get<Issue[]>("/issues")
      .then((res) => setIssues(res.data || []))
      .catch((err) => {
        console.error(err);
        setError("Failed to load issues. Are you authenticated?");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => loadIssues(), []);

  const handleStatusChange = async (id: number, status: string) => {
    setUpdating(id);
    setError("");
    try {
      await api.put(`/issues/${id}?status=${status}`);
      loadIssues();
    } catch {
      setError("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this issue?")) return;
    try {
      await api.delete(`/issues/${id}`);
      loadIssues();
    } catch {
      setError("Failed to delete issue");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Issues</h1>
        <Link
          to="/create-issue"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
        >
          + Create Issue
        </Link>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm animate-fade-in">{error}</div>
      )}

      {loading ? (
        <div className="mt-6 sm:mt-8 overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm animate-pulse-soft">
          <div className="p-6 space-y-4">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
        </div>
      ) : issues.length === 0 ? (
        <div className="mt-6 sm:mt-8 p-8 sm:p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mb-4">
            <Bug className="w-8 h-8" strokeWidth={1.5} />
          </div>
          No issues yet.{" "}
          <Link to="/create-issue" className="text-blue-600 hover:underline font-medium">
            Create one
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile: Card layout */}
          <div className="mt-6 sm:mt-8 md:hidden space-y-4">
            {issues.map((i, idx) => (
              <div
                key={i.id}
                className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.03}s`, animationFillMode: "both" } as React.CSSProperties}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-slate-800 truncate">{i.title}</h3>
                    {i.description && (
                      <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{i.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(i.id)}
                    className="text-slate-400 hover:text-red-600 text-sm shrink-0"
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 items-center">
                  <select
                    value={i.status || "OPEN"}
                    onChange={(e) => handleStatusChange(i.id, e.target.value)}
                    disabled={updating === i.id}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer ${
                      statusColors[i.status || "OPEN"] || "bg-slate-100"
                    }`}
                  >
                    {ISSUE_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      priorityColors[i.priority || "MEDIUM"] || "bg-slate-100"
                    }`}
                  >
                    {i.priority || "—"}
                  </span>
                  <span className="text-xs text-slate-500">{i.project?.name || "—"}</span>
                  <span className="text-xs text-slate-500 truncate max-w-[120px]">
                    {i.assignedUser?.name || i.assignedUser?.email || "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table layout */}
          <div className="mt-6 sm:mt-8 hidden md:block overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm animate-fade-in-up">
            <table className="w-full text-left min-w-[640px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-sm font-semibold text-slate-700">Title</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-sm font-semibold text-slate-700">Priority</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-sm font-semibold text-slate-700">Project</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-sm font-semibold text-slate-700">Assignee</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-sm font-semibold text-slate-700 w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((i, idx) => (
                  <tr
                    key={i.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-200 animate-fade-in-up"
                    style={{ animationDelay: `${idx * 0.03}s`, animationFillMode: "both" } as React.CSSProperties}
                  >
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <div>
                        <span className="font-medium text-slate-800">{i.title}</span>
                        {i.description && (
                          <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{i.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <select
                        value={i.status || "OPEN"}
                        onChange={(e) => handleStatusChange(i.id, e.target.value)}
                        disabled={updating === i.id}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer transition-all duration-200 ${
                          statusColors[i.status || "OPEN"] || "bg-slate-100"
                        }`}
                      >
                        {ISSUE_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full inline-block ${
                          priorityColors[i.priority || "MEDIUM"] || "bg-slate-100"
                        }`}
                      >
                        {i.priority || "—"}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-600">
                      {i.project?.name || "—"}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-600">
                      {i.assignedUser?.name || i.assignedUser?.email || "—"}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <button
                        onClick={() => handleDelete(i.id)}
                        className="text-sm text-slate-400 hover:text-red-600 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Issues;
