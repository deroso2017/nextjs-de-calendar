"use client";

import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/spinner";

const Users = dynamic(() => import("@/components/admin/Users"), {
  loading: () => (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Spinner className="h-10 w-10" />
    </div>
  ),
  ssr: false,
});

export default function UsersPage() {
  return <Users />;
}
