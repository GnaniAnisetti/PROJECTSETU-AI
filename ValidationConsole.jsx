import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  FileCheck2,
  Calendar,
  Layers,
  MapPin,
  Ruler
} from 'lucide-react';

export const ValidationConsole = () => {
  const { currentProject, extractedData, matchResult, currentUser, switchRole, triggerDemoAlert } = useApp();
  const navigate = useNavigate();

  const [validationState, setValidationState] = useState('PENDING'); // 'PENDING' | 'CONFIRMED' | 'EDITED' | 'REJECTED'
  const [isEditing, setIsEditing] = useState(false);
  const [validatedData, setValidatedData] = useState({
    activityId: matchResult?.topMatch?.activityId || 'act-l6-embank',
    activityName: matchResult?.topMatch?.name || 'Embankment Filling',
    wbsCode: matchResult?.topMatch?.wbsCode || 'WBS-1.1.2',
    level: 'L6',
    date: '2026-09-11',
    location: extractedData?.location || '34+500 to 35+200',
    quantity: extractedData?.quantity || 700,
    unit: extractedData?.unit || 'meters',
    actualProgressPct: 58.0,
    plannedProgressPct: 65.0,
    variancePct: -7.0,
    validationMethod: 'HUMAN_CONFIRMED_AI_SUGGESTION',
    validatedBy: currentUser.fullName,
    validationNotes: 'Confirmed match with chainage 34+500 to 35+200 MoRTH specification.'
  });

  const handleConfirm = async () => {
    setValidationState('CONFIRMED');
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });

    await api.validateRecord({
      action: 'CONFIRMED',
      activityId: validatedData.activityId,
      activityName: validatedData.activityName,
      quantity: validatedData.quantity,
      progressPct: validatedData.actualProgressPct,
      validatedBy: currentUser.fullName
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    setIsEditing(false);
    setValidationState('EDITED');

    await api.validateRecord({
      action: 'EDITED',
      activityId: validatedData.activityId,
      activityName: validatedData.activityName,
      quantity: validatedData.quantity,
      progressPct: validatedData.actualProgressPct,
      validatedBy: currentUser.fullName,
      notes: validatedData.validationNotes
    });
  };

  const handleReject = async () => {
    setValidationState('REJECTED');
    await api.validateRecord({
      action: 'REJECTED',
      activityId: validatedData.activityId,
      activityName: validatedData.activityName,
      quantity: validatedData.quantity,
      progressPct: validatedData.actualProgressPct,
      validatedBy: currentUser.fullName
    });
  };

  const handleUpdateActualProgress = async () => {
    // Updates database actual progress and variance
    await api.updateProgress({
      activityId: validatedData.activityId,
      actualProgressPct: validatedData.actualProgressPct,
      quantityReported: validatedData.quantity
    });

    // Trigger alert sound/banner
    triggerDemoAlert();
    navigate('/progress');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            Pipeline Stage 4 of 5
          </span>
          <span className="text-xs text-slate-400">Human-in-the-Loop Validation Gate</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
          Project Authority Review & Validation Console
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Dual-path governance: High-confidence predictions (≥ 90%) offer 1-click express approval, while low-confidence suggestions require human inspection, edit, or rejection.
        </p>
      </div>

      {/* Role Alert Notice */}
      {currentUser.role === 'FIELD_ENGINEER' && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between text-xs text-indigo-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              You are currently logged in as <strong>Field Engineer ({currentUser.fullName})</strong>. Review and approval is governed by the Project Authority.
            </span>
          </div>
          <button
            onClick={() => switchRole('PROJECT_MANAGER')}
            className="px-3 py-1.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Switch to Authority Engineer
          </button>
        </div>
      )}

      {/* Main Validation Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        
        <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              AI Suggestion Match Details
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            High Confidence (94.0%)
          </span>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Target Project</span>
              <div className="font-bold text-xs text-slate-900 mt-1">{currentProject.name}</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Planned WBS Activity</span>
              {isEditing ? (
                <input
                  type="text"
                  value={validatedData.activityName}
                  onChange={(e) => setValidatedData(prev => ({ ...prev, activityName: e.target.value }))}
                  className="w-full text-xs p-1.5 mt-1 border border-indigo-300 rounded"
                />
              ) : (
                <div className="font-bold text-xs text-indigo-700 mt-1">
                  {validatedData.level} – {validatedData.activityName} ({validatedData.wbsCode})
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Executed Quantity</span>
              {isEditing ? (
                <input
                  type="number"
                  value={validatedData.quantity}
                  onChange={(e) => setValidatedData(prev => ({ ...prev, quantity: parseFloat(e.target.value) }))}
                  className="w-full text-xs p-1.5 mt-1 border border-indigo-300 rounded"
                />
              ) : (
                <div className="font-bold text-xs text-slate-900 mt-1">
                  {validatedData.quantity} {validatedData.unit}
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase">New Actual Progress</span>
              {isEditing ? (
                <input
                  type="number"
                  value={validatedData.actualProgressPct}
                  onChange={(e) => setValidatedData(prev => ({ ...prev, actualProgressPct: parseFloat(e.target.value) }))}
                  className="w-full text-xs p-1.5 mt-1 border border-indigo-300 rounded"
                />
              ) : (
                <div className="font-bold text-xs text-slate-900 mt-1">
                  {validatedData.actualProgressPct}% <span className="text-slate-400 font-normal">(Planned: {validatedData.plannedProgressPct}%)</span>
                </div>
              )}
            </div>

          </div>

          {/* Source Field DPR Evidence */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">
              Source DPR Ground Truth
            </div>
            <p className="text-xs text-slate-700 italic">
              "Today chainage 34+500 to 35+200 earthwork completed. Approximately 700 meters completed. Work started at 8:00 AM and ended at 5:00 PM. Heavy rain caused a 2 hour delay."
            </p>
          </div>

          {/* Action Buttons: Confirm, Edit, Reject */}
          {validationState === 'PENDING' && (
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
              
              <button
                onClick={handleConfirm}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm AI Suggestion</span>
              </button>

              <button
                onClick={handleEdit}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl transition-all"
              >
                <Edit3 className="w-4 h-4" />
                <span>Modify Parameters</span>
              </button>

              <button
                onClick={handleReject}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-all"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Match</span>
              </button>

            </div>
          )}

          {/* If In Edit Mode */}
          {isEditing && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              <label className="text-xs font-bold text-slate-700">Audit Notes for Modification:</label>
              <input
                type="text"
                value={validatedData.validationNotes}
                onChange={(e) => setValidatedData(prev => ({ ...prev, validationNotes: e.target.value }))}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg"
              >
                Save & Confirm Modification
              </button>
            </div>
          )}

        </div>

      </div>

      {/* SECTION 14: VALIDATED DATA CERTIFICATE */}
      {validationState !== 'PENDING' && (
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-md p-6 animate-in zoom-in-95 duration-200">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900">
                  OFFICIAL VALIDATED DATA RECORD
                </h3>
                <p className="text-[11px] text-slate-400">
                  Committed to immutable PostgreSQL audit ledger & ready for baseline schedule variance computation.
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-extrabold rounded-full">
              STATUS: VALIDATED
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6 text-xs">
            <div>
              <span className="text-slate-400">Verified Activity:</span>
              <div className="font-extrabold text-slate-900 mt-0.5">{validatedData.level} – {validatedData.activityName}</div>
            </div>
            <div>
              <span className="text-slate-400">Validated Quantity:</span>
              <div className="font-bold text-slate-900 mt-0.5">{validatedData.quantity} {validatedData.unit}</div>
            </div>
            <div>
              <span className="text-slate-400">Validated By:</span>
              <div className="font-bold text-indigo-700 mt-0.5">{currentUser.fullName}</div>
            </div>
            <div>
              <span className="text-slate-400">Validation Timestamp:</span>
              <div className="font-mono text-slate-700 mt-0.5">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>

          {/* Section 15 Update Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Next: Commit actual progress to database and detect delay/risk variances.
            </span>

            <button
              onClick={handleUpdateActualProgress}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Update Actual Progress & Recalculate Variance</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
