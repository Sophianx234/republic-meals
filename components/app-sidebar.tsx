"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  UtensilsCrossed,
  LayoutDashboard,
  ClipboardList,
  FileSpreadsheet,
  History,
  ChefHat,
  Users,
  LifeBuoy,
  Store,
  UploadCloud,
  CheckCircle2
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"

// --- 1. DEFINE NAVIGATION FOR EACH ROLE ---

const NAV_ITEMS = {
  teams: [
    {
      name: "Republic Meals",
      logo: '/images/rb.png',
      plan: "Corporate Service",
    }
  ],
  
  // ROLE: STAFF
  staff: [
    {
      title: "Lunch Menu",
      url: "/staff",
      icon: UtensilsCrossed,
      isActive: true,
      items: [
        { title: "Order Meal", url: "/staff/launch-menu/meal" },
        { title: "Weekly Schedule", url: "/staff/launch-menu/weekly-schedule" },
      ],
    },
    {
      title: "My Account",
      url: "/account",
      icon: History,
      items: [
        { title: "Account Information", url: "/staff/account/info" },
        { title: "Order History", url: "/staff/account/history" },
      ],
    },
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
      items: [
        { title: "Report Issue", url: "/staff/support/report-issue" },
      ],
    },
  ],

  // ROLE: RESTAURANT
  restaurant: [
    {
      name: "Kitchen Dashboard",
      url: "/restaurant/dashboard",
      icon: Store,
    },
    {
      name: "Live Orders",
      url: "/restaurant/orders",
      icon: ClipboardList,
    },
    {
      name: "Menu Management",
      url: "/restaurant/menu",
      icon: ChefHat,
    },
    {
      name: "Upload Menu", 
      url: "/restaurant/menu/upload",
      icon: UploadCloud,
    },
    {
      name: "Order History",
      url: "/restaurant/history",
      icon: CheckCircle2,
    }
  ],

  // ROLE: ADMIN
  admin: [
    {
      name: "Admin Overview",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Staff Management",
      url: "/admin/staff",
      icon: Users,
    },
    {
      name: "Financial Reports",
      url: "/admin/reports",
      icon: FileSpreadsheet,
    },
    {
      name: "System Settings",
      url: "/admin/settings",
      icon: UtensilsCrossed,
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return null

  const role = "admin" 

  return (
    <Sidebar collapsible="icon" {...props} >
      <SidebarHeader>
        <TeamSwitcher teams={NAV_ITEMS.teams} />
      </SidebarHeader>
      
      <div className="h-px bg-sidebar-border -translate-2 shadow-sm my-2 opacity-50 w-full" />
      
      {/* FIXED: Removed 'mx-4' so icons fit when collapsed */}
      <SidebarContent>
        {/* SCENARIO A: STAFF VIEW */}
        {role === "staff" && (
           <NavMain items={NAV_ITEMS.staff} />
        )}

        {/* SCENARIO B: RESTAURANT VIEW */}
        {role === "restaurant" && (
          <SidebarGroup>
            <SidebarGroupLabel>Kitchen Operations</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.restaurant.map((item) => {
                  // FIX: Use strict equality '===' to avoid selecting multiple links
                  const isActive = pathname === item.url 

                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={item.name}
                        isActive={isActive}
                        className={isActive ? "!bg-[#0090BF] !text-white font-medium hover:!bg-[#0090BF]/90" : ""}
                      >
                        <Link href={item.url}>
                          <item.icon className={isActive ? "!text-white" : ""} />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* SCENARIO C: ADMIN VIEW */}
        {role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.admin.map((item) => {
                  // FIX: Use strict equality '===' to avoid selecting multiple links
                  const isActive = pathname === item.url 
                  
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={item.name}
                        isActive={isActive}
                        className={isActive ? "!bg-[#0090BF] !text-white font-medium hover:!bg-[#0090BF]/90" : ""}
                      >
                        <Link href={item.url}>
                          <item.icon className={isActive ? "!text-white" : ""} />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}