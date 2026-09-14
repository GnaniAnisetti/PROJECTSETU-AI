import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  ChevronRight, 
  X, 
  Sparkles, 
  Building2, 
  Cpu, 
  GitMerge, 
  TrendingDown, 
  Lightbulb, 
  Sliders
} from 'lucide-react';

export const ScenarioWalkthroughModal = ({ isOpen, onClose }) => {
  const { switchRole, setSelectedProjectId, triggerDemoAlert } = useApp();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const demoSteps = [
    {
      step: 1,
      title: 'Login as Field Engineer',
      desc: 'Set role to Field Engineer (Rajesh Sharma) on the construction front.',
      action: () => {
        switchRole('FIELD_ENGINEER');
        navigate('/data-input');
      },
      page: '/data-input'
    },
    {
      step: 2,
      title: 'Site Data Input (Text / OCR / Voice)',
      desc: 'Ingest DPR: "Earth filling completed from ch 34+500 to 35+200. 700m done. Heavy rain caused 2h delay."',
      action: () => {
        navigate('/data-input');
      },
      page: '/data-input'
    },
    {
      step: 3,
      title: 'AI Data Extraction Pipeline',
      desc: 'AI parses activity, chainage 34+500, 700m quantity, 2h delay, and heavy rainfall weather condition.',
      action: () => {
        navigate('/extraction');
      },
      page: '/extraction'
    },
    {
      step: 4,
      title: 'Semantic L5/L6 Schedule Matching',
      desc: 'Embeddings match "earth filling" to "L6 – Embankment Filling" with 94% confidence score.',
      action: () => {
        navigate('/activity-matching');
      },
      page: '/activity-matching'
    },
    {
      step: 5,
      title: 'Human-in-the-Loop Validation',
      desc: 'Switch to Project Authority (Priya Nair) to review and confirm high-confidence AI suggestion.',
      action: () => {
        switchRole('PROJECT_MANAGER');
        navigate('/validation');
      },
      page: '/validation'
    },
    {
      step: 6,
      title: 'Progress Update & Variance Calculation',
      desc: 'Actual progress updates to 58.0% vs Planned 65.0%. Negative variance = -7.0% calculated.',
      action: () => {
        navigate('/progress');
        triggerDemoAlert();
      },
      page: '/progress'
    },
    {
      step: 7,
      title: 'Real-Time Alert & AI Root Cause Analysis',
      desc: 'Threshold breached (-7% < -5%). Explainable AI isolates: Unseasonal Heavy Rain + Saturated Subsoil.',
      action: () => {
        navigate('/risks');
      },
      page: '/risks'
    },
    {
      step: 8,
      title: 'Impact-Quantified AI Recommendations',
      desc: 'AI recommends reallocating 2 excavators and rescheduling subgrade prep. Recovers 1.5 days delay!',
      action: () => {
        navigate('/recommendations');
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      },
      page: '/recommendations'
    },
    {
      step: 9,
      title: 'Feedback Loop & Historical ML Learning',
      desc: 'Capture user satisfaction rating; view matching accuracy improving from 86.2% to 93.8%.',
      action: () => {
        navigate('/feedback');
      },
      page: '/feedback'
    },
    {
      step: 10,
      title: 'What-If Forecasting & Scenario Simulator',
      desc: 'Simulate adding +2 dumpers and extending twilight shifts to bring delivery date back on track!',
      action: () => {
        navigate('/forecast');
      },
      page: '/forecast'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>SIH 2026 Interactive Evaluation Walkthrough</span>
          </div>
          <h2 className="text-xl font-extrabold mt-1 text-white">
            PROJECTSETU AI — End-to-End Demo Script
          </h2>
          <p className="text-xs text-indigo-100 mt-1 max-w-lg">
            Problem Statement 26122 (Team HEXORA): Real-time field data capture, L5/L6 schedule linking, variance alerts, AI root causes, and forecasting.
          </p>
        </div>

        {/* Steps List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
          {demoSteps.map((item) => (
            <div
              key={item.step}
              className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-xl transition-colors group"
            >
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-xs flex items-center justify-center shrink-0 border border-indigo-200">
                  {item.step}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  item.action();
                  onClose();
                }}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white text-xs font-bold rounded-lg transition-all shadow-2xs group-hover:shadow"
              >
                <span>Jump</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Highway Construction – Package A (Ch 34+500)
          </span>
          <button
            onClick={() => {
              demoSteps[0].action();
              onClose();
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2"
          >
            <span>Start from Step 1</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
