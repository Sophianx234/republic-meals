"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { format, startOfWeek, endOfWeek, isSameDay, parseISO } from "date-fns";
import { Calendar, History, Printer, Filter as FilterIcon, Utensils } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// --- Types ---
type FoodItem = { _id: string; name: string; category: string; price: number };
type DailyMenu = { date: string; items: FoodItem[] };

interface MenuHistoryProps {
  initialData: DailyMenu[];
  selectedYear: string;
  selectedMonth: string;
}

export function MenuHistory({ initialData, selectedYear, selectedMonth }: MenuHistoryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- PRINT STATE ---
  const [printData, setPrintData] = useState<{ weekStart: string; days: DailyMenu[] } | null>(null);

  // --- FILTER HANDLER (Updates URL, Server Component Refetches) ---
  const handleFilterChange = (key: "year" | "month", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    // Replace current URL with new params. 
    // This triggers the page.tsx to re-run and pass new `initialData`.
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // --- GROUPING LOGIC (Same as before) ---
  const historyByWeek = useMemo(() => {
    const groups: Record<string, DailyMenu[]> = {};
    initialData.forEach((entry) => {
      const date = parseISO(entry.date);
      const weekStart = format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
      if (!groups[weekStart]) groups[weekStart] = [];
      groups[weekStart].push(entry);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [initialData]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #history-printable, #history-printable * { visibility: visible; }
          #history-printable { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>

      {/* --- HEADER & FILTERS --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-1">
        <div>
           <h3 className="text-lg font-medium flex items-center gap-2">
               <History className="w-5 h-5 text-gray-500" />
               Past Schedules
           </h3>
           <p className="text-sm text-muted-foreground">Browse and reprint previous weekly menus.</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm">
            <FilterIcon className="w-4 h-4 text-gray-400 ml-2" />
            
            {/* Month Select */}
            <Select 
                value={selectedMonth} 
                onValueChange={(val) => handleFilterChange("month", val)}
            >
                <SelectTrigger className="w-[140px] border-0 bg-transparent focus:ring-0 h-8 font-medium">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                            {format(new Date(2000, i, 1), "MMMM")}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <span className="text-gray-300">|</span>

            {/* Year Select */}
            <Select 
                value={selectedYear} 
                onValueChange={(val) => handleFilterChange("year", val)}
            >
                <SelectTrigger className="w-[100px] border-0 bg-transparent focus:ring-0 h-8 font-medium">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {[2024, 2025, 2026, 2027].map((year) => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <ScrollArea className="flex-1 h-[600px] pr-4">
        <div className="space-y-6">
          {historyByWeek.map(([weekStart, days]) => {
            const startDate = parseISO(weekStart);
            const endDate = endOfWeek(startDate, { weekStartsOn: 1 });
            const totalItems = days.reduce((acc, d) => acc + d.items.length, 0);

            return (
              <Card key={weekStart} className="overflow-hidden   shadow-sm hover:shadow-md transition-shadow group">
                <CardHeader className="bg-gray-50/50 py-3 border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Week of {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
                    </CardTitle>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-white border-gray-200 text-gray-600 font-normal">
                         {totalItems} Items
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 px-2 text-gray-500 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setPrintData({ weekStart, days })}
                      >
                        <Printer className="w-3 h-3 mr-1.5" /> Print
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    {[0, 1, 2, 3, 4].map((offset) => {
                      const currentDay = new Date(startDate);
                      currentDay.setDate(startDate.getDate() + offset);
                      const dateKey = format(currentDay, "yyyy-MM-dd");
                      const dayMenu = days.find((d) => d.date === dateKey);
                      const isToday = isSameDay(currentDay, new Date());

                      return (
                        <div key={offset} className={`p-4 flex flex-col gap-2 min-h-[120px] ${isToday ? 'bg-blue-50/20' : ''}`}>
                          <div className="flex flex-col mb-1">
                            <span className="text-xs font-bold uppercase text-gray-500">
                               {format(currentDay, "EEEE")}
                            </span>
                            <span className="text-xs text-gray-400">
                               {format(currentDay, "MMM d")}
                            </span>
                          </div>

                          {dayMenu ? (
                            <div className="space-y-2">
                              {dayMenu.items.map((item) => (
                                <div key={item._id} className="text-sm bg-gray-50 p-2 rounded border border-gray-100">
                                  <p className="font-medium text-gray-900 leading-tight">{item.name}</p>
                                  <p className="text-[10px] text-gray-500 mt-1">GHS {item.price}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg">
                               <span className="text-[10px] text-gray-300 uppercase">No Menu</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {historyByWeek.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed">
                <Utensils className="w-10 h-10 mb-3 opacity-20" />
                <p>No menus found for {format(new Date(parseInt(selectedYear), parseInt(selectedMonth)), "MMMM yyyy")}.</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* --- PRINT PREVIEW DIALOG --- */}
      <Dialog open={!!printData} onOpenChange={(open) => !open && setPrintData(null)}>
        <DialogContent className="max-w-[800px] h-[90vh] flex flex-col p-0 overflow-hidden">
             <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <DialogTitle className="flex items-center gap-2 text-base">
                    <Printer className="w-4 h-4" /> Print Preview
                </DialogTitle>
                <Button onClick={handlePrint} className="bg-black hover:bg-gray-800 text-white">
                    Print Now
                </Button>
             </div>

             <div className="flex-1 bg-gray-100 overflow-y-auto p-8 flex justify-center">
                 {printData && (() => {
                     const startDate = parseISO(printData.weekStart);
                     const endDate = endOfWeek(startDate, { weekStartsOn: 1 });
                     return (
                        <div id="history-printable" className="bg-white shadow-lg p-10 w-full max-w-[210mm] min-h-[297mm] text-black">
                            <div className="text-center border-b-2 border-black pb-4 mb-6">
                                <h1 className="text-3xl font-bold uppercase tracking-wide">Weekly Menu</h1>
                                <p className="text-gray-500 mt-2">
                                    {format(startDate, "MMMM d")} — {format(endDate, "MMMM d, yyyy")}
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[0, 1, 2, 3, 4].map((offset) => {
                                    const currentDay = new Date(startDate);
                                    currentDay.setDate(startDate.getDate() + offset);
                                    const dateKey = format(currentDay, "yyyy-MM-dd");
                                    const dayMenu = printData.days.find((d) => d.date === dateKey);
                                    
                                    if (!dayMenu) return null; 

                                    return (
                                        <div key={offset} className="break-inside-avoid">
                                            <h3 className="text-lg font-bold bg-gray-100 p-2 border-l-4 border-black mb-3 flex justify-between items-center">
                                                {format(currentDay, "EEEE")}
                                                <span className="text-sm font-normal text-gray-500">{format(currentDay, "MMM d")}</span>
                                            </h3>
                                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 pl-4">
                                                {dayMenu.items.map(item => (
                                                    <div key={item._id} className="flex justify-between items-baseline border-b border-dashed border-gray-200 pb-1">
                                                        <span className="font-medium">{item.name}</span>
                                                        <span className="text-sm text-gray-600">GHS {item.price}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-12 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
                                Republic Lunch • Printed on {format(new Date(), "PPP")}
                            </div>
                        </div>
                     );
                 })()}
             </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}