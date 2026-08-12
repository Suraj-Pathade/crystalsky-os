/**
 * Hinglish WhatsApp Integration & URL Generator Service for CrystalSky OS
 * Owner: Pravin Ghukshe (8412850833)
 * Brand: CrystalSky Photography & Film
 */

/**
 * Format phone number to international wa.me format (India standard +91)
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

/**
 * Generate click-to-chat WhatsApp deep link
 */
export function generateWhatsAppURL(phone, message) {
  const formattedPhone = formatPhoneNumber(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

/**
 * Client Payment Reminder Message Generator (Hinglish)
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

Namaste ${clientName || 'Client'} ji,

Yeh aapki CrystalSky Photography booking payment ka ek friendly reminder hai:

📸 *Shoot Ki Jankari:*
• Event Name: *${eventName || 'Photography Booking'}*
• Date: ${eventDate || 'N/A'}

💰 *Payment Ka Hisab:*
• Total Shoot Contract: ₹${formattedContract}
• Abhi Tak Jama Hua: ₹${formattedPaid}
• *Baaki Pending Balance: ₹${formattedPending}*
${dueDate ? `• Due Date: ${dueDate}` : ''}

${isFinalPayment ? 'Aapka Album aur Video delivery ke liye tayar hai. Kripya baaki balance clear karein.' : 'Kripya baaki payment jald se jald clear karein.'}

UPI / Bank details ke liye hume reply karein.

Bahut Bahut Dhanyawad,
*Pravin Ghukshe*
CrystalSky Photography & Film
📱 Contact / WhatsApp: 8412850833`;
}

/**
 * Client Payment Received Confirmation Receipt Message (Hinglish)
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

Namaste ${clientName || 'Grahak'} ji,

Hame aapka payment mil gaya hai! Receipt details neeche hain:

🧾 *Received Payment:*
• Mil Gaya Amount: *₹${amountStr}*
• Payment Mode: ${paymentMethod || 'UPI / Transfer'} (${paymentType || 'Payment'})
${referenceNumber ? `• Txn / Ref ID: ${referenceNumber}` : ''}
• Shoot / Event: ${eventName || 'Booking'}

📊 *Aapka Account Balance Summary:*
• Total Shoot Package: ₹${contractStr}
• Kul Jama Hua: ₹${paidStr}
• *Baaki Pending Balance: ₹${pendingStr}*

${Number(totalPending || 0) === 0 ? '✨ *Aapka poora payment clear ho gaya hai! CrystalSky Photography ko chunne ke liye Dhanyawad!*' : 'Payment dene ke liye Dhanyawad!'}

Warm Regards,
*Pravin Ghukshe*
CrystalSky Photography & Film
📱 Contact / WhatsApp: 8412850833`;
}

/**
 * Team Member Event Assignment Notification Message (Hinglish)
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

Namaste ${teamMemberName},

Aapko CrystalSky Photography ki shoot assignment assign ki gayi hai:

🎬 *Shoot Ki Jankari:*
• Shoot / Event: *${eventName || 'Shoot Assignment'}*
• Aapka Role: *${role || 'Team Member'}*
• Date: ${eventDate || 'N/A'}
• Time: ${startTime || 'TBD'} ${endTime ? `- ${endTime}` : ''}
• Reporting Time: *${reportingTime || startTime || 'TBD'}*

📍 *Venue Details:*
• Venue Name: ${venue || 'N/A'}
• Location Address: ${address || 'N/A'}
${googleMapsLink ? `• Google Maps Link: ${googleMapsLink}` : ''}

👤 *Client Information:*
• Client Name: ${clientName || 'N/A'}
• Contact: ${clientPhone || 'N/A'}

💵 *Shoot Remuneration:*
• Agreed Shoot Fees: ₹${agreedStr}

${notes ? `📝 *Special Instructions:* ${notes}` : ''}

Kripya time par pahuchein aur is message ka reply dekar confirm karein!

Dhanyawad,
*Pravin Ghukshe*
CrystalSky Photography & Film
📱 Contact / WhatsApp: 8412850833`;
}
