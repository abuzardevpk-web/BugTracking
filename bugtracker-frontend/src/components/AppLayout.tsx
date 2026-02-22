import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderOpen, Bug, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/projects", label: "Projects", Icon: FolderOpen },
  { to: "/issues", label: "Issues", Icon: Bug },
];

const SidebarContent: React.FC<{
  user: { name?: string; role?: string } | null;
  onLogout: () => void;
  onNavClick?: () => void;
  location: ReturnType<typeof useLocation>;
}> = ({ user, onLogout, onNavClick, location }) => (
  <>
    <div className="p-4 lg:p-8 relative">
      <Link to="/dashboard" className="flex items-center gap-3 group" onClick={onNavClick}>
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300 shrink-0">
          <Bug className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-bold text-xl tracking-tight text-white">BugTracker</span>
      </Link>
    </div>

    <nav className="flex-1 px-4 py-4 space-y-2 relative">
      <div className="mb-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
        Main Menu
      </div>
      {navLinks.map(({ to, label, Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavClick}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${location.pathname === to
              ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]"
              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 hover:translate-x-1"
            }`}
        >
          <Icon className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${location.pathname === to ? "opacity-100" : "opacity-60"}`} strokeWidth={2} />
          <span className="font-medium">{label}</span>
          {location.pathname === to && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)] animate-pulse-soft" />
          )}
        </Link>
      ))}
    </nav>

    <div className="p-4 lg:p-6 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm relative">
      <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold text-blue-400 border border-slate-700 shrink-0">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white truncate">{user?.name}</div>
          <div className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">{user?.role}</div>
        </div>
      </div>
      <button
        onClick={() => { onLogout(); onNavClick?.(); }}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-xl transition-all duration-300"
      >
        <LogOut className="w-4 h-4" strokeWidth={2} />
        <span>Sign out</span>
      </button>
    </div>
  </>
);

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row font-sans">
      {/* Mobile header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 text-white shrink-0 border-b border-slate-800">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" strokeWidth={2} />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2">
          <Bug className="w-6 h-6 text-blue-400" strokeWidth={2.5} />
          <span className="font-bold text-lg">BugTracker</span>
        </Link>
        <div className="w-10" aria-hidden />
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - hidden on mobile, overlay when open */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto w-72 bg-slate-900 flex flex-col overflow-hidden shadow-2xl lg:shrink-0
          transform transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          lg:animate-slide-in-left`}
      >
        <div className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-800 transition-colors">
          <button onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X className="w-5 h-5 text-slate-400" strokeWidth={2} />
          </button>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-full h-[50%] bg-blue-500 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-full h-[50%] bg-indigo-500 rounded-full blur-[100px]" />
        </div>
        <div className="relative flex flex-col h-full pt-12 lg:pt-0">
          <SidebarContent
            user={user}
            onLogout={handleLogout}
            onNavClick={() => setSidebarOpen(false)}
            location={location}
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-auto bg-[#f8fafc] animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
