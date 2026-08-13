import type { ReactNode } from "react";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import TicketDetailModal from "@/components/ticket-detail/ticket-detail-modal";
import { getCurrentUser } from "@/lib/auth/dal";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Redirects to /login if the session is missing, expired, or the user is inactive.
  const user = await getCurrentUser();

  return (
    <div className="flex h-screen w-full">
      <Sidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar user={user} />
        <main className="flex-1 overflow-y-auto bg-slate-50">{children}</main>
      </div>
      <TicketDetailModal />
    </div>
  );
}
