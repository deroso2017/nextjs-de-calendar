"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type CalendarContextType = {
  selectedState: string;
  setSelectedState: (s: string) => void;
  currentYear: number;
  currentMonth: number;
  setCurrentYear: (y: number) => void;
  setCurrentMonth: (m: number) => void;
};

const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [selectedState, setSelectedStateRaw] = useState("NW");
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  useEffect(() => {
    const stored = localStorage.getItem("calendar_state");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setSelectedStateRaw(stored);
  }, []);

  const setSelectedState = (s: string) => {
    setSelectedStateRaw(s);
    localStorage.setItem("calendar_state", s);
  };

  return (
    <CalendarContext.Provider
      value={{
        selectedState,
        setSelectedState,
        currentYear,
        currentMonth,
        setCurrentYear,
        setCurrentMonth,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error("useCalendar must be used within CalendarProvider");
  return ctx;
}
