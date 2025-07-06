const yearFormatter = new Intl.DateTimeFormat("en", { year: "numeric" });
const monthFormatter = new Intl.DateTimeFormat("en", { month: "2-digit" });
const dayFormatter = new Intl.DateTimeFormat("en", { day: "2-digit" });

export default function formatDateTime(date: Date) {
  let year = yearFormatter.format(date);
  let month = monthFormatter.format(date);
  let day = dayFormatter.format(date);
  return `${year}-${month}-${day}T00:00:00Z`;
}

