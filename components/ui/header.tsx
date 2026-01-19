"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
import { Bell, Search, Settings, LogOut, User, CreditCard } from "lucide-react"
import { authClient } from "@/lib/auth-client"

export function Header() {
  const router = useRouter()
  // 1. Get User Session
  const { data: session } = authClient.useSession()

  // 2. Handle Logout
  const handleLogout = async () => {
     await authClient.signOut()
     router.push("/login") // Redirect to login
  }

  // 3. Helper for Initials (e.g. "Sophian Abdul" -> "SA")
  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "U"

  return (
    <header className="sticky z-50 bg-sidebar text-sidebar-foreground top-0  flex h-16 shrink-0 items-center justify-between gap-2 border-b  px-4 shadow-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      
      {/* --- LEFT SECTION: Context --- */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Overview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* --- RIGHT SECTION: Actions --- */}
      <div className="flex items-center gap-4">
        
        {/* 1. Global Search (Hidden on small mobile) */}
        <div className="relative hidden md:flex items-center">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders, staff..."
              className="h-9 w-64 rounded-lg bg-muted/50 pl-9 text-sm shadow-none focus-visible:ring-1 md:w-80"
            />
        </div>

        {/* 2. Notifications */}
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
            {/* Red Dot for Unread */}
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-600 border border-background"></span>
            <span className="sr-only">Notifications</span>
        </Button>

        {/* 3. User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <Avatar className="h-9 w-9 border border-input">
                {/* Prioritize session image, fallback to initials */}
                <AvatarImage 
                    src={session?.user?.image || ""} 
                    alt={session?.user?.name || "User"} 
                    className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
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
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/billing')}>
                <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Settings</span>
              </DropdownMenuItem>
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