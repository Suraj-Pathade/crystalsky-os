import React, { useState } from 'react';
import { X, Camera, Calendar, MapPin, UserPlus, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function EventModal({ isOpen, onClose, initialData = null }) {
  const { clients, saveClient, saveEvent, showToast } = useApp();

  const [selectedClientId, setSelectedClientId] = useState(initialData ? initialData.ClientID : '');
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

  const [eventName, setEventName] = useState(initialData ? initialData.EventName : '');
  const [eventType, setEventType] = useState(initialData ? initialData.EventType : 'Wedding');
  const [eventDate, setEventDate] = useState(initialData ? initialData.EventDate : new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(initialData ? initialData.StartTime : '09:00');
  const [venue, setVenue] = useState(initialData ? initialData.Venue : '');
  const [address, setAddress] = useState(initialData ? initialData.Address : '');
  const [city, setCity] = useState(initialData ? initialData.City : 'Nagpur');
  const [mapsLink, setMapsLink] = useState(initialData ? initialData.GoogleMapsLink : '');
  const [contractValue, setContractValue] = useState(initialData ? initialData.TotalContractValue : 25000);
  const [notes, setNotes] = useState(initialData ? initialData.Notes : '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    let clientID = selectedClientId;
    let clientName = '';
    let clientPhone = '';

    if (clientID === 'NEW') {
      if (!newClientName || !newClientPhone) {
        alert('Please fill new client name and phone number');
        return;
      }
      const savedClient = saveClient({ Name: newClientName, Phone: newClientPhone });
      clientID = savedClient.ClientID;
      clientName = savedClient.Name;
      clientPhone = savedClient.Phone;
    } else {
      const found = clients.find(c => c.ClientID === clientID);
      if (found) {
        clientName = found.Name;
        clientPhone = found.Phone;
      }
    }

    if (!eventName || !clientID) {
      alert('Please fill event name and select/create a client.');
      return;
    }

    const payload = {
      EventID: initialData ? initialData.EventID : undefined,
      ClientID: clientID,
      ClientName: clientName || newClientName,
      ClientPhone: clientPhone || newClientPhone,
      EventName: eventName,
      EventType: eventType,
      EventDate: eventDate,
      StartTime: startTime,
      Venue: venue,
      Address: address,
      City: city,
      GoogleMapsLink: mapsLink,
      TotalContractValue: Number(contractValue || 0),
      Notes: notes,
      EventStatus: initialData ? initialData.EventStatus : 'Booked',
      ProductionStatus: initialData ? initialData.ProductionStatus : 'BOOKED'
    };

    saveEvent(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-xl p-5 md:p-6 animate-modal shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              📸
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {initialData ? 'Edit Shoot Booking' : 'Book New Photography Event'}
              </h3>
              <p className="text-xs text-zinc-400">CrystalSky Photography & Film</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          
          {/* Client Selection */}
          <div className="space-y-1.5 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <label className="block font-bold text-amber-400">1. Select or Create Client *</label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="">-- Choose Existing Client --</option>
              {clients.map(c => (
                <option key={c.ClientID} value={c.ClientID}>{c.Name} ({c.Phone})</option>
              ))}
              <option value="NEW">+ Create New Client</option>
            </select>

            {selectedClientId === 'NEW' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <input
                  type="text"
                  placeholder="New Client Full Name"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
                <input
                  type="tel"
                  placeholder="Client Phone Number"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Event Name / Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul & Priya Wedding"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                {['Wedding', 'Pre-Wedding', 'Engagement', 'Reception', 'Haldi', 'Mehendi', 'Sangeet', 'Birthday', 'Corporate', 'Other'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Event Date *</label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Venue & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Venue Name</label>
              <input
                type="text"
                placeholder="e.g. Radisson Blu Lawn"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">City</label>
              <input
                type="text"
                placeholder="e.g. Nagpur / Pune"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Google Maps Location Link (Optional)</label>
            <input
              type="url"
              placeholder="https://maps.app.goo.gl/..."
              value={mapsLink}
              onChange={(e) => setMapsLink(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Total Contract Value */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
            <label className="block font-bold text-amber-400">Total Contract Value (₹) *</label>
            <input
              type="number"
              required
              min="0"
              value={contractValue}
              onChange={(e) => setContractValue(e.target.value)}
              placeholder="e.g. 100000"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-extrabold text-sm focus:outline-none focus:border-amber-500"
            />
            <p className="text-[10px] text-amber-300/80">Can be edited anytime per client agreement.</p>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Shoot Notes / Requirements</label>
            <textarea
              rows="2"
              placeholder="Traditional team: 2 Photographers, 1 Videographer, 1 Reel maker..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full btn-gold py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Event Booking
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
