import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AlertTriangle, ArrowRight, X, ShieldAlert } from 'lucide-react';

export const LiveAlertBanner = () => {
  const { liveAlert, setLiveAlert } = useApp();
  const navigate = useNavigate();

  if (!liveAlert) return null;

  return (
    <div className="bg-gradient-to-r from-rose-600 via-amber-600 to-rose-700 text-white px-4 py-2.5 shadow-md flex items-center justify-between animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="p-1 bg-white/20 rounded-md shrink-0">
          <ShieldAlert className="w-5 h-5 text-white animate-bounce" />
        </div>
        <div className="truncate">
          <span className="font-extrabold text-xs uppercase tracking-wider bg-white text-rose-700 px-2 py-0.5 rounded mr-2">
            CRITICAL VARIANCE ALERT
          </span>
          <span className="text-xs font-semibold">{liveAlert.title}</span>
          <span className="text-xs text-white/80 hidden md:inline ml-2 truncate">
            — {liveAlert.message}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-4">
        <button
          onClick={() => {
            navigate('/risks');
          }}
          className="flex items-center gap-1 text-xs font-bold bg-white text-slate-900 px-3 py-1 rounded-md shadow-xs hover:bg-slate-100 transition-colors"
        >
          <span>Investigate Root Cause</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setLiveAlert(null)}
          className="p-1 hover:bg-white/20 rounded-md text-white/80 hover:text-white transition-colors"
          title="Dismiss Banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
