import React from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Calendar, AlertTriangle, 
  CheckCircle2, Clock, Plus, ArrowRight, Camera, Users, CreditCard, Receipt, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function DashboardView({ onOpenQuickAdd }) {
  const { 
    financials, events, payments, expenses, tasks, clients,
    setActiveView, setSelectedEventId, loadDemoData
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // Operational metrics calculated from actual data
  const todayEvents = events.filter(e => e.EventDate === todayStr);
  const upcomingEvents = events.filter(e => e.EventDate >= todayStr).sort((a,b) => a.EventDate.localeCompare(b.EventDate)).slice(0, 5);

  const overduePayments = events.filter(e => {
    const evPayments = payments.filter(p => p.EventID === e.EventID);
    const paid = evPayments.reduce((s, p) => s + Number(p.Amount || 0), 0);
    const pending = Number(e.TotalContractValue || 0) - paid;
    return pending > 0 && e.EventDate < todayStr;
  });

  const overdueTasks = tasks.filter(t => t.Status !== 'COMPLETED' && t.DueDate < todayStr);

  const todayPayments = payments.filter(p => p.PaymentDate === todayStr);
  const todayExpenses = expenses.filter(ex => ex.Date === todayStr);

  // Financial Chart Data
  const chartData = [
    { name: 'Total Contract', value: financials.totalContractValue },
    { name: 'Received Cash', value: financials.totalReceived },
    { name: 'Client Receivable', value: financials.totalReceivable },
    { name: 'Total Expenses', value: financials.totalExpenses },
    { name: 'Est. Net Profit', value: financials.estimatedContractProfit }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/60 border border-amber-500/30 shadow-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
            CRYSTAL<span className="text-amber-500">SKY</span> OS Overview
          </h1>
          <p className="text-xs text-zinc-300 mt-1">
            Real-time financial dashboard & shoot console for <strong>Suraj Pathade (9922639066)</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => onOpenQuickAdd('new_event')}
            className="flex-1 md:flex-none btn-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            + Book Shoot
          </button>

          <button
            onClick={() => onOpenQuickAdd('record_payment')}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-extrabold flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Record Payment
          </button>
        </div>
      </div>

      {/* 3-Step Visual Workflow Banner for High Visibility */}
      <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <span>⚡</span> How CrystalSky OS Solves Your Business Problems:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
            <span className="font-extrabold text-amber-400 text-sm">1. Book Shoot & Contract</span>
            <p className="text-[11px] text-zinc-400 mt-1">Set total agreed shoot price (e.g. ₹1,00,000) & event date.</p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
            <span className="font-extrabold text-emerald-400 text-sm">2. Payments & WhatsApp</span>
            <p className="text-[11px] text-zinc-400 mt-1">Log advance payments. System calculates balance & generates WhatsApp receipts.</p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
            <span className="font-extrabold text-rose-400 text-sm">3. Expenses & Net Profit</span>
            <p className="text-[11px] text-zinc-400 mt-1">Log gear, travel & freelancer payables. System computes exact Net Profit & Margin.</p>
          </div>
        </div>
      </div>

      {/* Financial KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* Total Contract */}
        <div className="p-4 rounded-xl glass-panel border-t-2 border-t-zinc-400">
          <p className="text-[10px] uppercase font-bold text-zinc-400">Total Contract Value</p>
          <p className="text-xl md:text-2xl font-extrabold text-white mt-1">
            ₹{financials.totalContractValue.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-zinc-400 mt-1">{events.length} shoots booked</p>
        </div>

        {/* Received */}
        <div className="p-4 rounded-xl glass-panel border-t-2 border-t-emerald-500 bg-emerald-500/5">
          <p className="text-[10px] uppercase font-bold text-emerald-400">Money Received</p>
          <p className="text-xl md:text-2xl font-extrabold text-emerald-400 mt-1">
            ₹{financials.totalReceived.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-zinc-400 mt-1">{payments.length} payments logged</p>
        </div>

        {/* Receivables */}
        <div className="p-4 rounded-xl glass-panel border-t-2 border-t-amber-500 bg-amber-500/5">
          <p className="text-[10px] uppercase font-bold text-amber-400">Client Receivables</p>
          <p className="text-xl md:text-2xl font-extrabold text-amber-400 mt-1">
            ₹{financials.totalReceivable.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-zinc-400 mt-1">Money clients owe you</p>
        </div>

        {/* Expenses */}
        <div className="p-4 rounded-xl glass-panel border-t-2 border-t-rose-500 bg-rose-500/5">
          <p className="text-[10px] uppercase font-bold text-rose-400">Total Expenses</p>
          <p className="text-xl md:text-2xl font-extrabold text-rose-400 mt-1">
            ₹{financials.totalExpenses.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-zinc-400 mt-1">{expenses.length} expenses logged</p>
        </div>

        {/* Contract Profit */}
        <div className="p-4 rounded-xl glass-panel-gold">
          <p className="text-[10px] uppercase font-bold text-amber-300">Est. Net Profit</p>
          <p className="text-xl md:text-2xl font-extrabold text-white mt-1">
            ₹{financials.estimatedContractProfit.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-amber-400 font-bold mt-1">
            Margin: {financials.contractProfitMargin}%
          </p>
        </div>

        {/* Team Payables */}
        <div className="p-4 rounded-xl glass-panel border-t-2 border-t-purple-500 bg-purple-500/5">
          <p className="text-[10px] uppercase font-bold text-purple-400">Team Payables</p>
          <p className="text-xl md:text-2xl font-extrabold text-purple-400 mt-1">
            ₹{financials.teamPayables.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-zinc-400 mt-1">Money to pay team</p>
        </div>
      </div>

      {/* Operational Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Shoot Summary */}
        <div className="p-5 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              Today's Business ({todayStr})
            </h3>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">LIVE</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-400">Shoots Today:</span>
              <span className="font-bold text-white">{todayEvents.length} shoots</span>
            </div>

            <div className="flex justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-400">Payments Today:</span>
              <span className="font-bold text-emerald-400">₹{todayPayments.reduce((s,p)=>s+Number(p.Amount),0).toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-400">Expenses Today:</span>
              <span className="font-bold text-rose-400">₹{todayExpenses.reduce((s,e)=>s+Number(e.Amount),0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Overdue Alerts */}
        <div className="p-5 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Action & Payment Alerts
            </h3>
            <span className="text-[10px] text-rose-400 font-bold">Priority</span>
          </div>

          {overduePayments.length === 0 && overdueTasks.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              No overdue payments or tasks! All clear.
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              {overduePayments.map(e => (
                <div key={e.EventID} className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{e.EventName}</p>
                    <p className="text-[10px] text-rose-300">Client: {e.ClientName}</p>
                  </div>
                  <button 
                    onClick={() => setActiveView('receivables')}
                    className="px-2.5 py-1 rounded bg-rose-500 text-black font-extrabold text-[10px]"
                  >
                    Reminder
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Shoots Timeline */}
        <div className="p-5 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-400" />
              Upcoming Shoots
            </h3>
            <button 
              onClick={() => setActiveView('events')}
              className="text-[11px] text-amber-400 hover:underline font-bold"
            >
              View All
            </button>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-500">
              No upcoming shoots booked yet.
              <button 
                onClick={() => onOpenQuickAdd('new_event')}
                className="block mx-auto mt-2 text-amber-400 hover:underline font-bold"
              >
                + Book First Shoot
              </button>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              {upcomingEvents.map(e => (
                <div 
                  key={e.EventID}
                  onClick={() => { setSelectedEventId(e.EventID); setActiveView('event_detail'); }}
                  className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div>
                    <p className="font-bold text-white">{e.EventName}</p>
                    <p className="text-[10px] text-zinc-400">{e.ClientName} • {e.Venue || 'Venue TBD'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-amber-400 font-bold">{e.EventDate}</p>
                    <p className="text-[10px] text-zinc-500">{e.EventType}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Financial Bar Chart (When Data Exists) */}
      {events.length > 0 ? (
        <div className="p-5 rounded-2xl glass-panel space-y-4">
          <h3 className="text-sm font-bold text-white">Financial Summary Visual Chart</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} />
                <YAxis stroke="#a1a1aa" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px' }}
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                />
                <Bar dataKey="value" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        /* Prominent Empty State with Demo Button */
        <div className="p-10 rounded-2xl border border-dashed border-amber-500/40 text-center space-y-3 bg-zinc-950">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">
            📸
          </div>
          <h3 className="text-base font-extrabold text-white">Welcome, Suraj! Your System is Ready</h3>
          <p className="text-xs text-zinc-300 max-w-md mx-auto">
            You can load <strong>realistic sample CrystalSky data</strong> right now with 1 click to see all graphs and reports in action, OR start adding your real clients directly!
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={loadDemoData}
              className="btn-gold px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              ⚡ Load Sample CrystalSky Demo Data
            </button>
            <button
              onClick={() => onOpenQuickAdd('new_event')}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold text-xs hover:border-amber-500"
            >
              + Book Real Shoot
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
