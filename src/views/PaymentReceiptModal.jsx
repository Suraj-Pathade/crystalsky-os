import React from 'react';
import { X, Printer, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateWhatsAppURL, buildPaymentConfirmationMessage } from '../services/whatsappService';
import { printElement } from '../services/exportService';

export default function PaymentReceiptModal({ isOpen, onClose, payment }) {
  const { events, clients } = useApp();

  if (!isOpen || !payment) return null;

  const event = events.find(e => e.EventID === payment.EventID);
  const client = clients.find(c => c.ClientID === payment.ClientID) || {
    Name: payment.ClientName,
    Phone: ''
  };

  const evPayments = events.filter(e => e.EventID === payment.EventID);
  const totalContract = event ? Number(event.TotalContractValue || 0) : Number(payment.Amount || 0);

  // Total paid calculation
  const allEventPayments = payment.EventID 
    ? events.reduce((acc, ev) => acc, 0) // Placeholder
    : Number(payment.Amount);

  const pendingBalance = Math.max(0, totalContract - Number(payment.Amount));

  const handleWhatsAppSend = () => {
    const msg = buildPaymentConfirmationMessage({
      clientName: payment.ClientName || client.Name,
      eventName: payment.EventName || (event ? event.EventName : 'Photography Booking'),
      paymentAmount: payment.Amount,
      paymentMethod: payment.PaymentMethod,
      paymentType: payment.PaymentType,
      totalContract: totalContract,
      totalPaid: payment.Amount,
      totalPending: pendingBalance,
      referenceNumber: payment.ReferenceNumber
    });

    const url = generateWhatsAppURL(client.WhatsApp || client.Phone, msg);
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    printElement('printable-receipt-area');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-5 animate-modal shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-extrabold text-white">Payment Receipt</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Area */}
        <div id="printable-receipt-area" className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 text-xs">
          <div className="text-center border-b border-zinc-800 pb-3">
            <h2 className="font-extrabold text-base text-amber-400">CrystalSky Photography & Film</h2>
            <p className="text-[10px] text-zinc-400">Owner: Suraj Pathade | 📱 9922639066</p>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">Receipt ID: {payment.PaymentID}</p>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between">
              <span className="text-zinc-400">Client Name:</span>
              <span className="font-bold text-white">{payment.ClientName || 'Valued Client'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Event Booking:</span>
              <span className="font-medium text-white">{payment.EventName || 'Photography Shoot'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Date Paid:</span>
              <span className="font-mono text-zinc-300">{payment.PaymentDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Payment Type:</span>
              <span className="font-semibold text-emerald-400">{payment.PaymentType || 'Advance'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Payment Method:</span>
              <span className="text-zinc-300">{payment.PaymentMethod} {payment.ReferenceNumber ? `(${payment.ReferenceNumber})` : ''}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-sm">
            <span className="font-bold text-white">Amount Received:</span>
            <span className="font-extrabold text-emerald-400 text-base">₹{Number(payment.Amount).toLocaleString('en-IN')}</span>
          </div>

          <div className="text-[10px] text-zinc-500 text-center pt-2">
            Thank you for choosing CrystalSky Photography & Film!
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={handleWhatsAppSend}
            className="w-full py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg"
          >
            <MessageSquare className="w-4 h-4" />
            WhatsApp Receipt
          </button>

          <button
            onClick={handlePrint}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-zinc-700"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            Print Receipt
          </button>
        </div>

      </div>
    </div>
  );
}
