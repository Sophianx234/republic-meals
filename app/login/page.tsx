'use client';

import { motion, AnimatePresence } from "framer-motion";
import { LoginForm } from "@/components/login-form";
import { ShieldCheck, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    src: '/images/woman-7.jpg',
    title: "Focus on the work, \n we'll handle the lunch.",
    tag: "Staff Portal"
  },
  {
    id: 2,
    src: '/images/woman-4.jpg',
    title: "A seamless experience \n for every branch.",
    tag: "Operational Calm"
  },
  {
    id: 3,
    src: '/images/woman-1.jpg',
    title: "Digital precision \n in every plate.",
    tag: "Excellence"
  }
];

export default function LoginPage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-white selection:bg-[#0090BF] selection:text-white">
      
      {/* LEFT SIDE: Login Form */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 p-6 md:p-10"
      >
        {/* Brand Header */}
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium group">
            <motion.div
              whileHover={{ rotate: -15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image src="/images/rb.png" alt="Logo" width={34} height={34} />
            </motion.div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none group-hover:text-[#0090BF] transition-colors">
              Republic<span className="text-[#0090BF]">Lunch</span>
            </h1>
          </Link>
        </div>

        {/* Login Form Container */}
        <div className="flex flex-1 items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="w-full max-w-xs"
          >
           

            <LoginForm />

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-8 flex items-center justify-center gap-2 text-center text-[10px] text-slate-400 font-bold tracking-widest uppercase"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0090BF]" />
              <span>Secure</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <Lock className="w-3 h-3" />
              <span>Enterprise Grade Encryption</span>
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* RIGHT SIDE: Visual Slideshow */}
      <div className="bg-muted relative overflow-hidden hidden lg:block h-full">
        {/* Overlays for Legibility */}
        <div className="absolute inset-0 bg-[#0090BF]/10 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-slate-900/40 z-[12] pointer-events-none" />
        <div className="absolute inset-0 bg-black/60 z-[15] pointer-events-none" />
        
        {/* Sliding Images */}
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
              alt="Staff Dining"
              fill
              className="h-full w-full object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Floating Text Content */}
        <div className="absolute bottom-16 left-16 z-20 text-white max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-[#0090BF] text-white text-[10px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full shadow-lg border border-white/20">
                {slides[index].tag}
              </span>
              <h2 className="text-4xl font-bold tracking-tighter mt-6 leading-tight whitespace-pre-line">
                {slides[index].title}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicators */}
          <div className="mt-8 flex justify-start gap-1.5">
            {slides.map((_, i) => (
              <motion.div
                key={i}
                onClick={() => setIndex(i)}
                initial={false}
                animate={{ 
                  width: i === index ? 40 : 10,
                  backgroundColor: i === index ? "#0090BF" : "rgba(255, 255, 255, 0.4)"
                }}
                className="h-1 rounded-full cursor-pointer transition-all duration-300"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}