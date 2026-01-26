import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { StaffManagement } from "@/components/ui/staff-management";

export const metadata: Metadata = {
  title: "Staff Management | Admin",
};

export default async function StaffPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || session.user.role !== "admin") {
      redirect("/");
  }

  return (
    <div className="p-6 ">
      <StaffManagement />
    </div>
  );
}