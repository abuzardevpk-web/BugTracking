import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderOpen, Bug, Users, ChevronRight } from "lucide-react";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ projects: 0, issues: 0, users: 0 });
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([api.get("/projects"), api.get("/issues"), api.get("/users")])
      .then(([pRes, iRes, uRes]) =>
        setStats({
          projects: Array.isArray(pRes.data) ? pRes.data.length : 0,
          issues: Array.isArray(iRes.data) ? iRes.data.length : 0,
          users: Array.isArray(uRes.data) ? uRes.data.length : 0,
        })
      )
      .catch(() => { });
  }, []);

  const displayName = user?.name || "User";

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto space-y-6 sm:space-y-8 md:space-y-10">
      {/* Header Section */}
      <header className="relative py-8 px-4 sm:py-10 sm:px-6 md:py-12 md:px-8 rounded-2xl sm:rounded-[2.5rem] bg-slate-900 overflow-hidden shadow-2xl animate-fade-in-up">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] -ml-48 -mb-48" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-3 sm:mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            System Online
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">{displayName}</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-slate-400 text-base sm:text-lg max-w-2xl font-medium">
            Manage your projects and track issues with our high-performance bug tracking system.
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { Icon: FolderOpen, value: stats.projects, label: "Active Projects", iconBg: "bg-blue-50", iconBorder: "border-blue-100", iconColor: "text-blue-600", anim: "stagger-1", hover: true },
          { Icon: Bug, value: stats.issues, label: "Open Issues", iconBg: "bg-red-50", iconBorder: "border-red-100", iconColor: "text-red-600", anim: "stagger-2", hover: true },
          { Icon: Users, value: stats.users, label: "Team Members", iconBg: "bg-green-50", iconBorder: "border-green-100", iconColor: "text-green-600", anim: "stagger-3", hover: true },
        ].map(({ Icon, value, label, iconBg, iconBorder, iconColor, anim, hover }) => (
          <div
            key={label}
            className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm transition-all duration-300 animate-fade-in-up ${anim} ${
              hover ? "hover:shadow-xl hover:-translate-y-1 hover:border-slate-300/80" : "opacity-50 cursor-not-allowed"
            }`}
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${iconBg} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 border ${iconBorder}`}>
              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} strokeWidth={2} />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{value}</div>
            <div className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </section>

      {/* Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <Link
          to="/projects"
          className="group p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-blue-500/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between gap-4 animate-fade-in-up stagger-5"
        >
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-600 rounded-xl sm:rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 shrink-0">
              <FolderOpen className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Manage Projects</h3>
              <p className="text-slate-500 mt-0.5 sm:mt-1 text-sm sm:text-base">View, track and organize project workflows.</p>
            </div>
          </div>
          <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 shrink-0">
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </span>
        </Link>

        <Link
          to="/create-issue"
          className="group p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-red-500/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between gap-4 animate-fade-in-up stagger-6"
        >
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-red-500 rounded-xl sm:rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 shrink-0">
              <Bug className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Report Issue</h3>
              <p className="text-slate-500 mt-0.5 sm:mt-1 text-sm sm:text-base">Document new bugs found in the system.</p>
            </div>
          </div>
          <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-red-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 shrink-0">
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
