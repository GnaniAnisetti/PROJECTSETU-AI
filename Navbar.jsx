import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Bell, 
  Radio, 
  Sparkles, 
  ChevronDown, 
  UserCheck, 
  ShieldAlert,
  PlayCircle
} from 'lucide-react';

export const Navbar = ({ onOpenScenarioModal }) => {
  const { 
    currentUser, 
    switchRole, 
    DEMO_USERS, 
    projects, 
    selectedProjectId, 
    setSelectedProjectId,
    wsConnected, 
    notifications,
    liveAlert
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const roleColors = {
    FIELD_ENGINEER: 'bg-emerald-500/10 text-emerald-700 border-emerald-300',
    PROJECT_MANAGER: 'bg-indigo-500/10 text-indigo-700 border-indigo-300',
    CITIZEN: 'bg-amber-500/10 text-amber-700 border-amber-300',
    ADMIN: 'bg-purple-500/10 text-purple-700 border-purple-300'
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Branding & Tagline */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">PROJECTSETU</span>
                <span className="px-1.5 py-0.5 text-xs font-bold bg-indigo-600 text-white rounded">AI</span>
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 hidden sm:inline">SIH 26122</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                Team HEXORA • Planning-to-Execution Bridge
              </p>
            </div>
          </Link>

          {/* Project Selector */}
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200">
            <span className="text-xs text-slate-400 font-medium">Active Project:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.code}: {p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Actions, Sync Indicator, Notifications, Role Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Quick Demo Scenario Launcher */}
          <button
            onClick={onOpenScenarioModal}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-lg shadow-sm hover:shadow transition-all active:scale-95"
            title="Launch End-to-End Judge Walkthrough"
          >
            <PlayCircle className="w-4 h-4 text-white animate-pulse" />
            <span className="hidden sm:inline">Interactive SIH Demo</span>
          </button>

          {/* Live Sync Status */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-600">
            <Radio className={`w-3.5 h-3.5 ${wsConnected ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
            <span>{wsConnected ? 'Live Sync Active' : 'Offline / Standalone'}</span>
          </div>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="System Alerts & Notifications"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Alert Notifications ({notifications.length})</span>
                  <span className="text-[10px] text-slate-400">Real-time WebSockets</span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">No active alerts. System on track.</div>
                  ) : (
                    notifications.map((n, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => { setShowNotifications(false); navigate('/risks'); }}
                        className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>{n.title || 'Variance Detected'}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">Variance: {n.varianceValue}%</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${roleColors[currentUser.role]} transition-colors`}
            >
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">{currentUser.fullName}</span>
              <span className="text-[10px] opacity-75">({currentUser.role.replace('_', ' ')})</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Active Role (SIH Demo)
                </div>
                {Object.entries(DEMO_USERS).map(([key, user]) => (
                  <button
                    key={key}
                    onClick={() => {
                      switchRole(key);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-slate-50 transition-colors ${
                      currentUser.role === key ? 'bg-indigo-50/70 font-bold text-indigo-700' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{user.fullName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-mono">
                        {key.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{user.designation}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
