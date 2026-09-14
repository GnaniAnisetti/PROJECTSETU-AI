import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  FolderTree, 
  FileUp, 
  Cpu, 
  GitMerge, 
  CheckCircle2, 
  BarChart3, 
  AlertTriangle, 
  Lightbulb, 
  MessageSquareHeart, 
  History, 
  PieChart, 
  FileSpreadsheet, 
  TrendingUp, 
  ShieldCheck,
  Users
} from 'lucide-react';

export const Sidebar = () => {
  const { currentUser } = useApp();

  const navItems = [
    { label: 'Executive Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['PROJECT_MANAGER', 'ADMIN', 'FIELD_ENGINEER'] },
    { label: 'Project Portfolio & WBS', path: '/projects', icon: FolderTree, roles: ['PROJECT_MANAGER', 'ADMIN', 'FIELD_ENGINEER', 'CITIZEN'] },
    { label: 'Site Data Input', path: '/data-input', icon: FileUp, roles: ['FIELD_ENGINEER', 'PROJECT_MANAGER', 'ADMIN'] },
    { label: 'AI Extraction Pipeline', path: '/extraction', icon: Cpu, roles: ['FIELD_ENGINEER', 'PROJECT_MANAGER', 'ADMIN'] },
    { label: 'L5/L6 Activity Matcher', path: '/activity-matching', icon: GitMerge, roles: ['PROJECT_MANAGER', 'ADMIN', 'FIELD_ENGINEER'] },
    { label: 'Human Validation Console', path: '/validation', icon: CheckCircle2, roles: ['PROJECT_MANAGER', 'ADMIN'] },
    { label: 'Plan vs Actual Tracking', path: '/progress', icon: BarChart3, roles: ['PROJECT_MANAGER', 'ADMIN', 'FIELD_ENGINEER', 'CITIZEN'] },
    { label: 'Risk & Delay Alerts', path: '/risks', icon: AlertTriangle, roles: ['PROJECT_MANAGER', 'ADMIN'] },
    { label: 'AI Actionable Mitigations', path: '/recommendations', icon: Lightbulb, roles: ['PROJECT_MANAGER', 'ADMIN'] },
    { label: 'Feedback & Calibration', path: '/feedback', icon: MessageSquareHeart, roles: ['PROJECT_MANAGER', 'ADMIN', 'FIELD_ENGINEER'] },
    { label: 'Historical ML Learning', path: '/learning', icon: History, roles: ['PROJECT_MANAGER', 'ADMIN'] },
    { label: 'Performance Analytics', path: '/analytics', icon: PieChart, roles: ['PROJECT_MANAGER', 'ADMIN'] },
    { label: 'Executive Reports', path: '/reports', icon: FileSpreadsheet, roles: ['PROJECT_MANAGER', 'ADMIN'] },
    { label: 'What-If Forecasting', path: '/forecast', icon: TrendingUp, roles: ['PROJECT_MANAGER', 'ADMIN'] },
    { label: 'Admin & Audit Trail', path: '/admin', icon: ShieldCheck, roles: ['ADMIN', 'PROJECT_MANAGER'] },
    { label: 'Citizen Transparency Portal', path: '/citizen', icon: Users, roles: ['CITIZEN', 'PROJECT_MANAGER', 'ADMIN', 'FIELD_ENGINEER'] }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      
      {/* Workflow Indicator */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase">
          Planning-to-Execution Pipeline
        </div>
        <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
          <span>Unstructured DPR</span>
          <span className="text-indigo-400">→</span>
          <span>Schedule Link</span>
          <span className="text-indigo-400">→</span>
          <span>Mitigation</span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isAllowed = item.roles.includes(currentUser.role);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950'
                    : isAllowed
                    ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    : 'text-slate-500 opacity-60 hover:bg-slate-800/30'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
              {!isAllowed && (
                <span className="ml-auto text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400">view</span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Session Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-700/60 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-white">
            {currentUser.fullName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="truncate">
            <div className="text-xs font-semibold text-white truncate">{currentUser.fullName}</div>
            <div className="text-[10px] text-slate-400 truncate">{currentUser.designation}</div>
          </div>
        </div>
      </div>

    </aside>
  );
};
