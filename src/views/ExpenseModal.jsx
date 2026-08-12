import React, { useState } from 'react';
import { X, Receipt, Check, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ExpenseModal({ isOpen, onClose, defaultEventId = null }) {
  const { events, team, saveExpense } = useApp();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventId, setEventId] = useState(defaultEventId || '');
  const [category, setCategory] = useState('Photographer');
  const [personVendor, setPersonVendor] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [receiptUrl, setReceiptUrl] = useState('');

  if (!isOpen) return null;

  const categoriesList = [
    'Photographer', 'Videographer', 'Candid', 'Cinematographer', 'Reel', 'Drone',
    'Video Editing', 'Photo Editing', 'Album Designing', 'Album Printing',
    'Travel', 'Fuel', 'Food', 'Equipment Rental', 'Camera Rental', 'Lens Rental',
    'Marketing', 'Software', 'Office', 'Miscellaneous'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert('Please enter a valid expense amount.');
      return;
    }

    const selectedEv = events.find(ev => ev.EventID === eventId);

    saveExpense({
      Date: date,
      EventID: eventId,
      ClientID: selectedEv ? selectedEv.ClientID : '',
      Category: category,
      PersonVendor: personVendor,
      Description: description,
      Amount: Number(amount),
      PaymentMethod: paymentMethod,
      ReceiptURL: receiptUrl
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-5 animate-modal shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-rose-400" />
            Log Business Expense
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-3 text-xs">
          
          {/* Category & Amount */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Expense Category *</label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
              >
                {categoriesList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-rose-400 mb-1">Amount (₹) *</label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 8000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-zinc-900 border border-rose-500/50 text-white font-bold rounded-xl px-3 py-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Optional Event Link */}
          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Link to Event / Shoot (Optional)</label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="">-- General Business Expense --</option>
              {events.map(ev => (
                <option key={ev.EventID} value={ev.EventID}>{ev.EventName} ({ev.EventDate})</option>
              ))}
            </select>
          </div>

          {/* Vendor & Date */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Paid To / Vendor</label>
              <input
                type="text"
                placeholder="Person or Shop Name"
                value={personVendor}
                onChange={(e) => setPersonVendor(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Expense Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method & Description */}
          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI / GPay / PhonePe</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Card">Credit/Debit Card</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Description / Notes</label>
            <input
              type="text"
              placeholder="e.g. Lens rental for 2 days"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full btn-gold py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Expense Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
