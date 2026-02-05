"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { forgotPasswordAction } from "@/app/actions/auth";
import RiseLoader from "react-spinners/RiseLoader";

const slides = [
  {
    id: 1,
    src: "/images/happy-2.jpg",
    title: "Protecting your \n digital identity.",
    tag: "Account Security",
  },
  {
    id: 2,
    src: "/images/woman-11.jpg",
    title: "Secure recovery \n for every staff.",
    tag: "Identity Verified",
  },
  {
    id: 3,
    src: "/images/woman-1.jpg",
    title: "A seamless portal \n for Republic Bank.",
    tag: "Operational Calm",
  },
];

export default function ForgotPasswordPage() {
  const [index, setIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Auto-play logic for the slider
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleResetRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await forgotPasswordAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setIsSubmitted(true);
      }
    });
  };

  const formVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-white selection:bg-[#0090BF] selection:text-white">
      {/* LEFT SIDE: Recovery Flow */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col p-6 md:p-10"
      >
        <div className="flex flex-col gap-8">
          <div className="flex justify-center md:justify-start">
            <Link
              href="/"
              className="flex items-center gap-2 font-medium group"
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Image
                  src="/images/rb.png"
                  alt="Logo"
                  width={34}
                  height={34}
                  priority
                />
              </motion.div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none group-hover:text-[#0090BF] transition-colors">
                Republic<span className="text-[#0090BF]">Lunch</span>
              </h1>
            </Link>
          </div>

          <div className="flex justify-center md:justify-start">
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#0090BF] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="forgot-form"
                  variants={formVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4 }}
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold tracking-tighter text-slate-900">
                      Reset Password
                    </h2>
                    <p className="text-slate-500 mt-2">
                      Enter your staff email and we&apos;ll send you a recovery
                      link.
                    </p>
                  </div>

                  <form onSubmit={handleResetRequest} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        Staff Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          name="email"
                          type="email"
                          required
                          disabled={isPending}
                          placeholder="name@republicghana.com"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0090BF]/20 focus:border-[#0090BF] transition-all disabled:opacity-70"
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex items-center gap-2 text-red-500 text-xs font-medium bg-red-50 p-3 rounded-lg"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full bg-[#0090BF] hover:bg-[#007EA8] text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isPending ? (
                        <RiseLoader size={6} color="white" />
                      ) : (
                        "Send Recovery Link"
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success-message"
                  variants={formVariants}
                  initial="initial"
                  animate="animate"
                  className="text-center space-y-6"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-500">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900">
                      Check your email
                    </h2>
                    <p className="text-slate-500 text-balance">
                      We&apos;ve sent a password reset link to your staff inbox.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-sm font-bold text-[#0090BF] hover:underline"
                  >
                    Didn&apos;t receive it? Try again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold tracking-widest uppercase"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0090BF]" />
              <span>Identity Verified</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <Lock className="w-3 h-3" />
              <span>Secure Recovery</span>
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* RIGHT SIDE: Visual Slider */}
      <div className="bg-muted relative overflow-hidden hidden lg:block h-full">
        <div className="absolute inset-0 bg-[#0090BF]/10 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-slate-900/60 z-[12] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-[15] pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={slides[index].id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="relative h-full w-full"
          >
            <Image
              src={slides[index].src}
              alt="Security Visual"
              fill
              className="h-full w-full object-cover grayscale brightness-75"
              priority={index === 0}
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-16 right-16 z-20 text-right text-white max-w-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full border border-white/20">
                {slides[index].tag}
              </span>
              <h2 className="text-4xl font-bold tracking-tighter mt-6 leading-tight whitespace-pre-line">
                {slides[index].title}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicator */}
          <div className="mt-8 flex justify-end gap-1.5">
            {slides.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === index ? 40 : 10,
                  backgroundColor:
                    i === index ? "#0090BF" : "rgba(255, 255, 255, 0.4)",
                }}
                className="h-1 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
