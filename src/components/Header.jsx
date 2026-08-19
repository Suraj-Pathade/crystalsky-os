import React, { useState } from 'react';
import { Search, Plus, RefreshCw, Sun, Moon, Database, ShieldCheck, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/storageService';

export default function Header({ onOpenQuickAdd }) {
  const { 
    searchQuery, setSearchQuery, settings, refreshData, 
    themeMode, toggleThemeMode, setActiveView, lockApp, showToast
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: 'Good Morning 🌅', sub: 'Shubh Prabhat' };
    if (hour >= 12 && hour < 17) return { text: 'Good Afternoon ☀️', sub: 'Shubh Dopahar' };
    if (hour >= 17 && hour < 22) return { text: 'Good Evening 🌆', sub: 'Shubh Sandhya' };
    return { text: 'Good Night 🌙', sub: 'Shubh Ratri' };
  };

  const greeting = getTimeBasedGreeting();

  const formattedDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const isSheetsConnected = Boolean(settings.googleScriptUrl);

  const handleManualCloudSync = async () => {
    setIsSyncing(true);
    if (settings.googleScriptUrl) {
      const liveData = await StorageService.fetchLiveDataFromSheets();
      setIsSyncing(false);
      refreshData();
      if (liveData) {
        showToast('⚡ Live data fetched from Google Sheets! Mobile & Laptop now in sync.');
      } else {
        showToast('Refreshed local data engine.', 'info');
      }
    } else {
      setIsSyncing(false);
      refreshData();
      showToast('⚠️ Connect Google Sheets URL in Settings for Laptop ↔ Mobile cloud sync!', 'warning');
    }
  };

  return (
    <header className="bg-zinc-950/95 dark:bg-zinc-950/95 light:bg-white border-b border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200 sticky top-0 z-30 px-4 md:px-6 py-3 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Dynamic Time Greeting & Owner */}
      <div>
        <h2 className="text-base md:text-lg font-extrabold text-white dark:text-white light:text-zinc-900 tracking-tight flex items-center gap-2">
          <span>{greeting.text},</span>
          <span className="text-amber-400">Pravin Ghukshe</span>
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400 font-mono mt-0.5">
          <span>📅 {formattedDate}</span>
          <span>•</span>
          {/* Live Google Sheets Active Indicator */}
          <button
            onClick={() => setActiveView('settings')}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
              isSheetsConnected
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
            }`}
          >
            <Database className="w-3 h-3" />
            <span>{isSheetsConnected ? 'Sheets Sync Live ⚡' : '⚠️ Connect Sheets (Mobile Sync)'}</span>
          </button>
        </div>
      </div>

      {/* Middle: Search Input */}
      <div className="flex-1 max-w-md hidden sm:block relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Grahak ka naam, venue, phone number, ya payment ref search karein..."
          className="w-full bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-zinc-100 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 rounded-xl pl-9 pr-4 py-2 text-xs text-white dark:text-white light:text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 transition-all"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Security Lockout Sign-out Button */}
        <button
          onClick={lockApp}
          title="Lock System & Sign Out"
          className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold hover:bg-rose-500/20 flex items-center gap-1.5 transition-all"
        >
          <Lock className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Lock System</span>
        </button>

        {/* Day / Night Theme Toggle */}
        <button
          onClick={toggleThemeMode}
          title={`Switch to ${themeMode === 'dark' ? 'Day Light' : 'Night Dark'} Mode`}
          className="p-2 rounded-xl bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 text-amber-400 hover:scale-105 transition-all"
        >
          {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Cloud Sync Button */}
        <button
          onClick={handleManualCloudSync}
          title="Sync Live Data with Google Sheets Cloud"
          className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
            isSyncing 
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-spin' 
              : 'bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 border-zinc-800 text-zinc-300 hover:text-white'
          }`}
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
        </button>

        <button
          onClick={onOpenQuickAdd}
          className="btn-gold px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">+ Action</span>
        </button>
      </div>
    </header>
  );
}
