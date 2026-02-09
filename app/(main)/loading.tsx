import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      
      {/* Container for Logo & Spinner */}
      <div className="relative flex items-center justify-center w-24 h-24">
        
        {/* Spinning Ring (Blue) */}
        <div className="absolute inset-0 rounded-full border-4 border-t-[#0090BF] border-r-transparent border-b-slate-100 border-l-slate-100 animate-spin" />
        
        {/* Inner Static Ring (Subtle Gold Accent) */}
        <div className="absolute inset-2 rounded-full border-2 border-[#FFB81C]/20" />

        {/* Logo in Center */}
        <div className="relative w-10 h-10 animate-pulse">
           {/* Ensure /images/rb.png exists in your public folder */}
           <Image 
             src="/images/rb.png" 
             alt="Loading..." 
             fill
             className="object-contain"
             priority
           />
        </div>
      </div>

      {/* Loading Text */}
      <div className="mt-6 flex flex-col items-center gap-1">
        <h3 className="text-sm font-bold text-slate-900 tracking-widest uppercase">
          Republic<span className="text-[#0090BF]">Lunch</span>
        </h3>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-[#0090BF] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1.5 h-1.5 bg-[#0090BF] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1.5 h-1.5 bg-[#0090BF] rounded-full animate-bounce"></span>
        </div>
      </div>
      
    </div>
  );
}