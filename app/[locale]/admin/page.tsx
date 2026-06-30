"use client";

import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/spinner";

const AdminView = dynamic(() => import("@/components/admin/AdminDashboard"), {
  loading: () => (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Spinner className="h-10 w-10" />
    </div>
  ),
  ssr: false,
});

export default function AdminPage() {
  return <AdminView />;
}
