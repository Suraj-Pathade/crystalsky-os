import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, RefreshCw, Smartphone, Database, Calendar, MessageSquare, ArrowRight, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/storageService';

export default function SetupWizard({ onComplete }) {
  const { settings, updateSettings, showToast } = useApp();

  const [scriptUrl, setScriptUrl] = useState(settings.googleScriptUrl || '');
  const [testingSheets, setTestingSheets] = useState(false);
  const [sheetsStatus, setSheetsStatus] = useState(settings.googleScriptUrl ? 'Connected' : 'Not Connected');
  const [sheetsMessage, setSheetsMessage] = useState('');

  const [testingCalendar, setTestingCalendar] = useState(false);
  const [calendarStatus, setCalendarStatus] = useState('Available');

  const [whatsappStatus, setWhatsappStatus] = useState('Available');

  // Test Google Sheets Connection
  const testGoogleSheets = async () => {
    if (!scriptUrl) {
      setSheetsStatus('Not Connected');
      setSheetsMessage('Please enter your Google Apps Script Web App URL first.');
      return;
    }
    setTestingSheets(true);
    try {
      const res = await fetch(`${scriptUrl}?action=ping`);
      const data = await res.json();
      if (data && data.success) {
        setSheetsStatus('Connected');
        setSheetsMessage(`Successfully connected! API Owner: ${data.owner}`);
        updateSettings({ googleScriptUrl: scriptUrl });
        showToast('Google Sheets connected successfully!');
      } else {
        setSheetsStatus('Error');
        setSheetsMessage(data.error || 'Connection test returned invalid payload.');
      }
    } catch (e) {
      setSheetsStatus('Error');
      setSheetsMessage(`Connection failed: ${e.message}. Ensure your script is deployed as Web App to "Anyone".`);
    } finally {
      setTestingSheets(false);
    }
  };

  // Initialize Sheet Structure
  const initializeSheets = async () => {
    if (!scriptUrl) {
      alert('Please configure & test Google Script Web App URL first.');
      return;
    }
    setTestingSheets(true);
    try {
      const res = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'initializeSystem' }),
        mode: 'no-cors'
      });
      showToast('Sheet structure initialization command sent!');
      setSheetsStatus('Connected');
    } catch (e) {
      alert('Initialization error: ' + e.message);
    } finally {
      setTestingSheets(false);
    }
  };

  const handleFinish = () => {
    updateSettings({ googleScriptUrl: scriptUrl });
    showToast('Setup complete! Welcome to CrystalSky OS.');
    onComplete();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center border-b border-zinc-800 pb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl mx-auto shadow-xl shadow-amber-500/20 mb-3">
            📸
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-white">
            WELCOME TO <span className="text-amber-500">CRYSTALSKY OS</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Photography & Film Business Management System
          </p>
          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
            <span>Owner: Suraj Pathade</span>
            <span>•</span>
            <span>📱 9922639066</span>
          </div>
        </div>

        {/* Integration Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Google Sheets */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <Database className="w-5 h-5 text-amber-400" />
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                sheetsStatus === 'Connected' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {sheetsStatus}
              </span>
            </div>
            <h4 className="text-xs font-bold text-white">Google Sheets API</h4>
            <p className="text-[10px] text-zinc-400 mt-1">Primary database backend</p>
          </div>

          {/* Google Calendar */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {calendarStatus}
              </span>
            </div>
            <h4 className="text-xs font-bold text-white">Google Calendar</h4>
            <p className="text-[10px] text-zinc-400 mt-1">Direct web & API sync</p>
          </div>

          {/* WhatsApp */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {whatsappStatus}
              </span>
            </div>
            <h4 className="text-xs font-bold text-white">WhatsApp Chat</h4>
            <p className="text-[10px] text-zinc-400 mt-1">Instant pre-filled links</p>
          </div>
        </div>

        {/* Step-by-Step Configuration */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <span>⚙️</span> Setup Instructions & Google Apps Script Connection
          </h3>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <label className="block text-xs font-medium text-zinc-300">
              Google Apps Script Web App URL (Optional for Local Mode, Required for Sheets Sync):
            </label>
            <input
              type="url"
              value={scriptUrl}
              onChange={(e) => setScriptUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
            />
            {sheetsMessage && (
              <p className={`text-[11px] font-mono ${sheetsStatus === 'Connected' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {sheetsMessage}
              </p>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={testGoogleSheets}
                disabled={testingSheets}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                {testingSheets ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5 text-amber-400" />}
                Test Connection
              </button>

              <button
                onClick={initializeSheets}
                disabled={testingSheets || !scriptUrl}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30 text-xs font-semibold flex items-center gap-1.5"
              >
                Create 14 Sheet Tabs
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed">
            💡 <strong>Offline / Instant Mode:</strong> You can click <strong>"Finish Setup & Launch"</strong> right now! All your data will save safely in your browser immediately. You can paste your Google Apps Script URL later in Settings anytime.
          </div>
        </div>

        {/* Launch Button */}
        <div className="pt-2">
          <button
            onClick={handleFinish}
            className="w-full btn-gold py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
          >
            Finish Setup & Launch CrystalSky OS
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
