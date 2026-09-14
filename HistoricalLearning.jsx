import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend 
} from 'recharts';
import { 
  History, 
  TrendingUp, 
  Cpu, 
  CheckCircle2, 
  Database, 
  Sparkles, 
  Layers, 
  Award,
  ArrowRight
} from 'lucide-react';

export const HistoricalLearning = () => {
  const [learningData, setLearningData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.getLearningData().then(res => {
      if (res) setLearningData(res);
    });
  }, []);

  const stats = learningData?.modelStats || {
    initialAccuracy: 86.2,
    currentAccuracy: 93.8,
    accuracyGain: '+7.6%',
    totalFieldReportsProcessed: 1420,
    validatedMatchesCount: 1380,
    userCorrectionRate: '6.2%'
  };

  const evolutionData = stats.evolutionData || [
    { month: 'Apr 2025', accuracy: 86.2, samples: 120 },
    { month: 'May 2025', accuracy: 87.5, samples: 210 },
    { month: 'Jun 2025', accuracy: 89.1, samples: 340 },
    { month: 'Jul 2025', accuracy: 91.0, samples: 290 },
    { month: 'Aug 2025', accuracy: 92.4, samples: 310 },
    { month: 'Sep 2025', accuracy: 93.8, samples: 150 }
  ];

  const historicalDelays = [
    { type: 'Weather / Heavy Rain', avgDelay: 2.4, frequency: 14, effectiveness: 92 },
    { type: 'Aggregate Quarry Shortage', avgDelay: 4.8, frequency: 8, effectiveness: 85 },
    { type: 'Equipment Breakdown', avgDelay: 1.8, frequency: 11, effectiveness: 88 },
    { type: 'Utility Shifting / RoW', avgDelay: 6.2, frequency: 5, effectiveness: 78 }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            Self-Supervised Learning & Model Evolution
          </span>
          <span className="text-xs text-slate-400">Section 24</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
          Historical Project Intelligence & Model Improvement
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tracks the continuous learning loop: Human validation corrections and field feedback iteratively retrain semantic similarity weights and recommendation effectiveness.
        </p>
      </div>

      {/* Model Improvement Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-indigo-300 text-xs mb-2">
            <span className="font-bold uppercase tracking-wider">Current Match Accuracy</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">{stats.currentAccuracy}%</div>
          <div className="mt-2 text-xs text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{stats.accuracyGain} from baseline ({stats.initialAccuracy}%)</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-bold uppercase tracking-wider">Field DPRs Processed</span>
            <Database className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.totalFieldReportsProcessed.toLocaleString()}</div>
          <div className="mt-2 text-xs text-slate-500 font-medium">
            Across 3 national highway corridor packages
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-bold uppercase tracking-wider">Human Confirmations</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.validatedMatchesCount.toLocaleString()}</div>
          <div className="mt-2 text-xs text-indigo-600 font-bold">
            97.2% Agreement with AI suggestions
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-bold uppercase tracking-wider">User Correction Rate</span>
            <Cpu className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-purple-700">{stats.userCorrectionRate}</div>
          <div className="mt-2 text-xs text-slate-500 font-medium">
            Dropped from 13.8% in Month 1
          </div>
        </div>

      </div>

      {/* Accuracy Evolution Line Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Model Semantic Accuracy Improvement Trajectory (Monthly)
            </h3>
            <p className="text-xs text-slate-400">
              Reinforcement from Project Authority validation decisions over time
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
            Continuous Self-Tuning
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolutionData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[80, 100]} unit="%" tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                formatter={(val) => [`${val}% accuracy`]}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
              />
              <Line type="monotone" dataKey="accuracy" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5, fill: '#4f46e5' }} name="Accuracy %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Delay Causes & Mitigation Effectiveness */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Historical Root-Cause Library & Mitigation Effectiveness
            </h3>
            <p className="text-xs text-slate-500">
              Historical outcomes guiding current AI prescriptive recommendations
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {historicalDelays.map((item, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <span className="font-bold text-slate-900 text-xs">{item.type}</span>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Occurrences logged: {item.frequency} times across corridor stretch
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <span className="text-slate-400 text-[11px]">Avg Delay: </span>
                  <span className="font-black text-rose-600">+{item.avgDelay} Days</span>
                </div>

                <div className="w-36">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Mitigation Success</span>
                    <span className="font-bold text-emerald-600">{item.effectiveness}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${item.effectiveness}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forward link to Analytics */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <span className="text-xs text-slate-600">
          Next: Explore comprehensive multi-chart analytics and performance trends.
        </span>
        <button
          onClick={() => navigate('/analytics')}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
        >
          <span>View Performance Analytics</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
