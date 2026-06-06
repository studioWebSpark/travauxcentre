export function generateIcal(opts: {
  uid:         string
  titre:       string
  description: string
  lieu:        string
  debut:       Date
  fin:         Date
}): string {
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Travaux Centre//CRM//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${opts.uid}@travauxcentre.fr`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(opts.debut)}`,
    `DTEND:${fmt(opts.fin)}`,
    `SUMMARY:${opts.titre}`,
    `DESCRIPTION:${opts.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${opts.lieu}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
}

export function googleCalendarUrl(opts: {
  titre:       string
  description: string
  lieu:        string
  debut:       Date
  fin:         Date
}): string {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  const p = new URLSearchParams({
    action:  "TEMPLATE",
    text:    opts.titre,
    details: opts.description,
    location: opts.lieu,
    dates:   `${fmt(opts.debut)}/${fmt(opts.fin)}`,
  })
  return `https://www.google.com/calendar/render?${p.toString()}`
}
