import React from 'react';
import { Users, Plus, Phone, MessageSquare, Mail, MapPin, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateWhatsAppURL } from '../services/whatsappService';

export default function ClientsView({ onOpenClientModal }) {
  const { clients, events, payments, setSelectedClientId, setActiveView, searchQuery } = useApp();

  const filteredClients = clients.filter(c => {
    return !searchQuery || 
      (c.Name && c.Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.Phone && c.Phone.includes(searchQuery)) ||
      (c.City && c.City.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-500" />
            Client Directory
          </h1>
          <p className="text-xs text-zinc-400">
            Manage photography clients, multi-event history, and financial ledgers
          </p>
        </div>

        <button
          onClick={onOpenClientModal}
          className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          + Add New Client
        </button>
      </div>

      {/* Clients List / Cards Grid */}
      {filteredClients.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-zinc-800 text-center space-y-3 bg-zinc-950">
          <Users className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Clients Found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            {clients.length === 0 ? 'Your database has no client profiles yet.' : 'No clients match your search query.'}
          </p>
          <button
            onClick={onOpenClientModal}
            className="btn-gold px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create First Client Profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const clientEvents = events.filter(e => e.ClientID === client.ClientID);
            const totalContract = clientEvents.reduce((s, e) => s + Number(e.TotalContractValue || 0), 0);
            
            const clientPayments = payments.filter(p => p.ClientID === client.ClientID);
            const totalPaid = clientPayments.reduce((s, p) => s + Number(p.Amount || 0), 0);
            const pending = Math.max(0, totalContract - totalPaid);

            const handleWhatsAppClick = (e) => {
              e.stopPropagation();
              const url = generateWhatsAppURL(client.WhatsApp || client.Phone, `Hello ${client.Name}, Greetings from CrystalSky Photography & Film!`);
              window.open(url, '_blank');
            };

            return (
              <div
                key={client.ClientID}
                onClick={() => { setSelectedClientId(client.ClientID); setActiveView('client_detail'); }}
                className="p-5 rounded-2xl glass-panel hover:border-amber-500/50 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono text-zinc-500">ID: {client.ClientID}</span>
                    <button
                      onClick={handleWhatsAppClick}
                      className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1 hover:bg-emerald-500/30"
                    >
                      <MessageSquare className="w-3 h-3" />
                      WhatsApp
                    </button>
                  </div>

                  <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors">
                    {client.Name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">📱 {client.Phone}</p>
                </div>

                <div className="space-y-1 text-xs text-zinc-400 border-t border-zinc-800/80 pt-2">
                  <p>Events Booked: <strong className="text-white">{clientEvents.length} shoots</strong></p>
                  {client.City && <p className="truncate">City: {client.City}</p>}
                </div>

                {/* Financial Summary */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">Total Contract</p>
                    <p className="font-bold text-white">₹{totalContract.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-amber-500 font-bold uppercase">Pending</p>
                    <p className="font-bold text-amber-400">₹{pending.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
