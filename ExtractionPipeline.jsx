import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  Edit3, 
  FileCode, 
  Sparkles, 
  Clock, 
  CloudRain, 
  HardHat, 
  Truck, 
  MapPin, 
  Ruler
} from 'lucide-react';

export const ExtractionPipeline = () => {
  const { extractedData, setExtractedData, setMatchResult } = useApp();
  const navigate = useNavigate();

  const [editableData, setEditableData] = useState({ ...extractedData });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('table'); // 'table' | 'json'

  const pipelineSteps = [
    { name: 'OCR Ingestion', status: 'COMPLETE', time: '140ms' },
    { name: 'Text Normalization', status: 'COMPLETE', time: '85ms' },
    { name: 'NLP / LLM Entity Extraction', status: 'COMPLETE', time: '410ms' },
    { name: 'Attribute & Quantity Normalizer', status: 'COMPLETE', time: '60ms' },
    { name: 'Structured JSON Schema Validated', status: 'READY', time: '35ms' }
  ];

  const handleFieldChange = (field, val) => {
    setEditableData(prev => ({ ...prev, [field]: val }));
  };

  const handleSaveAndProceed = async () => {
    setExtractedData(editableData);

    // Call semantic match endpoint
    const res = await api.matchActivity(editableData);
    if (res && res.matchResult) {
      setMatchResult(res.matchResult);
    }

    navigate('/activity-matching');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            Pipeline Stage 2 of 5
          </span>
          <span className="text-xs text-slate-400">AI Extraction & Entity Normalization</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
          AI Data Capture & Structured JSON Preview
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Unstructured natural-language text converted into normalized civil engineering execution events with confidence scoring.
        </p>
      </div>

      {/* Visual Pipeline Progression Ribbon */}
      <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-md">
        <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>AI Extraction Execution Trace</span>
          </span>
          <span className="text-emerald-400 font-mono text-[10px]">Total Latency: 730ms</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {pipelineSteps.map((step, idx) => (
            <div key={idx} className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 relative">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span>0{idx + 1}</span>
                <span className="text-emerald-400 font-mono">{step.time}</span>
              </div>
              <div className="text-xs font-bold text-slate-200">{step.name}</div>
              <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>{step.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Structured Preview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {/* Card Header & View Switcher */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Extracted Project Progress Record
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              Confidence: {editableData.confidence || 94.0}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'table' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Interactive Table
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'json' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Standard JSON</span>
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Done Editing' : 'Edit Values'}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Table View */}
        {activeTab === 'table' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Field 1: Activity Description */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-semibold uppercase text-[10px]">Detected Activity</span>
                  <span className="font-mono text-[10px] text-indigo-600">NLP_PARSER</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableData.activity}
                    onChange={(e) => handleFieldChange('activity', e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-indigo-300 rounded-lg focus:outline-hidden"
                  />
                ) : (
                  <div className="font-extrabold text-sm text-slate-900">{editableData.activity}</div>
                )}
                <div className="text-[11px] text-slate-500 mt-1">Classification: {editableData.activity_type}</div>
              </div>

              {/* Field 2: Location / Chainage */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-semibold uppercase text-[10px]">Location / Chainage Stretch</span>
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableData.location}
                    onChange={(e) => handleFieldChange('location', e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-indigo-300 rounded-lg focus:outline-hidden"
                  />
                ) : (
                  <div className="font-extrabold text-sm font-mono text-slate-900">{editableData.location}</div>
                )}
                <div className="text-[11px] text-slate-500 mt-1">Corridor stretch length: 700 meters</div>
              </div>

              {/* Field 3: Quantity & Unit */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-semibold uppercase text-[10px]">Progress Quantity Executed</span>
                  <Ruler className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                {isEditing ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={editableData.quantity}
                      onChange={(e) => handleFieldChange('quantity', parseFloat(e.target.value))}
                      className="w-2/3 text-xs p-2 bg-white border border-indigo-300 rounded-lg focus:outline-hidden"
                    />
                    <input
                      type="text"
                      value={editableData.unit}
                      onChange={(e) => handleFieldChange('unit', e.target.value)}
                      className="w-1/3 text-xs p-2 bg-white border border-indigo-300 rounded-lg focus:outline-hidden"
                    />
                  </div>
                ) : (
                  <div className="font-extrabold text-sm text-slate-900">
                    {editableData.quantity} <span className="text-slate-500 font-semibold">{editableData.unit}</span>
                  </div>
                )}
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">Completion: {editableData.completion}% of planned daily target</div>
              </div>

              {/* Field 4: Inclement Weather & Delay */}
              <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/30">
                <div className="flex items-center justify-between text-xs text-amber-600 mb-1">
                  <span className="font-semibold uppercase text-[10px]">Delay Stoppage & Weather</span>
                  <CloudRain className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="font-extrabold text-sm text-slate-900">
                  {editableData.delay_hours} Hours Stoppage
                </div>
                <div className="text-[11px] text-amber-800 font-medium mt-1">
                  Cause: {editableData.weather_condition} ({editableData.delay_reason})
                </div>
              </div>

              {/* Field 5: Manpower & Resources */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-semibold uppercase text-[10px]">Manpower Mobilized</span>
                  <HardHat className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div className="font-extrabold text-sm text-slate-900">
                  {editableData.manpower} Personnel
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Supervisor, 3 Roller Operators, 20 Civil Laborers
                </div>
              </div>

              {/* Field 6: Equipment Fleet Detected */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-semibold uppercase text-[10px]">Heavy Machinery Fleet</span>
                  <Truck className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div className="font-semibold text-xs text-slate-800 space-y-0.5">
                  {editableData.equipment?.map((eq, i) => (
                    <div key={i}>• {eq}</div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Standard JSON View */}
        {activeTab === 'json' && (
          <div className="p-6 bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto">
            <pre>{JSON.stringify(editableData, null, 2)}</pre>
          </div>
        )}

        {/* Action Button Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Next: Match "{editableData.activity}" against planned L5/L6 activities.
          </div>

          <button
            onClick={handleSaveAndProceed}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95"
          >
            <span>Continue to L5/L6 Activity Matching</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
