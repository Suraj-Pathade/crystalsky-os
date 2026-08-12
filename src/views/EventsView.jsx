import React, { useState } from 'react';
import { Camera, Plus, Search, Calendar, MapPin, Phone, CreditCard, ChevronRight, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function EventsView({ onOpenEventModal }) {
  const { events, payments, setSelectedEventId, setActiveView, searchQuery } = useApp();
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredEvents = events.filter(e => {
    const matchesSearch = 
      !searchQuery ||
      (e.EventName && e.EventName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.ClientName && e.ClientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.Venue && e.Venue.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === 'ALL' || e.EventType === filterType;
    const matchesStatus = filterStatus === 'ALL' || e.EventStatus === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  }).sort((a,b) => (b.EventDate || '').localeCompare(a.EventDate || ''));

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <Camera className="w-6 h-6 text-amber-500" />
            Events & Shoot Bookings
          </h1>
          <p className="text-xs text-zinc-400">
            Manage photography bookings, event dates, contract values, and team assignments
          </p>
        </div>

        <button
          onClick={onOpenEventModal}
          className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          + Add New Event
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
        <Filter className="w-4 h-4 text-amber-500" />
        
        {/* Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
        >
          <option value="ALL">All Event Types</option>
          <option value="Wedding">Wedding</option>
          <option value="Pre-Wedding">Pre-Wedding</option>
          <option value="Engagement">Engagement</option>
          <option value="Reception">Reception</option>
          <option value="Haldi">Haldi</option>
          <option value="Sangeet">Sangeet</option>
          <option value="Corporate">Corporate</option>
          <option value="Other">Other</option>
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="Booked">Booked</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
        </select>

        <span className="ml-auto text-xs text-zinc-500 font-mono">
          Showing {filteredEvents.length} events
        </span>
      </div>

      {/* Events Grid / List */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-zinc-800 text-center space-y-3 bg-zinc-950">
          <Camera className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Events Found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            {events.length === 0 ? 'No events recorded in your database yet.' : 'No events match your current filter settings.'}
          </p>
          <button
            onClick={onOpenEventModal}
            className="btn-gold px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create First Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => {
            const evPayments = payments.filter(p => p.EventID === event.EventID);
            const totalPaid = evPayments.reduce((sum, p) => sum + Number(p.Amount || 0), 0);
            const pending = Math.max(0, Number(event.TotalContractValue || 0) - totalPaid);
            const isPaid = pending === 0 && Number(event.TotalContractValue || 0) > 0;

            return (
              <div
                key={event.EventID}
                onClick={() => { setSelectedEventId(event.EventID); setActiveView('event_detail'); }}
                className="p-5 rounded-2xl glass-panel hover:border-amber-500/50 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold tracking-wide">
                      {event.EventType || 'Shoot'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isPaid ? 'badge-paid' : pending > 0 ? 'badge-duesoon' : 'badge-upcoming'
                    }`}>
                      {isPaid ? 'PAID IN FULL' : `PENDING: ₹${pending.toLocaleString('en-IN')}`}
                    </span>
                  </div>

                  {/* Title & Client */}
                  <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                    {event.EventName}
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium">👤 Client: {event.ClientName}</p>
                </div>

                {/* Details Meta */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-800/80 text-xs text-zinc-300 font-mono">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>{event.EventDate || 'Date TBD'} ({event.StartTime || '09:00'})</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 truncate">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">{event.Venue || 'Venue not set'} {event.City ? `(${event.City})` : ''}</span>
                  </div>
                </div>

                {/* Financial Footer */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase text-zinc-500 font-bold">Contract Value</p>
                    <p className="text-sm font-bold text-white">
                      ₹{Number(event.TotalContractValue || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                    <span>Manage</span>
                    <ChevronRight className="w-4 h-4" />
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
