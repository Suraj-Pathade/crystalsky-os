import React from 'react';
import { TrendingDown, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PayablesView() {
  const { eventTeam, events, saveEventTeamAssignment, showToast } = useApp();

  const payables = eventTeam.filter(et => Number(et.PendingAmount || 0) > 0);
  const totalPayableAmount = payables.reduce((s, p) => s + Number(p.PendingAmount || 0), 0);

  const handleRecordPayout = (item) => {
    const amountStr = prompt(`Enter amount paid to ${item.PersonName} for ${item.Role}:`, item.PendingAmount);
    if (!amountStr || isNaN(amountStr) || Number(amountStr) <= 0) return;

    const paidAmt = Number(amountStr);
    const newPaid = Number(item.PaidAmount || 0) + paidAmt;
    
    saveEventTeamAssignment({
      ...item,
      PaidAmount: newPaid,
      PaymentDate: new Date().toISOString().split('T')[0]
    });

    showToast(`Recorded payout of ₹${paidAmt.toLocaleString('en-IN')} to ${item.PersonName}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
          <TrendingDown className="w-6 h-6 text-purple-400" />
          Team & Vendor Payables (Money I Have To Pay)
        </h1>
        <p className="text-xs text-zinc-400">
          Track agreed rates vs paid amounts vs pending balances for freelancers, editors & printers
        </p>
      </div>

      {/* Summary Box */}
      <div className="p-5 rounded-2xl glass-panel border-l-4 border-l-purple-500 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase font-bold text-purple-400">Total Freelancer Pending Payables</p>
          <p className="text-3xl font-extrabold text-white mt-1">
            ₹{totalPayableAmount.toLocaleString('en-IN')}
          </p>
        </div>
        <span className="text-xs font-mono text-zinc-400">{payables.length} pending payouts</span>
      </div>

      {/* Payables Table */}
      {payables.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-zinc-800 text-center space-y-3 bg-zinc-950">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">All Team Payouts Cleared!</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            You currently have zero pending freelancer or vendor payables.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 glass-panel">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/90 text-amber-400 font-bold border-b border-zinc-800">
              <tr>
                <th className="p-3.5">Person Name</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Event</th>
                <th className="p-3.5">Agreed Fee</th>
                <th className="p-3.5">Paid So Far</th>
                <th className="p-3.5">Pending Amount</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 bg-zinc-950/60 text-zinc-200">
              {payables.map((item) => {
                const linkedEv = events.find(e => e.EventID === item.EventID);
                return (
                  <tr key={item.AssignmentID} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="p-3.5 font-bold text-white">{item.PersonName}</td>
                    <td className="p-3.5 font-semibold text-purple-400">{item.Role}</td>
                    <td className="p-3.5 text-zinc-300">{linkedEv ? linkedEv.EventName : item.EventID}</td>
                    <td className="p-3.5">₹{Number(item.AgreedAmount || 0).toLocaleString('en-IN')}</td>
                    <td className="p-3.5 text-emerald-400">₹{Number(item.PaidAmount || 0).toLocaleString('en-IN')}</td>
                    <td className="p-3.5 font-extrabold text-amber-400 text-sm">₹{Number(item.PendingAmount || 0).toLocaleString('en-IN')}</td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleRecordPayout(item)}
                        className="btn-gold px-3 py-1 rounded-lg text-xs font-bold"
                      >
                        Record Payout
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
