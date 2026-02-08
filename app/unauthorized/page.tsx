'use client';

import { motion } from 'framer-motion';
import { ShieldBan, ArrowLeft, Home, LockKeyhole } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#f8fafc] via-white to-[#eef6fb] font-sans text-slate-900 selection:bg-[#0090BF] selection:text-white relative overflow-hidden">
      
      {/* --- BACKGROUND ELEMENTS (Matches Hero) --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#0090BF]/5 blur-3xl" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#FFB81C]/5 blur-3xl" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg px-6"
      >
        <div className=" p-8 md:p-12 text-center">
          
          {/* --- BRANDING --- */}
          <div className="flex flex-col items-center justify-center mb-8 opacity-80">
            <div className="relative mb-2">
               <Image src="/images/rb.png" alt="Republic Bank" width={48} height={48} className="object-contain" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Republic<span className="text-[#0090BF]">Lunch</span>
            </h2>
          </div>

          {/* --- ICON --- */}
          <div className="relative flex items-center justify-center w-24 h-24 mx-auto mb-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="absolute inset-0 bg-red-50 rounded-full border border-red-100"
            />
            
            {/* Swapped to ShieldBan and added a 'No' shake animation */}
            <motion.div 
              initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
              animate={{ 
                rotate: [0, -10, 10, -10, 10, 0], // Subtle 'No' head shake
                scale: 1, 
                opacity: 1 
              }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
               <ShieldBan className="w-10 h-10 text-red-500 relative z-10" />
            </motion.div>
            
            {/* Decorative Lock */}
            <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full border border-slate-100 shadow-sm">
                <LockKeyhole className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* --- TEXT CONTENT --- */}
          <div className="space-y-3 mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Access Restricted
            </h1>
            <p className="text-slate-500 text-base leading-relaxed">
              You do not have the required permissions to view this page. This area is strictly for authorized personnel only.
            </p>
          </div>

          {/* --- ACTIONS --- */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-[#0090BF] transition-all duration-200 shadow-sm active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>

            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0090BF] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-900/10 hover:bg-[#007EA8] transition-all duration-200 active:scale-95"
            >
              <Home className="w-4 h-4" />
              Home Portal
            </Link>
          </div>

          {/* --- FOOTER INFO --- */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium">
              Error Code: 403_FORBIDDEN
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Need help? Contact Welfare at <span className="font-bold text-slate-600">Ext 4050</span>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}