import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { 
  MessageSquareHeart, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Minus, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  History
} from 'lucide-react';

export const FeedbackLoop = () => {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [usefulness, setUsefulness] = useState('HELPFUL'); // 'HELPFUL' | 'PARTIALLY_HELPFUL' | 'NOT_HELPFUL'
  const [comments, setComments] = useState(
    'The recommendation to reallocate excavators to Ch 42+000 prevented machine downtime during the rainfall.'
  );
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.submitFeedback({
      recommendationId: 'rec-001',
      rating,
      isHelpful: usefulness,
      comments,
      userId: currentUser.id
    });

    setSubmitted(true);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs text-center">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-50 text-indigo-700 mb-3">
          <MessageSquareHeart className="w-8 h-8" />
        </div>
        <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
          Section 23 • Human Reinforcement Loop
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
          AI Suggestion Feedback & Model Calibration
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Your feedback tunes the semantic matching weights and recommendation risk models for future infrastructure planning packages.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-md p-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Feedback Successfully Ingested!
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Thank you! This feedback updates the active token embeddings and contributes to our model accuracy gain from 86.2% to 93.8%.
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/learning')}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              <span>View Historical ML Learning Dashboard</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Target Recommendation Context */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Evaluating AI Suggestion:</span>
              <div className="font-extrabold text-sm text-slate-900 mt-1">
                "Reallocate Earthmoving Fleet to Dry Rock-Cut Front at Ch 42+000"
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Expected Delay Reduction: 1.5 days • Cost Impact: +₹18,500
              </p>
            </div>

            {/* Question 1: Usefulness Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Was this AI suggestion useful for site operations?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { key: 'HELPFUL', label: 'Helpful', icon: ThumbsUp, color: 'text-emerald-700 border-emerald-300 bg-emerald-50/50' },
                  { key: 'PARTIALLY_HELPFUL', label: 'Partially Helpful', icon: Minus, color: 'text-amber-700 border-amber-300 bg-amber-50/50' },
                  { key: 'NOT_HELPFUL', label: 'Not Helpful', icon: ThumbsDown, color: 'text-rose-700 border-rose-300 bg-rose-50/50' }
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = usefulness === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setUsefulness(opt.key)}
                      className={`p-4 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-2 transition-all ${
                        isSelected 
                          ? `${opt.color} ring-2 ring-indigo-500 shadow-xs font-extrabold` 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 2: Star Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Overall AI Accuracy Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            {/* Question 3: Qualitative Comments */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Operational Outcome & Observations
              </label>
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-800"
                placeholder="Share how the mitigation performed on site..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Audited to PostgreSQL table `feedback`
              </span>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Commit Feedback to Model Ledger</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
