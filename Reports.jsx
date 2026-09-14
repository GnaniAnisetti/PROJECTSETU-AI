import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Filter, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  Share2
} from 'lucide-react';

export const Reports = () => {
  const [selectedReportType, setSelectedReportType] = useState('DPR');
  const [selectedDateRange, setSelectedDateRange] = useState('CURRENT_WEEK');

  const reportCatalog = [
    {
      id: 'DPR',
      title: 'Daily Progress Report (DPR)',
      code: 'REP-DPR-2026-09-11',
      date: '11 September 2026',
      desc: 'Itemized DPR containing daily chainage execution, BoQ volume output, weather delays, and machinery fleet records.',
      category: 'Field Execution'
    },
    {
      id: 'WEEKLY',
      title: 'Weekly Progress & S-Curve Variance Report',
      code: 'REP-WPR-2026-W36',
      date: 'Week 36 (Sep 05 - Sep 11)',
      desc: 'Executive variance summary comparing cumulative actual velocity against contractual Primavera P6 baseline.',
      category: 'Planning & Governance'
    },
    {
      id: 'DELAY',
      title: 'MoRTH Inclement Weather & Delay Audit Report',
      code: 'REP-DLY-2026-004',
      date: 'Monthly Cumulative (Sep 2026)',
      desc: 'Official delay log detailing 2.0 hours rainfall stoppage at Ch 34+500 and aggregate quarry logistics bottlenecks.',
      category: 'Contractual Claims'
    },
    {
      id: 'RISK',
      title: 'Risk Register & Critical Path Vulnerability Audit',
      code: 'REP-RSK-2026-Q3',
      date: 'Q3 2026 Assessment',
      desc: 'Multi-factor risk classification of L6 activities breaching warning and critical thresholds.',
      category: 'Risk Management'
    },
    {
      id: 'MITIGATION',
      title: 'AI Actionable Recommendation & Impact Audit',
      code: 'REP-REC-2026-08',
      date: 'Post-Mitigation Review',
      desc: 'Comprehensive summary of accepted AI suggestions, delay days recovered (-1.5 days), and fleet reallocation costs.',
      category: 'AI Prescriptive'
    },
    {
      id: 'SUMMARY',
      title: 'Executive Project Status & Public Transparency Summary',
      code: 'REP-SUM-PKG-A',
      date: 'Active Status',
      desc: 'High-level synthesis for Ministry Project Monitoring Group (PMG) and citizen transparency dissemination.',
      category: 'Executive Summary'
    }
  ];

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Report,Project,Date,Planned_Pct,Actual_Pct,Variance_Pct,Status\n" +
      `${selectedReportType},Highway Package A,2026-09-11,65.0,58.0,-7.0,WARNING\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ProjectSetu_${selectedReportType}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentReport = reportCatalog.find(r => r.id === selectedReportType) || reportCatalog[0];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Section 26 • Official Project Documentation
            </span>
            <span className="text-xs text-slate-400">MoRTH / NHAI Standard Formats</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Executive Reports & Audit Generation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate printable and downloadable compliance reports, variance logs, and AI mitigation dossiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-all"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF Document</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {reportCatalog.map((rep) => {
          const isSelected = rep.id === selectedReportType;
          return (
            <button
              key={rep.id}
              onClick={() => setSelectedReportType(rep.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                isSelected ? 'text-indigo-200' : 'text-slate-400'
              }`}>
                {rep.category}
              </div>
              <div className="text-xs font-extrabold line-clamp-2 leading-snug">
                {rep.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Official Formatted Report Sheet Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
        
        {/* Formal Document Letterhead */}
        <div className="p-8 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xl">
              PS
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700">
                National Highways Authority of India • Corridor Package A
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {currentReport.title}
              </h2>
              <div className="text-xs text-slate-500 mt-0.5">
                Ref Code: <span className="font-mono font-bold text-slate-700">{currentReport.code}</span> • Generated: {currentReport.date}
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500">
            <div>Contract Package: <strong>NHAI-PKG-A</strong></div>
            <div>Chainage: <strong>Km 30.000 to Km 72.000</strong></div>
            <div className="text-emerald-700 font-bold mt-1">Verified By AI & Authority Engineer</div>
          </div>
        </div>

        {/* Report Content Body */}
        <div className="p-8 space-y-6">
          
          {/* Executive Summary Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              1. Project Velocity & Variance Synthesis
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">WBS Item</th>
                    <th className="p-3">Chainage Stretch</th>
                    <th className="p-3">Planned %</th>
                    <th className="p-3">Actual %</th>
                    <th className="p-3">Variance</th>
                    <th className="p-3">Risk Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-white">
                    <td className="p-3 font-bold text-slate-900">L6 – Embankment Filling</td>
                    <td className="p-3 font-mono">Ch 34+500 to 35+200</td>
                    <td className="p-3">65.0%</td>
                    <td className="p-3 font-extrabold text-indigo-700">58.0%</td>
                    <td className="p-3 font-black text-rose-600">-7.0%</td>
                    <td className="p-3 text-amber-700 font-bold">WARNING (Weather delay)</td>
                  </tr>
                  <tr className="bg-slate-50/40">
                    <td className="p-3 font-bold text-slate-900">L6 – Granular Sub-Base (GSB)</td>
                    <td className="p-3 font-mono">Ch 30+000 to 48+000</td>
                    <td className="p-3">42.0%</td>
                    <td className="p-3 font-extrabold text-indigo-700">30.0%</td>
                    <td className="p-3 font-black text-rose-600">-12.0%</td>
                    <td className="p-3 text-rose-700 font-bold">HIGH RISK (Quarry Bottleneck)</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 font-bold text-slate-900">L6 – Roadway Excavation</td>
                    <td className="p-3 font-mono">Ch 30+000 to 50+000</td>
                    <td className="p-3">70.0%</td>
                    <td className="p-3 font-extrabold text-indigo-700">68.0%</td>
                    <td className="p-3 font-semibold text-emerald-600">-2.0%</td>
                    <td className="p-3 text-emerald-700 font-bold">ON TRACK</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Root-Cause & Field Evidence Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              2. Field Incident Log & AI Causal Correlation
            </h3>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <strong className="text-slate-900">Event Date: 2026-09-11 (Reporting Shift A)</strong>
                <span className="text-slate-500 font-mono">Recorded by: Rajesh Sharma (Sr. Site Eng)</span>
              </div>
              <p className="text-slate-600">
                At 14:00 hrs, unseasonal localized downpour (38mm/hr) precipitated across Chainage 34+500 to 35+200. Earth filling was suspended for 2.0 hours due to surface soil moisture exceeding OMC by +4.2%. Machine slippage observed on embankment slope.
              </p>
              <div className="pt-2 border-t border-slate-200 text-indigo-800 font-semibold">
                AI Correlation: High-confidence semantic match (94%) to WBS 1.1.2. Variance calculated as -7.0% against Week 8 target.
              </div>
            </div>
          </div>

          {/* Prescriptive Mitigation Audit */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              3. Authority Approved Mitigations & Quantified Impact
            </h3>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 text-xs space-y-2">
              <div className="font-bold text-emerald-950">
                Mitigation Directive #REC-001: Fleet Reallocation & Aeration Dry-Back
              </div>
              <p className="text-slate-700">
                Project Authority Priya Nair authorized diverting 2 excavators to dry rock cutting at Ch 42+000 and scheduling a 2.5-hour extended twilight compaction shift.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-200 font-mono text-[11px] text-emerald-800">
                <div>Delay Recovered: -1.5 Days</div>
                <div>Cost Delta: +₹18,500</div>
                <div>Fleet Utilization: +14%</div>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              <div className="font-bold text-slate-900">Rajesh Sharma</div>
              <div>Field Engineer, NHAI PIU</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-indigo-700">PROJECTSETU AI Engine v1.0</div>
              <div>Automated Schedule Intelligence Layer</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900">Priya Nair</div>
              <div>Project Director & Authority Engineer</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
