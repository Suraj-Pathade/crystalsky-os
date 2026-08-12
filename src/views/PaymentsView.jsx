import React, { useState } from 'react';
import { CreditCard, Plus, Search, Filter, Printer, MessageSquare, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToCSV } from '../services/exportService';

export default function PaymentsView({ onOpenPaymentModal, onShowReceipt }) {
  const { payments, events, searchQuery } = useApp();
  const [filterMethod, setFilterMethod] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');

  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      !searchQuery ||
      (p.ClientName && p.ClientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.EventName && p.EventName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.PaymentID && p.PaymentID.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.ReferenceNumber && p.ReferenceNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMethod = filterMethod === 'ALL' || p.PaymentMethod === filterMethod;
    const matchesType = filterType === 'ALL' || p.PaymentType === filterType;

    return matchesSearch && matchesMethod && matchesType;
  }).sort((a,b) => (b.PaymentDate || '').localeCompare(a.PaymentDate || ''));

  const totalCollected = filteredPayments.reduce((s, p) => s + Number(p.Amount || 0), 0);

  const handleExportCSV = () => {
    exportToCSV(filteredPayments, 'CrystalSky_Payments_Log.csv');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            Client Payment Management
          </h1>
          <p className="text-xs text-zinc-400">
            Log advance payments, wedding day payments, final payments, and issue receipts
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
            onClick={() => onOpenPaymentModal()}
            className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            + Record Payment
          </button>
        </div>
      </div>

      {/* Financial Summary Card */}
      <div className="p-5 rounded-2xl glass-panel-gold flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase font-bold text-amber-300">Total Payments Collected</p>
          <p className="text-2xl font-extrabold text-white mt-1">
            ₹{totalCollected.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-zinc-300 font-mono mt-0.5">{filteredPayments.length} payment records</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
        <Filter className="w-4 h-4 text-emerald-400" />
        
        <select
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
        >
          <option value="ALL">All Payment Methods</option>
          <option value="UPI">UPI / GPay / PhonePe</option>
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
        >
          <option value="ALL">All Payment Types</option>
          <option value="Advance">Advance</option>
          <option value="Wedding Day">Wedding Day</option>
          <option value="Final">Final Payment</option>
          <option value="Additional">Additional</option>
        </select>
      </div>

      {/* Payment Table */}
      {filteredPayments.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-zinc-800 text-center space-y-3 bg-zinc-950">
          <CreditCard className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Payments Logged</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            No payment transaction records exist matching your filter criteria.
          </p>
          <button
            onClick={() => onOpenPaymentModal()}
            className="btn-gold px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Record First Payment
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 glass-panel">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/90 text-amber-400 font-bold border-b border-zinc-800">
              <tr>
                <th className="p-3.5">ID & Date</th>
                <th className="p-3.5">Client & Event</th>
                <th className="p-3.5">Payment Type</th>
                <th className="p-3.5">Method & Ref</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 bg-zinc-950/60 text-zinc-200">
              {filteredPayments.map((p) => (
                <tr key={p.PaymentID} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="p-3.5">
                    <p className="font-mono text-zinc-400 font-bold">{p.PaymentID}</p>
                    <p className="text-[10px] text-zinc-500">{p.PaymentDate}</p>
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-white">{p.ClientName || 'N/A'}</p>
                    <p className="text-[10px] text-zinc-400">{p.EventName || 'Event Booking'}</p>
                  </td>
                  <td className="p-3.5 font-semibold text-white">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px]">
                      {p.PaymentType || 'Advance'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <p className="font-medium text-zinc-300">{p.PaymentMethod}</p>
                    {p.ReferenceNumber && <p className="text-[10px] text-zinc-500 font-mono">Ref: {p.ReferenceNumber}</p>}
                  </td>
                  <td className="p-3.5 text-right font-extrabold text-emerald-400 text-sm">
                    ₹{Number(p.Amount).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => onShowReceipt(p)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-500 text-amber-400 font-bold text-[11px] inline-flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
