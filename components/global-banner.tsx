"use client";

import { AlertTriangle, Clock, X, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Settings {
  maintenanceMode: boolean;
  isOrderingOpen: boolean;
  orderCutoffTime: string; // Expected format "HH:MM" e.g., "10:30"
}

export function GlobalBanner({ settings }: { settings: Settings | null }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isPastCutoffTime, setIsPastCutoffTime] = useState(false);

  // LOGIC: Check if current time is past the cutoff time
  useEffect(() => {
    if (settings?.orderCutoffTime) {
      const checkTime = () => {
        const now = new Date();
        const [hours, minutes] = settings.orderCutoffTime.split(":").map(Number);
        const cutoff = new Date();
        cutoff.setHours(hours, minutes, 0, 0);

        setIsPastCutoffTime(now > cutoff);
      };

      checkTime(); // Run immediately
      const timer = setInterval(checkTime, 60000); // Re-check every minute
      return () => clearInterval(timer);
    }
  }, [settings?.orderCutoffTime]);

  if (!settings || !isVisible) return null;

  let content = null;
  let style = "";
  let icon = null;

  // PRIORITY 1: Maintenance Mode (Critical - Overrides everything)
  if (settings.maintenanceMode) {
    icon = <AlertTriangle className="h-5 w-5 text-white animate-pulse" />;
    content = (
      <div className="flex flex-col md:flex-row md:items-center gap-1">
        <span className="font-bold uppercase tracking-wider text-xs md:text-sm">System Maintenance</span>
        <span className="hidden md:inline text-white/40">|</span>
        <span className="text-sm">The portal is currently limited for scheduled updates.</span>
      </div>
    );
    style = "bg-red-700 text-white border-b border-red-800";
  } 
  // PRIORITY 2: Ordering Closed OR Past Cutoff Time
  // This ensures the banner shows if the admin manually closes it OR if the time has passed
  else if (!settings.isOrderingOpen || isPastCutoffTime) {
    icon = <Clock className="h-5 w-5 text-[#FFB81C]" />;
    content = (
      <div className="flex flex-col md:flex-row md:items-center gap-1">
        <span className="font-bold text-[#FFB81C] uppercase tracking-wider text-xs md:text-sm">
          Ordering Closed
        </span>
        <span className="hidden md:inline text-white/20">|</span>
        <span className="text-blue-50 text-sm">
          {/* Dynamic message based on why it is closed */}
          {isPastCutoffTime 
            ? `The ${settings.orderCutoffTime} cutoff has passed. Orders now apply to the next working day.`
            : "Meal orders are currently paused by the administrator."}
        </span>
      </div>
    );
    style = "bg-slate-900 text-white border-b border-slate-800 shadow-md";
  } 
  else {
    // Normal operation - don't show banner
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`relative z-[100] w-full ${style}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              {/* Message Content */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 p-1.5 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
                  {icon}
                </div>
                {content}
              </div>

              {/* Dismiss Button */}
              <button
                onClick={() => setIsVisible(false)}
                className="flex-shrink-0 ml-4 p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}