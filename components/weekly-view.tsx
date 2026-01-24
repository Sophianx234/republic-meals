"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  UtensilsCrossed, 
  Clock,
  ArrowRight,
  ChefHat
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { format, isToday } from "date-fns"; 
// Note: npm install date-fns if you haven't, or use native JS formatting

type ScheduleDay = {
  date: Date;
  dayName: string;
  items: {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string | null;
    isSoldOut: boolean;
  }[];
};

export function WeeklyView({ schedule }: { schedule: ScheduleDay[] }) {
  // Find index of today, otherwise default to Monday (0)
  const todayIndex = schedule.findIndex(d => isToday(d.date));
  const [activeIndex, setActiveIndex] = useState(todayIndex !== -1 ? todayIndex : 0);

  const activeDay = schedule[activeIndex];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-gray-900" />
            Weekly Menu
          </h1>
          <p className="text-sm text-gray-500">Preview upcoming meals for the week.</p>
        </div>
        
        {/* Date Badge */}
        <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-xs font-semibold font-mono">
           {format(schedule[0].date, "MMM d")} - {format(schedule[4].date, "MMM d")}
        </div>
      </div>

      {/* --- DAY TABS --- */}
      <div className="flex overflow-x-auto pb-2 gap-3 scrollbar-hide">
        {schedule.map((day, index) => {
          const isSelected = activeIndex === index;
          const isCurrent = isToday(day.date);
          const hasFood = day.items.length > 0;

          return (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative flex-shrink-0 min-w-[100px] flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 border",
                isSelected 
                  ? "bg-gray-900 text-white border-gray-900 shadow-lg scale-105 z-10" 
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                isCurrent && !isSelected && "ring-2 ring-blue-100 bg-blue-50/50"
              )}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-70">
                {day.dayName.slice(0, 3)}
              </span>
              <span className={cn("text-2xl font-bold", isSelected ? "text-white" : "text-gray-900")}>
                {format(day.date, "d")}
              </span>
              
              {/* Dots for status */}
              <div className="flex gap-1 mt-2 justify-center">
                {hasFood ? (
                   <div className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-emerald-400" : "bg-emerald-500")} />
                ) : (
                   <div className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-gray-600" : "bg-gray-300")} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Header for the Day */}
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">{activeDay.dayName}</h2>
              {isToday(activeDay.date) && (
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Today
                </span>
              )}
            </div>

            {/* Empty State */}
            {activeDay.items.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl">
                 <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-gray-100">
                   <ChefHat className="w-8 h-8 text-gray-300" />
                 </div>
                 <p className="text-gray-900 font-medium">Menu Not Available</p>
                 <p className="text-gray-500 text-sm">The kitchen hasn't posted the menu for {activeDay.dayName} yet.</p>
               </div>
            ) : (
              // Grid of Food Items
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeDay.items.map((item) => (
                  <div 
                    key={item.id} 
                    className="group bg-white border border-gray-200 rounded-lg overflow-hidden flex hover:shadow-md transition-all duration-300"
                  >
                    {/* Small Image */}
                    <div className="w-28 h-28 relative bg-gray-100 shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <UtensilsCrossed className="w-6 h-6" />
                        </div>
                      )}
                      {item.isSoldOut && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="text-[10px] font-bold bg-white px-2 py-1 rounded shadow-sm text-red-600 border border-red-100 uppercase">Sold Out</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 px-1.5 py-0.5 rounded-sm border border-gray-100">{item.category}</span>
                          <span className="font-mono text-sm font-bold text-gray-900">₵{item.price}</span>
                        </div>
                        <h3 className="font-medium text-gray-900 leading-snug mt-2 line-clamp-2">{item.name}</h3>
                      </div>
                      
                      {/* Action Area */}
                      <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-end">
                        {isToday(activeDay.date) ? (
                           <Link 
                             href="/staff/order" 
                             className="text-xs font-semibold text-gray-900 flex items-center gap-1 hover:gap-2 transition-all hover:text-blue-600"
                           >
                             Order Now <ArrowRight className="w-3 h-3" />
                           </Link>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                             <Clock className="w-3 h-3" />
                             <span>{activeDay.dayName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}