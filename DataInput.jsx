import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  FileText, 
  FileSpreadsheet, 
  FileUp, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Upload,
  AlertCircle
} from 'lucide-react';

export const DataInput = () => {
  const { currentProject, setExtractedData } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('text');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');

  // 1. Text DPR
  const [textInput, setTextInput] = useState(
    'Today chainage 34+500 to 35+200 earthwork completed.\nApproximately 700 meters completed.\nWork started at 8:00 AM and ended at 5:00 PM.\nHeavy rain caused a 2 hour delay.'
  );

  // 2. CSV / Excel
  const [csvFile, setCsvFile] = useState(null);
  const [csvPreview, setCsvPreview] = useState([
    { date: '2026-09-11', chainage: '34+500 to 35+200', activity: 'Earth filling', qty: 700, unit: 'm', stoppage: '2 hrs (Rain)' },
    { date: '2026-09-11', chainage: '44+100', activity: 'Pier cap tying', qty: 45, unit: 'MT', stoppage: '0 hrs' }
  ]);

  // 3. PDF / Scanned DPR
  const [pdfFile, setPdfFile] = useState(null);

  // 4. Voice Input
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');

  // 5. Site Images
  const [siteImages, setSiteImages] = useState([
    {
      name: 'site_dpr_ch34_500_rain.jpg',
      chainage: 'Ch 34+800',
      timestamp: 'Today, 14:30',
      caption: 'Wet subsoil conditions & roller slippage after downpour',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=600&q=80'
    }
  ]);

  const loadDemoScenario = () => {
    setTextInput(
      'Today chainage 34+500 to 35+200 earthwork completed.\nApproximately 700 meters completed.\nWork started at 8:00 AM and ended at 5:00 PM.\nHeavy rain caused a 2 hour delay.'
    );
    setActiveTab('text');
  };

  // Web Speech API integration
  const toggleVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Falling back to simulation.');
      setVoiceTranscript('Today chainage 34+500 to 35+200 earth filling executed 700 meters. Heavy rain halted compaction for 2 hours.');
      setTextInput('Today chainage 34+500 to 35+200 earth filling executed 700 meters. Heavy rain halted compaction for 2 hours.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    if (!isListening) {
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setVoiceTranscript(transcript);
        setTextInput(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleProcessAndExtract = async () => {
    setIsProcessing(true);
    setProcessingStage('1. Ingesting raw unstructured site buffer...');
    
    await new Promise(r => setTimeout(r, 600));
    setProcessingStage('2. Running OCR & Text Normalization...');
    
    await new Promise(r => setTimeout(r, 600));
    setProcessingStage('3. Executing NLP/LLM Entity & Quantity Extraction...');

    const res = await api.extractEntities(textInput);
    if (res && res.extracted) {
      setExtractedData(res.extracted);
    }

    await new Promise(r => setTimeout(r, 400));
    setIsProcessing(false);
    navigate('/extraction');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header with Demo Scenario Quick Fill */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Multi-Modal Data Ingestion
            </span>
            <span className="text-xs text-slate-400">Target: {currentProject.name}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Site Progress Data Input (Field-to-AI Layer)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingest unstructured daily progress reports (DPR), spreadsheets, scanned logs, voice recordings, and geo-tagged site images.
          </p>
        </div>

        <button
          onClick={loadDemoScenario}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-extrabold rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-white animate-spin" />
          <span>Load SIH Demo Scenario</span>
        </button>
      </div>

      {/* Multi-Modal Tab Selectors */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'text', label: 'A. Normal Text DPR', icon: FileText },
          { id: 'excel', label: 'B. Excel / CSV File', icon: FileSpreadsheet },
          { id: 'pdf', label: 'C. PDF / Scanned Report', icon: FileUp },
          { id: 'voice', label: 'D. Voice Note Input', icon: Mic },
          { id: 'images', label: 'E. Site Photos & EXIF', icon: ImageIcon }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6">
        
        {/* TAB A: Text DPR */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Unstructured Daily Progress Report Text
              </label>
              <span className="text-[11px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                Natural Language DPR
              </span>
            </div>

            <textarea
              rows={6}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full text-sm font-sans p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-800 leading-relaxed"
              placeholder="Paste or write your raw site report here..."
            ></textarea>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-600">
              <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                <strong>Field Tip:</strong> You do not need to look up WBS codes or activity IDs. Our semantic LLM engine automatically identifies activities, chainages, quantities, weather stoppages, and equipment.
              </span>
            </div>
          </div>
        )}

        {/* TAB B: Excel / CSV */}
        {activeTab === 'excel' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-8 text-center bg-slate-50/50 cursor-pointer transition-colors">
              <FileSpreadsheet className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-800">
                Drag and drop daily site log (.xlsx, .csv)
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Supports standard MoRTH / NHAI contractor daily log spreadsheets
              </p>
              <input
                type="file"
                accept=".csv, .xlsx"
                className="hidden"
                id="csv-upload"
                onChange={(e) => setCsvFile(e.target.files[0])}
              />
              <label
                htmlFor="csv-upload"
                className="mt-4 inline-block px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
              >
                Browse Spreadsheet
              </label>
            </div>

            {/* Parsed CSV Preview Table */}
            <div>
              <div className="text-xs font-bold text-slate-700 mb-2">
                Parsed Spreadsheet Records (Sample Batch)
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Location / Chainage</th>
                      <th className="p-3">Reported Activity</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Stoppage / Weather</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {csvPreview.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="p-3 font-semibold text-slate-800">{row.date}</td>
                        <td className="p-3 font-mono">{row.chainage}</td>
                        <td className="p-3 font-bold text-indigo-700">{row.activity}</td>
                        <td className="p-3">{row.qty} {row.unit}</td>
                        <td className="p-3 text-amber-600 font-medium">{row.stoppage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB C: PDF / Scanned DPR */}
        {activeTab === 'pdf' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-8 text-center bg-slate-50/50 cursor-pointer transition-colors">
              <FileUp className="w-10 h-10 text-blue-600 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-800">
                Upload Scanned DPR / Site Sign-Off PDF
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                OCR engine automatically digitizes scanned handwriting, tabular formats, and site stamps.
              </p>
            </div>

            {/* Simulated OCR Visualizer */}
            <div className="p-4 bg-slate-900 rounded-xl text-slate-200 text-xs font-mono relative overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2 text-[10px] text-emerald-400 font-bold">
                <span>[OCR ENGINE] Tesseract / EasyOCR Pre-Scan Active</span>
                <span>CONFIDENCE: 98.4%</span>
              </div>
              <div className="space-y-1 text-slate-300">
                <div>&gt; [BBox 140, 220]: "EARTHWORK CHAINAGE 34+500 TO 35+200 COMPLETED"</div>
                <div>&gt; [BBox 140, 260]: "QUANTITY: 700 METERS EXECUTED"</div>
                <div>&gt; [BBox 140, 300]: "INCLEMENT WEATHER: 2.0 HOURS RAINFALL DOWNTIME"</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB D: Voice Note Input */}
        {activeTab === 'voice' && (
          <div className="text-center py-8 space-y-4">
            <button
              onClick={toggleVoiceRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all shadow-xl ${
                isListening
                  ? 'bg-rose-600 text-white ring-8 ring-rose-100 animate-pulse'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
              }`}
            >
              {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>

            <div>
              <div className="text-sm font-extrabold text-slate-900">
                {isListening ? 'Listening to Field Engineer audio...' : 'Click microphone to record voice DPR'}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Powered by Web Speech API. Transcribes spoken Hindi / Hinglish / English directly to text.
              </p>
            </div>

            {voiceTranscript && (
              <div className="max-w-md mx-auto p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 font-medium">
                "{voiceTranscript}"
              </div>
            )}
          </div>
        )}

        {/* TAB E: Site Images & EXIF */}
        {activeTab === 'images' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Geo-Tagged Site Photographs</span>
              <span className="text-[11px] text-slate-500">EXIF Chainage Matching</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {siteImages.map((img, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                  <div className="h-44 w-full bg-slate-100 relative">
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-mono">
                      {img.chainage} • {img.timestamp}
                    </span>
                  </div>
                  <div className="p-3 bg-white">
                    <div className="text-xs font-bold text-slate-800">{img.name}</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{img.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit & Processing Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Clicking Proceed sends raw data to the AI Extraction Engine (Section 8).
          </div>

          <button
            onClick={handleProcessAndExtract}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{processingStage}</span>
              </>
            ) : (
              <>
                <span>Extract Project Events with AI</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
