import React, { useState } from 'react';
import { Receipt, Plus, Filter, Calendar, Download, Trash2, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToCSV } from '../services/exportService';

export default function ExpensesView({ onOpenExpenseModal }) {
  const { expenses, events, deleteExpense, searchQuery } = useApp();

  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categoriesList = [
    'Photographer', 'Videographer', 'Candid', 'Cinematographer', 'Reel', 'Drone',
    'Video Editing', 'Photo Editing', 'Album Designing', 'Album Printing',
    'Travel', 'Fuel', 'Food', 'Equipment Rental', 'Camera Rental', 'Lens Rental',
    'Marketing', 'Software', 'Office', 'Miscellaneous'
  ];

  // Filter expenses by selected Month (YYYY-MM) and Category
  const filteredExpenses = expenses.filter(ex => {
    const exMonth = (ex.Date || '').substring(0, 7);
    const matchesMonth = !selectedMonth || exMonth === selectedMonth;
    const matchesCategory = selectedCategory === 'ALL' || ex.Category === selectedCategory;
    const matchesSearch = !searchQuery ||
      (ex.Category && ex.Category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ex.PersonVendor && ex.PersonVendor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ex.Description && ex.Description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesMonth && matchesCategory && matchesSearch;
  }).sort((a,b) => (b.Date || '').localeCompare(a.Date || ''));

  const totalMonthlyExpense = filteredExpenses.reduce((s, ex) => s + Number(ex.Amount || 0), 0);

  // Group by category for pie/progress overview
  const categoryTotals = filteredExpenses.reduce((acc, ex) => {
    const cat = ex.Category || 'Other';
    acc[cat] = (acc[cat] || 0) + Number(ex.Amount || 0);
    return acc;
  }, {});

  const handleExportCSV = () => {
    exportToCSV(filteredExpenses, `CrystalSky_Expenses_${selectedMonth}.csv`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-rose-400" />
            Monthly Expense Tracker
          </h1>
          <p className="text-xs text-zinc-400">
            Track gear rentals, freelancer payouts, travel, studio expenses, and editing costs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={() => onOpenExpenseModal()}
            className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            + Log Expense
          </button>
        </div>
      </div>

      {/* Month Picker & Category Filter */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-white">Select Month:</span>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Categories</option>
            {categoriesList.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="ml-auto text-xs font-mono text-zinc-400">
          Showing {filteredExpenses.length} records
        </div>
      </div>

      {/* Monthly Expense Stat Card */}
      <div className="p-5 rounded-2xl glass-panel border-l-4 border-l-rose-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase font-bold text-rose-400">
            Total Expense for {selectedMonth || 'Selected Period'}
          </p>
          <p className="text-3xl font-extrabold text-white mt-1">
            ₹{totalMonthlyExpense.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Category breakdown badges */}
        <div className="flex flex-wrap gap-2 max-w-xl">
          {Object.entries(categoryTotals).map(([cat, amt]) => (
            <div key={cat} className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px]">
              <span className="text-zinc-400">{cat}:</span> <strong className="text-rose-400">₹{amt.toLocaleString('en-IN')}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Expenses Table */}
      {filteredExpenses.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-zinc-800 text-center space-y-3 bg-zinc-950">
          <Receipt className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Expenses Found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            {expenses.length === 0 ? 'No expense transactions recorded in your database yet.' : `No expenses logged for ${selectedMonth}.`}
          </p>
          <button
            onClick={() => onOpenExpenseModal()}
            className="btn-gold px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Log First Expense
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 glass-panel">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/90 text-amber-400 font-bold border-b border-zinc-800">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Category & Subcategory</th>
                <th className="p-3.5">Event / Shoot</th>
                <th className="p-3.5">Paid To / Vendor</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 bg-zinc-950/60 text-zinc-200">
              {filteredExpenses.map((ex) => {
                const linkedEvent = events.find(e => e.EventID === ex.EventID);
                return (
                  <tr key={ex.ExpenseID} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="p-3.5 font-mono text-zinc-400">{ex.Date}</td>
                    <td className="p-3.5">
                      <p className="font-bold text-white">{ex.Category}</p>
                      {ex.Subcategory && <p className="text-[10px] text-zinc-400">{ex.Subcategory}</p>}
                    </td>
                    <td className="p-3.5">
                      {linkedEvent ? (
                        <span className="font-medium text-amber-400">{linkedEvent.EventName}</span>
                      ) : (
                        <span className="text-zinc-500 italic">General Business</span>
                      )}
                    </td>
                    <td className="p-3.5 text-zinc-300 font-medium">{ex.PersonVendor || 'N/A'}</td>
                    <td className="p-3.5 text-zinc-400">{ex.PaymentMethod}</td>
                    <td className="p-3.5 text-right font-extrabold text-rose-400 text-sm">
                      ₹{Number(ex.Amount).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => deleteExpense(ex.ExpenseID)}
                        title="Delete Expense"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
