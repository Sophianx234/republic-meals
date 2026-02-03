"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, Settings, LogOut, User, UtensilsCrossed, History, LifeBuoy, Store, ClipboardList, ChefHat, UploadCloud, CheckCircle2, LayoutDashboard, Users, FileSpreadsheet } from "lucide-react"
import { authClient } from "@/lib/auth-client"

// --- 1. DEFINE NAV ITEMS (Normally imported, but defined here for context) ---
const NAV_ITEMS = {
  teams: [
    { name: "Republic Meals", logo: '/images/rb.png', plan: "Corporate Service" }
  ],
  staff: [
    {
      title: "Lunch Menu", url: "/staff", icon: UtensilsCrossed, isActive: true,
      items: [
        { title: "Order Meal", url: "/staff/launch-menu/meal" },
        { title: "Weekly Schedule", url: "/staff/launch-menu/weekly-schedule" },
      ],
    },
    {
      title: "My Account", url: "/account", icon: History,
      items: [
        { title: "Account Information", url: "/staff/account/info" },
        { title: "Order History", url: "/staff/account/history" },
      ],
    },
    {
      title: "Support", url: "/support", icon: LifeBuoy,
      items: [ { title: "Report Issue", url: "/staff/support/report-issue" } ],
    },
  ],
  restaurant: [
    { name: "Kitchen Dashboard", url: "/restaurant/dashboard", icon: Store },
    { name: "Live Orders", url: "/restaurant/orders", icon: ClipboardList },
    { name: "Menu Management", url: "/restaurant/menu", icon: ChefHat },
    { name: "Upload Menu", url: "/restaurant/menu/upload", icon: UploadCloud },
    { name: "Order History", url: "/restaurant/history", icon: CheckCircle2 }
  ],
  admin: [
    { name: "Admin Overview", url: "/admin", icon: LayoutDashboard },
    { name: "Staff Management", url: "/admin/staff", icon: Users },
    { name: "Financial Reports", url: "/admin/reports", icon: FileSpreadsheet },
    { name: "System Settings", url: "/admin/settings", icon: UtensilsCrossed }
  ]
}

// --- 2. HELPER: Flatten NAV_ITEMS into a simple URL -> Title map ---
const createUrlMap = () => {
  const map = new Map<string, string>();
  
  // Helper to process a list of items
  const processItems = (items: any[]) => {
    items.forEach(item => {
      // Handle both 'title' (staff) and 'name' (admin/restaurant) keys
      const label = item.title || item.name;
      if (item.url && label) {
        map.set(item.url, label);
      }
      // Process nested items if they exist
      if (item.items) {
        processItems(item.items);
      }
    });
  };

  // Process all roles
  processItems(NAV_ITEMS.staff);
  processItems(NAV_ITEMS.restaurant);
  processItems(NAV_ITEMS.admin);
  
  return map;
};

// Create the map once (outside component to avoid recalc)
const URL_TO_TITLE_MAP = createUrlMap();

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  
  const [searchQuery, setSearchQuery] = React.useState("")

  // --- 3. GENERATE VALID BREADCRUMBS ---
  const breadcrumbs = React.useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const validCrumbs: { href: string; title: string }[] = [];
    
    let currentPath = "";

    segments.forEach((segment) => {
      currentPath += `/${segment}`;
      
      // CHECK: Does this constructed path exist in our configuration?
      if (URL_TO_TITLE_MAP.has(currentPath)) {
        validCrumbs.push({
          href: currentPath,
          title: URL_TO_TITLE_MAP.get(currentPath) || segment
        });
      }
    });

    return validCrumbs;
  }, [pathname]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = async () => {
      await authClient.signOut()
      router.push("/login")
  }

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "U"

  return (
    <header className="sticky z-50 bg-sidebar text-sidebar-foreground top-0 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 shadow-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      
      {/* --- LEFT SECTION --- */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        
        {/* DYNAMIC BREADCRUMB */}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              
              return (
                <React.Fragment key={crumb.href}>
                  <BreadcrumbItem className="hidden md:block">
                    {isLast ? (
                      <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href}>{crumb.title}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* --- RIGHT SECTION --- */}
      <div className="flex items-center gap-4">
        
        {/* 1. Global Search */}
        <div className="relative hidden md:flex items-center">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search menu or orders" 
              className="h-9 w-80 rounded-lg bg-muted/50 pl-9 pr-12 text-sm shadow-none focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <kbd className="pointer-events-none absolute right-2.5 top-[50%] -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
              <span className="text-xs">ctrl</span> + K
            </kbd>
        </div>

        {/* 2. Notifications */}
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-600 border border-background"></span>
            <span className="sr-only">Notifications</span>
        </Button>

        {/* 3. User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <Avatar className="h-9 w-9 border border-input">
                <AvatarImage 
                    src={session?.user?.image || ""} 
                    alt={session?.user?.name || "User"} 
                    className="object-cover"
                />
                <AvatarFallback className={`${session?.user?.profileColor || 'bg-primary/10'} text-primary font-medium`}>
                    {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session?.user?.name || "Guest"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email || "guest@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() =>{
                if(session?.user.role === 'admin'){
                  router.push('/admin/profile')
                }else if(session?.user.role === 'staff'){
                  router.push('/staff/account/info')
                }else{
                  router.push('/restaurant/profile') 
                }
              }}>
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Profile</span>
              </DropdownMenuItem>
              {session?.user.role === 'admin' && (
                <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
                  <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Settings</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}