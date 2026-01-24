import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getStaffOrderHistory } from "@/app/actions/staff";
import { OrderAnalytics } from "@/components/ui/order-analytics";

export const metadata: Metadata = {
  title: "Order History | Republic Lunch",
  description: "View your past orders and spending analytics.",
};

export default async function HistoryPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) redirect("/");

  const historyData = await getStaffOrderHistory(session.user.id);

  if (!historyData.success) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-red-500">Failed to load history data.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-6xl mx-auto">
        <OrderAnalytics data={historyData} />
      </div>
    </div>
  );
}