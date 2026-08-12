import React, { useState } from 'react';
import { FileSpreadsheet, Download, Printer, TrendingUp, TrendingDown, Calendar, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToCSV, printElement } from '../services/exportService';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

export default function ReportsView() {
  const { events, payments, expenses, eventTeam, tasks, deliverables, financials } = useApp();
  
  const [reportType, setReportType] = useState('MONTHLY'); // MONTHLY vs WEEKLY
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));

  // Monthly Report Calculations
  const monthEvents = events.filter(e => (e.EventDate || '').startsWith(selectedMonth));
  const monthPayments = payments.filter(p => (p.PaymentDate || '').startsWith(selectedMonth));
  const monthExpenses = expenses.filter(ex => (ex.Date || '').startsWith(selectedMonth));

  const monthRevenue = monthPayments.reduce((s, p) => s + Number(p.Amount || 0), 0);
  const monthTotalExpenses = monthExpenses.reduce((s, ex) => s + Number(ex.Amount || 0), 0);
  const monthCashProfit = monthRevenue - monthTotalExpenses;

  // Category chart data
  const categoryData = Object.entries(
    monthExpenses.reduce((acc, ex) => {
      const cat = ex.Category || 'Misc';
      acc[cat] = (acc[cat] || 0) + Number(ex.Amount || 0);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#f59e0b', '#34d399', '#f87171', '#60a5fa', '#a78bfa', '#fbbf24', '#f472b6'];

  // Weekly Report Calculations (Current 7 Days)
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
  const todayStr = today.toISOString().split('T')[0];

  const weeklyEvents = events.filter(e => e.EventDate >= sevenDaysAgoStr && e.EventDate <= todayStr);
  const weeklyPayments = payments.filter(p => p.PaymentDate >= sevenDaysAgoStr && p.PaymentDate <= todayStr);
  const weeklyExpenses = expenses.filter(ex => ex.Date >= sevenDaysAgoStr && ex.Date <= todayStr);

  const weeklyRevenue = weeklyPayments.reduce((s, p) => s + Number(p.Amount || 0), 0);
  const weeklyTotalExpenses = weeklyExpenses.reduce((s, ex) => s + Number(ex.Amount || 0), 0);
  const weeklyCashProfit = weeklyRevenue - weeklyTotalExpenses;

  const weeklyCompletedTasks = tasks.filter(t => t.Status === 'COMPLETED' && t.CompletedAt >= sevenDaysAgoStr);
  const weeklyPendingTasks = tasks.filter(t => t.Status !== 'COMPLETED');

  const handlePrintReport = () => {
    printElement('printable-report-area');
  };

  const handleExportCSV = () => {
    const dataToExport = reportType === 'MONTHLY' ? monthEvents : weeklyEvents;
    exportToCSV(dataToExport, `CrystalSky_${reportType}_Report.csv`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-amber-500" />
            Financial Reports (Weekly & Monthly P&L)
          </h1>
          <p className="text-xs text-zinc-400">
            Real P&L statements, weekly performance, and event profitability analysis for Pravin Ghukshe
          </p>
        </div>

        <div className="flex items-center gap-2">
          {reportType === 'MONTHLY' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
          )}

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>

          <button
            onClick={handlePrintReport}
            className="btn-gold px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Toggle Tabs: MONTHLY P&L vs WEEKLY REPORT */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setReportType('MONTHLY')}
          className={`px-5 py-3 text-xs font-extrabold border-b-2 transition-colors ${
            reportType === 'MONTHLY'
              ? 'border-amber-500 text-amber-400 bg-amber-500/10'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          📅 Monthly P&L Statement ({selectedMonth})
        </button>

        <button
          onClick={() => setReportType('WEEKLY')}
          className={`px-5 py-3 text-xs font-extrabold border-b-2 transition-colors ${
            reportType === 'WEEKLY'
              ? 'border-amber-500 text-amber-400 bg-amber-500/10'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          📊 Weekly Business Report (Last 7 Days)
        </button>
      </div>

      {/* Printable Report Section */}
      <div id="printable-report-area" className="space-y-6">

        {/* MONTHLY P&L TAB */}
        {reportType === 'MONTHLY' && (
          <>
            <div className="p-6 rounded-2xl glass-panel-gold space-y-4">
              <h2 className="text-base font-extrabold text-amber-400">
                Monthly P&L Summary for {selectedMonth} (Pravin Ghukshe)
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <p className="text-zinc-400">Total Payments Received:</p>
                  <p className="text-xl font-extrabold text-emerald-400">₹{monthRevenue.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <p className="text-zinc-400">Total Expenses Paid:</p>
                  <p className="text-xl font-extrabold text-rose-400">₹{monthTotalExpenses.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <p className="text-zinc-400">Cash Flow Profit:</p>
                  <p className="text-xl font-extrabold text-white">₹{monthCashProfit.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <p className="text-zinc-400">Events Booked:</p>
                  <p className="text-xl font-extrabold text-amber-400">{monthEvents.length} shoots</p>
                </div>
              </div>
            </div>

            {/* Expense Distribution Chart */}
            {categoryData.length > 0 && (
              <div className="p-5 rounded-2xl glass-panel space-y-3">
                <h3 className="text-sm font-bold text-white">Expense Distribution by Category</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={85}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {categoryData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}

        {/* WEEKLY REPORT TAB */}
        {reportType === 'WEEKLY' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl glass-panel-gold space-y-4">
              <h2 className="text-base font-extrabold text-amber-400">
                Weekly Performance Summary ({sevenDaysAgoStr} to {todayStr})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <p className="text-zinc-400">Weekly Money Received:</p>
                  <p className="text-xl font-extrabold text-emerald-400">₹{weeklyRevenue.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <p className="text-zinc-400">Weekly Expenses Spent:</p>
                  <p className="text-xl font-extrabold text-rose-400">₹{weeklyTotalExpenses.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <p className="text-zinc-400">Weekly Net Cash Profit:</p>
                  <p className="text-xl font-extrabold text-white">₹{weeklyCashProfit.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <p className="text-zinc-400">Shoots Executed:</p>
                  <p className="text-xl font-extrabold text-amber-400">{weeklyEvents.length} shoots</p>
                </div>
              </div>
            </div>

            {/* Weekly Operational Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl glass-panel space-y-2">
                <h3 className="text-xs font-bold text-amber-400 uppercase">Tasks Overview</h3>
                <p className="text-xs text-zinc-300">Completed Tasks This Week: <strong className="text-emerald-400">{weeklyCompletedTasks.length}</strong></p>
                <p className="text-xs text-zinc-300">Pending Tasks Left: <strong className="text-amber-400">{weeklyPendingTasks.length}</strong></p>
              </div>

              <div className="p-5 rounded-2xl glass-panel space-y-2">
                <h3 className="text-xs font-bold text-amber-400 uppercase">Pending Financials</h3>
                <p className="text-xs text-zinc-300">Client Receivables: <strong className="text-amber-400">₹{financials.totalReceivable.toLocaleString('en-IN')}</strong></p>
                <p className="text-xs text-zinc-300">Freelancer Payables: <strong className="text-purple-400">₹{financials.teamPayables.toLocaleString('en-IN')}</strong></p>
              </div>
            </div>
          </div>
        )}

        {/* Event Profitability Table (Shown on both) */}
        <div className="p-5 rounded-2xl glass-panel space-y-4">
          <h3 className="text-sm font-bold text-white">Event Profitability Breakdown</h3>
          {events.length === 0 ? (
            <p className="text-xs text-zinc-500">No events logged in the database yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 text-amber-400 font-bold">
                  <tr>
                    <th className="p-3">Event Name</th>
                    <th className="p-3">Client</th>
                    <th className="p-3">Contract Value</th>
                    <th className="p-3">Event Expenses</th>
                    <th className="p-3">Estimated Profit</th>
                    <th className="p-3">Margin %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 bg-zinc-950 text-zinc-200">
                  {events.map(ev => {
                    const evExp = expenses.filter(x => x.EventID === ev.EventID);
                    const totalExp = evExp.reduce((s, x) => s + Number(x.Amount || 0), 0);
                    const contract = Number(ev.TotalContractValue || 0);
                    const profit = contract - totalExp;
                    const margin = contract > 0 ? ((profit / contract) * 100).toFixed(1) : 0;

                    return (
                      <tr key={ev.EventID}>
                        <td className="p-3 font-bold text-white">{ev.EventName}</td>
                        <td className="p-3 text-zinc-400">{ev.ClientName}</td>
                        <td className="p-3 font-medium">₹{contract.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-rose-400">₹{totalExp.toLocaleString('en-IN')}</td>
                        <td className="p-3 font-bold text-emerald-400">₹{profit.toLocaleString('en-IN')}</td>
                        <td className="p-3 font-mono text-amber-400">{margin}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
