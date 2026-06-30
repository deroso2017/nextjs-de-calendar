"use client";

import { useMemo } from "react";
import { useCalendar } from "@/contexts/CalendarContext";
import { getHolidaysForState, GERMAN_STATES } from "@/lib/holidays";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function CalendarView() {
  const t = useTranslations("Calendar");

  const {
    selectedState,
    setSelectedState,
    currentYear,
    currentMonth,
    setCurrentYear,
    setCurrentMonth,
  } = useCalendar();

  const MONTH_NAMES = t.raw("months") as string[];
  const DAY_NAMES = [
    t("weekdays.mon"),
    t("weekdays.tue"),
    t("weekdays.wed"),
    t("weekdays.thu"),
    t("weekdays.fri"),
    t("weekdays.sat"),
    t("weekdays.sun"),
  ];

  const holidays = useMemo(
    () => getHolidaysForState(currentYear, selectedState),
    [currentYear, selectedState],
  );

  const holidayMap = useMemo(() => {
    const map: Record<string, string> = {};
    holidays.forEach((h) => {
      map[h.date] = h.name;
    });
    return map;
  }, [holidays]);

  const days = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    const startOffset = (firstDay.getDay() + 6) % 7;

    const cells: (number | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= lastDay.getDate(); d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    return cells;
  }, [currentYear, currentMonth]);

  const navigate = (dir: number) => {
    let m = currentMonth + dir;
    let y = currentYear;

    if (m < 0) {
      m = 11;
      y--;
    }
    if (m > 11) {
      m = 0;
      y++;
    }

    setCurrentMonth(m);
    setCurrentYear(y);
  };

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="font-semibold text-lg min-w-[180px] text-center">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>

          <Button variant="outline" size="icon" onClick={() => navigate(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrentMonth(today.getMonth());
              setCurrentYear(today.getFullYear());
            }}
          >
            {t("today")}
          </Button>
        </div>

        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder={t("selectState")} />
          </SelectTrigger>

          <SelectContent>
            {GERMAN_STATES.map((s) => (
              <SelectItem key={s.code} value={s.code}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* CALENDAR GRID */}
      <div className="rounded-lg border overflow-hidden">
        <div className="grid grid-cols-7 bg-muted">
          {DAY_NAMES.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-xs font-medium text-muted-foreground"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            if (!day)
              return (
                <div
                  key={i}
                  className="h-16 border-t border-r last:border-r-0 bg-muted/30"
                />
              );

            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
              2,
              "0",
            )}-${String(day).padStart(2, "0")}`;

            const holiday = holidayMap[dateStr];
            const isToday = dateStr === todayStr;

            const dayOfWeek =
              (new Date(currentYear, currentMonth, day).getDay() + 6) % 7;

            const isWeekend = dayOfWeek >= 5;

            return (
              <div
                key={i}
                className={cn(
                  "h-16 border-t border-r last:border-r-0 p-1 relative",
                  isWeekend && "bg-muted/20",
                  holiday && "bg-green-50 dark:bg-green-950/30",
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium inline-flex h-6 w-6 items-center justify-center rounded-full",
                    isToday && "bg-primary text-primary-foreground",
                    !isToday && isWeekend && "text-muted-foreground",
                  )}
                >
                  {day}
                </span>

                {holiday && (
                  <p className="text-[10px] leading-tight text-green-700 dark:text-green-400 mt-0.5 line-clamp-2">
                    {holiday}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* HOLIDAY LIST */}
      <div className="space-y-1">
        <h3 className="font-medium text-sm">
          {t("holidaysInMonth")} {MONTH_NAMES[currentMonth]}
        </h3>

        {holidays
          .filter((h) =>
            h.date.startsWith(
              `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`,
            ),
          )
          .map((h) => (
            <div key={h.date} className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground w-24">
                {new Date(h.date).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </span>
              <span>{h.name}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
