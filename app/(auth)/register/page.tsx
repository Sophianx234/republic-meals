'use client';

import { AnimatePresence, motion } from "framer-motion";
import { SignupForm } from "@/components/signup-form";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";

const slides = [
  {
    id: 1,
    src: '/images/woman-7.jpg',
    title: "A plate reserved \n for every talent.",
    tag: "Staff Welfare"
  },
  {
    id: 2,
    src: '/images/woman-1.jpg',
    title: "Quality nutrition \n for peak performance.",
    tag: "Excellence"
  },
  {
    id: 3,
    src: '/images/happy-9.jpg',
    title: "Nourishing our \n Republic family.",
    tag: "Community"
  },
  {
    id: 4,
    src: '/images/woman-2.jpg',
    title: "Digital precision \n in every order.",
    tag: "Innovation"
  },
  {
    id: 5,
    src: '/images/woman-4.jpg',
    title: "Efficiency served \n at every branch.",
    tag: "Operational Calm"
  },
  {
    id: 6,
    src: '/images/happy-4.png',
    title: "Your well-being \n is our priority.",
    tag: "Welfare"
  }
];
export default function RegisterPage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-white selection:bg-[#0090BF] selection:text-white">
      
      {/* LEFT SIDE: Signup Flow */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 p-6 md:p-10"
      >
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image 
                src="/images/rb.png" 
                alt="Republic Bank Logo" 
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

        <div className="flex flex-1 items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="w-full max-w-xs"
          >
            <SignupForm />
            
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

      {/* RIGHT SIDE: Visual "Hook" */}
      <div className="bg-muted relative overflow-hidden hidden lg:block h-full">
        {/* 1. Subtle Blue Tint Overlay */}
        <div className="absolute inset-0 bg-[#0090BF]/10 z-10 pointer-events-none" />
        
        {/* 2. Global Dark Overlay (Added this for legibility) */}
        <div className="absolute inset-0 bg-slate-900/40 z-[12] pointer-events-none" />

        {/* 3. Gradient Bottom Overlay */}
        <div className="absolute inset-0 bg-black/65  z-[15] pointer-events-none" />
        
        {/* Image Slider */}
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
              alt="Staff Experience"
              fill
              sizes="50vw"
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Floating Text Overlay */}
        <div className="absolute bottom-16 right-16 z-20 text-right text-white max-w-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
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

          <p className="text-blue-100/70 text-base mt-4 leading-relaxed">
            Standardizing meal operations across all Republic Bank branches with digital precision.
          </p>
          
          {/* Dynamic Progress Indicator */}
          <div className="mt-8 flex justify-end gap-2">
            {slides.map((_, i) => (
              <motion.div
                key={i}
                onClick={() => setIndex(i)}
                initial={false}
                animate={{ 
                  width: i === index ? 48 : 16,
                  backgroundColor: i === index ? "#0090BF" : "rgba(255, 255, 255, 0.4)"
                }}
                className="h-1 rounded-full cursor-pointer transition-colors duration-300"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}