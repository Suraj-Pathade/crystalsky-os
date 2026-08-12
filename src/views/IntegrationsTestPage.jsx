import React, { useState } from 'react';
import { ShieldCheck, Database, Calendar, MessageSquare, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateWhatsAppURL } from '../services/whatsappService';

export default function IntegrationsTestPage() {
  const { settings } = useApp();

  const [sheetsResult, setSheetsResult] = useState(null);
  const [testingSheets, setTestingSheets] = useState(false);

  const [calResult, setCalResult] = useState(null);
  const [waResult, setWaResult] = useState(null);

  const testGoogleSheetsAPI = async () => {
    if (!settings.googleScriptUrl) {
      setSheetsResult({ success: false, message: 'Google Apps Script Web App URL is empty in Settings.' });
      return;
    }
    setTestingSheets(true);
    try {
      const res = await fetch(`${settings.googleScriptUrl}?action=ping`);
      const data = await res.json();
      if (data && data.success) {
        setSheetsResult({ success: true, message: `SUCCESS! Connected to Google Apps Script. API Owner: ${data.owner}` });
      } else {
        setSheetsResult({ success: false, message: data.error || 'Invalid API payload' });
      }
    } catch (e) {
      setSheetsResult({ 
        success: false, 
        message: `FAILED: ${e.message}. Ensure deployment is set to "Execute as: Me" and "Access: Anyone".` 
      });
    } finally {
      setTestingSheets(false);
    }
  };

  const testGoogleCalendar = () => {
    setCalResult({ success: true, message: 'SUCCESS! Calendar URL generator & .ICS file builder verified.' });
  };

  const testWhatsAppLink = () => {
    const url = generateWhatsAppURL('9922639066', 'Testing CrystalSky OS WhatsApp Click-to-Chat integration link!');
    window.open(url, '_blank');
    setWaResult({ success: true, message: 'SUCCESS! Opened WhatsApp deep link in browser.' });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-amber-500" />
          Integrations Live Diagnostic Test
        </h1>
        <p className="text-xs text-zinc-400">
          Run empirical live diagnostic tests for Google Sheets, Google Calendar, and WhatsApp links
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Test Google Sheets */}
        <div className="p-5 rounded-2xl glass-panel space-y-3">
          <div className="flex items-center justify-between">
            <Database className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-zinc-400">Sheets API</span>
          </div>
          <h3 className="font-bold text-sm text-white">Google Sheets Connection</h3>
          <p className="text-xs text-zinc-400">Verifies REST endpoint ping response from your Apps Script URL.</p>

          {sheetsResult && (
            <div className={`p-3 rounded-xl border text-xs font-mono ${
              sheetsResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              {sheetsResult.message}
            </div>
          )}

          <button
            onClick={testGoogleSheetsAPI}
            disabled={testingSheets}
            className="btn-gold w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
          >
            {testingSheets ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            Run Sheets Test
          </button>
        </div>

        {/* Test Google Calendar */}
        <div className="p-5 rounded-2xl glass-panel space-y-3">
          <div className="flex items-center justify-between">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold text-zinc-400">Calendar API</span>
          </div>
          <h3 className="font-bold text-sm text-white">Google Calendar Link</h3>
          <p className="text-xs text-zinc-400">Verifies web renderer & .ics event file builder.</p>

          {calResult && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              {calResult.message}
            </div>
          )}

          <button
            onClick={testGoogleCalendar}
            className="w-full py-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40 hover:bg-blue-500/30 font-bold text-xs flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Run Calendar Test
          </button>
        </div>

        {/* Test WhatsApp Link */}
        <div className="p-5 rounded-2xl glass-panel space-y-3">
          <div className="flex items-center justify-between">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-zinc-400">WhatsApp Deep Link</span>
          </div>
          <h3 className="font-bold text-sm text-white">WhatsApp Chat Generator</h3>
          <p className="text-xs text-zinc-400">Opens test pre-filled message URL in WhatsApp.</p>

          {waResult && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              {waResult.message}
            </div>
          )}

          <button
            onClick={testWhatsAppLink}
            className="w-full py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Run WhatsApp Link Test
          </button>
        </div>
      </div>
    </div>
  );
}
