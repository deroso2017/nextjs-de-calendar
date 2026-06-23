"use client";

import { useState } from "react";
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sun, Cloud, CloudRain, RefreshCw } from "lucide-react";
import { WeatherState } from "./types";
import { Spinner } from "../ui/spinner";
import HourlyForecast from "./HourlyForecast";
import { cn } from "@/lib/utils";

function getIcon(code: number) {
  if (code === 0) return <Sun className="h-5 w-5 text-yellow-400" />;
  if (code < 50) return <Cloud className="h-5 w-5 text-muted-foreground" />;
  if (code < 70) return <CloudRain className="h-5 w-5 text-blue-400" />;
  return <Cloud className="h-5 w-5 text-muted-foreground" />;
}

export default function WeatherView() {
  const [city, setCity] = useState("Köln");
  const [data, setData] = useState<WeatherState | null>(null);
  const [tab, setTab] = useState<"now" | "today" | "week">("now");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hourlyRef = useRef<HTMLDivElement | null>(null);

  const fetchWeather = async (preserveTab = false) => {
    setLoading(true);
    setError(null);

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`,
      );
      const geo = await geoRes.json();

      if (!geo?.results?.length) {
        setError("City not found");
        setData(null);
        return;
      }

      const place = geo.results[0];

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${place.latitude}` +
          `&longitude=${place.longitude}` +
          `&current_weather=true` +
          `&hourly=temperature_2m,weathercode` +
          `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
          `&timezone=auto`,
      );

      const w = await res.json();

      if (!w?.current_weather) {
        setError("Weather data unavailable");
        setData(null);
        return;
      }

      setData({
        name: place.name,
        country: place.country,

        now: {
          temperature: w.current_weather.temperature,
          windspeed: w.current_weather.windspeed,
          weathercode: w.current_weather.weathercode,
        },

        hourly:
          w.hourly?.time?.map((t: string, i: number) => ({
            time: t,
            temperature: w.hourly.temperature_2m[i],
            weathercode: w.hourly.weathercode[i],
          })) ?? [],

        daily:
          w.daily?.time?.map((t: string, i: number) => ({
            date: t,
            max: w.daily.temperature_2m_max[i],
            min: w.daily.temperature_2m_min[i],
            weathercode: w.daily.weathercode[i],
          })) ?? [],
      });

      if (!preserveTab) {
        setTab("now");
        setSelectedDay(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Get hourly data for a full day (00:00 → 23:00)
  const getDayHours = (date: string) => {
    return data?.hourly.filter((h) => h.time.startsWith(date)) ?? [];
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex justify-center">
      <div className="w-full max-w-4xl space-y-6">
        {/* Search */}
        <Card className="p-4 bg-card/60 backdrop-blur">
          <div className="flex gap-2">
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city..."
            />

            <Button onClick={() => fetchWeather(false)} disabled={loading}>
              {loading ? <Spinner className="h-4 w-4" /> : "Search"}
            </Button>
            {data && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => fetchWeather(true)}
                disabled={loading}
                title="Refresh weather"
              >
                <RefreshCw
                  className={cn("h-4 w-4", loading && "animate-spin")}
                />
              </Button>
            )}
          </div>
        </Card>

        {/* Error */}
        {error && (
          <Card className="p-4 text-red-500 bg-card/60 backdrop-blur">
            {error}
          </Card>
        )}

        {/* Empty */}
        {!data && !loading && (
          <Card className="p-6 text-center bg-card/60 backdrop-blur">
            <p className="text-muted-foreground">
              Search a city to view weather
            </p>
          </Card>
        )}

        {/* DATA */}
        {data && (
          <>
            {/* Location */}
            <div className="text-center text-muted-foreground">
              {data.name}, {data.country}
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={tab === "now" ? "default" : "outline"}
                onClick={() => {
                  setTab("now");
                  setSelectedDay(null);
                }}
              >
                Now
              </Button>

              <Button
                variant={tab === "today" ? "default" : "outline"}
                onClick={() => {
                  setTab("today");
                  setSelectedDay(null);
                }}
              >
                Today
              </Button>

              <Button
                variant={tab === "week" ? "default" : "outline"}
                onClick={() => setTab("week")}
              >
                7 Days
              </Button>
            </div>

            {/* NOW */}
            {tab === "now" && (
              <Card className="p-6 text-center bg-card/60 backdrop-blur space-y-2">
                <div className="flex justify-center">
                  {getIcon(data.now.weathercode)}
                </div>

                <div className="text-5xl font-bold">
                  {data.now.temperature}°
                </div>

                <p className="text-muted-foreground">
                  Wind: {data.now.windspeed} km/h
                </p>
              </Card>
            )}

            {/* TODAY */}
            {tab === "today" && (
              <HourlyForecast
                hours={getDayHours(new Date().toISOString().slice(0, 10))}
                getIcon={getIcon}
              />
            )}

            {/* WEEK */}
            {tab === "week" && (
              <div className="space-y-3">
                {/* Days list */}
                {data.daily.map((d) => (
                  <Card
                    key={d.date}
                    onClick={() => {
                      setSelectedDay(d.date);

                      // wait for render then scroll
                      setTimeout(() => {
                        hourlyRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }, 50);
                    }}
                    className={cn(
                      "p-4 cursor-pointer transition hover:opacity-70",
                      {
                        "ring-2 ring-primary": selectedDay === d.date,
                      },
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {new Date(d.date).toLocaleDateString(undefined, {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          Min {d.min}° / Max {d.max}°
                        </p>
                      </div>

                      {getIcon(d.weathercode)}
                    </div>
                  </Card>
                ))}

                {/* Hourly view for selected day */}
                {selectedDay && (
                  <HourlyForecast
                    ref={hourlyRef}
                    title="Hourly Forecast"
                    hours={getDayHours(selectedDay)}
                    getIcon={getIcon}
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
