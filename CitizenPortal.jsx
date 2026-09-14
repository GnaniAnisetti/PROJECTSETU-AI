import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Layers, 
  Clock, 
  Users, 
  ShieldCheck,
  Eye
} from 'lucide-react';

export const CitizenPortal = () => {
  const { projects } = useApp();

  const publicMilestones = [
    { title: 'Package A: Grade Separator at Ch 38+200 Open to Traffic', date: 'August 2026', status: 'COMPLETED' },
    { title: 'Package A: 42 km 4-Lane Pavement Bituminous Layering', date: 'Target: Nov 2026', status: 'IN_PROGRESS' },
    { title: 'Section B: Environmental Compliance & Pipeline Crossing', date: 'Target: Feb 2027', status: 'ON_TRACK' },
    { title: 'Package C: Cable-Stayed River Viaduct Pylons Erection', date: 'Target: Oct 2026', status: 'IN_PROGRESS' }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold mb-3 backdrop-blur-md">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Citizen Transparency & Public Accountability Portal</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            National Infrastructure Public Dashboard
          </h1>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Open government initiative providing citizens with real-time verified actual progress on highway corridors, natural gas networks, and bridge infrastructure projects.
          </p>
        </div>
      </div>

      {/* Projects Public Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                {p.code}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                PUBLIC STATUS: ACTIVE
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900">{p.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{p.location}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Public Completion:</span>
                <span className="font-extrabold text-indigo-700 text-sm">{p.overallActualPct}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${p.overallActualPct}%` }}></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Corridor: {p.corridorLengthKm} km</span>
                <span>Target: {p.plannedEndDate}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>MoRTH verified actual field progress data</span>
            </div>
          </div>
        ))}
      </div>

      {/* Citizen Milestones Track */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6">
        <h3 className="font-extrabold text-sm text-slate-900 mb-4">
          Key Civic Milestones & Traffic Openings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {publicMilestones.map((m, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start gap-3">
              <div className={`p-2 rounded-lg shrink-0 ${
                m.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
              }`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">{m.title}</h4>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                  <span>Target Date: {m.date}</span>
                  <span className="font-bold text-indigo-600">{m.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
