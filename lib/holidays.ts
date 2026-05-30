export type Holiday = { name: string; date: string; states?: string[] };

export const GERMAN_STATES = [
  { code: "ALL", name: "Alle Bundesländer" },
  { code: "BW", name: "Baden-Württemberg" },
  { code: "BY", name: "Bayern" },
  { code: "BE", name: "Berlin" },
  { code: "BB", name: "Brandenburg" },
  { code: "HB", name: "Bremen" },
  { code: "HH", name: "Hamburg" },
  { code: "HE", name: "Hessen" },
  { code: "MV", name: "Mecklenburg-Vorpommern" },
  { code: "NI", name: "Niedersachsen" },
  { code: "NW", name: "Nordrhein-Westfalen" },
  { code: "RP", name: "Rheinland-Pfalz" },
  { code: "SL", name: "Saarland" },
  { code: "SN", name: "Sachsen" },
  { code: "ST", name: "Sachsen-Anhalt" },
  { code: "SH", name: "Schleswig-Holstein" },
  { code: "TH", name: "Thüringen" },
];

function easterSunday(year: number): Date {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function fmt(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getHolidays(year: number): Holiday[] {
  const easter = easterSunday(year);

  return [
    { name: "Neujahr", date: `${year}-01-01` },
    { name: "Heilige Drei Könige", date: `${year}-01-06`, states: ["BW", "BY", "ST"] },
    { name: "Internationaler Frauentag", date: `${year}-03-08`, states: ["BE", "MV", "TH"] },
    { name: "Karfreitag", date: fmt(addDays(easter, -2)) },
    { name: "Ostersonntag", date: fmt(easter), states: ["BB"] },
    { name: "Ostermontag", date: fmt(addDays(easter, 1)) },
    { name: "Tag der Arbeit", date: `${year}-05-01` },
    { name: "Christi Himmelfahrt", date: fmt(addDays(easter, 39)) },
    { name: "Pfingstsonntag", date: fmt(addDays(easter, 49)), states: ["BB"] },
    { name: "Pfingstmontag", date: fmt(addDays(easter, 50)) },
    { name: "Fronleichnam", date: fmt(addDays(easter, 60)), states: ["BW", "BY", "HE", "NW", "RP", "SL", "SN", "TH"] },
    { name: "Mariä Himmelfahrt", date: `${year}-08-15`, states: ["BY", "SL"] },
    { name: "Weltkindertag", date: `${year}-09-20`, states: ["TH"] },
    { name: "Tag der Deutschen Einheit", date: `${year}-10-03` },
    { name: "Reformationstag", date: `${year}-10-31`, states: ["BB", "HB", "HH", "MV", "NI", "SN", "ST", "SH", "TH"] },
    { name: "Allerheiligen", date: `${year}-11-01`, states: ["BW", "BY", "NW", "RP", "SL"] },
    { name: "Buß- und Bettag", date: fmt(getBussUndBettag(year)), states: ["SN"] },
    { name: "1. Weihnachtstag", date: `${year}-12-25` },
    { name: "2. Weihnachtstag", date: `${year}-12-26` },
  ];
}

function getBussUndBettag(year: number): Date {
  const nov23 = new Date(year, 10, 23);
  const day = nov23.getDay();
  const daysToWed = day <= 3 ? 3 - day : 10 - day;
  return addDays(nov23, daysToWed - (day === 3 ? 7 : 0));
}

export function getHolidaysForState(year: number, stateCode: string): Holiday[] {
  const all = getHolidays(year);
  if (stateCode === "ALL") return all;
  return all.filter((h) => !h.states || h.states.includes(stateCode));
}
