import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { MonthlyHistory } from "@/components/ui/monthly-history";

export const metadata: Metadata = {
  title: "Order Archive | Republic Lunch",
  description: "View and print monthly order reports.",
};

export default async function RestaurantHistoryPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) redirect("/");
  
  // Optional: Restrict to admin/kitchen roles
  // if (session.user.role !== 'admin') redirect("/");

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 pt-6">
      <div className="flex items-center justify-between mb-6">
         <h1 className="text-2xl font-bold text-slate-900">Order Archive</h1>
      </div>
      <MonthlyHistory />
    </div>
  );
}