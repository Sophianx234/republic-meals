import { GlobalBanner } from "@/components/global-banner";
import { getSystemSettings } from "@/app/actions/settings"; // Your existing action


export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Fetch settings on the server
  const { settings } = await getSystemSettings();

  return (
    <html lang="en">
      <body >
        
        {/* 2. Place Banner at the very top */}
        <GlobalBanner settings={settings} />
        
        <main className="min-h-screen bg-slate-50/30">
          {children}
        </main>
        
      </body>
    </html>
  );
}