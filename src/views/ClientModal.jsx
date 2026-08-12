import React, { useState } from 'react';
import { X, Users, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ClientModal({ isOpen, onClose, initialData = null }) {
  const { saveClient } = useApp();

  const [name, setName] = useState(initialData ? initialData.Name : '');
  const [phone, setPhone] = useState(initialData ? initialData.Phone : '');
  const [whatsapp, setWhatsapp] = useState(initialData ? initialData.WhatsApp : '');
  const [email, setEmail] = useState(initialData ? initialData.Email : '');
  const [city, setCity] = useState(initialData ? initialData.City : 'Nagpur');
  const [address, setAddress] = useState(initialData ? initialData.Address : '');
  const [instagram, setInstagram] = useState(initialData ? initialData.Instagram : '');
  const [notes, setNotes] = useState(initialData ? initialData.Notes : '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Please fill Client Name and Phone number.');
      return;
    }

    saveClient({
      ClientID: initialData ? initialData.ClientID : undefined,
      Name: name,
      Phone: phone,
      WhatsApp: whatsapp || phone,
      Email: email,
      City: city,
      Address: address,
      Instagram: instagram,
      Notes: notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-5 animate-modal shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            {initialData ? 'Edit Client Profile' : 'Add New Client'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Client Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">WhatsApp Number</label>
              <input
                type="tel"
                placeholder="Defaults to Phone"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">City</label>
              <input
                type="text"
                placeholder="e.g. Nagpur"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Instagram Handle</label>
              <input
                type="text"
                placeholder="@username"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="client@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Address / Notes</label>
            <textarea
              rows="2"
              placeholder="Client references, address, special notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full btn-gold py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Client Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
