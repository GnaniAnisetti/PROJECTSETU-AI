import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { WorkflowStepper } from '../components/WorkflowStepper';
import confetti from 'canvas-confetti';
import { 
  LogOut, 
  FileText, 
  FileSpreadsheet, 
  FileUp, 
  Mic, 
  MicOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Printer, 
  MapPin, 
  Star,
  Share2,
  Globe,
  UploadCloud,
  Check,
  ExternalLink
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

export const MainWorkspace = () => {
  const { 
    currentUser, 
    logout, 
    projects, 
    selectedProjectId, 
    setSelectedProjectId, 
    currentProject, 
    extractedData, 
    setExtractedData, 
    matchResult, 
    setMatchResult
  } = useApp();
  const navigate = useNavigate();

  // Role Security Check
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const role = currentUser?.role || 'PROJECT_MANAGER';

  // Role-specific workspace title
  const workspaceTitle = 
    role === 'FIELD_ENGINEER' ? 'FIELD OPERATIONS' :
    role === 'PROJECT_MANAGER' ? 'PROJECT CONTROL' :
    role === 'CITIZEN' ? 'PUBLIC VIEW' :
    'SYSTEM';

  // Available tabs per role (Strict isolation)
  const getTabsForRole = () => {
    if (role === 'FIELD_ENGINEER') {
      return [
        { id: 'capture', label: 'Capture Progress' },
        { id: 'extract', label: 'AI Extraction' },
        { id: 'match', label: 'Activity Match' },
        { id: 'today', label: "Today's Progress" }
      ];
    }
    if (role === 'CITIZEN') {
      return [
        { id: 'citizen_overview', label: 'Public Overview' },
        { id: 'citizen_reports', label: 'Public Reports' }
      ];
    }
    if (role === 'ADMIN') {
      return [
        { id: 'admin_overview', label: 'System Overview' },
        { id: 'capture', label: 'Data Ingestion' },
        { id: 'admin_projects', label: 'Projects' },
        { id: 'admin_users', label: 'Users & Roles' },
        { id: 'admin_thresholds', label: 'Threshold Rules' },
        { id: 'admin_audit', label: 'Audit Trail' },
        { id: 'overview', label: 'Project Control View' }
      ];
    }
    // Default: PROJECT_MANAGER
    return [
      { id: 'overview', label: 'Overview' },
      { id: 'capture', label: 'Data Ingestion' },
      { id: 'progress', label: 'Plan vs Actual' },
      { id: 'validation', label: 'AI & Validation' },
      { id: 'risk', label: 'Risk & Cause' },
      { id: 'recommendations', label: 'Recommendations' },
      { id: 'forecast', label: 'Forecast' },
      { id: 'reports', label: 'Reports' },
      { id: 'feedback', label: 'Learning Loop' }
    ];
  };

  const tabs = getTabsForRole();
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // Synchronize stepper stage
  const getStepperStage = () => {
    if (activeTab === 'capture') return 'capture';
    if (activeTab === 'extract') return 'extract';
    if (activeTab === 'match') return 'match';
    if (activeTab === 'validation') return 'validate';
    if (activeTab === 'progress' || activeTab === 'today') return 'progress';
    if (activeTab === 'risk') return 'risk';
    if (activeTab === 'recommendations') return 'recommend';
    if (activeTab === 'reports' || activeTab === 'citizen_reports') return 'report';
    if (activeTab === 'forecast') return 'forecast';
    return 'progress';
  };

  const handleStepClick = (stepId) => {
    if (role === 'FIELD_ENGINEER') {
      if (stepId === 'capture') setActiveTab('capture');
      else if (stepId === 'extract') setActiveTab('extract');
      else if (stepId === 'match') setActiveTab('match');
      else if (stepId === 'progress') setActiveTab('today');
      return;
    }
    if (role === 'CITIZEN') {
      if (stepId === 'progress') setActiveTab('citizen_overview');
      else if (stepId === 'report') setActiveTab('citizen_reports');
      return;
    }
    // Authority & Admin
    if (stepId === 'capture') setActiveTab('capture');
    else if (stepId === 'extract' || stepId === 'match' || stepId === 'validate') setActiveTab('validation');
    else if (stepId === 'progress') setActiveTab('progress');
    else if (stepId === 'risk') setActiveTab('risk');
    else if (stepId === 'recommend') setActiveTab('recommendations');
    else if (stepId === 'report') setActiveTab('reports');
    else if (stepId === 'forecast') setActiveTab('forecast');
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // -------------------------------------------------------------
  // SHARED FUNCTIONAL COMPONENT STATES
  // -------------------------------------------------------------

  // 1. Data Input State
  const [inputMode, setInputMode] = useState('text'); // 'text' | 'excel' | 'pdf' | 'voice'
  const [dprText, setDprText] = useState(
    'Today chainage 34+500 to 35+200 earthwork completed.\nApproximately 700 meters completed.\nWork started at 8:00 AM and ended at 5:00 PM.\nHeavy rain caused a 2 hour delay.'
  );
  const [isExtracting, setIsExtracting] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [csvRecords, setCsvRecords] = useState([
    { date: '2026-09-11', chainage: '34+500 to 35+200', activity: 'Earth filling', qty: 700, unit: 'm', stoppage: '2 hrs (Rain)' },
    { date: '2026-09-11', chainage: '44+100', activity: 'Pier cap tying', qty: 45, unit: 'MT', stoppage: '0 hrs' }
  ]);

  const handleLoadSampleText = () => {
    setDprText(
      'Today chainage 34+500 to 35+200 earthwork completed.\nApproximately 700 meters completed.\nWork started at 8:00 AM and ended at 5:00 PM.\nHeavy rain caused a 2 hour delay.'
    );
    setUploadedFileName('sample_dpr_report.txt');
  };

  const handleLoadSampleCsv = () => {
    const sampleRows = [
      { date: '2026-09-11', chainage: '34+500 to 35+200', activity: 'Earth filling', qty: 700, unit: 'm', stoppage: '2 hrs (Rain)' },
      { date: '2026-09-11', chainage: '44+100', activity: 'Pier cap tying', qty: 45, unit: 'MT', stoppage: '0 hrs' },
      { date: '2026-09-11', chainage: '30+000 to 30+400', activity: 'Roadway cut excavation', qty: 850, unit: 'cum', stoppage: '0.5 hrs' },
      { date: '2026-09-10', chainage: '32+000 to 32+600', activity: 'Subgrade preparation', qty: 600, unit: 'm', stoppage: '0 hrs' },
      { date: '2026-09-10', chainage: '30+000 to 31+000', activity: 'Granular Sub-Base GSB', qty: 400, unit: 'm', stoppage: '3 hrs (Supply)' }
    ];
    setCsvRecords(sampleRows);
    setDprText('Imported from sample_site_log.csv: Earth filling executed 700 meters between Ch 34+500 to 35+200. Stoppage: 2 hours due to heavy rain.');
    setUploadedFileName('sample_site_log.csv');
  };

  const handleLoadSamplePdf = () => {
    setUploadedFileName('sample_dpr_inspection.pdf');
    setIsOcrProcessing(true);
    setTimeout(() => {
      setIsOcrProcessing(false);
      setDprText('OCR Ingested from sample_dpr_inspection.pdf:\nChainage: Km 34+500 to Km 35+200\nActivity: Earthwork Formation & Embankment Layer Compaction\nQuantity: 700 meters (4,200 cum fill volume)\nInclement Weather: 38mm precipitation, 2.0 hrs compaction halt.');
    }, 600);
  };

  const handleTextFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setDprText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleCsvFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length > 1) {
          const parsed = lines.slice(1).map(line => {
            const parts = line.split(',');
            return {
              date: parts[0] || '2026-09-11',
              chainage: `${parts[1] || '34+500'} to ${parts[2] || '35+200'}`,
              activity: parts[3] || 'Earth filling',
              qty: parts[4] || '700',
              unit: parts[5] || 'm',
              stoppage: `${parts[7] || '2.0'} hrs`
            };
          });
          setCsvRecords(parsed);
          setDprText(`Imported from ${file.name}: ${parsed[0].activity} ${parsed[0].qty} ${parsed[0].unit} executed at ${parsed[0].chainage}. Stoppage: ${parsed[0].stoppage}.`);
        }
      };
      reader.readAsText(file);
    }
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setIsOcrProcessing(true);
      setTimeout(() => {
        setIsOcrProcessing(false);
        setDprText(`OCR Scanned from ${file.name}:\nLocation: Km 34+500 to Km 35+200\nActivity: Embankment Layer Filling & Compaction\nQuantity: 700 meters\nWeather: 38mm rainfall, 2 hours downtime.`);
      }, 700);
    }
  };

  const handleRunExtraction = async () => {
    setIsExtracting(true);
    const res = await api.extractEntities(dprText);
    if (res && res.extracted) {
      setExtractedData(res.extracted);
      const mRes = await api.matchActivity(res.extracted);
      if (mRes && mRes.matchResult) {
        setMatchResult(mRes.matchResult);
      }
    }
    setIsExtracting(false);
    setActiveTab('extract');
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setVoiceTranscript('Today chainage 34+500 to 35+200 earth filling executed 700 meters. Heavy rain halted compaction for 2 hours.');
      setDprText('Today chainage 34+500 to 35+200 earth filling executed 700 meters. Heavy rain halted compaction for 2 hours.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    if (!voiceRecording) {
      recognition.start();
      setVoiceRecording(true);
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
        setVoiceTranscript(transcript);
        setDprText(transcript);
      };
      recognition.onerror = () => setVoiceRecording(false);
      recognition.onend = () => setVoiceRecording(false);
    } else {
      recognition.stop();
      setVoiceRecording(false);
    }
  };

  // 2. Human Validation State
  const [validationStatus, setValidationStatus] = useState('PENDING'); // 'PENDING' | 'CONFIRMED' | 'EDITED' | 'REJECTED'
  const [valQuantity, setValQuantity] = useState(700);
  const [isEditingMatch, setIsEditingMatch] = useState(false);

  const handleConfirmValidation = async () => {
    setValidationStatus('CONFIRMED');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    await api.validateRecord({
      action: 'CONFIRMED',
      activityId: matchResult.topMatch.activityId,
      activityName: matchResult.topMatch.name,
      quantity: valQuantity,
      progressPct: 58.0,
      validatedBy: currentUser.fullName
    });
  };

  const handleRejectValidation = async () => {
    setValidationStatus('REJECTED');
    await api.validateRecord({
      action: 'REJECTED',
      activityId: matchResult.topMatch.activityId,
      activityName: matchResult.topMatch.name,
      quantity: valQuantity,
      progressPct: 58.0,
      validatedBy: currentUser.fullName
    });
  };

  // 3. Risk & Cause State
  const [rootCause, setRootCause] = useState(null);

  useEffect(() => {
    api.getRootCause('alt-001').then(res => {
      if (res && res.rootCause) setRootCause(res.rootCause);
    });
  }, []);

  // 4. Recommendations State
  const [recommendations, setRecommendations] = useState([
    {
      id: 'rec-001',
      title: 'Divert Earthmoving Fleet to Dry Rock-Cut Workfront',
      suggestedAction: 'Divert 2 hydraulic excavators & 4 tippers from wet section (Ch 34+500) to dry rock cutting section at Ch 42+000. Extend twilight compaction by 2.5 hours.',
      delayReduction: '-1.5 Days',
      costDelta: '+₹18,500',
      resourceImpact: '+14% Fleet Productivity',
      status: 'PENDING'
    },
    {
      id: 'rec-002',
      title: 'Mobilize Secondary Commercial Quarry Supplier for GSB',
      suggestedAction: 'Authorize emergency commercial draw from secondary approved quarry at Ch 58+000 to bridge 200 TPD supply gap.',
      delayReduction: '-4.0 Days',
      costDelta: '+₹65,000',
      resourceImpact: '+200 MT/day aggregate hauling trucks',
      status: 'PENDING'
    }
  ]);

  const handleRecAction = (recId, action) => {
    setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, status: action } : r));
    if (action === 'ACCEPTED') {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    }
  };

  // 5. What-If Simulator State
  const [simWorkers, setSimWorkers] = useState(12);
  const [simExcavators, setSimExcavators] = useState(2);
  const [simShiftHours, setSimShiftHours] = useState(2.0);

  // 6. Admin State
  const [thresholds, setThresholds] = useState({ warning: -5.0, critical: -10.0 });
  const [auditLog, setAuditLog] = useState([]);
  const [auditSearch, setAuditSearch] = useState('');
  const [thresholdSaved, setThresholdSaved] = useState(false);

  useEffect(() => {
    if (role === 'ADMIN') {
      api.getThresholds().then(r => r && r.thresholds && setThresholds(r.thresholds));
      api.getAuditTrail().then(r => r && r.auditTrail && setAuditLog(r.auditTrail));
    }
  }, [role]);

  const handleSaveThresholds = (e) => {
    e.preventDefault();
    api.updateThresholds(thresholds);
    setThresholdSaved(true);
    setTimeout(() => setThresholdSaved(false), 2500);
  };

  // 7. Feedback Loop State
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('Reallocating fleet prevented machine downtime during the heavy downpour.');
  const [feedbackDone, setFeedbackDone] = useState(false);

  // 8. Progress comparison dataset
  const l6Activities = [
    { name: 'Roadway Excavation', planned: 70, actual: 68, variance: -2, status: 'ON_TRACK', unit: 'cum', qtyAct: 116000, qtyPln: 120000 },
    { name: 'Embankment Filling', planned: 65, actual: 58, variance: -7, status: 'WARNING', unit: 'meters', qtyAct: 84700, qtyPln: 95000 },
    { name: 'Compaction & Proof Rolling', planned: 60, actual: 55, variance: -5, status: 'WARNING', unit: 'meters', qtyAct: 82500, qtyPln: 95000 },
    { name: 'Subgrade Preparation', planned: 50, actual: 48, variance: -2, status: 'ON_TRACK', unit: 'meters', qtyAct: 40300, qtyPln: 42000 },
    { name: 'Granular Sub-Base (GSB)', planned: 42, actual: 30, variance: -12, status: 'HIGH_RISK', unit: 'meters', qtyAct: 28500, qtyPln: 40000 },
    { name: 'Wet Mix Macadam (WMM)', planned: 25, actual: 20, variance: -5, status: 'WARNING', unit: 'meters', qtyAct: 30400, qtyPln: 38000 }
  ];

  const sCurveData = [
    { week: 'W1', planned: 10, actual: 10 },
    { week: 'W2', planned: 18, actual: 18 },
    { week: 'W3', planned: 28, actual: 27 },
    { week: 'W4', planned: 38, actual: 36 },
    { week: 'W5', planned: 47, actual: 44 },
    { week: 'W6', planned: 55, actual: 51 },
    { week: 'W7', planned: 60, actual: 55 },
    { week: 'W8 (Now)', planned: 65, actual: 58 },
    { week: 'W9', planned: 72, actual: null, forecast: 65 },
    { week: 'W10', planned: 80, actual: null, forecast: 74 }
  ];

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* ========================================================================= */}
      {/* 1. TOP BAR: Project + User + Role + Logout (Apple-like minimal navbar)   */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          
          {/* Left: Brand Identity & Active Workspace Label */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-tight text-slate-900">PROJECTSETU</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-600 text-white">AI</span>
            </div>

            <span className="text-slate-300">/</span>

            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              {workspaceTitle}
            </span>
          </div>

          {/* Center: Project Selector */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">Project:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="text-xs font-semibold bg-slate-50 hover:bg-slate-100/80 text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.code}: {p.name}</option>
              ))}
            </select>
          </div>

          {/* Right: Only the logged-in user's information + Clean Logout */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser.fullName}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {role === 'FIELD_ENGINEER' ? 'Field Engineer' : role === 'PROJECT_MANAGER' ? 'Project Authority' : role === 'CITIZEN' ? 'Citizen' : 'Administrator'}
              </div>
            </div>

            <button
              onClick={() => setShowDeployModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/70 rounded-lg transition-colors cursor-pointer"
              title="Deploy & Network Access"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Share / Deploy</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
              title="Sign out of ProjectSetu AI"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. SUB-BAR: Minimal Horizontal Workflow Step Indicator                   */}
      {/* ========================================================================= */}
      <WorkflowStepper
        currentStep={getStepperStage()}
        onStepClick={handleStepClick}
        userRole={role}
      />

      {/* ========================================================================= */}
      {/* 3. WORKSPACE TABS: Compact single-workspace navigation                    */}
      {/* ========================================================================= */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN CONTENT AREA (Clean, High Whitespace, Single Workspace Layout)   */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* ------------------------------------------------------------- */}
        {/* ROLE 1: FIELD OPERATIONS (Field Engineer)                    */}
        {/* ------------------------------------------------------------- */}

        {/* TAB: Capture Progress (Compact Data Input) */}
        {activeTab === 'capture' && (role === 'FIELD_ENGINEER' || role === 'PROJECT_MANAGER' || role === 'ADMIN') && (
          <div className="space-y-4 max-w-3xl mx-auto">
            {/* Assigned Project Header */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Corridor</span>
                <h2 className="text-base font-bold text-slate-900">{currentProject.name}</h2>
                <span className="text-xs text-slate-500 font-mono">Km 30.000 to Km 72.000</span>
              </div>
              <div className="flex items-center gap-2">
                {uploadedFileName && (
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-indigo-600" />
                    <span>{uploadedFileName}</span>
                  </span>
                )}
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active Site Session
                </span>
              </div>
            </div>

            {/* Compact Input Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Capture Site Progress</span>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  {[
                    { id: 'text', label: 'TEXT', icon: FileText },
                    { id: 'excel', label: 'CSV / EXCEL', icon: FileSpreadsheet },
                    { id: 'pdf', label: 'PDF', icon: FileUp },
                    { id: 'voice', label: 'VOICE', icon: Mic }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setInputMode(t.id)}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        inputMode === t.id ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode: Text */}
              {inputMode === 'text' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Daily Log Entry</span>
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/80 px-2.5 py-1 rounded-lg cursor-pointer transition-colors border border-indigo-200/60">
                        <span>Import .txt File</span>
                        <input
                          type="file"
                          accept=".txt,.log"
                          onChange={handleTextFileChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleLoadSampleText}
                        className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Load Sample Text
                      </button>
                      <a
                        href="/samples/sample_dpr_report.txt"
                        download="sample_dpr_report.txt"
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 hover:underline"
                        title="Download sample text file"
                      >
                        <Download className="w-3 h-3" />
                        <span>.txt</span>
                      </a>
                    </div>
                  </div>
                  <textarea
                    rows={4}
                    value={dprText}
                    onChange={(e) => setDprText(e.target.value)}
                    placeholder="Enter daily progress details or import .txt file..."
                    className="w-full text-xs sm:text-sm p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 leading-relaxed text-slate-800 font-mono"
                  />
                  <div className="text-[11px] text-slate-400">
                    No need for WBS codes. AI maps chainages, quantities, and weather stoppages automatically.
                  </div>
                </div>
              )}

              {/* Mode: Excel / CSV */}
              {inputMode === 'excel' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Tabular MoRTH Site Log</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleLoadSampleCsv}
                        className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Load Sample CSV
                      </button>
                      <a
                        href="/samples/sample_site_log.csv"
                        download="sample_site_log.csv"
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 transition-colors"
                        title="Download sample CSV file"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download sample_site_log.csv</span>
                      </a>
                    </div>
                  </div>

                  <label className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl p-5 text-center bg-slate-50/50 hover:bg-indigo-50/20 transition-all flex flex-col items-center justify-center cursor-pointer group">
                    <FileSpreadsheet className="w-8 h-8 text-indigo-600 group-hover:scale-110 transition-transform mb-1.5" />
                    <span className="text-xs font-bold text-slate-800">
                      {uploadedFileName ? `Loaded: ${uploadedFileName}` : 'Select or drop CSV / Excel file'}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">Click to browse your local .csv or .xlsx logs</span>
                    <input
                      type="file"
                      accept=".csv,text/csv,application/vnd.ms-excel"
                      onChange={handleCsvFileChange}
                      className="hidden"
                    />
                  </label>

                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">Date</th>
                          <th className="p-2.5">Chainage</th>
                          <th className="p-2.5">Activity</th>
                          <th className="p-2.5">Qty</th>
                          <th className="p-2.5">Stoppage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {csvRecords.map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50/60">
                            <td className="p-2.5 text-slate-600">{r.date}</td>
                            <td className="p-2.5 font-mono text-slate-800">{r.chainage}</td>
                            <td className="p-2.5 font-bold text-indigo-700">{r.activity}</td>
                            <td className="p-2.5 text-slate-900 font-semibold">{r.qty} {r.unit}</td>
                            <td className="p-2.5 text-amber-700 font-medium">{r.stoppage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Mode: PDF */}
              {inputMode === 'pdf' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Scanned Field Report / Inspection PDF</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleLoadSamplePdf}
                        className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Load Sample PDF
                      </button>
                      <a
                        href="/samples/sample_dpr_inspection.pdf"
                        download="sample_dpr_inspection.pdf"
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 transition-colors"
                        title="Download sample PDF report"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download sample_dpr_inspection.pdf</span>
                      </a>
                    </div>
                  </div>

                  <label className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-5 text-center bg-slate-50/50 hover:bg-blue-50/20 transition-all flex flex-col items-center justify-center cursor-pointer group">
                    <FileUp className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform mb-1.5" />
                    <span className="text-xs font-bold text-slate-800">
                      {isOcrProcessing ? 'Performing AI OCR Scanning...' : (uploadedFileName || 'Select or drop Inspection PDF')}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">Automated OCR detects stamps, chainages, and signed DPR data</span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handlePdfFileChange}
                      className="hidden"
                    />
                  </label>

                  <div className="p-3 bg-slate-900 rounded-xl text-slate-300 text-xs font-mono">
                    <div className="flex items-center justify-between mb-1 text-slate-400">
                      <span className="text-emerald-400 font-bold">OCR ENGINE: READY</span>
                      <span>PDF 1.4 COMPLIANT</span>
                    </div>
                    <div>&gt; [Extracted]: "CHAINAGE KM 34+500 TO KM 35+200 - 700 METERS"</div>
                    <div>&gt; [Extracted]: "ACTIVITY: EARTHWORK / EMBANKMENT COMPACTION"</div>
                    <div>&gt; [Extracted]: "INCLEMENT WEATHER HALT: 2.0 HOURS (RAIN)"</div>
                  </div>
                </div>
              )}

              {/* Mode: Voice */}
              {inputMode === 'voice' && (
                <div className="text-center py-6 space-y-3">
                  <button
                    onClick={toggleVoice}
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-transform ${
                      voiceRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-indigo-600 text-white hover:scale-105'
                    }`}
                  >
                    {voiceRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                  <div className="text-xs font-bold text-slate-800">
                    {voiceRecording ? 'Recording audio...' : 'Click to dictate site report (Hindi / English)'}
                  </div>
                  {voiceTranscript && (
                    <div className="text-xs p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900 text-left">
                      "{voiceTranscript}"
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={handleRunExtraction}
                  disabled={isExtracting}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isExtracting ? 'Extracting with AI...' : 'Extract Entities & Structured JSON'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: AI Extraction (Structured JSON) */}
        {activeTab === 'extract' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Extraction Layer</span>
                  <h3 className="text-sm font-bold text-slate-900">Extracted Structured Project Event</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Confidence: {extractedData.confidence}%
                </span>
              </div>

              {/* Structured Key Values */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Activity</span>
                  <div className="font-bold text-slate-900 mt-0.5">{extractedData.activity}</div>
                </div>
                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Location / Chainage</span>
                  <div className="font-bold font-mono text-slate-900 mt-0.5">{extractedData.location}</div>
                </div>
                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Progress Quantity</span>
                  <div className="font-bold text-indigo-700 mt-0.5">{extractedData.quantity} {extractedData.unit}</div>
                </div>
                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Delay Stoppage</span>
                  <div className="font-bold text-amber-700 mt-0.5">{extractedData.delay_hours} hrs ({extractedData.delay_reason})</div>
                </div>
                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Manpower</span>
                  <div className="font-bold text-slate-900 mt-0.5">{extractedData.manpower} Workers</div>
                </div>
                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Equipment</span>
                  <div className="font-bold text-slate-900 mt-0.5">Excavator, 4 Tippers, Roller</div>
                </div>
              </div>

              {/* Structured JSON Drawer */}
              <div className="p-3 bg-slate-950 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto max-h-44">
                <pre>{JSON.stringify(extractedData, null, 2)}</pre>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setActiveTab('capture')}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  ← Back to Input
                </button>
                <button
                  onClick={() => setActiveTab('match')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Activity Match</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Activity Match (Field Activity → Matched L5/L6 Activity → Confidence %) */}
        {activeTab === 'match' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Semantic Schedule Linking</span>
                <h3 className="text-base font-bold text-slate-900">AI Activity Link Result</h3>
              </div>

              {/* EXACT REQUIREMENT SPEC: Field Activity → Matched L5/L6 Activity → Confidence % */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Field Activity</span>
                  <div className="text-base font-black text-slate-900 mt-0.5">
                    {extractedData.activity}
                  </div>
                </div>

                <div className="text-slate-400 text-lg hidden sm:block">→</div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Matched L5/L6 Activity</span>
                  <div className="text-base font-black text-indigo-700 mt-0.5">
                    {matchResult.topMatch.name}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">{matchResult.topMatch.wbsCode}</span>
                </div>

                <div className="sm:border-l sm:border-slate-200 sm:pl-5 text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Confidence</span>
                  <div className="text-2xl font-black text-emerald-600">
                    {matchResult.confidenceScore}%
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed">
                <strong>Match Explanation:</strong> {matchResult.explanation}
              </div>

              {/* Alternatives List */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Evaluated Candidates</span>
                <div className="space-y-1.5 text-xs">
                  {matchResult.alternatives.map((alt, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 text-slate-600">
                      <span>{alt.name} ({alt.wbsCode})</span>
                      <span className="font-semibold text-slate-700">{alt.similarityScore}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Today's Progress (Field Engineer Summary) */}
        {activeTab === 'today' && role === 'FIELD_ENGINEER' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today's Site Execution</span>
              <h2 className="text-lg font-bold text-slate-900">Embankment Formation (Ch 34+500 to 35+200)</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">Target Qty</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">700 meters</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">Executed Qty</span>
                  <div className="font-bold text-emerald-600 text-sm mt-0.5">700 meters (100%)</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">Rain Stoppage</span>
                  <div className="font-bold text-amber-600 text-sm mt-0.5">2.0 hrs</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">Status</span>
                  <div className="font-bold text-indigo-700 text-sm mt-0.5">Submitted for Review</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ROLE 2 & 4: PROJECT CONTROL (Project Authority / Admin)      */}
        {/* ------------------------------------------------------------- */}

        {/* TAB: Overview */}
        {activeTab === 'overview' && (role === 'PROJECT_MANAGER' || role === 'ADMIN') && (
          <div className="space-y-5">
            {/* EXACT REQUIREMENT SPEC: Progress (Planned 65% | Actual 58% | Variance -7% | DELAY) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contractual Execution Sync</span>
                <div className="flex items-center gap-6 mt-1">
                  <div>
                    <span className="text-xs text-slate-400">Planned</span>
                    <div className="text-2xl font-black text-slate-900">65%</div>
                  </div>
                  <div className="text-slate-200 text-xl font-light">|</div>
                  <div>
                    <span className="text-xs text-slate-400">Actual</span>
                    <div className="text-2xl font-black text-indigo-700">58%</div>
                  </div>
                  <div className="text-slate-200 text-xl font-light">|</div>
                  <div>
                    <span className="text-xs text-slate-400">Variance</span>
                    <div className="text-2xl font-black text-rose-600">-7%</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                  DELAY DETECTED
                </span>
                <button
                  onClick={() => setActiveTab('progress')}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  View WBS
                </button>
              </div>
            </div>

            {/* EXACT REQUIREMENT SPEC: Compact Risk Alert */}
            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-black text-slate-900 uppercase">DELAY DETECTED</span>
                  <span className="text-xs text-slate-300">|</span>
                  <span className="text-xs text-slate-600 font-medium">Cause: Heavy Rainfall (38mm/hr)</span>
                  <span className="text-xs text-slate-300">|</span>
                  <span className="text-xs font-bold text-rose-600">Variance: -7%</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Subgrade moisture exceeded Optimum Moisture Content (OMC) at Ch 34+500. 2.0 hours fleet downtime.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('risk')}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
              >
                VIEW ANALYSIS
              </button>
            </div>

            {/* EXACT REQUIREMENT SPEC: Compact Recommendation */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 max-w-2xl">
                <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">AI Recommendation</div>
                <h4 className="text-xs font-bold text-slate-900">
                  Divert Earthmoving Fleet to Dry Rock-Cut Workfront at Ch 42+000
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span><strong>Expected Impact:</strong> -1.5 Days Schedule Recovery</span>
                  <span>•</span>
                  <span>+₹18,500 Cost Delta</span>
                  <span>•</span>
                  <span>+14% Fleet Productivity</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRecAction('rec-001', 'ACCEPTED')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  ACCEPT
                </button>
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  EDIT
                </button>
              </div>
            </div>

            {/* Quick Activity Health Grid */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Monitored Activities</span>
                <span className="text-xs text-slate-400">Week 8 Progress</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {l6Activities.slice(0, 3).map((act, i) => (
                  <div key={i} className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 text-xs space-y-1">
                    <div className="font-bold text-slate-900 truncate">{act.name}</div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>{act.actual}% / {act.planned}%</span>
                      <span className={`font-black ${act.variance < -5 ? 'text-rose-600' : 'text-slate-700'}`}>{act.variance}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Plan vs Actual (Full functional component) */}
        {activeTab === 'progress' && (
          <div className="space-y-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WBS Execution Progress</span>
                  <h3 className="text-sm font-bold text-slate-900">Plan vs Actual Activity Table</h3>
                </div>
                <div className="text-xs text-slate-500">Baseline Target: 65% | Current Actual: 58%</div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">WBS Activity</th>
                      <th className="p-3">Quantity Executed</th>
                      <th className="p-3">Planned %</th>
                      <th className="p-3">Actual %</th>
                      <th className="p-3">Variance</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {l6Activities.map((act, i) => (
                      <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 font-bold text-slate-900">{act.name}</td>
                        <td className="p-3 font-medium text-slate-600">{act.qtyAct.toLocaleString()} / {act.qtyPln.toLocaleString()} {act.unit}</td>
                        <td className="p-3 text-slate-600">{act.planned}%</td>
                        <td className="p-3 font-black text-indigo-700">{act.actual}%</td>
                        <td className={`p-3 font-black ${act.variance < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {act.variance}%
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            act.variance >= -5 ? 'bg-emerald-50 text-emerald-700' : act.variance >= -10 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {act.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* S-Curve Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">Cumulative S-Curve Trend</span>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sCurveData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line type="monotone" dataKey="planned" stroke="#3b82f6" strokeWidth={2} name="Planned Baseline" />
                    <Line type="monotone" dataKey="actual" stroke="#4f46e5" strokeWidth={3} name="Actual Recorded" connectNulls={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB: AI & Validation (Human-in-the-Loop) */}
        {activeTab === 'validation' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Human-in-the-Loop Governance</span>
                  <h3 className="text-sm font-bold text-slate-900">Review & Validate AI Match</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Match Score: 94%
                </span>
              </div>

              {/* Match Card */}
              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Reported Activity</span>
                  <div className="font-bold text-slate-900 mt-0.5">{extractedData.activity}</div>
                </div>
                <div>
                  <span className="text-slate-400">Mapped WBS Item</span>
                  <div className="font-bold text-indigo-700 mt-0.5">{matchResult.topMatch.name}</div>
                </div>
                <div>
                  <span className="text-slate-400">Reported Qty</span>
                  <div className="font-bold text-slate-900 mt-0.5">{valQuantity} {extractedData.unit}</div>
                </div>
                <div>
                  <span className="text-slate-400">Project Authority</span>
                  <div className="font-bold text-slate-900 mt-0.5">{currentUser.fullName}</div>
                </div>
              </div>

              {/* Action Buttons */}
              {validationStatus === 'PENDING' ? (
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleConfirmValidation}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm AI Suggestion</span>
                  </button>
                  <button
                    onClick={() => setIsEditingMatch(!isEditingMatch)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Modify
                  </button>
                  <button
                    onClick={handleRejectValidation}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Validated & Committed to PostgreSQL ledger by {currentUser.fullName}.</span>
                </div>
              )}

              {isEditingMatch && validationStatus === 'PENDING' && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <label className="font-bold text-slate-700">Adjust Validated Quantity:</label>
                  <input
                    type="number"
                    value={valQuantity}
                    onChange={(e) => setValQuantity(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: Risk & Cause Analysis */}
        {activeTab === 'risk' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Explainable AI</span>
                <h3 className="text-base font-bold text-slate-900">Schedule Variance Root Cause Analysis</h3>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Primary Cause</span>
                <div className="text-sm font-bold">{rootCause?.primaryCause || 'Unseasonal Heavy Rainfall & Saturated Soil (OMC Exceeded)'}</div>
                <p className="text-xs text-slate-300">Local AWS station confirms 38mm precipitation over active corridor stretch.</p>
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Contributing Factors</span>
                <div className="space-y-1.5">
                  {rootCause?.contributingFactors?.map((f, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
                      • {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">Rainfall</span>
                  <div className="font-bold text-slate-900 mt-0.5">38 mm</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">Fleet Stoppage</span>
                  <div className="font-bold text-amber-600 mt-0.5">2.0 Hours</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">Soil Moisture</span>
                  <div className="font-bold text-slate-900 mt-0.5">OMC +4.2%</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">Labor Idle</span>
                  <div className="font-bold text-slate-900 mt-0.5">18 Workers</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Recommendations */}
        {activeTab === 'recommendations' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            {recommendations.map((rec) => (
              <div key={rec.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{rec.id}</span>
                    <h3 className="text-sm font-bold text-slate-900">{rec.title}</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    rec.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {rec.status}
                  </span>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl">
                  {rec.suggestedAction}
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                    <span className="text-emerald-700 font-semibold">Delay Recovered</span>
                    <div className="font-black text-emerald-700 mt-0.5">{rec.delayReduction}</div>
                  </div>
                  <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                    <span className="text-blue-700 font-semibold">Cost Delta</span>
                    <div className="font-black text-blue-700 mt-0.5">{rec.costDelta}</div>
                  </div>
                  <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl">
                    <span className="text-purple-700 font-semibold">Fleet Productivity</span>
                    <div className="font-black text-purple-700 mt-0.5">{rec.resourceImpact}</div>
                  </div>
                </div>

                {rec.status === 'PENDING' && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleRecAction(rec.id, 'ACCEPTED')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      ACCEPT
                    </button>
                    <button
                      onClick={() => setEditingRecId(rec.id)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleRecAction(rec.id, 'REJECTED')}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      REJECT
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB: What-If Forecasting */}
        {activeTab === 'forecast' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Predictive Simulation</span>
                <h3 className="text-sm font-bold text-slate-900">What-If Resource Levers</h3>
              </div>

              {/* Interactive Sliders */}
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Additional Site Laborers</span>
                    <span className="font-bold text-indigo-700">+{simWorkers} workers</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={simWorkers}
                    onChange={(e) => setSimWorkers(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Hydraulic Excavators Added</span>
                    <span className="font-bold text-indigo-700">+{simExcavators} units</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    value={simExcavators}
                    onChange={(e) => setSimExcavators(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Twilight Shift Extension</span>
                    <span className="font-bold text-indigo-700">+{simShiftHours} hrs/day</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="0.5"
                    value={simShiftHours}
                    onChange={(e) => setSimShiftHours(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Simulation Result */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Delay Recovered</span>
                  <div className="font-black text-emerald-600 text-sm mt-0.5">-12 Days</div>
                </div>
                <div>
                  <span className="text-slate-400">Revised Completion</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">02 Dec 2026</div>
                </div>
                <div>
                  <span className="text-slate-400">Budget Impact</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">+₹3,60,000</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MoRTH Compliance</span>
                  <h3 className="text-sm font-bold text-slate-900">Official Daily & Weekly Reports</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8,Activity,Planned,Actual,Variance\nEmbankment Filling,65,58,-7\n";
                      const encoded = encodeURI(csvContent);
                      const a = document.createElement("a");
                      a.href = encoded;
                      a.download = "ProjectSetu_Report.csv";
                      a.click();
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Formatted Report Sheet Preview */}
              <div className="p-5 bg-slate-50/70 rounded-xl border border-slate-200 text-xs space-y-3 font-sans">
                <div className="border-b border-slate-200 pb-2">
                  <div className="text-[10px] uppercase font-bold text-indigo-700">NHAI CORRIDOR PACKAGE A • PIU NAGPUR</div>
                  <div className="font-bold text-sm text-slate-900">DAILY PROGRESS REPORT (DPR) #REP-2026-09-11</div>
                </div>
                <div className="space-y-1 text-slate-700">
                  <div><strong>Chainage Stretch:</strong> Km 34+500 to Km 35+200 (700m)</div>
                  <div><strong>Activity Executed:</strong> L6 – Embankment Filling (WBS-1.1.2)</div>
                  <div><strong>Variance:</strong> -7.0% (Delayed due to unseasonal 38mm rainfall)</div>
                  <div><strong>Authority Mitigation:</strong> Fleet reallocated to rock-cut front at Ch 42+000</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Feedback & Historical Learning */}
        {activeTab === 'feedback' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Continuous Learning</span>
                <h3 className="text-sm font-bold text-slate-900">AI Recommendation Calibration & Evolution</h3>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs text-center">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">Current Accuracy</span>
                  <div className="font-black text-indigo-700 text-lg mt-0.5">93.8%</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">Accuracy Gain</span>
                  <div className="font-black text-emerald-600 text-lg mt-0.5">+7.6%</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">Validated Reports</span>
                  <div className="font-black text-slate-900 text-lg mt-0.5">1,380</div>
                </div>
              </div>

              {/* Feedback Form */}
              {feedbackDone ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Feedback successfully ingested! Weights updated for future recommendations.</span>
                </div>
              ) : (
                <div className="space-y-3 pt-2 text-xs">
                  <label className="font-bold text-slate-700">Rate Recommendation Quality:</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        onClick={() => setFeedbackRating(s)}
                        className={`p-1 ${s <= feedbackRating ? 'text-amber-400' : 'text-slate-200'}`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={2}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                  <button
                    onClick={() => {
                      setFeedbackDone(true);
                      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg text-xs cursor-pointer"
                  >
                    Submit Feedback
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ROLE 3: PUBLIC VIEW (Citizen)                                */}
        {/* ------------------------------------------------------------- */}

        {activeTab === 'citizen_overview' && role === 'CITIZEN' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Public Infrastructure Portal</span>
                <h2 className="text-xl font-black text-slate-900 mt-1">{currentProject.name}</h2>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentProject.location}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Overall Completion</span>
                  <span className="font-bold text-indigo-700">{currentProject.overallActualPct}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${currentProject.overallActualPct}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">Status</span>
                  <div className="font-bold text-emerald-600 text-sm mt-0.5">ACTIVE &amp; VERIFIED</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">Corridor Length</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{currentProject.corridorLengthKm} km</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">Target Completion</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{currentProject.plannedEndDate}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'citizen_reports' && role === 'CITIZEN' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Public Transparency Disclosures</span>
              <h3 className="text-sm font-bold text-slate-900">MoRTH Public Milestone Notices</h3>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex justify-between items-center">
                  <span>Ch 38+200 Grade Separator Open to Public Traffic</span>
                  <span className="font-bold text-emerald-600">COMPLETED</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span>42 km 4-Lane Bituminous Surface Dressing</span>
                  <span className="font-bold text-indigo-600">TARGET NOV 2026</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ROLE 4: SYSTEM (Administrator)                               */}
        {/* ------------------------------------------------------------- */}

        {activeTab === 'admin_overview' && role === 'ADMIN' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Administration</span>
              <h2 className="text-lg font-bold text-slate-900">Platform Health & Governance</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">Active Projects</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{projects.length}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">Audit Records</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{auditLog.length}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">Warning Threshold</span>
                  <div className="font-bold text-amber-600 text-sm mt-0.5">{thresholds.warning}%</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">Critical Threshold</span>
                  <div className="font-bold text-rose-600 text-sm mt-0.5">{thresholds.critical}%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin_projects' && role === 'ADMIN' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Registry</span>
              <div className="divide-y divide-slate-100 text-xs">
                {projects.map(p => (
                  <div key={p.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{p.code} • {p.location}</div>
                    </div>
                    <span className="font-bold text-indigo-700">{p.overallActualPct}% Actual</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin_users' && role === 'ADMIN' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">User & Role Directory</span>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'Rajesh Sharma', user: 'engineer', role: 'FIELD_ENGINEER', desc: 'Field Operations & DPR Capture' },
                  { name: 'Priya Nair', user: 'manager', role: 'PROJECT_MANAGER', desc: 'Project Control, Validation & Mitigations' },
                  { name: 'Amit Patel', user: 'citizen', role: 'CITIZEN', desc: 'Public View Transparency' },
                  { name: 'Vikram Rathore', user: 'admin', role: 'ADMIN', desc: 'System Configuration & Auditing' }
                ].map((u, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{u.name} <span className="text-slate-400 font-normal">(@{u.user})</span></div>
                      <div className="text-[11px] text-slate-500">{u.desc}</div>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin_thresholds' && role === 'ADMIN' && (
          <div className="space-y-4 max-w-xl mx-auto">
            <form onSubmit={handleSaveThresholds} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tolerance Configuration</span>
              <h3 className="text-sm font-bold text-slate-900">Variance Threshold Sensitivity</h3>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Warning Threshold (Amber)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    value={thresholds.warning}
                    onChange={(e) => setThresholds({ ...thresholds, warning: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  />
                  <span>%</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Critical Threshold (Red)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    value={thresholds.critical}
                    onChange={(e) => setThresholds({ ...thresholds, critical: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  />
                  <span>%</span>
                </div>
              </div>

              {thresholdSaved && (
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Thresholds successfully saved.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl cursor-pointer"
              >
                Save Thresholds
              </button>
            </form>
          </div>
        )}

        {activeTab === 'admin_audit' && role === 'ADMIN' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Immutable Audit Trail</span>
                <input
                  type="text"
                  placeholder="Search audit trail..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg w-64"
                />
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left font-mono">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 font-sans">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Operator</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Scope</th>
                      <th className="p-3">New State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {auditLog
                      .filter(a => a.action.toLowerCase().includes(auditSearch.toLowerCase()) || a.user.toLowerCase().includes(auditSearch.toLowerCase()))
                      .map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="p-3 text-slate-400">{new Date(row.timestamp).toLocaleTimeString()}</td>
                          <td className="p-3 font-sans font-bold text-slate-800">{row.user}</td>
                          <td className="p-3 text-indigo-700 font-bold">{row.action}</td>
                          <td className="p-3 text-slate-600 font-sans">{row.entity}</td>
                          <td className="p-3 text-emerald-700 font-semibold">{row.next}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* 5. DEPLOYMENT & NETWORK SHARING MODAL                                      */}
      {/* ========================================================================= */}
      {showDeployModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Network Access & Deployment</h3>
                  <p className="text-[11px] text-slate-500">Accessible to team members, evaluators, and mobile devices</p>
                </div>
              </div>
              <button
                onClick={() => setShowDeployModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1 cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Live Network URLs */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Listening URLs (Port 3000)</span>
              
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase block">Local Machine</span>
                  <span className="text-xs font-mono font-bold text-slate-800">http://localhost:3000</span>
                </div>
                <a
                  href="http://localhost:3000"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 flex items-center gap-1"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase block">WiFi / LAN Network (Share With Anyone)</span>
                  <span className="text-xs font-mono font-bold text-indigo-900">http://10.10.40.107:3000</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText('http://10.10.40.107:3000');
                    alert('Network URL copied: http://10.10.40.107:3000');
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* Sample Files Download Shortcut */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sample Ingestion Files</span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <a
                  href="/samples/sample_dpr_report.txt"
                  download="sample_dpr_report.txt"
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center gap-1 transition-colors"
                >
                  <FileText className="w-4 h-4 text-slate-700" />
                  <span className="font-semibold text-slate-800 text-[11px]">.TXT Report</span>
                </a>
                <a
                  href="/samples/sample_site_log.csv"
                  download="sample_site_log.csv"
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center gap-1 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800 text-[11px]">.CSV Log</span>
                </a>
                <a
                  href="/samples/sample_dpr_inspection.pdf"
                  download="sample_dpr_inspection.pdf"
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center gap-1 transition-colors"
                >
                  <FileUp className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-800 text-[11px]">.PDF Scanned</span>
                </a>
              </div>
            </div>

            {/* Production Deploy Instructions */}
            <div className="space-y-1.5 p-3 bg-slate-900 rounded-xl text-slate-300 text-[11px] font-mono">
              <div className="text-emerald-400 font-bold font-sans text-xs flex items-center gap-1 mb-1">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Production 1-Click Deployment:</span>
              </div>
              <p className="text-slate-400 font-sans">1. Built static files are in <span className="text-white">frontend/dist/</span></p>
              <p className="text-slate-400 font-sans">2. Run <code className="text-indigo-300">npx serve -s dist -l 3000</code> or deploy to Vercel / Netlify / Render.</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDeployModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
