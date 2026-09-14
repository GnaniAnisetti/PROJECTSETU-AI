import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  Truck, 
  Users, 
  DollarSign,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Forecast = () => {
  const [forecastData, setForecastData] = useState(null);

  // Interactive What-If Simulator Inputs
  const [additionalWorkers, setAdditionalWorkers] = useState(12);
  const [additionalExcavators, setAdditionalExcavators] = useState(2);
  const [extendShiftHours, setExtendShiftHours] = useState(2.0);

  const [simulationResult, setSimulationResult] = useState({
    productivityBoostPct: 24,
    recoveredDays: 12,
    revisedDelayDays: 2,
    revisedCompletionDate: '2026-12-02',
    estimatedCostImpact: 360000
  });

  useEffect(() => {
    api.getForecast().then(res => {
      if (res) setForecastData(res);
    });
  }, []);

  const handleSimulate = async () => {
    const res = await api.simulateWhatIf({
      additionalWorkers,
      additionalExcavators,
      extendShiftHours
    });
    if (res && res.simulation) {
      setSimulationResult(res.simulation);
    }
  };

  useEffect(() => {
    handleSimulate();
  }, [additionalWorkers, additionalExcavators, extendShiftHours]);

  const forecastChartData = [
    { week: 'W8 (Now)', baseline: 65, actual: 58, scenarioA: 58, scenarioB: 58, scenarioC: 58 },
    { week: 'W9', baseline: 72, actual: null, scenarioA: 64, scenarioB: 67, scenarioC: 70 },
    { week: 'W10', baseline: 80, actual: null, scenarioA: 71, scenarioB: 76, scenarioC: 81 },
    { week: 'W11', baseline: 90, actual: null, scenarioA: 80, scenarioB: 87, scenarioC: 92 },
    { week: 'W12', baseline: 100, actual: null, scenarioA: 88, scenarioB: 97, scenarioC: 100 },
    { week: 'W13', baseline: 100, actual: null, scenarioA: 95, scenarioB: 100, scenarioC: 100 },
    { week: 'W14', baseline: 100, actual: null, scenarioA: 100, scenarioB: 100, scenarioC: 100 }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            Section 27 • Predictive AI Simulation
          </span>
          <span className="text-xs text-slate-400">Future Planning & Risk Mitigation</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
          Predictive Schedule Forecasting & What-If Simulator
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Projects completion trajectory using historical velocity, current weather risks, and interactive resource reallocation levers.
        </p>
      </div>

      {/* Primary Forecast Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-bold uppercase">Contractual Deadline</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">30 Nov 2026</div>
          <span className="text-[11px] text-slate-500 font-medium">Original baseline delivery target</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-2xs bg-rose-50/20">
          <div className="flex items-center justify-between text-xs text-rose-600 mb-1">
            <span className="font-bold uppercase">Current Paced Completion</span>
            <Clock className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">14 Dec 2026</div>
          <span className="text-[11px] text-rose-700 font-bold">+14 Days Project Slippage</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-2xs bg-emerald-50/20">
          <div className="flex items-center justify-between text-xs text-emerald-700 mb-1">
            <span className="font-bold uppercase">What-If Revised Date</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {simulationResult.revisedCompletionDate}
          </div>
          <span className="text-[11px] text-emerald-800 font-bold">
            Recovers {simulationResult.recoveredDays} Days Delay!
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-bold uppercase">Mitigation Budget Impact</span>
            <DollarSign className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            +₹{(simulationResult.estimatedCostImpact).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Fleet overtime & workforce surge</span>
        </div>

      </div>

      {/* Main Interactive Grid: Left Sliders, Right Forecast Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Sliders Panel */}
        <div className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-sm text-slate-900">
                What-If Resource Levers
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
              Live Model
            </span>
          </div>

          {/* Lever 1: Additional Workforce */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                Additional Site Laborers
              </span>
              <span className="font-extrabold text-indigo-700 text-sm">+{additionalWorkers} workers</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="2"
              value={additionalWorkers}
              onChange={(e) => setAdditionalWorkers(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0</span>
              <span>+20</span>
              <span>+40</span>
            </div>
          </div>

          {/* Lever 2: Heavy Excavators */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-indigo-600" />
                Hydraulic Excavators Added
              </span>
              <span className="font-extrabold text-indigo-700 text-sm">+{additionalExcavators} units</span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={additionalExcavators}
              onChange={(e) => setAdditionalExcavators(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 units</span>
              <span>+3 units</span>
              <span>+6 units</span>
            </div>
          </div>

          {/* Lever 3: Shift Hours Extension */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                Twilight Shift Extension
              </span>
              <span className="font-extrabold text-indigo-700 text-sm">+{extendShiftHours} hrs/day</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="0.5"
              value={extendShiftHours}
              onChange={(e) => setExtendShiftHours(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0h</span>
              <span>+2h</span>
              <span>+4h</span>
            </div>
          </div>

          {/* Simulation Outcome Badge */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Net Velocity Boost:</span>
              <span className="font-bold text-emerald-600">+{simulationResult.productivityBoostPct}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Days Recovered:</span>
              <span className="font-bold text-emerald-600">-{simulationResult.recoveredDays} Days</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-1 font-bold">
              <span className="text-slate-800">Residual Delay:</span>
              <span className="text-indigo-700">+{simulationResult.revisedDelayDays} Days</span>
            </div>
          </div>

        </div>

        {/* Forecast Trajectory Multi-Line Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Scenario Trajectory Comparison (Weeks 8 to 14)
                </h3>
                <p className="text-xs text-slate-400">
                  Scenario A (Status Quo) vs Scenario B (Targeted Surge) vs Scenario C (Fast Track)
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis unit="%" domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    formatter={(val, name) => [`${val}%`, name]}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="baseline" stroke="#3b82f6" strokeWidth={2} name="Contractual Baseline" />
                  <Line type="monotone" dataKey="scenarioA" stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" name="Scenario A: Status Quo (+14d)" />
                  <Line type="monotone" dataKey="scenarioB" stroke="#f59e0b" strokeWidth={3} name="Scenario B: Your What-If Setting (+2d)" />
                  <Line type="monotone" dataKey="scenarioC" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" name="Scenario C: Full Fast-Track (-2d)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Configured setting brings project completion date to <strong>{simulationResult.revisedCompletionDate}</strong>.
            </span>
            <button
              onClick={() => alert('Simulation configuration exported to Project Authority report')}
              className="font-bold text-indigo-600 hover:text-indigo-700"
            >
              Export Scenario to MoRTH →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
