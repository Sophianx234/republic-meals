import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const path = nextUrl.pathname;

  // 1. Fetch the session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // --- NEW: Redirect "Already Logged In" Users ---
  // If user is on /login AND has a session, send them to their role's home
  if (path === "/login" && session) {
    const role = session.user.role;
    
    // Your custom redirection logic
    const destination = role === 'staff' 
      ? '/staff/launch-menu/meal' 
      : role === 'admin' 
        ? '/admin' 
        : '/restaurant/dashboard';
        
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 2. Auth Check: Redirect to login if no session exists
  // We check 'path !== "/login"' to prevent infinite loops
  if (!session && path !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Define Role-Based Rules for PROTECTED routes
  // Format: "Path Prefix": ["Allowed Roles"]
  const roleRules = {
    "/admin": ["admin"],
    "/restaurant": ["catering", "kitchen"], 
    "/staff": ["staff",'admin'],       
  };

  // 4. Find matching rule for current path
  const matchedRule = Object.keys(roleRules).find((route) => 
    path.startsWith(route)
  );

  // 5. Authorization Check
  if (matchedRule && session) {
    // TypeScript fix: assert key type
    const allowedRoles = roleRules[matchedRule as keyof typeof roleRules];
    const userRole = session.user.role;

    if (!allowedRoles.includes(userRole)) {
      // User has session but wrong role -> 403 / unauthorized
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Allow request to proceed
  return NextResponse.next();
}

export const config = {
  // Apply to protected routes AND the login page
  matcher: [
    "/login",                // <--- Don't forget this!
    "/staff/:path*", 
    "/admin/:path*", 
    "/restaurant/:path*"     // Updated to match your redirect logic
  ],
};