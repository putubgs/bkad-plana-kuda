export function formatTanggalLengkap(timestamp: string) {
  const date = new Date(timestamp.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return timestamp;
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
