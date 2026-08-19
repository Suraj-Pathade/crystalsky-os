/**
 * English WhatsApp Integration & URL Generator Service for CrystalSky OS
 * Owner: Pravin Ghukshe (8412850833)
 * Brand: CrystalSky Photography & Film
 */

export function formatPhoneNumber(phone) {
  if (!phone) return '918412850833';
  let cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.length === 10) {
    return '91' + cleaned;
  }
  if (cleaned.startsWith('0')) {
    return '91' + cleaned.substring(1);
  }
  return cleaned;
}

export function generateWhatsAppURL(phone, message) {
  const formattedPhone = formatPhoneNumber(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

/**
 * Client Payment Reminder Message Generator (English)
 */
export function buildPaymentReminderMessage({
  clientName,
  eventName,
  eventDate,
  totalContract,
  totalPaid,
  totalPending,
  dueDate,
  isOverdue = false,
  isFinalPayment = false
}) {
  const formattedContract = Number(totalContract || 0).toLocaleString('en-IN');
  const formattedPaid = Number(totalPaid || 0).toLocaleString('en-IN');
  const formattedPending = Number(totalPending || 0).toLocaleString('en-IN');
  
  let header = isOverdue
    ? `⚠️ *PAYMENT OVERDUE REMINDER*`
    : isFinalPayment
    ? `🎉 *FINAL PAYMENT & ALBUM DELIVERY READY*`
    : `✨ *PAYMENT REMINDER*`;

  return `${header}
*CrystalSky Photography & Film*

Dear ${clientName || 'Client'},

This is a friendly payment reminder regarding your photography booking with CrystalSky:

📸 *Shoot Booking Details:*
• Event Name: *${eventName || 'Photography Booking'}*
• Event Date: ${eventDate || 'N/A'}

💰 *Payment Statement:*
• Total Shoot Contract: ₹${formattedContract}
• Total Amount Paid: ₹${formattedPaid}
• *Remaining Balance Dues: ₹${formattedPending}*
${dueDate ? `• Due Date: ${dueDate}` : ''}

${isFinalPayment ? 'Your Album & Video deliverables are ready for delivery. Kindly clear the remaining balance.' : 'Kindly clear the remaining balance at your earliest convenience.'}

Reply to this message for UPI or Bank Account details.

Thank you very much,
*Pravin Ghukshe*
CrystalSky Photography & Film
📱 Contact / WhatsApp: 8412850833`;
}

/**
 * Client Payment Received Confirmation Receipt Message (English)
 */
export function buildPaymentConfirmationMessage({
  clientName,
  eventName,
  paymentAmount,
  paymentMethod,
  paymentType,
  totalContract,
  totalPaid,
  totalPending,
  referenceNumber
}) {
  const amountStr = Number(paymentAmount || 0).toLocaleString('en-IN');
  const paidStr = Number(totalPaid || 0).toLocaleString('en-IN');
  const pendingStr = Number(totalPending || 0).toLocaleString('en-IN');
  const contractStr = Number(totalContract || 0).toLocaleString('en-IN');

  return `✅ *PAYMENT RECEIPT CONFIRMATION*
*CrystalSky Photography & Film*

Dear ${clientName || 'Client'},

We have successfully received your payment! Receipt details:

🧾 *Payment Received Details:*
• Amount Received: *₹${amountStr}*
• Payment Mode: ${paymentMethod || 'UPI / Transfer'} (${paymentType || 'Payment'})
${referenceNumber ? `• Txn / Ref ID: ${referenceNumber}` : ''}
• Event / Shoot: ${eventName || 'Booking'}

📊 *Account Balance Summary:*
• Total Package Contract: ₹${contractStr}
• Total Amount Paid: ₹${paidStr}
• *Remaining Pending Balance: ₹${pendingStr}*

${Number(totalPending || 0) === 0 ? '✨ *Your payment is completely cleared! Thank you for choosing CrystalSky Photography!*' : 'Thank you for your payment!'}

Warm Regards,
*Pravin Ghukshe*
CrystalSky Photography & Film
📱 Contact / WhatsApp: 8412850833`;
}

/**
 * Team Member Event Assignment Notification Message (English)
 */
export function buildTeamNotificationMessage({
  teamMemberName,
  role,
  eventName,
  eventDate,
  startTime,
  endTime,
  venue,
  address,
  googleMapsLink,
  clientName,
  clientPhone,
  reportingTime,
  agreedAmount,
  notes
}) {
  const agreedStr = Number(agreedAmount || 0).toLocaleString('en-IN');

  return `📸 *NEW SHOOT ASSIGNMENT DETAILS*
*CrystalSky Photography & Film*

Dear ${teamMemberName},

You have been assigned to a CrystalSky photography shoot:

🎬 *Assignment Details:*
• Event / Shoot: *${eventName || 'Shoot Assignment'}*
• Your Assigned Role: *${role || 'Team Member'}*
• Date: ${eventDate || 'N/A'}
• Time: ${startTime || 'TBD'} ${endTime ? `- ${endTime}` : ''}
• Reporting Time: *${reportingTime || startTime || 'TBD'}*

📍 *Venue Details:*
• Venue: ${venue || 'N/A'}
• Address: ${address || 'N/A'}
${googleMapsLink ? `• Google Maps Link: ${googleMapsLink}` : ''}

👤 *Client Details:*
• Client Name: ${clientName || 'N/A'}
• Contact: ${clientPhone || 'N/A'}

💵 *Shoot Fee:*
• Agreed Shoot Fee: ₹${agreedStr}

${notes ? `📝 *Special Instructions:* ${notes}` : ''}

Please report on time and reply to confirm your assignment!

Thank you,
*Pravin Ghukshe*
CrystalSky Photography & Film
📱 Contact / WhatsApp: 8412850833`;
}
