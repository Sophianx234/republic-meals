import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getKitchenStats } from "@/app/actions/analytics";
import { Metadata } from "next";
import { KitchenDashboard } from "@/components/ui/catering-dashboard";

export const metadata: Metadata = {
  title: "Kitchen Overview | Republic Lunch",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) redirect("/");

  const stats = await getKitchenStats();

  if (!stats) {
      return <div className="p-10 text-center">Failed to load analytics.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 pt-6">
      <KitchenDashboard stats={stats} />
    </div>
  );
}