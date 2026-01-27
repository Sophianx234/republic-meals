import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { FinancialReport } from "@/components/ui/financial-report";

export const metadata: Metadata = {
  title: "Financial Reports | Republic Lunch",
};

export default async function FinancePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || session.user.role !== "admin") {
      redirect("/");
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-screen bg-slate-50/30">
      <FinancialReport />
    </div>
  );
}