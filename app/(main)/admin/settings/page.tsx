import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSystemSettings } from "@/app/actions/settings";
import { Metadata } from "next";
import { SystemSettings } from "@/components/ui/system-settings";

export const metadata: Metadata = {
  title: "System Configuration | Admin",
};

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || session.user.role !== "admin") {
      redirect("/");
  }

  const { settings } = await getSystemSettings();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-screen bg-slate-50/30">
      <div className="mb-8">
         <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings</h1>
         <p className="text-slate-500 mt-1">Configure global application parameters and logic.</p>
      </div>
      
      {settings ? (
          <SystemSettings initialSettings={settings} />
      ) : (
          <div className="p-10 text-center text-slate-500">Failed to load settings.</div>
      )}
    </div>
  );
}