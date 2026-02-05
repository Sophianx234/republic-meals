'use client';

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Better Auth typically passes this

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      // Logic: Call your better-auth client or server action here
      // const { error } = await authClient.resetPassword({ newPassword: password, token });
      
      // Simulating success for UI demo:
      setTimeout(() => {
        setIsSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      }, 1500);
    });
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-white selection:bg-[#0090BF] selection:text-white">
      
      {/* LEFT SIDE: Reset Flow */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-4 p-6 md:p-10"
      >
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="reset-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold tracking-tighter text-slate-900">Set New Password</h2>
                    <p className="text-slate-500 mt-2">Choose a strong password to secure your account.</p>
                  </div>

                  <form onSubmit={handleReset} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">New Password</label>
                      <div className="relative">
                        <input 
                          name="password"
                          type={showPassword ? "text" : "password"} 
                          required 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0090BF]/20 focus:border-[#0090BF] outline-none transition-all"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Confirm Password</label>
                      <input 
                        name="confirmPassword"
                        type="password" 
                        required 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0090BF]/20 focus:border-[#0090BF] outline-none transition-all"
                      />
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-red-500 text-xs font-medium bg-red-50 p-3 rounded-lg">
                        <AlertCircle className="w-4 h-4" /> {error}
                      </div>
                    )}

                    <button 
                      type="submit"
                      disabled={isPending || !token}
                      className="w-full bg-[#0090BF] hover:bg-[#007EA8] text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isPending ? "Updating..." : "Update Password"}
                    </button>
                    
                    {!token && (
                      <p className="text-[10px] text-red-400 text-center font-bold uppercase mt-2 italic">
                        Invalid or missing reset token.
                      </p>
                    )}
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-green-500 shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900">Password Updated</h2>
                    <p className="text-slate-500">Your security credentials have been refreshed. Redirecting you to login...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* RIGHT SIDE: Visual */}
      <div className="bg-muted relative overflow-hidden hidden lg:block h-full">
        <div className="absolute inset-0 bg-[#0090BF]/10 z-10" />
        <div className="absolute inset-0 bg-black/70 z-[12]" />
        
        <Image
          src='/images/woman-1.jpg'
          alt="Secure System"
          fill
          className="object-cover"
        />

        <div className="absolute bottom-16 right-16 z-20 text-right text-white max-w-sm">
          <span className="bg-[#0090BF] text-white text-[10px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full">
            Encryption Active
          </span>
          <h2 className="text-4xl font-bold tracking-tighter mt-6 leading-tight">
            Security you can <br /> depend on.
          </h2>
        </div>
      </div>
    </div>
  );
}