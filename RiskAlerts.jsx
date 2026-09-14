import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CloudRain, 
  Truck, 
  Users, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  HelpCircle,
  Radio
} from 'lucide-react';

export const RiskAlerts = () => {
  const { currentProject, wsConnected } = useApp();
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [selectedAlertId, setSelectedAlertId] = useState('alt-001');
  const [rootCause, setRootCause] = useState(null);

  useEffect(() => {
    api.getAlerts().then(res => {
      if (res && res.alerts) {
        setAlerts(res.alerts);
        if (res.alerts.length > 0) setSelectedAlertId(res.alerts[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedAlertId) {
      api.getRootCause(selectedAlertId).then(res => {
        if (res && res.rootCause) setRootCause(res.rootCause);
      });
    }
  }, [selectedAlertId]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
            Real-Time Alert & AI Root-Cause Engine
          </span>
          <span className="text-xs text-slate-400">Sections 18 & 19</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
          Schedule Variance Alerts & Explainable Root Cause Analysis
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Detects threshold-breaching variances in real-time, pushes WebSocket broadcast notifications, and correlates meteorological and equipment data to explain the true root causes.
        </p>
      </div>

      {/* Main Grid: Left Alert Feed, Right Explainable Cause Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Active Alerts Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Active Project Alerts ({alerts.length})
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
              <Radio className={`w-3 h-3 ${wsConnected ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
              <span>WebSockets Live</span>
            </div>
          </div>

          <div className="space-y-3">
            {alerts.map((a) => {
              const isSelected = a.id === selectedAlertId;
              const isCritical = a.severity === 'HIGH_RISK';

              return (
                <div
                  key={a.id}
                  onClick={() => setSelectedAlertId(a.id)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-rose-600 bg-white ring-2 ring-rose-500/20 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <ShieldAlert className={`w-4 h-4 ${isCritical ? 'text-rose-600' : 'text-amber-500'}`} />
                      {a.activityName}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isCritical ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {a.varianceValue}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-snug">
                    {a.message}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Target: Highway Pkg A</span>
                    <span className="font-mono">{new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Explainable AI Cause Analysis Inspector */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          
          <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Explainable Root Cause Breakdown
                </h3>
                <p className="text-[11px] text-slate-400">
                  Causal graph synthesizing meteorological records, daily DPR text, and machine telemetry
                </p>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Confidence: {rootCause?.analysisConfidence || 94.2}%
            </span>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Primary Cause Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-sm">
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                Primary Root Cause Identified
              </div>
              <div className="text-lg font-black text-white">
                {rootCause?.primaryCause || 'Unseasonal Heavy Rainfall & Saturated Soil (OMC Exceeded)'}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Field report data and local AWS weather station confirm precipitation exceeding infiltration threshold.
              </p>
            </div>

            {/* Contributing Factors Grid */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Contributing Delay Factors
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rootCause?.contributingFactors?.map((factor, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Environmental & Telemetry Metrics */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Site Sensor & Telemetry Corroboration
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                
                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                    <CloudRain className="w-3.5 h-3.5" />
                    <span className="font-semibold text-[10px]">Precipitation</span>
                  </div>
                  <div className="font-black text-slate-900">38 mm</div>
                  <span className="text-[10px] text-slate-400">Site Camp AWS #2</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-1.5 text-amber-600 mb-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span className="font-semibold text-[10px]">Fleet Stoppage</span>
                  </div>
                  <div className="font-black text-slate-900">2.0 Hours</div>
                  <span className="text-[10px] text-slate-400">Roller & Tippers</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-1.5 text-indigo-600 mb-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span className="font-semibold text-[10px]">Soil Moisture</span>
                  </div>
                  <div className="font-black text-slate-900">OMC +4.2%</div>
                  <span className="text-[10px] text-slate-400">Laboratory Proctor</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-1.5 text-purple-600 mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span className="font-semibold text-[10px]">Labor Idle</span>
                  </div>
                  <div className="font-black text-slate-900">18 Workers</div>
                  <span className="text-[10px] text-slate-400">During Downpour</span>
                </div>

              </div>
            </div>

            {/* Forward Action: Proceed to Recommendations */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                AI has generated 3 actionable mitigation strategies with quantified impacts.
              </span>

              <button
                onClick={() => navigate('/recommendations')}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95 shrink-0"
              >
                <span>View AI Recommendations & Impact Metrics</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
