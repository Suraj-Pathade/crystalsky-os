import React, { useState } from 'react';
import { PackageCheck, Plus, CheckCircle2, MessageSquare, AlertCircle, Edit3, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateWhatsAppURL, buildPaymentReminderMessage } from '../services/whatsappService';

export default function DeliverablesView() {
  const { deliverables, events, payments, saveDeliverable, showToast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [eventId, setEventId] = useState('');
  const [type, setType] = useState('Photos');
  const [status, setStatus] = useState('IN PROGRESS');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [driveUrl, setDriveUrl] = useState('');
  const [notes, setNotes] = useState('');

  const handleOpenCreate = () => {
    setEditingItem(null);
    setEventId('');
    setType('Photos');
    setStatus('IN PROGRESS');
    setDueDate(new Date().toISOString().split('T')[0]);
    setDriveUrl('');
    setNotes('');
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEventId(item.EventID || '');
    setType(item.Type || 'Photos');
    setStatus(item.Status || 'IN PROGRESS');
    setDueDate(item.DueDate || new Date().toISOString().split('T')[0]);
    setDriveUrl(item.DriveURL || item.Notes || '');
    setNotes(item.Notes || '');
    setShowModal(true);
  };

  const handleStatusChange = (item, newStatus) => {
    saveDeliverable({ ...item, Status: newStatus });
    showToast(`Deliverable "${item.Type}" updated to ${newStatus}`);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!eventId) {
      alert('Please select an event');
      return;
    }

    const ev = events.find(e => e.EventID === eventId);

    const payload = {
      DeliverableID: editingItem ? editingItem.DeliverableID : undefined,
      EventID: eventId,
      EventName: ev ? ev.EventName : (editingItem ? editingItem.EventName : ''),
      ClientName: ev ? ev.ClientName : (editingItem ? editingItem.ClientName : ''),
      Type: type,
      Status: status,
      DueDate: dueDate,
      DriveURL: driveUrl,
      Notes: notes
    };

    saveDeliverable(payload);
    setShowModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-amber-400" />
            Deliverables & Album Production Tracker
          </h1>
          <p className="text-xs text-zinc-400">
            Track Photos, Video, Reels, Album Design, and Album Printing delivery status
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          + Track New Deliverable
        </button>
      </div>

      {/* Deliverables List */}
      {deliverables.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-zinc-800 text-center space-y-3 bg-zinc-950">
          <PackageCheck className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Deliverables Logged</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Log raw photos, edited videos, or printed albums to track delivery deadlines.
          </p>
          <button
            onClick={handleOpenCreate}
            className="btn-gold px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add First Deliverable
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deliverables.map((deliv) => {
            const ev = events.find(e => e.EventID === deliv.EventID);
            const evPayments = payments.filter(p => p.EventID === deliv.EventID);
            const totalPaid = evPayments.reduce((s, p) => s + Number(p.Amount || 0), 0);
            const pendingBalance = ev ? Math.max(0, Number(ev.TotalContractValue || 0) - totalPaid) : 0;

            const isDelivered = deliv.Status === 'DELIVERED';
            const isFinalPending = isDelivered && pendingBalance > 0;

            const handleWhatsAppFinalReminder = () => {
              if (!ev) return;
              const msg = buildPaymentReminderMessage({
                clientName: ev.ClientName,
                eventName: ev.EventName,
                eventDate: ev.EventDate,
                totalContract: ev.TotalContractValue,
                totalPaid,
                totalPending: pendingBalance,
                isFinalPayment: true
              });
              const url = generateWhatsAppURL(ev.ClientPhone, msg);
              window.open(url, '_blank');
            };

            return (
              <div key={deliv.DeliverableID} className="p-4 rounded-2xl glass-panel space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                      {deliv.Type}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <select
                        value={deliv.Status}
                        onChange={(e) => handleStatusChange(deliv, e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 text-[11px] text-white rounded-lg px-2 py-1 font-bold"
                      >
                        <option value="NOT STARTED">NOT STARTED</option>
                        <option value="IN PROGRESS">IN PROGRESS</option>
                        <option value="ALBUM DESIGN">ALBUM DESIGN</option>
                        <option value="PRINTING">PRINTING</option>
                        <option value="READY">READY</option>
                        <option value="DELIVERED">DELIVERED</option>
                      </select>

                      <button
                        onClick={() => handleOpenEdit(deliv)}
                        className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 hover:bg-amber-500/20"
                        title="Edit Deliverable / Album Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-sm">{deliv.EventName || 'Photography Shoot'}</h3>
                    <p className="text-xs text-zinc-400">Client: {deliv.ClientName}</p>
                    <p className="text-[11px] text-zinc-500 font-mono mt-0.5">Due Date: {deliv.DueDate || 'N/A'}</p>
                  </div>

                  {deliv.DriveURL && (
                    <a
                      href={deliv.DriveURL}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-amber-400 underline font-mono flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open Album / Drive Link
                    </a>
                  )}
                </div>

                {isFinalPending && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                    <p className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      FINAL PAYMENT PENDING (₹{pendingBalance.toLocaleString('en-IN')})
                    </p>
                    <button
                      onClick={handleWhatsAppFinalReminder}
                      className="w-full py-1.5 rounded-lg bg-emerald-500 text-black font-extrabold text-[10px] flex items-center justify-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      WhatsApp Final Payment Reminder
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Deliverable Edit / Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-5 animate-modal shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-white">
              {editingItem ? 'Edit Deliverable / Album Details' : 'Add Event Deliverable'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Select Event *</label>
                <select
                  required
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2"
                >
                  <option value="">-- Select Event * --</option>
                  {events.map(ev => (
                    <option key={ev.EventID} value={ev.EventID}>{ev.EventName} ({ev.ClientName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Deliverable Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2"
                >
                  <option value="Photos">Edited Photos</option>
                  <option value="Video">Full Video / Film</option>
                  <option value="Reel">Instagram Reel</option>
                  <option value="Album">Photobook Album</option>
                  <option value="Other">Other Deliverable</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Production Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2"
                >
                  <option value="NOT STARTED">NOT STARTED</option>
                  <option value="IN PROGRESS">IN PROGRESS</option>
                  <option value="ALBUM DESIGN">ALBUM DESIGN</option>
                  <option value="PRINTING">PRINTING</option>
                  <option value="READY">READY</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Delivery Due Date</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Google Drive / Album Preview Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 font-mono text-[11px]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-gold py-2.5 rounded-xl text-xs font-bold"
                >
                  Save Deliverable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
