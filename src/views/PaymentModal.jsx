import React, { useState } from 'react';
import { X, CreditCard, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export default function PaymentModal({ isOpen, onClose, defaultEventId = null, onSavedPayment }) {
  const { events, clients, savePayment } = useApp();

  const [eventId, setEventId] = useState(defaultEventId || '');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paymentType, setPaymentType] = useState('Advance');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const selectedEvent = events.find(e => e.EventID === eventId);

  // Auto calculate current pending balance
  let pendingBalance = 0;
  if (selectedEvent) {
    pendingBalance = Number(selectedEvent.TotalContractValue || 0); // Simplified auto prompt
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventId || !amount || Number(amount) <= 0) {
      alert('Please select an event and enter a valid payment amount.');
      return;
    }

    const payload = {
      EventID: eventId,
      ClientID: selectedEvent ? selectedEvent.ClientID : '',
      ClientName: selectedEvent ? selectedEvent.ClientName : '',
      EventName: selectedEvent ? selectedEvent.EventName : '',
      PaymentDate: paymentDate,
      Amount: Number(amount),
      PaymentMethod: paymentMethod,
      PaymentType: paymentType,
      ReferenceNumber: referenceNumber,
      Notes: notes
    };

    const saved = savePayment(payload);

    // Fire celebration confetti!
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    onClose();
    if (onSavedPayment) {
      onSavedPayment(saved);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-5 animate-modal shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            Record Client Payment
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-3 text-xs">
          
          {/* Select Event */}
          <div>
            <label className="block font-bold text-amber-400 mb-1">Select Event / Booking *</label>
            <select
              required
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="">-- Choose Event --</option>
              {events.map(ev => (
                <option key={ev.EventID} value={ev.EventID}>
                  {ev.EventName} - Client: {ev.ClientName} (Val: ₹{Number(ev.TotalContractValue || 0).toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
            <label className="block font-bold text-emerald-400">Payment Amount (₹) *</label>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 25000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-extrabold text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Payment Date & Type */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Payment Date *</label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Payment Milestone</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
              >
                <option value="Advance">Advance Payment</option>
                <option value="Wedding Day">Wedding Day Payment</option>
                <option value="Final">Final Payment</option>
                <option value="Additional">Additional Payment</option>
              </select>
            </div>
          </div>

          {/* Payment Method & Ref */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
              >
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="PhonePe">PhonePe</option>
                <option value="Google Pay">Google Pay</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Transaction Ref / Txn ID</label>
              <input
                type="text"
                placeholder="e.g. UPI/123456789"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Notes</label>
            <input
              type="text"
              placeholder="Payment remarks..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full btn-gold py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Payment & Generate Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
