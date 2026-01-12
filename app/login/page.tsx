import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
              <Image src="/images/rb.png" alt="Logo" width={34} height={34} />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none group-hover:text-[#0090BF] transition">
                  Republic<span className="text-[#0090BF]">Lunch</span>
                </h1>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative overflow-y-hidden hidden lg:block">
        <div className="absolute inset-0 bg-[#0090BF]/20" />
        <div className="absolute inset-0 bg-black/60" />
        <Image
          src='/images/happy-9.jpg'
          alt="Image"
          width={10000}
          height={1000}
          className="h-full w-full object-center object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
