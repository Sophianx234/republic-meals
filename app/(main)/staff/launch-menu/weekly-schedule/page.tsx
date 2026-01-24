import { auth } from "@/lib/auth"; // Your auth library
import { headers } from "next/headers";
import { MonthlyView } from "@/components/ui/monthly-view";
import { redirect } from "next/navigation";
import { Calendar } from "lucide-react";

export default async function SchedulePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) redirect("/");

  return (
    <div className="min-h-screen bg-gray-50/50 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
    Monthly Menu
  </h1>
  <p className="text-sm text-gray-500">Plan ahead and pre-order your meals for the entire month.</p>
</div>
      <MonthlyView userId={session.user.id} />
    </div>
  );
}