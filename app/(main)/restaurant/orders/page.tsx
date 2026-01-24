import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getLiveOrders } from "@/app/actions/restaurant";
import { LiveOrderBoard } from "@/components/ui/live-order-board";

export const metadata: Metadata = {
  title: "Kitchen Live Board | Republic Lunch",
};

export default async function KitchenLivePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) redirect("/");
  
  // Optional: Restrict to kitchen role
 /*  if (session.user.role !== "kitchen" && session.user.role !== "admin") {
      return <div className="p-8 text-center text-red-500">Access Denied: Kitchen Staff Only</div>;
  } */

  const { orders } = await getLiveOrders();

  return (
    <div className="min-h-screen bg-gray-50/50 pt-6 px-4 pb-4">
      <LiveOrderBoard initialOrders={orders as any} />
    </div>
  );
}