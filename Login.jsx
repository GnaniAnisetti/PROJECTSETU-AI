import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BridgeBackground } from '../components/BridgeBackground';
import { Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export const Login = () => {
  const { login, signUp } = useApp();
  const navigate = useNavigate();

  // Mode: 'login' | 'signup'
  const [mode, setMode] = useState('login');

  // Login form state
  const [username, setUsername] = useState('manager');
  const [password, setPassword] = useState('demo123');
  const [role, setRole] = useState('PROJECT_MANAGER');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign up form state
  const [name, setName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState('FIELD_ENGINEER');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // UI state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !password.trim() || !role) {
      setError('Please provide username, password, and select your role.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(username, password, role, rememberMe);
      if (res.success) {
        navigate('/workspace');
      } else {
        setError(res.message || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setError('An error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !regUsername.trim() || !regPassword.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signUp(name, regUsername, regPassword, regRole);
      if (res.success) {
        setSuccess('Account created successfully! You can now log in.');
        setUsername(regUsername);
        setPassword(regPassword);
        setRole(regRole);
        setMode('login');
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch {
      setError('An error occurred during account creation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Subtle Vector Infrastructure Line Pattern */}
      <BridgeBackground />

      {/* Main Login / Sign Up Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/40 p-8 sm:p-10 transition-all">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            <span>HEXORA</span>
            <span>•</span>
            <span>SIH 2026 • 26122</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            PROJECTSETU AI
          </h1>

          <p className="text-xs text-slate-500 font-medium mt-1.5">
            From field data to project intelligence.
          </p>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200/60 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs flex items-start gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{success}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. manager, engineer, citizen, admin"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full text-sm px-3.5 py-2.5 pr-10 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors cursor-pointer"
              >
                <option value="FIELD_ENGINEER">Field Engineer</option>
                <option value="PROJECT_MANAGER">Project Authority</option>
                <option value="CITIZEN">Citizen / Public</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>

            {/* Secondary Controls: Remember me + Forgot password? */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline focus:outline-none"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'LOGIN'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Subtle Demo Credential Hint */}
            <div className="pt-2 text-center">
              <span className="text-[11px] text-slate-400">
                Default accounts: <code className="text-slate-600 font-mono">engineer</code>, <code className="text-slate-600 font-mono">manager</code>, <code className="text-slate-600 font-mono">citizen</code>, <code className="text-slate-600 font-mono">admin</code> (key: <code className="text-slate-600 font-mono">demo123</code>)
              </span>
            </div>

            {/* Toggle to Sign Up */}
            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              New user?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
                className="text-indigo-600 font-bold hover:underline focus:outline-none"
              >
                Sign up
              </button>
            </div>

          </form>
        ) : (
          /* SIGN UP FORM */
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajesh Sharma"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                placeholder="Choose a username"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full text-sm px-3.5 py-2.5 pr-10 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                placeholder="Re-type your password"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors"
                required
              />
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Role
              </label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors cursor-pointer"
              >
                <option value="FIELD_ENGINEER">Field Engineer</option>
                <option value="PROJECT_MANAGER">Project Authority</option>
                <option value="CITIZEN">Citizen / Public</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Creating Account...' : 'CREATE ACCOUNT'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Return to Login */}
            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="text-indigo-600 font-bold hover:underline focus:outline-none"
              >
                Log in
              </button>
            </div>

          </form>
        )}

      </div>

      {/* Minimal Forgot Password Helper Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <HelpCircle className="w-5 h-5" />
              <span>Password Recovery</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              In this prototype environment, credentials for seeded roles are:
            </p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-mono space-y-1 text-slate-700">
              <div>• engineer / demo123 (Field Engineer)</div>
              <div>• manager / demo123 (Project Authority)</div>
              <div>• citizen / demo123 (Citizen)</div>
              <div>• admin / demo123 (Admin)</div>
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
