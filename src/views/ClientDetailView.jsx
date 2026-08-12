import React from 'react';
import { ArrowLeft, Users, Phone, MessageSquare, Mail, MapPin, Calendar, Camera, CreditCard, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateWhatsAppURL } from '../services/whatsappService';

export default function ClientDetailView({ onBack, onOpenEventModal, onOpenPaymentModal }) {
  const { selectedClientId, clients, events, payments, setSelectedEventId, setActiveView } = useApp();

  const client = clients.find(c => c.ClientID === selectedClientId);

  if (!client) {
    return (
      <div className="p-8 text-center text-zinc-400">
        <p>Client profile not found.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-zinc-800 text-white rounded-xl text-xs">
          Back to Client Directory
        </button>
      </div>
    );
  }

  const clientEvents = events.filter(e => e.ClientID === client.ClientID);
  const totalContract = clientEvents.reduce((s, e) => s + Number(e.TotalContractValue || 0), 0);

  const clientPayments = payments.filter(p => p.ClientID === client.ClientID);
  const totalPaid = clientPayments.reduce((s, p) => s + Number(p.Amount || 0), 0);
  const pendingBalance = Math.max(0, totalContract - totalPaid);

  const handleWhatsApp = () => {
    const url = generateWhatsAppURL(client.WhatsApp || client.Phone, `Hello ${client.Name}, Greetings from CrystalSky Photography & Film!`);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Clients
      </button>

      {/* Main Profile Header */}
      <div className="p-6 rounded-2xl glass-panel-gold flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-zinc-400">Client ID: {client.ClientID}</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-0.5">{client.Name}</h1>
          <p className="text-xs text-zinc-300 font-mono mt-1">📱 {client.Phone} {client.Email ? `• ✉️ ${client.Email}` : ''}</p>
          {client.City && <p className="text-xs text-zinc-400 mt-1">📍 Location: {client.City} {client.Address ? `, ${client.Address}` : ''}</p>}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleWhatsApp}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg"
          >
            <MessageSquare className="w-4 h-4" />
            WhatsApp Client
          </button>

          <button
            onClick={onOpenEventModal}
            className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            + Add Event
          </button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl glass-panel">
          <p className="text-[10px] uppercase font-bold text-zinc-400">Total Contract Value</p>
          <p className="text-xl font-extrabold text-white mt-1">₹{totalContract.toLocaleString('en-IN')}</p>
        </div>

        <div className="p-4 rounded-xl glass-panel border-l-2 border-l-emerald-500">
          <p className="text-[10px] uppercase font-bold text-emerald-400">Total Paid</p>
          <p className="text-xl font-extrabold text-emerald-400 mt-1">₹{totalPaid.toLocaleString('en-IN')}</p>
        </div>

        <div className="p-4 rounded-xl glass-panel border-l-2 border-l-amber-500">
          <p className="text-[10px] uppercase font-bold text-amber-400">Total Pending Balance</p>
          <p className="text-xl font-extrabold text-amber-400 mt-1">₹{pendingBalance.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Client's Linked Events */}
      <div className="p-5 rounded-2xl glass-panel space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Camera className="w-4 h-4 text-amber-500" />
          Client's Booked Events ({clientEvents.length})
        </h3>

        {clientEvents.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4">No events booked for this client yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {clientEvents.map(ev => (
              <div
                key={ev.EventID}
                onClick={() => { setSelectedEventId(ev.EventID); setActiveView('event_detail'); }}
                className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/50 cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-white text-sm">{ev.EventName}</h4>
                  <p className="text-xs text-zinc-400">Date: {ev.EventDate || 'TBD'} • Venue: {ev.Venue || 'N/A'}</p>
                </div>
                <p className="font-bold text-amber-400 text-xs">₹{Number(ev.TotalContractValue || 0).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
