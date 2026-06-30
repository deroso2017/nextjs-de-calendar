"use client";

import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/spinner";

const Settings = dynamic(() => import("@/components/admin/Settings"), {
  loading: () => (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Spinner className="h-10 w-10" />
    </div>
  ),
  ssr: false,
});

export default function SettingsPage() {
  return <Settings />;
}
