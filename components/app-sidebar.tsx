"use client"

import {
  Frame,
  PieChart,
  SquareTerminal
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useEffect } from "react"
import { auth } from "@/lib/auth"
import { authClient } from "@/lib/auth-client"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: '/images/rb.png',
      plan: "Enterprise",
    }
  ],
  navMain: [
    {
      title: "Admin",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    
    
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },

  ],
}

export  function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  

    const {data:session, isPending} = authClient.useSession();
    if(isPending){
      return null;
    }

  
  return (
    <Sidebar collapsible="icon" {...props} >
      <SidebarHeader >
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <div className="h-px bg-gray-200 dark:bg-gray-700 -mt-.5 shadow-sm " />
      <SidebarContent >
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        {session?.user && <NavUser user={session.user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
