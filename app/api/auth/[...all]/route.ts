export const dynamic = "force-dynamic"; // <-- ADD THIS LINE

import { auth } from "@/lib/auth"; // Your Better Auth import
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);