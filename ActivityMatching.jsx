import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  GitMerge, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  HelpCircle, 
  Sliders, 
  Search,
  ExternalLink
} from 'lucide-react';

export const ActivityMatching = () => {
  const { extractedData, matchResult } = useApp();
  const navigate = useNavigate();

  const topMatch = matchResult?.topMatch || {
    activityId: 'act-l6-embank',
    wbsCode: 'WBS-1.1.2',
    level: 'L6',
    name: 'Embankment Filling',
    plannedProgress: 65.0,
    actualProgress: 58.0,
    similarityScore: 94.0,
    unit: 'meters'
  };

  const alternatives = matchResult?.alternatives || [
    { activityId: 'act-l6-excav', wbsCode: 'WBS-1.1.1', level: 'L6', name: 'Excavation', plannedProgress: 70.0, actualProgress: 68.0, similarityScore: 68.0 },
    { activityId: 'act-l6-subgrade', wbsCode: 'WBS-1.2.1', level: 'L6', name: 'Subgrade Preparation', plannedProgress: 50.0, actualProgress: 48.0, similarityScore: 52.0 },
    { activityId: 'act-l6-compact', wbsCode: 'WBS-1.1.3', level: 'L6', name: 'Compaction & Proof Rolling', plannedProgress: 60.0, actualProgress: 55.0, similarityScore: 64.0 }
  ];

  const confidenceScore = topMatch.similarityScore || 94.0;
  const isHighConfidence = confidenceScore >= 90.0;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            Pipeline Stage 3 of 5
          </span>
          <span className="text-xs text-slate-400">Semantic Schedule Matching</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
          L5 / L6 Semantic Activity Linking Engine
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Maps informal field terminology ("earth filling") to contractual Primavera/MS Project WBS items ("L6 – Embankment Filling") using embeddings, token cosine similarity, and chainage alignment.
        </p>
      </div>

      {/* Primary Match Found Banner */}
      <div className={`p-6 rounded-2xl border shadow-sm ${
        isHighConfidence 
          ? 'bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 text-white border-indigo-700' 
          : 'bg-gradient-to-r from-amber-900 via-orange-900 to-amber-950 text-white border-amber-700'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                isHighConfidence ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-900'
              }`}>
                {isHighConfidence ? 'HIGH CONFIDENCE (>= 90%)' : 'LOW CONFIDENCE (< 90%)'}
              </span>
              <span className="text-xs text-indigo-200">
                AI Schedule Match Confirmed
              </span>
            </div>

            <div className="text-2xl font-black tracking-tight">
              Matched: {topMatch.name}
            </div>

            <p className="text-xs text-indigo-100/80 max-w-xl leading-relaxed">
              <strong>Match Explanation:</strong> Matched because informal site description "{extractedData.activity}" is semantically equivalent to "{topMatch.name}" in MoRTH WBS taxonomy and reported stretch ({extractedData.location}) overlaps with active embankment corridor.
            </p>
          </div>

          {/* Confidence Score Gauge */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center shrink-0 min-w-[160px]">
            <div className="text-3xl font-black text-emerald-400">{confidenceScore}%</div>
            <div className="text-[11px] font-bold text-white/80 uppercase tracking-wider mt-0.5">
              Similarity Score
            </div>
            <div className="mt-2 text-[10px] text-white/60">
              Cosine: 0.94 • Levenshtein: 0.88
            </div>
          </div>

        </div>
      </div>

      {/* Side-by-Side Comparison: Field Input vs Schedule WBS Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Extracted Field Report */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Unstructured Field Report
            </span>
            <span className="text-[11px] font-mono text-slate-400">Daily Site DPR</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400">Field Activity:</span>
              <div className="font-extrabold text-sm text-slate-900 mt-0.5">"{extractedData.activity}"</div>
            </div>
            <div>
              <span className="text-slate-400">Reported Chainage:</span>
              <div className="font-semibold text-slate-800 font-mono mt-0.5">{extractedData.location}</div>
            </div>
            <div>
              <span className="text-slate-400">Executed Quantity:</span>
              <div className="font-semibold text-slate-800 mt-0.5">{extractedData.quantity} {extractedData.unit}</div>
            </div>
            <div>
              <span className="text-slate-400">Weather Stoppage:</span>
              <div className="font-semibold text-amber-700 mt-0.5">{extractedData.delay_hours} hrs ({extractedData.weather_condition})</div>
            </div>
          </div>
        </div>

        {/* Right: Matched WBS Master Activity */}
        <div className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-2xs space-y-4 bg-indigo-50/20">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
              2. Matched Master WBS Activity
            </span>
            <span className="text-[11px] font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-200">
              {topMatch.wbsCode}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400">Master WBS Item:</span>
              <div className="font-extrabold text-sm text-indigo-950 mt-0.5">
                {topMatch.level} – {topMatch.name}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Work Package:</span>
              <div className="font-semibold text-slate-800 mt-0.5">L5 – Earthwork Formation</div>
            </div>
            <div>
              <span className="text-slate-400">Planned vs Current Actual:</span>
              <div className="font-semibold text-slate-800 mt-0.5">
                Planned: {topMatch.plannedProgress}% • Actual: {topMatch.actualProgress}%
              </div>
            </div>
            <div>
              <span className="text-slate-400">Contractual Unit:</span>
              <div className="font-semibold text-slate-800 mt-0.5">{topMatch.unit} (Layer Compaction)</div>
            </div>
          </div>
        </div>

      </div>

      {/* Alternative Matches Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Alternative Semantic Match Candidates
            </h3>
            <p className="text-xs text-slate-500">
              Other WBS activities evaluated by token embeddings & fuzzy distance
            </p>
          </div>
          <span className="text-xs text-slate-400">Ranked by Proximity</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {alternatives.map((alt, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-400">{alt.wbsCode}</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">{alt.level}</span>
                <span className="font-bold text-slate-800">{alt.name}</span>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-slate-500">Planned: {alt.plannedProgress}%</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-slate-400 h-full rounded-full" style={{ width: `${alt.similarityScore}%` }}></div>
                  </div>
                  <span className="font-bold text-slate-700 w-10 text-right">{alt.similarityScore}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs text-slate-600">
          Confidence threshold: <strong className="text-indigo-600">94.0% &gt;= 90%</strong>. Routed to <strong className="text-indigo-600">High-Confidence Express Suggestion</strong> with Project Authority oversight.
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/validation')}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
          >
            <span>Proceed to Human-in-the-Loop Validation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
