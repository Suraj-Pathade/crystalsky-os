/**
 * Google Calendar Helper & ICS File Generator for CrystalSky OS
 * Owner: Suraj Pathade (9922639066)
 * Brand: CrystalSky Photography & Film
 */

/**
 * Build direct Google Calendar web creation URL
 */
export function buildGoogleCalendarUrl(event) {
  if (!event || !event.EventName) return '#';
  
  const title = encodeURIComponent(`📸 ${event.EventName} — CrystalSky`);
  
  const eventDate = event.EventDate ? new Date(event.EventDate) : new Date();
  const startIso = eventDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
  
  // Add 8 hours default duration
  const endDate = new Date(eventDate);
  endDate.setHours(endDate.getHours() + 8);
  const endIso = endDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
  
  const details = encodeURIComponent(
    `Client Name: ${event.ClientName || 'N/A'}\n` +
    `Client Phone: ${event.ClientPhone || 'N/A'}\n` +
    `Venue: ${event.Venue || 'N/A'}\n` +
    `Address: ${event.Address || 'N/A'}\n` +
    `City: ${event.City || ''}\n` +
    `Google Maps: ${event.GoogleMapsLink || 'N/A'}\n` +
    `Contract Amount: ₹${Number(event.TotalContractValue || 0).toLocaleString('en-IN')}\n` +
    `Status: ${event.EventStatus || 'Upcoming'}\n` +
    `Notes: ${event.Notes || 'None'}`
  );
  
  const location = encodeURIComponent(event.Address || event.Venue || event.City || '');
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
}

/**
 * Generate .ics calendar download file
 */
export function downloadIcsFile(event) {
  if (!event || !event.EventName) return;
  
  const title = `📸 ${event.EventName} — CrystalSky`;
  const eventDate = event.EventDate ? new Date(event.EventDate) : new Date();
  const startIso = eventDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
  
  const endDate = new Date(eventDate);
  endDate.setHours(endDate.getHours() + 8);
  const endIso = endDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
  
  const description = `Client: ${event.ClientName || 'N/A'} (${event.ClientPhone || ''})\\nVenue: ${event.Venue || ''}\\nContract: RS.${event.TotalContractValue || 0}`;

  const icsData = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CrystalSky Photography//OS 1.0//EN
BEGIN:VEVENT
UID:${event.EventID || Date.now()}@crystalsky.in
DTSTAMP:${startIso}
DTSTART:${startIso}
DTEND:${endIso}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${event.Address || event.Venue || ''}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.EventName.replace(/\s+/g, '_')}_CrystalSky.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
