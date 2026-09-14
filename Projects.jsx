import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  FolderTree,
  ChevronDown,
  ChevronRight,
  TrendingDown,
  Ruler
} from 'lucide-react';

export const Projects = () => {
  const { projects, selectedProjectId, setSelectedProjectId, currentProject } = useApp();
  const [activities, setActivities] = useState([]);
  const [expandedL5, setExpandedL5] = useState({ 'act-l5-earth': true, 'act-l5-pave': true });
  const navigate = useNavigate();

  useEffect(() => {
    api.getProjectActivities(selectedProjectId).then(res => {
      if (res && res.activities) setActivities(res.activities);
    });
  }, [selectedProjectId]);

  const toggleL5 = (id) => {
    setExpandedL5(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const l5Activities = activities.filter(a => a.level === 'L5');

  const getStatusBadge = (status, variance) => {
    if (status === 'ON_TRACK' || variance >= -5) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">ON TRACK</span>;
    }
    if (status === 'WARNING' || (variance < -5 && variance >= -10)) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">WARNING ({variance}%)</span>;
    }
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">HIGH RISK ({variance}%)</span>;
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Primavera / MS Project Enterprise Bridge
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Infrastructure Projects & L5/L6 Schedule Directory
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an infrastructure asset to explore its hierarchical Work Breakdown Structure (WBS) down to Level 6 field execution items.
            </p>
          </div>

          <button
            onClick={() => navigate('/data-input')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
          >
            + Ingest Field Progress
          </button>
        </div>
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((p) => {
          const isSelected = p.id === selectedProjectId;
          return (
            <div
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className={`p-5 rounded-2xl border text-left cursor-pointer transition-all hover:scale-[1.01] ${
                isSelected
                  ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {p.code}
                </span>
                {getStatusBadge(p.status, p.currentVariancePct)}
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 mt-3 line-clamp-1">
                {p.name}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{p.location}</span>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Timeline:</span>
                  <span className="font-semibold text-slate-700">{p.startDate} to {p.plannedEndDate}</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-400">Actual vs Planned:</span>
                    <span className="font-bold text-slate-900">
                      {p.overallActualPct}% <span className="text-slate-400 font-normal">/ {p.overallPlannedPct}%</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${p.overallActualPct}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400">Schedule Variance:</span>
                  <span className={`font-extrabold ${p.currentVariancePct < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {p.currentVariancePct}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* L5 / L6 Activity WBS Schedule Viewer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                WBS Activity Schedule: {currentProject.name}
              </h3>
              <p className="text-xs text-slate-500">
                L5 Work Packages & L6 Granular Activities (Primavera P6 baseline link)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> On Track (&gt; -5%)
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Warning (-5% to -10%)
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> High Risk (&lt; -10%)
            </span>
          </div>
        </div>

        {/* WBS Tree */}
        <div className="divide-y divide-slate-100">
          {l5Activities.map((l5) => {
            const isExpanded = expandedL5[l5.id];
            const childL6 = activities.filter(a => a.parentId === l5.id);

            return (
              <div key={l5.id} className="bg-white">
                
                {/* L5 Row */}
                <div
                  onClick={() => toggleL5(l5.id)}
                  className="p-4 hover:bg-slate-50/80 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button className="text-slate-400 hover:text-slate-600">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {l5.wbsCode}
                    </span>
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-1.5 py-0.5 rounded">
                      L5 Work Package
                    </span>
                    <span className="font-extrabold text-sm text-slate-900">
                      {l5.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-xs">
                    <div className="hidden sm:block text-right">
                      <span className="text-slate-400">Total Scope: </span>
                      <span className="font-bold text-slate-800">{l5.totalPlannedQuantity.toLocaleString()} {l5.unit}</span>
                    </div>

                    <div className="w-36">
                      <div className="flex items-center justify-between text-[11px] mb-0.5">
                        <span className="text-slate-500">Progress</span>
                        <span className="font-bold text-slate-900">{l5.actualProgressPct}% / {l5.plannedProgressPct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${l5.actualProgressPct}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="w-24 text-right">
                      {getStatusBadge(l5.status, l5.variancePct)}
                    </div>
                  </div>
                </div>

                {/* L6 Children Rows */}
                {isExpanded && childL6.length > 0 && (
                  <div className="bg-slate-50/40 divide-y divide-slate-100/80 border-t border-slate-100 pl-10 pr-4">
                    {childL6.map((l6) => (
                      <div key={l6.id} className="py-3 px-2 flex items-center justify-between hover:bg-slate-100/50 transition-colors">
                        
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                          <span className="font-mono text-xs text-slate-400">
                            {l6.wbsCode}
                          </span>
                          <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                            L6 Activity
                          </span>
                          <div>
                            <span className="text-xs font-bold text-slate-800">{l6.name}</span>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2">
                              <span>Chainage: {l6.chainageStart} to {l6.chainageEnd}</span>
                              <span>•</span>
                              <span>{l6.description}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-xs">
                          <div className="hidden md:block text-right">
                            <span className="text-slate-400">Planned Qty: </span>
                            <span className="font-semibold text-slate-700">{l6.totalPlannedQuantity.toLocaleString()} {l6.unit}</span>
                          </div>

                          <div className="w-32">
                            <div className="flex items-center justify-between text-[11px] mb-0.5">
                              <span className="text-slate-400">Act / Pln</span>
                              <span className="font-bold text-slate-900">{l6.actualProgressPct}% / {l6.plannedProgressPct}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  l6.variancePct < -5 ? 'bg-amber-500' : 'bg-indigo-600'
                                }`}
                                style={{ width: `${l6.actualProgressPct}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="w-24 text-right">
                            {getStatusBadge(l6.status, l6.variancePct)}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
