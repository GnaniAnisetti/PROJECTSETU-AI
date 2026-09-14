import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  ShieldCheck, 
  Sliders, 
  History, 
  Users, 
  Save, 
  CheckCircle2, 
  Search, 
  Filter,
  Lock,
  Key
} from 'lucide-react';

export const AdminPanel = () => {
  const [thresholds, setThresholds] = useState({ warning: -5.0, critical: -10.0 });
  const [auditTrail, setAuditTrail] = useState([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.getThresholds().then(res => {
      if (res && res.thresholds) setThresholds(res.thresholds);
    });
    api.getAuditTrail().then(res => {
      if (res && res.auditTrail) setAuditTrail(res.auditTrail);
    });
  }, []);

  const handleSaveThresholds = async (e) => {
    e.preventDefault();
    await api.updateThresholds(thresholds);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

    // Refresh audit trail
    const res = await api.getAuditTrail();
    if (res && res.auditTrail) setAuditTrail(res.auditTrail);
  };

  const filteredAudit = auditTrail.filter(a => 
    a.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.entity?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
            Section 34 • Governance & System Administration
          </span>
          <span className="text-xs text-slate-400">Security & Integrity</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
          System Administration & Permanent Audit Trail
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure project variance sensitivity thresholds, govern user roles, and inspect the immutable tamper-evident audit ledger.
        </p>
      </div>

      {/* Threshold Configuration & User Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Configurable Thresholds */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-sm text-slate-900">
                Variance Threshold Rules
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              Section 17
            </span>
          </div>

          <form onSubmit={handleSaveThresholds} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Warning Threshold (Amber)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  value={thresholds.warning}
                  onChange={(e) => setThresholds({ ...thresholds, warning: parseFloat(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-amber-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <span className="font-bold text-slate-500">%</span>
              </div>
              <span className="text-[10px] text-slate-400">Variances between 0% and this value are On Track.</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Critical Threshold (Red Alert)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  value={thresholds.critical}
                  onChange={(e) => setThresholds({ ...thresholds, critical: parseFloat(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-rose-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <span className="font-bold text-slate-500">%</span>
              </div>
              <span className="text-[10px] text-slate-400">Variances below this value trigger Critical Push Alerts.</span>
            </div>

            {savedSuccess && (
              <div className="p-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thresholds updated & logged to audit ledger!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Global Thresholds</span>
            </button>
          </form>
        </div>

        {/* Card 2: Enterprise Role Directory */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-sm text-slate-900">
                Authorized Personnel Roles & Permissions
              </h3>
            </div>
            <span className="text-xs text-slate-400">Role-Based Access Control</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="font-bold text-slate-900">Rajesh Sharma</div>
              <div className="text-[11px] text-emerald-700 font-semibold">FIELD_ENGINEER</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Permissions: Data Input, Mobile Audio Ingestion, OCR upload, Raw extraction review.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="font-bold text-slate-900">Priya Nair</div>
              <div className="text-[11px] text-indigo-700 font-semibold">PROJECT_MANAGER (Authority)</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Permissions: Human-in-the-loop validation, recommendation approval, mitigation actioning.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="font-bold text-slate-900">Amit Patel</div>
              <div className="text-[11px] text-amber-700 font-semibold">CITIZEN (Observer)</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Permissions: Public milestone viewing, completed corridor transparency dashboards.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="font-bold text-slate-900">Vikram Rathore</div>
              <div className="text-[11px] text-purple-700 font-semibold">ADMIN (System Administrator)</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Permissions: Full configuration, threshold management, schedule import, immutable audit.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Immutable Audit Trail Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Immutable System Audit Trail (PostgreSQL table `audit_trail`)
              </h3>
              <p className="text-xs text-slate-400">
                Every data ingestion, match acceptance, variance update, and threshold adjustment is permanently recorded
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Operator</th>
                <th className="p-3.5">Action Code</th>
                <th className="p-3.5">Entity / Scope</th>
                <th className="p-3.5">Prior State</th>
                <th className="p-3.5">New State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAudit.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 font-mono text-[11px]">
                  <td className="p-3.5 text-slate-400 whitespace-nowrap">
                    {new Date(row.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                  </td>
                  <td className="p-3.5 font-sans font-bold text-slate-800">
                    {row.user}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                      {row.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-sans text-slate-700">
                    {row.entity}
                  </td>
                  <td className="p-3.5 text-slate-400">
                    {row.prev || '—'}
                  </td>
                  <td className="p-3.5 font-semibold text-emerald-700">
                    {row.next}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
