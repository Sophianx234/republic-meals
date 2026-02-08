import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const path = nextUrl.pathname;

  // 1. Fetch the session (Next.js 16 allows Node runtime in proxy!)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. Auth Check: Redirect to login if no session exists
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Define Role-Based Rules
  // Format: "Path Prefix": ["Allowed Roles"]
  const roleRules = {
    "/admin": ["admin"],
    "/catering": ["catering", "kitchen"], // Example roles for catering
    "/staff": ["staff"],        // Example: Staff can access staff pages
  };

  // 4. Check if the current path is protected by a rule
  const matchedRule = Object.keys(roleRules).find((route) => 
    path.startsWith(route)
  );

  if (matchedRule) {
    const allowedRoles = roleRules[matchedRule as keyof typeof roleRules];
    const userRole = session.user.role; // Ensure 'role' is in your Better Auth schema

    // 5. Authorization Check: Redirect if role is not allowed
    if (!allowedRoles.includes(userRole)) {
      // Redirect unauthorized users to a safe page (e.g., dashboard or 403)
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Allow request to proceed
  return NextResponse.next();
}

export const config = {
  // Apply to protected routes only
  matcher: [
    "/staff/:path*", 
    "/admin/:path*", 
    "/catering/:path*"
  ],
};