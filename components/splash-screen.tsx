'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [exit, setExit] = useState(false);

  useEffect(() => {
    // --- DEV MODE: COMMENT OUT THESE LINES TO KEEP IT FOREVER ---
    const timer = setTimeout(() => setExit(true), 2200);
    const cleanup = setTimeout(onComplete, 2800);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(cleanup);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      // Ensure 'exit' is never true so it doesn't blur/fade out
      animate={exit ? { opacity: 0, scale: 1.1, filter: "blur(10px)" } : {}}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
    >
       {/* ... Rest of your JSX ... */}
       <div className="relative flex flex-col items-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-28 h-28 mb-6"
        >
           <Image 
             src="/images/rb.png" 
             alt="Republic Bank" 
             fill
             className="object-contain"
             priority
           />
           <div className="absolute inset-0 bg-[#0090BF]/20 blur-2xl rounded-full animate-pulse" />
        </motion.div>

        {/* Text Reveal Animation */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl font-bold text-slate-900 tracking-tight text-center"
          >
            Republic<span className="text-[#0090BF]">Lunch</span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, letterSpacing: "0em" }}
          animate={{ opacity: 1, letterSpacing: "0.3em" }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-[10px] font-bold text-[#FFB81C] uppercase"
        >
          Staff Welfare Portal
        </motion.p>

        {/* Custom Progress Bar */}
        <div className="mt-8 w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            className="h-full bg-[#0090BF]"
          />
        </div>
      </div>
    </motion.div>
  );
}