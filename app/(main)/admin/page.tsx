import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { OverviewDashboard } from "@/components/ui/overview-dashboard";
import { getAdminDashboardStats } from "@/app/actions/admin";

export const metadata: Metadata = {
  title: "Admin Dashboard | Republic Lunch",
};

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || session.user.role !== "admin") {
      redirect("/");
  }

  const result = await getAdminDashboardStats();

  if (!result.success || !result.data) {
      return (
        <div className="min-h-screen flex items-center justify-center text-slate-500">
            Failed to load dashboard data.
        </div>
      );
  }

  return (
    <div className="p-6 md:p-8  min-h-screen bg-slate-50/30">
      <div className="mb-8">
         <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Overview</h1>
         <p className="text-slate-500 mt-1">
            Welcome back, {session.user.name}. Here's what's happening today.
         </p>
      </div>
      <OverviewDashboard data={result.data} />
    </div>
  );
}