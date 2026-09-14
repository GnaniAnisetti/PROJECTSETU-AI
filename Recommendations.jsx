import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { 
  Lightbulb, 
  CheckCircle2, 
  Edit3, 
  XCircle, 
  Clock, 
  DollarSign, 
  Truck, 
  TrendingUp, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const Recommendations = () => {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([
    {
      id: 'rec-001',
      title: 'Divert Earthmoving Fleet to Dry Rock-Cut Workfront',
      suggestedAction: '1. Divert 2 hydraulic excavators & 4 tippers from wet section (Ch 34+500) to dry rock cutting section at Ch 42+000.\n2. Deploy high-capacity aerator disc harrow on Ch 34+800 to accelerate natural evaporation.\n3. Extend twilight dry-back rolling shift by 2.5 hours once moisture drops within +/-1% of OMC.',
      technicalJustification: 'Accelerating rock excavation prevents machine idling while natural insolation reduces subgrade moisture without chemical stabilization.',
      expectedDelayReductionDays: 1.5,
      expectedCostImpact: 18500,
      expectedResourceImpact: '+14% Fleet Productivity, 2 Excavators relocated',
      priority: 'HIGH',
      status: 'PENDING'
    },
    {
      id: 'rec-002',
      title: 'Mobilize Secondary Commercial Quarry Supplier for GSB',
      suggestedAction: 'Authorize emergency commercial draw from secondary approved quarry at Ch 58+000 to bridge 200 TPD supply gap.',
      technicalJustification: 'Direct bypass of environmental clearance delay at primary crusher pit.',
      expectedDelayReductionDays: 4.0,
      expectedCostImpact: 65000,
      expectedResourceImpact: '+200 MT/day aggregate hauling trucks',
      priority: 'URGENT',
      status: 'PENDING'
    },
    {
      id: 'rec-003',
      title: 'Reschedule Dependent GSB Layering by +2 Days',
      suggestedAction: 'Shift start of granular sub-base layer at Ch 34+500 by 48 hours to ensure subgrade achieves 98% MDD proof-rolling sign-off.',
      technicalJustification: 'Prevents placing expensive aggregate over yielding subgrade, eliminating rework risk.',
      expectedDelayReductionDays: 0.5,
      expectedCostImpact: 0,
      expectedResourceImpact: 'Zero capital cost, schedule buffer optimization',
      priority: 'MEDIUM',
      status: 'PENDING'
    }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editActionText, setEditActionText] = useState('');

  const handleAction = async (recId, actionType) => {
    setRecommendations(prev => prev.map(r => {
      if (r.id === recId) {
        return { ...r, status: actionType };
      }
      return r;
    }));

    if (actionType === 'ACCEPTED') {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }

    await api.actOnRecommendation(recId, actionType, editActionText);
    setEditingId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
            Actionable AI Prescriptive Intelligence
          </span>
          <span className="text-xs text-slate-400">Sections 20, 21 & 22</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
          AI Actionable Recommendations & Impact Quantification
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Provides Project Authorities with mathematically quantified mitigation strategies: delay days recovered, fleet utilization, and budget impact.
        </p>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-6">
        {recommendations.map((rec) => {
          const isPending = rec.status === 'PENDING';
          const isAccepted = rec.status === 'ACCEPTED';
          const isRejected = rec.status === 'REJECTED';
          const isModified = rec.status === 'MODIFIED';

          return (
            <div
              key={rec.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                isAccepted 
                  ? 'border-emerald-300 ring-2 ring-emerald-500/20 shadow-md' 
                  : isRejected 
                  ? 'border-slate-200 opacity-60' 
                  : 'border-slate-200 shadow-2xs hover:border-slate-300'
              }`}
            >
              
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${
                    rec.priority === 'URGENT' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.2 rounded-full text-[10px] font-extrabold uppercase ${
                        rec.priority === 'URGENT' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {rec.priority} PRIORITY
                      </span>
                      <span className="text-xs font-mono text-slate-400">{rec.id}</span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                      {rec.title}
                    </h3>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {isAccepted && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ACCEPTED & APPLIED
                    </span>
                  )}
                  {isRejected && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 font-extrabold text-xs rounded-full border border-rose-200">
                      <XCircle className="w-3.5 h-3.5" />
                      REJECTED
                    </span>
                  )}
                  {isModified && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded-full border border-indigo-200">
                      <Edit3 className="w-3.5 h-3.5" />
                      MODIFIED & APPLIED
                    </span>
                  )}
                  {isPending && (
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 font-extrabold text-xs rounded-full border border-amber-200">
                      AWAITING AUTHORITY DECISION
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-5">
                
                {/* Suggested Action */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Prescribed Operational Protocol
                  </div>
                  {editingId === rec.id ? (
                    <textarea
                      rows={3}
                      value={editActionText}
                      onChange={(e) => setEditActionText(e.target.value)}
                      className="w-full text-xs p-3 bg-slate-50 border border-indigo-300 rounded-xl"
                    />
                  ) : (
                    <div className="text-xs text-slate-800 font-medium whitespace-pre-line leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      {rec.suggestedAction}
                    </div>
                  )}
                </div>

                {/* Technical Justification */}
                <div className="text-xs text-slate-600">
                  <strong className="text-slate-900">Technical Rationale: </strong>
                  {rec.technicalJustification}
                </div>

                {/* SECTION 21: QUANTIFIED EXPECTED IMPACTS */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Section 21: Quantified Expected Impacts
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40">
                      <div className="flex items-center gap-1.5 text-emerald-700 text-xs mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-bold text-[10px] uppercase">Schedule Recovery</span>
                      </div>
                      <div className="text-xl font-black text-emerald-700">
                        -{rec.expectedDelayReductionDays} Days
                      </div>
                      <span className="text-[10px] text-slate-500">Critical path delay recovered</span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/40">
                      <div className="flex items-center gap-1.5 text-blue-700 text-xs mb-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span className="font-bold text-[10px] uppercase">Cost / Overtime Delta</span>
                      </div>
                      <div className="text-xl font-black text-blue-700">
                        +₹{rec.expectedCostImpact.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-slate-500">Haulage & shift differential</span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/40">
                      <div className="flex items-center gap-1.5 text-purple-700 text-xs mb-1">
                        <Truck className="w-3.5 h-3.5" />
                        <span className="font-bold text-[10px] uppercase">Resource Utilization</span>
                      </div>
                      <div className="text-sm font-black text-purple-900 mt-1">
                        {rec.expectedResourceImpact}
                      </div>
                      <span className="text-[10px] text-slate-500">Machinery optimization</span>
                    </div>

                  </div>
                </div>

                {/* SECTION 22: USER ACTIONS */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Decision logged by <strong>{currentUser.fullName}</strong> with timestamp audit.</span>
                  </div>

                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAction(rec.id, 'ACCEPTED')}
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept Mitigation</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingId(rec.id);
                          setEditActionText(rec.suggestedAction);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Scope</span>
                      </button>

                      <button
                        onClick={() => handleAction(rec.id, 'REJECTED')}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : editingId === rec.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAction(rec.id, 'MODIFIED')}
                        className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg"
                      >
                        Save Modified Action
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-2 text-slate-500 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => navigate('/feedback')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <span>Rate Recommendation Usefulness (Feedback Loop) →</span>
                    </button>
                  )}

                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
