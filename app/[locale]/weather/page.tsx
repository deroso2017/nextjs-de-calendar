"use client";

import { Spinner } from "@/components/ui/spinner";
import dynamic from "next/dynamic";

const WeatherView = dynamic(() => import("@/components/weather/WeatherView"), {
  loading: () => (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Spinner className="h-10 w-10" />
    </div>
  ),
  ssr: false,
});

export default function WeatherPage() {
  return <WeatherView />;
}
