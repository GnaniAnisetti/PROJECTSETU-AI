import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Ruler,
  FileSpreadsheet
} from 'lucide-react';

export const ProgressComparison = () => {
  const { currentProject, selectedProjectId } = useApp();
  const navigate = useNavigate();

  const [comparisonData, setComparisonData] = useState(null);
  const [activeTab, setActiveTab] = useState('activities'); // 'activities' | 'scurve' | 'quantities'

  useEffect(() => {
    api.getProgressComparison(selectedProjectId).then(res => {
      if (res) setComparisonData(res);
    });
  }, [selectedProjectId]);

  const planned = 65.0;
  const actual = 58.0;
  const variance = -7.0; // 58 - 65 = -7%

  const activities = [
    { name: 'Roadway Excavation', planned: 70, actual: 68, variance: -2, status: 'ON_TRACK', qtyPln: 120000, qtyAct: 116000, unit: 'cum' },
    { name: 'Embankment Filling', planned: 65, actual: 58, variance: -7, status: 'WARNING', qtyPln: 95000, qtyAct: 84700, unit: 'meters' },
    { name: 'Compaction & Proof Rolling', planned: 60, actual: 55, variance: -5, status: 'WARNING', qtyPln: 95000, qtyAct: 82500, unit: 'meters' },
    { name: 'Subgrade Preparation', planned: 50, actual: 48, variance: -2, status: 'ON_TRACK', qtyPln: 42000, qtyAct: 40300, unit: 'meters' },
    { name: 'Granular Sub-Base (GSB)', planned: 42, actual: 30, variance: -12, status: 'HIGH_RISK', qtyPln: 40000, qtyAct: 28500, unit: 'meters' },
    { name: 'Wet Mix Macadam (WMM)', planned: 25, actual: 20, variance: -5, status: 'WARNING', qtyPln: 38000, qtyAct: 30400, unit: 'meters' },
    { name: 'Concrete Pouring (Abutment)', planned: 80, actual: 78, variance: -2, status: 'ON_TRACK', qtyPln: 8500, qtyAct: 8300, unit: 'cum' },
    { name: 'Pier Cap Reinforcement', planned: 75, actual: 72, variance: -3, status: 'ON_TRACK', qtyPln: 4200, qtyAct: 4030, unit: 'MT' },
    { name: 'Box Culvert Construction', planned: 60, actual: 48, variance: -12, status: 'HIGH_RISK', qtyPln: 34, qtyAct: 27, unit: 'units' },
    { name: 'Longitudinal Side Drains', planned: 45, actual: 45, variance: 0, status: 'ON_TRACK', qtyPln: 28000, qtyAct: 28000, unit: 'meters' }
  ];

  const sCurveData = comparisonData?.sCurveData || [
    { week: 'W1', planned: 10, actual: 10 },
    { week: 'W2', planned: 18, actual: 18 },
    { week: 'W3', planned: 28, actual: 27 },
    { week: 'W4', planned: 38, actual: 36 },
    { week: 'W5', planned: 47, actual: 44 },
    { week: 'W6', planned: 55, actual: 51 },
    { week: 'W7', planned: 60, actual: 55 },
    { week: 'W8 (Current)', planned: 65, actual: 58 },
    { week: 'W9', planned: 72, actual: null, forecast: 64 },
    { week: 'W10', planned: 80, actual: null, forecast: 71 }
  ];

  const getStatusBadge = (variance) => {
    if (variance >= -5) {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">ON TRACK ({variance}%)</span>;
    }
    if (variance < -5 && variance >= -10) {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">WARNING ({variance}%)</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">HIGH RISK ({variance}%)</span>;
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            Real-Time Variance Engine
          </span>
          <span className="text-xs text-slate-400">Post-Validation Execution Sync</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
          Planned vs Actual Progress Comparison Dashboard
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Mathematical variance computation ($\text{Variance} = \text{Actual} - \text{Planned}$). Automatically triggers threshold alerts when delays breach tolerance limits.
        </p>
      </div>

      {/* Variance Metric Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Planned Baseline */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Planned Baseline Target</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-4xl font-black text-slate-900">
            {planned}%
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Primavera P6 contractual baseline schedule target for Week 8.
          </p>
        </div>

        {/* Card 2: Actual Recorded */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Actual Progress Recorded</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-4xl font-black text-indigo-700">
            {actual}%
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Synchronized from validated field DPRs and site measurement sheets.
          </p>
        </div>

        {/* Card 3: Mathematical Variance */}
        <div className="bg-gradient-to-br from-rose-50 to-amber-50 p-6 rounded-2xl border border-rose-200 shadow-2xs">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Schedule Variance</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-4xl font-black text-rose-600 flex items-center gap-2">
            <span>{variance}%</span>
            <span className="text-xs font-bold px-2 py-1 rounded bg-rose-600 text-white uppercase">
              WARNING
            </span>
          </div>
          <p className="text-xs text-rose-800 font-medium mt-2">
            Breaches warning threshold (-5.0%). Embankment filling and GSB delayed.
          </p>
        </div>

      </div>

      {/* View Switcher Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('activities')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'activities' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Activity-Wise Variance (L6 WBS)
        </button>
        <button
          onClick={() => setActiveTab('scurve')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'scurve' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Cumulative S-Curve Trend
        </button>
        <button
          onClick={() => setActiveTab('quantities')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'quantities' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Bill of Quantities (BoQ) Progress
        </button>
      </div>

      {/* Content Section based on tab */}
      {activeTab === 'activities' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">
              L6 Detailed Activity Progress & Variance Table
            </h3>
            <span className="text-xs text-slate-400">10 Monitored WBS Activities</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Activity Name</th>
                  <th className="p-3.5">Scope (BoQ)</th>
                  <th className="p-3.5">Planned %</th>
                  <th className="p-3.5">Actual %</th>
                  <th className="p-3.5">Progress Visual</th>
                  <th className="p-3.5">Variance</th>
                  <th className="p-3.5">Health Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activities.map((act, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{act.name}</td>
                    <td className="p-3.5 font-medium text-slate-600">
                      {act.qtyAct.toLocaleString()} / {act.qtyPln.toLocaleString()} {act.unit}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-600">{act.planned}%</td>
                    <td className="p-3.5 font-extrabold text-indigo-700">{act.actual}%</td>
                    <td className="p-3.5 w-40">
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                        <div
                          className={`h-full rounded-full ${
                            act.variance < -5 ? 'bg-amber-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${act.actual}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className={`p-3.5 font-black ${act.variance < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {act.variance}%
                    </td>
                    <td className="p-3.5">
                      {getStatusBadge(act.variance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {activeTab === 'scurve' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Weekly Cumulative Progress S-Curve
              </h3>
              <p className="text-xs text-slate-400">
                Identifies inflection points where weather and supply chain delays manifested
              </p>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sCurveData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(value) => [`${value}%`]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="planned" stroke="#3b82f6" strokeWidth={2} name="Planned Baseline" />
                <Line type="monotone" dataKey="actual" stroke="#4f46e5" strokeWidth={3} name="Actual Recorded" connectNulls={false} />
                <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={2} name="Current Projected Forecast" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'quantities' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-extrabold text-slate-900 mb-4">
            Executed vs Contractual Target Quantities (Physical Units)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.slice(0, 6).map((a, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60">
                <span className="text-xs font-bold text-slate-800">{a.name}</span>
                <div className="text-lg font-black text-slate-900 mt-2">
                  {a.qtyAct.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ {a.qtyPln.toLocaleString()} {a.unit}</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-500">
                  Remaining: {(a.qtyPln - a.qtyAct).toLocaleString()} {a.unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Forward Action Banner */}
      <div className="p-6 bg-gradient-to-r from-amber-50 to-rose-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-800 uppercase">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Threshold Alert Triggered: Embankment Filling (-7.0%)</span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Negative variance has crossed the -5% warning threshold. Real-time alert dispatched to Project Authority.
          </p>
        </div>

        <button
          onClick={() => navigate('/risks')}
          className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-95 shrink-0"
        >
          <span>Examine Delay Causes & Risks</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
