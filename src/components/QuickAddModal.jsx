import React from 'react';
import { X, Users, Camera, CreditCard, Receipt, CheckSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function QuickAddModal({ isOpen, onClose, onSelectAction }) {
  if (!isOpen) return null;

  const actions = [
    { id: 'new_client', title: 'New Client', desc: 'Add client profile & contact details', icon: Users, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { id: 'new_event', title: 'New Event / Shoot', desc: 'Book wedding, pre-wedding, photoshoot', icon: Camera, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { id: 'record_payment', title: 'Record Payment', desc: 'Log advance or final client payment', icon: CreditCard, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    { id: 'add_expense', title: 'Add Expense', desc: 'Log gear, travel, freelancer expense', icon: Receipt, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
    { id: 'add_task', title: 'Add Task', desc: 'Assign editing, album design, delivery task', icon: CheckSquare, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-5 animate-modal shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>⚡</span> Quick Business Action
            </h3>
            <p className="text-xs text-zinc-400">Select what you want to record for CrystalSky</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-2.5">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => { onSelectAction(act.id); onClose(); }}
                className="w-full p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 hover:border-amber-500/50 hover:bg-zinc-900 flex items-center gap-3.5 transition-all text-left group"
              >
                <div className={`p-2.5 rounded-xl border ${act.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">{act.title}</h4>
                  <p className="text-[11px] text-zinc-400">{act.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
