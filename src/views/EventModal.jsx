import React, { useState, useRef } from 'react';
import { X, Camera, Calendar as CalendarIcon, MapPin, UserPlus, Check, MessageSquare, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateWhatsAppURL, buildTeamNotificationMessage } from '../services/whatsappService';

export default function EventModal({ isOpen, onClose, initialData = null }) {
  const { clients, team, saveClient, saveEvent, saveEventTeamAssignment, showToast } = useApp();
  const dateInputRef = useRef(null);

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

  // Optional Team Assignments State
  const [assignedTeamMembers, setAssignedTeamMembers] = useState([]);

  if (!isOpen) return null;

  const handleAddTeamRow = () => {
    setAssignedTeamMembers(prev => [
      ...prev,
      { personId: '', personName: '', phone: '', role: 'Candid Photographer', agreedAmount: 5000 }
    ]);
  };

  const handleRemoveTeamRow = (index) => {
    setAssignedTeamMembers(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleTeamMemberSelect = (index, personId) => {
    const found = team.find(t => t.PersonID === personId);
    setAssignedTeamMembers(prev => {
      const copy = [...prev];
      if (found) {
        copy[index].personId = found.PersonID;
        copy[index].personName = found.Name;
        copy[index].phone = found.Phone || found.WhatsApp || '';
        copy[index].role = found.Role || 'Photographer';
      }
      return copy;
    });
  };

  const handleTeamFieldChange = (index, field, value) => {
    setAssignedTeamMembers(prev => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const handleSendWhatsAppNotice = (member) => {
    const msg = buildTeamNotificationMessage({
      teamMemberName: member.personName || 'Team Member',
      role: member.role,
      eventName: eventName || 'Shoot Booking',
      eventDate: eventDate,
      startTime: startTime,
      venue: venue,
      address: address,
      googleMapsLink: mapsLink,
      clientName: selectedClientId === 'NEW' ? newClientName : (clients.find(c => c.ClientID === selectedClientId)?.Name || ''),
      clientPhone: selectedClientId === 'NEW' ? newClientPhone : (clients.find(c => c.ClientID === selectedClientId)?.Phone || ''),
      agreedAmount: member.agreedAmount
    });

    const url = generateWhatsAppURL(member.phone || '8412850833', msg);
    window.open(url, '_blank');
  };

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

    const savedEvent = saveEvent(payload);

    // Save optional team assignments if selected
    if (savedEvent && assignedTeamMembers.length > 0) {
      assignedTeamMembers.forEach(tm => {
        if (tm.personId && tm.personName) {
          saveEventTeamAssignment({
            EventID: savedEvent.EventID,
            PersonID: tm.personId,
            PersonName: tm.personName,
            Role: tm.role,
            AgreedAmount: Number(tm.agreedAmount || 0),
            PaidAmount: 0
          });
        }
      });
    }

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
              <p className="text-xs text-zinc-400">CrystalSky Photography & Film (Pravin Ghukshe)</p>
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
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            )}
          </div>

          {/* Event Name & Type */}
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

          {/* Calendar Graphic Date Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Event Date (Calendar Picker) *</label>
              <div className="relative flex items-center">
                <input
                  ref={dateInputRef}
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-3 pr-10 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (dateInputRef.current && dateInputRef.current.showPicker) {
                      dateInputRef.current.showPicker();
                    }
                  }}
                  title="Click to open interactive Graphic Calendar Picker"
                  className="absolute right-2 p-1.5 rounded-lg bg-zinc-800 text-amber-400 hover:bg-zinc-700"
                >
                  <CalendarIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
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
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono text-[11px]"
            />
          </div>

          {/* Total Contract Value */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
            <label className="block font-bold text-amber-400">Total Contract Package Value (₹) *</label>
            <input
              type="number"
              required
              min="0"
              value={contractValue}
              onChange={(e) => setContractValue(e.target.value)}
              placeholder="e.g. 150000"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-extrabold text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* OPTIONAL TEAM ASSIGNMENT SECTION WITH WHATSAPP DISPATCH */}
          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-400 block text-xs">Assign Shoot Team (Optional)</span>
                <span className="text-[10px] text-zinc-400">Select team members & send direct WhatsApp notification</span>
              </div>
              <button
                type="button"
                onClick={handleAddTeamRow}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 hover:bg-amber-500/30"
              >
                <Plus className="w-3.5 h-3.5" />
                + Add Member
              </button>
            </div>

            {assignedTeamMembers.length > 0 && (
              <div className="space-y-2 pt-1">
                {assignedTeamMembers.map((member, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {/* Select Member */}
                      <div>
                        <label className="block text-[10px] text-zinc-400 font-semibold mb-0.5">Team Member</label>
                        {team.length > 0 ? (
                          <select
                            value={member.personId}
                            onChange={(e) => handleTeamMemberSelect(idx, e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-white text-[11px]"
                          >
                            <option value="">-- Choose Member --</option>
                            {team.map(t => (
                              <option key={t.PersonID} value={t.PersonID}>{t.Name} ({t.Role})</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            placeholder="Name (e.g. Amit)"
                            value={member.personName}
                            onChange={(e) => handleTeamFieldChange(idx, 'personName', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-white text-[11px]"
                          />
                        )}
                      </div>

                      {/* Role */}
                      <div>
                        <label className="block text-[10px] text-zinc-400 font-semibold mb-0.5">Role</label>
                        <input
                          type="text"
                          placeholder="Role (e.g. Candid)"
                          value={member.role}
                          onChange={(e) => handleTeamFieldChange(idx, 'role', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-white text-[11px]"
                        />
                      </div>

                      {/* Fee */}
                      <div>
                        <label className="block text-[10px] text-zinc-400 font-semibold mb-0.5">Agreed Fee (₹)</label>
                        <input
                          type="number"
                          placeholder="5000"
                          value={member.agreedAmount}
                          onChange={(e) => handleTeamFieldChange(idx, 'agreedAmount', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-white font-bold text-[11px]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-zinc-900">
                      {/* Direct WhatsApp Send Button */}
                      <button
                        type="button"
                        onClick={() => handleSendWhatsAppNotice(member)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1.5 hover:bg-emerald-500/30"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Send WhatsApp Assignment Notice
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveTeamRow(idx)}
                        className="p-1 text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
