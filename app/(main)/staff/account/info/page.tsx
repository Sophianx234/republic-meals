import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { AccountView } from "@/components/ui/account-view";

export const metadata: Metadata = {
  title: "Account Settings | Republic Lunch",
  description: "Manage your profile details and security.",
};

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) redirect("/");

  // Fetch complete profile from DB (including fields not in session)

  if (!session.user) {
      return <div className="p-12 text-center">User profile not found.</div>;
  }
  console.log("AccountPage session user:", session.user);

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-4xl mx-auto">
        <AccountView user={session.user} />
      </div>
    </div>
  );
}