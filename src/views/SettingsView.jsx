import React, { useState } from 'react';
import { Settings, Database, Calendar, Smartphone, Download, RefreshCw, Check, Trash2, Share2, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/storageService';
import { generateWhatsAppURL } from '../services/whatsappService';

export default function SettingsView({ onOpenIntegrationsTest, onOpenSetupWizard }) {
  const { settings, updateSettings, showToast, refreshData, clearDatabase } = useApp();

  const [ownerName, setOwnerName] = useState(settings.ownerName || 'Pravin Ghukshe');
  const [ownerPhone, setOwnerPhone] = useState(settings.ownerPhone || '8412850833');
  const [scriptUrl, setScriptUrl] = useState(settings.googleScriptUrl || '');
  const [calendarId, setCalendarId] = useState(settings.googleCalendarId || '');

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({
      ownerName,
      ownerPhone,
      googleScriptUrl: scriptUrl,
      googleCalendarId: calendarId
    });
  };

  const handleExportBackup = () => {
    const data = {
      settings: StorageService.getSettings(),
      clients: StorageService.getClients(),
      events: StorageService.getEvents(),
      payments: StorageService.getPayments(),
      expenses: StorageService.getExpenses(),
      team: StorageService.getTeam(),
      eventTeam: StorageService.getEventTeamAssignments(),
      tasks: StorageService.getTasks(),
      deliverables: StorageService.getDeliverables(),
      exportedAt: new Date().toISOString()
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CrystalSky_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showToast('Database backup downloaded!');
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data and reset to a clean empty database?')) {
      clearDatabase();
    }
  };

  // Generate 1-Click Mobile Cloud Sync Link
  const mobileSyncUrl = scriptUrl
    ? `${window.location.origin}${window.location.pathname}?scriptUrl=${encodeURIComponent(scriptUrl)}`
    : '';

  const handleSendMobileSyncWhatsApp = () => {
    if (!mobileSyncUrl) {
      alert('Please enter your Google Apps Script Web App URL first.');
      return;
    }

    const msg = `⚡ *CRYSTALSKY OS - 1-CLICK MOBILE CLOUD SYNC LINK*

Namaste Pravin ji,

Open this link on your Mobile Phone to automatically sync all Laptop clients, shoots, and freelancers from Google Sheets:

👇 *Click to Activate Mobile Sync:*
${mobileSyncUrl}

Pravin Ghukshe (8412850833)`;

    const url = generateWhatsAppURL(ownerPhone, msg);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-500" />
          Settings & Integration Configuration
        </h1>
        <p className="text-xs text-zinc-400">
          Manage business info, Google Apps Script API endpoints, Google Calendar, and database backups
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business & Owner Info Form */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>👤</span> Owner & Business Details
          </h3>

          <form onSubmit={handleSave} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Business Name</label>
              <input
                type="text"
                disabled
                value="CrystalSky Photography & Film"
                className="w-full bg-zinc-900 border border-zinc-800 text-amber-400 font-bold rounded-xl px-3 py-2 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Owner Name *</label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Phone / WhatsApp Number *</label>
              <input
                type="tel"
                required
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="btn-gold px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 w-full"
              >
                <Check className="w-4 h-4" />
                Save Business Settings
              </button>
            </div>
          </form>
        </div>

        {/* Google Apps Script & Mobile Sync Section */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            Google Sheets & Mobile Cloud Sync
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Google Apps Script Web App URL *</label>
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={scriptUrl}
                onChange={(e) => setScriptUrl(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 font-mono text-[11px] focus:outline-none focus:border-amber-500"
              />
            </div>

            {scriptUrl && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <Smartphone className="w-4 h-4" />
                  1-Click Mobile Cloud Sync Ready!
                </p>
                <p className="text-[10px] text-zinc-300">
                  Send this link to your phone via WhatsApp. Opening it once on Mobile will connect your Google Sheet automatically!
                </p>
                <button
                  type="button"
                  onClick={handleSendMobileSyncWhatsApp}
                  className="w-full py-2 rounded-lg bg-emerald-500 text-black font-extrabold text-[11px] flex items-center justify-center gap-1.5 hover:bg-emerald-400"
                >
                  <MessageSquare className="w-4 h-4" />
                  Send 1-Click Mobile Sync Link to WhatsApp
                </button>
              </div>
            )}

            <div className="pt-2 space-y-2">
              <button
                onClick={onOpenIntegrationsTest}
                className="w-full py-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-bold flex items-center justify-center gap-2"
              >
                Launch Integrations Test Page
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Database Backup & Reset Section */}
      <div className="p-6 rounded-2xl glass-panel space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-400" />
          Database Backup & Production Reset
        </h3>
        <p className="text-xs text-zinc-400">
          Download a complete JSON export of all clients, events, payments, expenses, and team assignments for offline backup.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportBackup}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold text-xs flex items-center gap-2 hover:border-emerald-500"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Download Complete Database Backup (.JSON)
          </button>

          <button
            onClick={handleClearData}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-rose-400 font-bold text-xs flex items-center gap-2 hover:bg-rose-500/20 hover:border-rose-500/40"
          >
            <Trash2 className="w-4 h-4" />
            Reset to Clean Empty Database
          </button>
        </div>
      </div>
    </div>
  );
}
