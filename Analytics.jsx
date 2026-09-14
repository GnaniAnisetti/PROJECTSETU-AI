import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  PieChart as PieIcon, 
  TrendingUp, 
  Clock, 
  Cpu, 
  CheckCircle2, 
  BarChart2, 
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    api.getAnalytics().then(res => {
      if (res) setAnalyticsData(res);
    });
  }, []);

  const monthlyDelayHours = analyticsData?.monthlyDelayHours || [
    { month: 'Apr', weather: 8, equipment: 4, material: 2 },
    { month: 'May', weather: 14, equipment: 6, material: 4 },
    { month: 'Jun', weather: 32, equipment: 8, material: 6 },
    { month: 'Jul', weather: 45, equipment: 10, material: 8 },
    { month: 'Aug', weather: 28, equipment: 5, material: 5 },
    { month: 'Sep', weather: 16, equipment: 3, material: 2 }
  ];

  const confidenceDist = analyticsData?.confidenceDistribution || [
    { tier: '90% - 100% (High)', count: 85, color: '#3B82F6' },
    { tier: '75% - 89% (Medium)', count: 12, color: '#6366F1' },
    { tier: '< 75% (Low)', count: 3, color: '#EC4899' }
  ];

  const recommendationPie = analyticsData?.recommendationAcceptance || [
    { name: 'Accepted', value: 78, color: '#10B981' },
    { name: 'Modified', value: 16, color: '#F59E0B' },
    { name: 'Rejected', value: 6, color: '#EF4444' }
  ];

  const resourceUtilization = [
    { week: 'W1', excavators: 85, tippers: 80, rollers: 75 },
    { week: 'W2', excavators: 88, tippers: 85, rollers: 80 },
    { week: 'W3', excavators: 92, tippers: 87, rollers: 82 },
    { week: 'W4', excavators: 89, tippers: 84, rollers: 78 },
    { week: 'W5', excavators: 78, tippers: 72, rollers: 65 }, // dip during monsoon
    { week: 'W6', excavators: 82, tippers: 76, rollers: 70 },
    { week: 'W7', excavators: 88, tippers: 82, rollers: 80 },
    { week: 'W8', excavators: 94, tippers: 91, rollers: 89 }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            Section 25 • Enterprise Analytics
          </span>
          <span className="text-xs text-slate-400">Deep Performance Modeling</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
          Infrastructure Project Performance Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Multi-dimensional analytics evaluating progress trajectories, root-cause delay trends, AI confidence calibration, and fleet utilization.
        </p>
      </div>

      {/* Row 1: Delay Breakdown Stacked Bar Chart & Recommendation Acceptance Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Stacked Bar Chart: Monthly Delay Breakdown by Root Cause */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Monthly Operational Stoppage Hours by Delay Cause
              </h3>
              <p className="text-xs text-slate-400">
                Weather vs Equipment Breakdown vs Material Shortage
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">Cumulative Hours</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyDelayHours} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis unit="h" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val, name) => [`${val} hrs`, name]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend />
                <Bar dataKey="weather" stackId="a" fill="#3b82f6" name="Weather / Rainfall" radius={[0, 0, 0, 0]} />
                <Bar dataKey="equipment" stackId="a" fill="#f59e0b" name="Machinery Breakdown" />
                <Bar dataKey="material" stackId="a" fill="#ef4444" name="Quarry / Material Shortage" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Recommendation Acceptance Rate */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Authority Decision Ratio
            </h3>
            <p className="text-xs text-slate-400">
              AI Recommendation acceptance vs modification vs rejection
            </p>
          </div>

          <div className="h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={recommendationPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {recommendationPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`${val}%`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
            {recommendationPie.map((r, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }}></span>
                  {r.name}
                </span>
                <span className="font-extrabold text-slate-900">{r.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 2: Resource Utilization Area Chart & AI Confidence Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Area Chart: Machinery Utilization Trends */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Heavy Machinery Fleet Utilization Trends (%)
              </h3>
              <p className="text-xs text-slate-400">
                Tracking productivity recovery post AI fleet reallocation
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={resourceUtilization} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis unit="%" domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val) => [`${val}%`]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend />
                <Area type="monotone" dataKey="excavators" stroke="#4f46e5" fill="#e0e7ff" name="Hydraulic Excavators" />
                <Area type="monotone" dataKey="tippers" stroke="#06b6d4" fill="#cffafe" name="Heavy Tippers" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: AI Confidence Score Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              AI Confidence Score Distribution
            </h3>
            <p className="text-xs text-slate-400">
              Percentage of field DPRs categorized by confidence tiers
            </p>
          </div>

          <div className="space-y-4 my-auto">
            {confidenceDist.map((tier, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">{tier.tier}</span>
                  <span className="font-extrabold text-slate-900">{tier.count}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${tier.count}%`, backgroundColor: tier.color }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
            85% of field reports auto-qualify for high-confidence express approval.
          </div>
        </div>

      </div>

    </div>
  );
};
