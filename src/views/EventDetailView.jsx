import React, { useState } from 'react';
import { 
  ArrowLeft, Camera, Calendar, MapPin, Phone, CreditCard, Receipt, 
  UserCheck, CheckSquare, PackageCheck, MessageSquare, Download, 
  Plus, Edit3, Trash2, ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateWhatsAppURL, buildTeamNotificationMessage, buildPaymentReminderMessage } from '../services/whatsappService';
import { buildGoogleCalendarUrl, downloadIcsFile } from '../services/calendarService';
import EventModal from './EventModal';

export default function EventDetailView({ 
  onBack, onOpenPaymentModal, onOpenExpenseModal, onOpenTeamAssignmentModal, onOpenTaskModal, onOpenDeliverableModal 
}) {
  const { 
    selectedEventId, events, payments, expenses, eventTeam, tasks, deliverables, 
    saveEvent, deleteEvent, showToast, checkAdminPermission 
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // overview, payments, expenses, team, tasks, deliverables, notes
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const event = events.find(e => e.EventID === selectedEventId);

  if (!event) {
    return (
      <div className="p-8 text-center text-zinc-400">
        <p>Event record not found or has been deleted.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-zinc-800 text-white rounded-xl text-xs">
          Back to Events List
        </button>
      </div>
    );
  }

  // Financial Calculations for this event
  const evPayments = payments.filter(p => p.EventID === event.EventID);
  const totalPaid = evPayments.reduce((s, p) => s + Number(p.Amount || 0), 0);
  const totalContract = Number(event.TotalContractValue || 0);
  const pendingBalance = Math.max(0, totalContract - totalPaid);

  const evExpenses = expenses.filter(ex => ex.EventID === event.EventID);
  const totalExpenses = evExpenses.reduce((s, ex) => s + Number(ex.Amount || 0), 0);

  const evTeam = eventTeam.filter(et => et.EventID === event.EventID);
  const totalTeamCost = evTeam.reduce((s, et) => s + Number(et.AgreedAmount || 0), 0);

  const totalEventCost = totalExpenses; // Total expenses logged
  const estimatedProfit = totalContract - totalEventCost;
  const profitMargin = totalContract > 0 ? ((estimatedProfit / totalContract) * 100).toFixed(1) : 0;

  // Production Status List
  const productionStatuses = [
    'BOOKED', 'EVENT UPCOMING', 'EVENT COMPLETED', 'PHOTO EDITING', 
    'VIDEO EDITING', 'REEL', 'ALBUM DESIGN', 'ALBUM APPROVAL', 
    'ALBUM PRINTING', 'DELIVERY', 'FINAL PAYMENT', 'COMPLETED'
  ];

  const handleStatusChange = (newStatus) => {
    if (!checkAdminPermission()) return;
    saveEvent({ ...event, ProductionStatus: newStatus });
    showToast(`Status updated to ${newStatus}`);
  };

  const handleEditClick = () => {
    if (!checkAdminPermission()) return;
    setIsEditModalOpen(true);
  };

  // WhatsApp Team Details Link
  const handleSendTeamWhatsApp = (member) => {
    const msg = buildTeamNotificationMessage({
      teamMemberName: member.PersonName,
      role: member.Role,
      eventName: event.EventName,
      eventDate: event.EventDate,
      startTime: event.StartTime,
      venue: event.Venue,
      address: event.Address,
      googleMapsLink: event.GoogleMapsLink,
      clientName: event.ClientName,
      clientPhone: event.ClientPhone,
      agreedAmount: member.AgreedAmount
    });
    const url = generateWhatsAppURL(member.Phone || event.ClientPhone, msg);
    window.open(url, '_blank');
  };

  // WhatsApp Payment Reminder Link
  const handleSendPaymentReminder = () => {
    const msg = buildPaymentReminderMessage({
      clientName: event.ClientName,
      eventName: event.EventName,
      eventDate: event.EventDate,
      totalContract,
      totalPaid,
      totalPending: pendingBalance,
      isFinalPayment: event.ProductionStatus === 'DELIVERY' || event.ProductionStatus === 'FINAL PAYMENT'
    });
    const url = generateWhatsAppURL(event.ClientPhone, msg);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Edit Shoot Details Button */}
          <button
            onClick={handleEditClick}
            className="btn-gold px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Shoot Details
          </button>

          <a
            href={buildGoogleCalendarUrl(event)}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 text-xs font-semibold flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            Calendar Sync
          </a>

          <button
            onClick={() => downloadIcsFile(event)}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export .ICS
          </button>
        </div>
      </div>

      {/* Main Event Header Card (Mobile Stacked) */}
      <div className="p-5 md:p-6 rounded-2xl glass-panel-gold space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold">
                {event.EventType || 'Shoot'}
              </span>
              <span className="text-xs text-zinc-400 font-mono">ID: {event.EventID}</span>
            </div>
            <h1 className="text-xl md:text-3xl font-extrabold text-white mt-1">{event.EventName}</h1>
            <p className="text-xs text-zinc-300 font-medium mt-0.5">👤 Client: <strong>{event.ClientName}</strong> ({event.ClientPhone || 'No Phone'})</p>
          </div>

          {/* Production Status Dropdown */}
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1 w-full md:w-auto">
            <p className="text-[10px] uppercase font-bold text-zinc-400">Production Workflow</p>
            <select
              value={event.ProductionStatus || 'BOOKED'}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-zinc-900 border border-amber-500/40 text-amber-400 font-bold rounded-lg px-3 py-1.5 text-xs focus:outline-none w-full"
            >
              {productionStatuses.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Shoot Metadata (Mobile Friendly) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-zinc-800 text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Date: <strong className="text-amber-400 font-mono">{event.EventDate || 'TBD'}</strong> ({event.StartTime || '09:00'})</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="truncate">Venue: <strong>{event.Venue || 'TBD'}</strong> {event.City ? `(${event.City})` : ''}</span>
          </div>
          {event.GoogleMapsLink && (
            <div className="flex items-center gap-1.5 text-amber-400">
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <a href={event.GoogleMapsLink} target="_blank" rel="noreferrer" className="underline truncate">
                View Google Maps
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Financial Summary Cards for this Event (Mobile Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-3.5 md:p-4 rounded-xl glass-panel">
          <p className="text-[10px] uppercase font-bold text-zinc-400">Contract Value</p>
          <p className="text-sm md:text-lg font-extrabold text-white mt-1">₹{totalContract.toLocaleString('en-IN')}</p>
        </div>

        <div className="p-3.5 md:p-4 rounded-xl glass-panel border-l-2 border-l-emerald-500">
          <p className="text-[10px] uppercase font-bold text-emerald-400">Total Received</p>
          <p className="text-sm md:text-lg font-extrabold text-emerald-400 mt-1">₹{totalPaid.toLocaleString('en-IN')}</p>
        </div>

        <div className="p-3.5 md:p-4 rounded-xl glass-panel border-l-2 border-l-amber-500">
          <p className="text-[10px] uppercase font-bold text-amber-400">Balance Pending</p>
          <p className="text-sm md:text-lg font-extrabold text-amber-400 mt-1">₹{pendingBalance.toLocaleString('en-IN')}</p>
        </div>

        <div className="p-3.5 md:p-4 rounded-xl glass-panel border-l-2 border-l-rose-500">
          <p className="text-[10px] uppercase font-bold text-rose-400">Event Expenses</p>
          <p className="text-sm md:text-lg font-extrabold text-rose-400 mt-1">₹{totalExpenses.toLocaleString('en-IN')}</p>
        </div>

        <div className="p-3.5 md:p-4 rounded-xl glass-panel-gold col-span-2 lg:col-span-1">
          <p className="text-[10px] uppercase font-bold text-amber-300">Estimated Profit</p>
          <p className="text-sm md:text-lg font-extrabold text-white mt-1">₹{estimatedProfit.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-amber-400 font-semibold">{profitMargin}% margin</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-zinc-800 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'payments', label: `Payments (${evPayments.length})` },
          { id: 'expenses', label: `Expenses (${evExpenses.length})` },
          { id: 'team', label: `Team (${evTeam.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client & Payment Reminder Box */}
          <div className="p-5 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              WhatsApp Reminders & Client Notice
            </h3>
            <p className="text-xs text-zinc-400">
              Send one-click WhatsApp message to {event.ClientName} regarding pending payment or shoot confirmation.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={handleSendPaymentReminder}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-bold flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Send Payment Reminder via WhatsApp
              </button>
            </div>
          </div>

          {/* Quick Stats & Notes */}
          <div className="p-5 rounded-2xl glass-panel space-y-3">
            <h3 className="text-sm font-bold text-white">Event Notes & Special Instructions</h3>
            <p className="text-xs text-zinc-300 whitespace-pre-wrap">
              {event.Notes || 'No notes added for this event.'}
            </p>
          </div>
        </div>
      )}

      {/* PAYMENTS TAB */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Client Payment Log</h3>
            <button
              onClick={() => onOpenPaymentModal(event.EventID)}
              className="btn-gold px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              + Record Payment
            </button>
          </div>

          {evPayments.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500 bg-zinc-950 rounded-xl border border-zinc-800">
              No payments logged for this event yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 text-amber-400 font-bold">
                  <tr>
                    <th className="p-3">Payment ID</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 bg-zinc-950 text-zinc-200">
                  {evPayments.map(p => (
                    <tr key={p.PaymentID}>
                      <td className="p-3 font-mono text-zinc-400">{p.PaymentID}</td>
                      <td className="p-3">{p.PaymentDate}</td>
                      <td className="p-3 font-semibold text-white">{p.PaymentType}</td>
                      <td className="p-3">{p.PaymentMethod}</td>
                      <td className="p-3 font-bold text-emerald-400">₹{Number(p.Amount).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* EXPENSES TAB */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Event Expenses Log</h3>
            <button
              onClick={() => onOpenExpenseModal(event.EventID)}
              className="btn-gold px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              + Log Event Expense
            </button>
          </div>

          {evExpenses.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500 bg-zinc-950 rounded-xl border border-zinc-800">
              No expenses logged for this event yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 text-amber-400 font-bold">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Vendor / Person</th>
                    <th className="p-3">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 bg-zinc-950 text-zinc-200">
                  {evExpenses.map(ex => (
                    <tr key={ex.ExpenseID}>
                      <td className="p-3">{ex.Date}</td>
                      <td className="p-3 font-semibold text-white">{ex.Category}</td>
                      <td className="p-3 text-zinc-400">{ex.PersonVendor || 'N/A'}</td>
                      <td className="p-3 font-bold text-rose-400">₹{Number(ex.Amount).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TEAM TAB */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Assigned Team Members</h3>
            <button
              onClick={() => onOpenTeamAssignmentModal(event.EventID)}
              className="btn-gold px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              + Assign Team Member
            </button>
          </div>

          {evTeam.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500 bg-zinc-950 rounded-xl border border-zinc-800">
              No photographers/videographers assigned to this event yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {evTeam.map(tm => (
                <div key={tm.AssignmentID} className="p-4 rounded-xl glass-panel space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{tm.PersonName}</h4>
                      <p className="text-xs text-amber-400 font-semibold">{tm.Role}</p>
                    </div>
                    <button
                      onClick={() => handleSendTeamWhatsApp(tm)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40 flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Notify via WhatsApp
                    </button>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                    <span>Fee: ₹{Number(tm.AgreedAmount || 0).toLocaleString('en-IN')}</span>
                    <span className="font-bold text-amber-400">Pending: ₹{Number(tm.PendingAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Event Modal */}
      {isEditModalOpen && (
        <EventModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={event}
        />
      )}
    </div>
  );
}
