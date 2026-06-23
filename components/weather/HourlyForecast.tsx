"use client";

import { Card } from "@/components/ui/card";
import { forwardRef, ReactNode } from "react";
import { Hour } from "./types";

interface HourlyForecastProps {
  hours: Hour[];
  getIcon: (weathercode: number) => ReactNode;
  title?: string;
}

const HourlyForecast = forwardRef<HTMLDivElement, HourlyForecastProps>(
  ({ hours, getIcon, title }, ref) => {
    return (
      <Card ref={ref} className="p-4 bg-card/60 backdrop-blur">
        {title && <h3 className="mb-3 font-semibold">{title}</h3>}

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {hours.map((h) => (
            <div
              key={h.time}
              className="rounded-xl border bg-background/50 p-3 text-center"
            >
              <div className="text-xs text-muted-foreground">
                {String(new Date(h.time).getHours()).padStart(2, "0")}:00
              </div>

              <div className="my-2 flex justify-center">
                {getIcon(h.weathercode)}
              </div>

              <div className="font-semibold">{Math.round(h.temperature)}°</div>
            </div>
          ))}
        </div>
      </Card>
    );
  },
);

HourlyForecast.displayName = "HourlyForecast";

export default HourlyForecast;
