import { getMyDailyOrder, getTodaysMenu } from "@/app/actions/order";
import { TodaysMenu } from "@/components/ui/todays-menu";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Order Lunch | RepublicLunch",
};

export default async function StaffOrderPage() {
  // 1. Get Session Server-Side
  // (Assuming Better Auth since you were using authClient)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Security: If no user, kick them out
  if (!session) {
    redirect("/");
  }

  // 2. Fetch Data in Parallel (Server Side)
  const [menuData, existingOrder] = await Promise.all([
    getTodaysMenu(),
    getMyDailyOrder(session?.user.id),
  ]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      <TodaysMenu
        menuData={menuData}
        existingOrder={existingOrder}
        userId={session.user.id}
      />
    </div>
  );
}
