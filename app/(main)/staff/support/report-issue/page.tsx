import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { ReportIssueForm } from "@/components/ui/report-issue-form";

export const metadata: Metadata = {
  title: "Report Issue | Republic Lunch",
  description: "Submit feedback or report technical issues.",
};

export default async function ReportIssuePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) redirect("/");

  return (
    <div className="min-h-screen bg-gray-50/50 pt-20 pb-20">
      <ReportIssueForm />
    </div>
  );
}