import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
// import { RegisterClientPage } from "@/components/auth/register-client-page"

export const metadata: Metadata = {
  title: "Register | Staff Meal Ordering",
  description: "Create a new account to start ordering delicious meals from your company menu",
}

export default async function RegisterPage() {


  return (
     <div className="grid min-h-svh lg:grid-cols-2">
          <div className="flex flex-col gap-4 p-6 md:p-10">
            <div className="flex justify-center gap-2 md:justify-start">
              <Link href="/" className="flex items-center gap-2 font-medium">
                  <Image src="/images/rb.png" alt="Logo" width={34} height={34} />
                <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none group-hover:text-[#0090BF] transition">
                      Republic<span className="text-[#0090BF]">Lunch</span>
                    </h1>
              </Link>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <div className="w-full max-w-xs">
                <SignupForm />
              </div>
            </div>
          </div>
          <div className="bg-muted relative overflow-y-hidden hidden lg:block">
            <div className="absolute inset-0 bg-[#0090BF]/20" />
            <div className="absolute inset-0 bg-black/60" />
            <Image
              src='/images/happy-4.jpg'
              alt="Image"
              width={10000}
              height={1000}
              className="h-full w-full object-center object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </div>
  )
}
