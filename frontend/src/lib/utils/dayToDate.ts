export default function dayToDate(startDate: Date, day: number) {
  return new Date(new Date(startDate).setDate(startDate.getDate() + day));
}
