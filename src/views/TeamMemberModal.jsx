import React, { useState } from 'react';
import { X, UserCheck, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TeamMemberModal({ isOpen, onClose }) {
  const { saveTeamMember } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Photographer');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const rolesList = [
    'Photographer', 'Videographer', 'Candid Photographer', 'Cinematographer',
    'Reel Creator', 'Drone Operator', 'Video Editor', 'Photo Editor',
    'Album Designer', 'Album Printer', 'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Please fill Name and Phone number.');
      return;
    }

    saveTeamMember({
      Name: name,
      Phone: phone,
      WhatsApp: phone,
      Role: role,
      Notes: notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-5 animate-modal shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-400" />
            Add Freelancer / Team Member
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Amit Verma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

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
            <label className="block font-semibold text-zinc-300 mb-1">Primary Skill / Role *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              {rolesList.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Notes / Gear Info</label>
            <textarea
              rows="2"
              placeholder="Sony A7IV owner, 70-200mm f2.8 lens..."
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
              Save Team Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
