import React from 'react';
import { UserCheck, Plus, Phone, MessageSquare, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateWhatsAppURL } from '../services/whatsappService';

export default function TeamView({ onOpenTeamModal }) {
  const { team, eventTeam } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-purple-400" />
            Freelancers & Team Directory
          </h1>
          <p className="text-xs text-zinc-400">
            Photographers, videographers, reel creators, drone operators, editors, and album designers
          </p>
        </div>

        <button
          onClick={onOpenTeamModal}
          className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          + Add Team Member
        </button>
      </div>

      {/* Team Cards Grid */}
      {team.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-zinc-800 text-center space-y-3 bg-zinc-950">
          <UserCheck className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Team Members Added</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Your freelancer database is empty. Add your trusted photographers and editors.
          </p>
          <button
            onClick={onOpenTeamModal}
            className="btn-gold px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add First Team Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((member) => {
            const assignments = eventTeam.filter(et => et.PersonID === member.PersonID);
            const totalEarned = assignments.reduce((s, a) => s + Number(a.AgreedAmount || 0), 0);
            const totalPaid = assignments.reduce((s, a) => s + Number(a.PaidAmount || 0), 0);
            const pending = Math.max(0, totalEarned - totalPaid);

            const handleWhatsApp = () => {
              const url = generateWhatsAppURL(member.WhatsApp || member.Phone, `Hello ${member.Name}, regarding CrystalSky Photography shoot assignment...`);
              window.open(url, '_blank');
            };

            return (
              <div key={member.PersonID} className="p-5 rounded-2xl glass-panel space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-white">{member.Name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold">
                      {member.Role}
                    </span>
                  </div>
                  <button
                    onClick={handleWhatsApp}
                    className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-zinc-400 font-mono">📱 Phone: {member.Phone || 'N/A'}</p>

                <div className="pt-2 border-t border-zinc-800 text-xs flex justify-between">
                  <span className="text-zinc-400">Events Assigned: <strong className="text-white">{assignments.length}</strong></span>
                  <span className="text-purple-400 font-bold">Pending Pay: ₹{pending.toLocaleString('en-IN')}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
