import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  TrendingDown, 
  TrendingUp, 
  ArrowUpRight, 
  Activity as ActivityIcon, 
  Cpu, 
  ShieldAlert,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';

export const Dashboard = () => {
  const { currentProject, projects, switchRole, triggerDemoAlert } = useApp();
  const navigate = useNavigate();

  const [comparisonData, setComparisonData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    api.getProgressComparison(currentProject.id).then(res => {
      if (res && res.sCurveData) setComparisonData(res);
    });
    api.getAnalytics().then(res => {
      if (res) setAnalyticsData(res);
    });
    api.getAlerts().then(res => {
      if (res && res.alerts) setAlerts(res.alerts);
    });
  }, [currentProject.id]);

  // Activity Planned vs Actual comparison dataset
  const activityData = [
    { name: 'Excavation', planned: 70, actual: 68, variance: -2 },
    { name: 'Embankment Fill', planned: 65, actual: 58, variance: -7 },
    { name: 'Compaction', planned: 60, actual: 55, variance: -5 },
    { name: 'Subgrade Prep', planned: 50, actual: 48, variance: -2 },
    { name: 'GSB Layer', planned: 42, actual: 30, variance: -12 },
    { name: 'Culverts', planned: 60, actual: 48, variance: -12 }
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
    { week: 'W9', planned: 72, actual: null },
    { week: 'W10', planned: 80, actual: null }
  ];

  const riskPieData = [
    { name: 'On Track (0 to -5%)', value: 8, color: '#10B981' },
    { name: 'Warning (-5% to -10%)', value: 4, color: '#F59E0B' },
    { name: 'Critical Delay (<-10%)', value: 2, color: '#EF4444' }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Corridor Package A • Active
            </span>
            <span className="text-xs text-slate-400">NH Infrastructure Corridor</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Infrastructure Execution & Schedule Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time synchronization between daily site progress reports and Primavera/MS Project L5/L6 schedules.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/data-input')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all hover:scale-[1.02]"
          >
            <FileText className="w-4 h-4" />
            <span>Ingest Site DPR</span>
          </button>
          <button
            onClick={() => navigate('/validation')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
          >
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>Pending Approvals (2)</span>
          </button>
          <button
            onClick={() => navigate('/forecast')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all"
          >
            <TrendingUp className="w-4 h-4" />
            <span>What-If Forecast</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Projects</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">3</div>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
            <span>1 On Track</span> • <span className="text-amber-600">2 At Risk</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Planned vs Actual</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            58.0<span className="text-sm font-medium text-slate-400"> / 65%</span>
          </div>
          <div className="text-[11px] text-rose-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Variance: -7.0%</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Delayed Activities</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">4</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">
            2 Weather, 2 Material
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">AI Accuracy</span>
            <Cpu className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">93.8%</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+7.6% Self-Learned</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Review</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">2</div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">
            Human-in-the-Loop
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Alerts</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600 mt-2">
            {alerts.length || 2}
          </div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">
            Action required
          </div>
        </div>

      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* S-Curve Progress Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Baseline S-Curve vs Actual Cumulative Progress
              </h3>
              <p className="text-xs text-slate-400">
                Weekly progress divergence detection (Planned 65% vs Actual 58% at Week 8)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-3 h-0.5 bg-blue-500"></span> Planned Baseline
              </span>
              <span className="flex items-center gap-1.5 text-indigo-600">
                <span className="w-3 h-0.5 bg-indigo-600"></span> Actual Recorded
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sCurveData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(value) => [`${value}%`]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="planned" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Planned" />
                <Line type="monotone" dataKey="actual" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} name="Actual" connectNulls={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              WBS Activities Risk Health
            </h3>
            <p className="text-xs text-slate-400">
              Threshold breakdown (-5% warning, -10% critical)
            </p>
          </div>

          <div className="h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
            {riskPieData.map((r, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }}></span>
                  {r.name}
                </span>
                <span className="font-extrabold text-slate-900">{r.value} pkgs</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Activity Comparison & Live Alert Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Activity Planned vs Actual Grouped Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                L6 Activity Variance Breakdown (% Planned vs % Actual)
              </h3>
              <p className="text-xs text-slate-400">
                Granular work packages linked to site execution DPRs
              </p>
            </div>
            <button
              onClick={() => navigate('/progress')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Full Analysis</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val) => [`${val}%`]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="planned" fill="#93c5fd" radius={[4, 4, 0, 0]} name="Planned %" />
                <Bar dataKey="actual" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Actual %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Variance Alerts & Quick Ticker */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-slate-900">
                Live Alert Feed
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                WebSocket Sync
              </span>
            </div>

            <div className="space-y-3">
              {alerts.slice(0, 2).map((a, idx) => (
                <div 
                  key={idx} 
                  onClick={() => navigate('/risks')}
                  className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/40 hover:bg-rose-50 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-rose-700">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {a.activityName}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-rose-200 text-rose-800 text-[10px]">
                      {a.varianceValue}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    {a.message}
                  </p>
                  <div className="mt-2 text-[10px] text-indigo-600 font-bold flex items-center gap-1">
                    <span>Inspect Root Cause →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => navigate('/recommendations')}
              className="w-full py-2 px-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>View AI Actionable Recommendations</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
