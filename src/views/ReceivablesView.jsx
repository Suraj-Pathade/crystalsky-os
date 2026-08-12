import React from 'react';
import { TrendingUp, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateWhatsAppURL, buildPaymentReminderMessage } from '../services/whatsappService';

export default function ReceivablesView() {
  const { events, payments } = useApp();
  const todayStr = new Date().toISOString().split('T')[0];

  const receivablesList = events.map(e => {
    const evPayments = payments.filter(p => p.EventID === e.EventID);
    const paid = evPayments.reduce((s, p) => s + Number(p.Amount || 0), 0);
    const pending = Math.max(0, Number(e.TotalContractValue || 0) - paid);
    
    let status = 'PAID';
    if (pending > 0) {
      if (e.EventDate < todayStr) status = 'OVERDUE';
      else if (e.EventDate === todayStr) status = 'DUE TODAY';
      else status = 'DUE SOON';
    }

    return {
      ...e,
      PaidAmount: paid,
      PendingAmount: pending,
      ReceivableStatus: status
    };
  }).filter(item => item.PendingAmount > 0).sort((a,b) => {
    const order = { 'OVERDUE': 1, 'DUE TODAY': 2, 'DUE SOON': 3, 'PAID': 4 };
    return (order[a.ReceivableStatus] || 9) - (order[b.ReceivableStatus] || 9);
  });

  const totalReceivables = receivablesList.reduce((s, r) => s + r.PendingAmount, 0);

  const handleSendReminder = (item) => {
    const msg = buildPaymentReminderMessage({
      clientName: item.ClientName,
      eventName: item.EventName,
      eventDate: item.EventDate,
      totalContract: item.TotalContractValue,
      totalPaid: item.PaidAmount,
      totalPending: item.PendingAmount,
      isOverdue: item.ReceivableStatus === 'OVERDUE'
    });

    const url = generateWhatsAppURL(item.ClientPhone, msg);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-amber-400" />
          Client Receivables (Money I Have To Receive)
        </h1>
        <p className="text-xs text-zinc-400">
          Overdue and upcoming client payment tracking with instant WhatsApp reminders
        </p>
      </div>

      {/* Summary Box */}
      <div className="p-5 rounded-2xl glass-panel-gold flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase font-bold text-amber-300">Total Pending Client Receivables</p>
          <p className="text-3xl font-extrabold text-white mt-1">
            ₹{totalReceivables.toLocaleString('en-IN')}
          </p>
        </div>
        <span className="text-xs font-mono text-zinc-300">{receivablesList.length} clients with pending balance</span>
      </div>

      {/* Receivables Table */}
      {receivablesList.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-zinc-800 text-center space-y-3 bg-zinc-950">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">All Client Payments Collected!</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            There are zero pending client receivables in your business database right now.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 glass-panel">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/90 text-amber-400 font-bold border-b border-zinc-800">
              <tr>
                <th className="p-3.5">Client & Event</th>
                <th className="p-3.5">Event Date</th>
                <th className="p-3.5">Contract Value</th>
                <th className="p-3.5">Paid Amount</th>
                <th className="p-3.5">Pending Balance</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 bg-zinc-950/60 text-zinc-200">
              {receivablesList.map((item) => (
                <tr key={item.EventID} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="p-3.5">
                    <p className="font-bold text-white">{item.ClientName}</p>
                    <p className="text-[10px] text-zinc-400">{item.EventName}</p>
                  </td>
                  <td className="p-3.5 font-mono text-zinc-300">{item.EventDate || 'TBD'}</td>
                  <td className="p-3.5 font-medium">₹{Number(item.TotalContractValue || 0).toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-emerald-400">₹{item.PaidAmount.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 font-extrabold text-amber-400 text-sm">
                    ₹{item.PendingAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 font-bold">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      item.ReceivableStatus === 'OVERDUE' ? 'badge-overdue' : 'badge-duesoon'
                    }`}>
                      {item.ReceivableStatus}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => handleSendReminder(item)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1 mx-auto"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Send Reminder
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
