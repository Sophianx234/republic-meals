"use client"

import * as React from "react"
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
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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

// --- 1. DEFINE NAVIGATION FOR EACH ROLE ---

const NAV_ITEMS = {
  teams: [
    {
      name: "Republic Meals",
      logo: '/images/rb.png',
      plan: "Corporate Service",
    }
  ],
  
  // ROLE: STAFF (The consumers)
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
        { title: "Order History", url: "/account/history" },
        { title: "My Expenses", url: "/account/expenses" },
      ],
    },
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
      items: [
        { title: "Report Issue", url: "/support" },
      ],
    },
  ],

  // ROLE: RESTAURANT (The providers)
  restaurant: [
    {
      name: "Kitchen Dashboard",
      url: "/restaurant",
      icon: Store,
    },
    {
      name: "Live Orders",
      url: "/restaurant/orders",
      icon: ClipboardList, // The "Ticket" view
    },
    {
      name: "Menu Management",
      url: "/restaurant/menu",
      icon: ChefHat, // Upload & Edit Menu
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

  // ROLE: ADMIN (The overseers)
  admin: [
    {
      name: "Admin Overview",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Staff Management",
      url: "/admin/users",
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
      icon: UtensilsCrossed, // Configure meal subsidies etc.
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return null

  // 2. DETECT ROLE
  // Ensure your auth schema returns one of these strings
  // const role = session?.user?.role as "staff" | "admin" | "restaurant" | undefined
  const role =  "staff" // TEMPORARY HARD CODE FOR TESTING

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={NAV_ITEMS.teams} />
      </SidebarHeader>
      
      <div className="h-px bg-sidebar-border shadow-sm mx-4 my-2 opacity-50" />
      
      <SidebarContent>
        {/* SCENARIO A: STAFF VIEW (Standard Navigation) */}
        {role === "staff" && (
           <NavMain items={NAV_ITEMS.staff} />
        )}

        {/* SCENARIO B: RESTAURANT VIEW */}
        {role === "restaurant" && (
          <SidebarGroup>
            <SidebarGroupLabel>Kitchen Operations</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.restaurant.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild tooltip={item.name}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
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
                {NAV_ITEMS.admin.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild tooltip={item.name}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        {/* Fallback or Shared Links (Optional) */}
        {/* You can add a shared "Support" section here if needed for all roles */}

      </SidebarContent>

      <SidebarFooter>
        {session?.user && <NavUser user={session.user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}