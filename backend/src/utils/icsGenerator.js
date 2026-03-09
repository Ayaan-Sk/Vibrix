function generateICS(events) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SmartNoticeBoard//EN'];
  for (const ev of events) {
    lines.push('BEGIN:VEVENT');
    lines.push(`SUMMARY:${ev.title}`);
    lines.push(`DTSTART:${formatICSDate(ev.startDate)}`);
    if (ev.endDate) lines.push(`DTEND:${formatICSDate(ev.endDate)}`);
    lines.push(`UID:${ev.id}@smartnoticeboard`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function formatICSDate(date) {
  return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

module.exports = { generateICS };
