"use client";

import { useState, useMemo, useRef } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { Save, Loader2, Search, Filter, Check, CalendarDays, XCircle, Eye, UtensilsCrossed, Printer, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";
import { publishWeeklySchedule } from "@/app/actions/restaurant";

type FoodItem = { _id: string; name: string; category: string; price: number };

const getCategories = (foods: FoodItem[]) => {
  const cats = new Set(foods.map((f) => f.category));
  return ["All", ...Array.from(cats)];
};

export function WeeklyPlanner({ allFoods }: { allFoods: FoodItem[] }) {
  const [isPending, setIsPending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // --- PREVIEW STATE ---
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewDayIndex, setPreviewDayIndex] = useState(0); // 0 = Mon...
  const [previewMode, setPreviewMode] = useState<"daily" | "weekly">("daily");
  
  // Print Ref
  const printRef = useRef<HTMLDivElement>(null);

  // --- DATE LOGIC ---
  const today = new Date();
  const startDate = startOfWeek(today, { weekStartsOn: 1 }); 

  const weekDays = useMemo(() => Array.from({ length: 5 }).map((_, i) => {
    const date = addDays(startDate, i);
    return {
      label: format(date, "EEE"), 
      fullLabel: format(date, "EEEE"), 
      sub: format(date, "MMM d"), 
      key: format(date, "yyyy-MM-dd"), 
    };
  }), []);

  // --- SCHEDULE STATE ---
  const [schedule, setSchedule] = useState<Record<string, string[]>>({});

  const toggleCell = (dateKey: string, foodId: string) => {
    setSchedule((prev) => {
      const currentList = prev[dateKey] || [];
      const exists = currentList.includes(foodId);
      return {
        ...prev,
        [dateKey]: exists ? currentList.filter(id => id !== foodId) : [...currentList, foodId]
      };
    });
  };

  const toggleRowAllWeek = (foodId: string) => {
    const isAllEnabled = weekDays.every(day => schedule[day.key]?.includes(foodId));
    setSchedule(prev => {
      const next = { ...prev };
      weekDays.forEach(day => {
        const currentList = next[day.key] || [];
        if (isAllEnabled) {
          next[day.key] = currentList.filter(id => id !== foodId);
        } else {
          if (!currentList.includes(foodId)) next[day.key] = [...currentList, foodId];
        }
      });
      return next;
    });
  };

  const clearAll = () => {
    if(confirm("Are you sure you want to clear the entire schedule?")) {
        setSchedule({});
    }
  }

  // --- FILTERING ---
  const categories = useMemo(() => getCategories(allFoods), [allFoods]);
  
  const filteredFoods = useMemo(() => {
    return allFoods.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || food.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allFoods, searchTerm, selectedCategory]);

  // --- SUBMISSION ---
  const handlePublish = async () => {
    setIsPending(true);
    const payload = Object.entries(schedule).map(([date, foodIds]) => ({
      date: new Date(date),
      foodIds,
    }));

    try {
        const result = await publishWeeklySchedule(payload);
        if (result.success) {
          toast.success("Schedule published!");
        } else {
          toast.error("Failed to save.");
        }
    } catch (e) {
        toast.error("Error occurred.");
    }
    setIsPending(false);
  };

  // --- PREVIEW DATA HELPER ---
  const getPreviewFoods = (dayKey: string) => {
    const ids = schedule[dayKey] || [];
    return allFoods.filter(f => ids.includes(f._id));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 flex flex-col h-full max-h-[calc(100vh-100px)]">
      
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #printable-area, #printable-area * { visibility: visible; }
          #printable-area { position: absolute; left: 0; top: 0; width: 100%; }
          ::-webkit-scrollbar { display: none; }
        }
      `}</style>

      {/* --- HEADER --- */}
      <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4 flex-shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-black" />
                    Weekly Menu Planner
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Scheduling: <span className="font-medium text-gray-900">{weekDays[0].sub} - {weekDays[4].sub}</span>
                </p>
            </div>
            
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => setIsPreviewOpen(true)} className="text-black hover:bg-gray-100">
                    <Eye className="w-4 h-4 mr-2" /> Preview
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll} className="text-gray-500 hover:text-red-600 hover:border-red-200">
                    <XCircle className="w-4 h-4 mr-2" /> Clear
                </Button>
                <Button onClick={handlePublish} disabled={isPending} className="bg-black hover:bg-gray-800 text-white">
                    {isPending ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Publish
                </Button>
            </div>
        </div>

        {/* --- FILTERS --- */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                    placeholder="Search dishes..." 
                    className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-black"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="w-full sm:w-[200px]">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-black">
                        <Filter className="w-4 h-4 mr-2 text-gray-400" />
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </div>
      </div>

      {/* --- TABLE --- */}
      {/* Changed: Removed fixed h-[600px] inside and used absolute inset-0 to fill the flex container properly */}
      <div className="flex-1 bg-white rounded-xl border shadow-sm relative min-h-[300px] overflow-hidden">
        <div className="absolute inset-0 overflow-auto">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 text-gray-700 font-semibold sticky top-0 z-20 shadow-sm">
                    <tr>
                        <th className="p-4 sticky left-0 z-20 bg-gray-50 border-b min-w-[200px] md:min-w-[250px] shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                            Dish Details
                        </th>
                        {weekDays.map(day => (
                            <th key={day.key} className="p-3 border-b text-center min-w-[100px]">
                                <div className="flex flex-col items-center">
                                    <span className="text-sm font-bold">{day.label}</span>
                                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{day.sub}</span>
                                </div>
                            </th>
                        ))}
                        <th className="p-3 border-b text-center w-[80px] bg-gray-50">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">All</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredFoods.length === 0 ? (
                        <tr><td colSpan={7} className="p-8 text-center text-gray-500">No dishes found.</td></tr>
                    ) : (
                        filteredFoods.map((food) => {
                            const isAllSelected = weekDays.every(day => schedule[day.key]?.includes(food._id));
                            return (
                                <tr key={food._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="p-4 sticky left-0 bg-white group-hover:bg-gray-50 border-r border-gray-100 z-10 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900 truncate max-w-[180px]" title={food.name}>{food.name}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className="text-[10px] px-1.5 h-5 font-normal text-gray-500 bg-gray-100">{food.category}</Badge>
                                                <span className="text-xs text-gray-400">GHS 123</span>
                                            </div>
                                        </div>
                                    </td>
                                    {weekDays.map(day => {
                                        const isSelected = schedule[day.key]?.includes(food._id);
                                        return (
                                            <td key={`${food._id}-${day.key}`} className="p-2 text-center border-r border-gray-50 last:border-0">
                                                <button
                                                    onClick={() => toggleCell(day.key, food._id)}
                                                    className={`w-full h-12 rounded-lg flex items-center justify-center transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-black ${isSelected ? "bg-black border-black shadow-sm" : "bg-white border-gray-200 hover:border-gray-400 hover:bg-gray-50"}`}
                                                >
                                                    {isSelected && <Check className="w-5 h-5 text-white animate-in zoom-in-50" />}
                                                </button>
                                            </td>
                                        );
                                    })}
                                    <td className="p-2 text-center bg-gray-50/30">
                                        <button onClick={() => toggleRowAllWeek(food._id)} className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto transition-colors ${isAllSelected ? "bg-gray-200 text-black" : "text-gray-300 hover:text-black hover:bg-gray-100"}`}>
                                            <CalendarDays className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* --- PREVIEW MODAL --- */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[800px] h-[90vh] flex flex-col p-0 overflow-hidden">
            <div className="p-6 pb-2 border-b flex justify-between items-start">
                <div>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-black" />
                            Menu Preview
                        </DialogTitle>
                        <DialogDescription>
                            Review the schedule before publishing.
                        </DialogDescription>
                    </DialogHeader>
                </div>
                
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setPreviewMode("daily")}
                        className={`h-8 px-3 text-xs ${previewMode === 'daily' ? 'bg-white shadow-sm text-black font-medium' : 'text-gray-500 hover:text-black'}`}
                    >
                        <List className="w-3 h-3 mr-2" /> Interactive
                    </Button>
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setPreviewMode("weekly")}
                        className={`h-8 px-3 text-xs ${previewMode === 'weekly' ? 'bg-white shadow-sm text-black font-medium' : 'text-gray-500 hover:text-black'}`}
                    >
                        <LayoutGrid className="w-3 h-3 mr-2" /> Printable PDF
                    </Button>
                </div>
            </div>

            {/* --- DAILY INTERACTIVE MODE --- */}
            {previewMode === "daily" && (
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar: Days */}
                    <div className="w-1/3 bg-gray-50 border-r overflow-y-auto p-2 space-y-1">
                        {weekDays.map((day, index) => (
                            <button
                                key={day.key}
                                onClick={() => setPreviewDayIndex(index)}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${
                                    previewDayIndex === index 
                                    ? "bg-white shadow-sm ring-1 ring-black/5 font-semibold text-black border-l-4 border-black" 
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                            >
                                <span className="block">{day.fullLabel}</span>
                                <span className="text-xs opacity-60 font-normal">{day.sub}</span>
                            </button>
                        ))}
                    </div>

                    {/* Right Content: Menu for the Day */}
                    <div className="w-2/3 bg-white overflow-y-auto p-6">
                        <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">
                            {weekDays[previewDayIndex].fullLabel}'s Menu
                        </h3>
                        
                        {getPreviewFoods(weekDays[previewDayIndex].key).length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-400 border-2 border-dashed rounded-xl bg-gray-50">
                                <UtensilsCrossed className="w-8 h-8 mb-2 opacity-20" />
                                <p>No items scheduled</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {getPreviewFoods(weekDays[previewDayIndex].key).map(food => (
                                    <div key={food._id} className="flex items-center justify-between p-3 rounded-lg border hover:shadow-sm transition-shadow bg-white">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{food.name}</span>
                                            <Badge variant="outline" className="w-fit mt-1 text-[10px] text-gray-500 border-gray-300">
                                                {food.category}
                                            </Badge>
                                        </div>
                                        <span className="font-semibold text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                                            GHS 123
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- PRINTABLE WEEKLY MODE --- */}
            {previewMode === "weekly" && (
                <div className="flex-1 overflow-y-auto bg-gray-100 p-8 flex flex-col items-center">
                    
                    {/* Print Actions */}
                    <div className="w-full max-w-[210mm] flex justify-end mb-4">
                        <Button onClick={handlePrint} className="bg-black hover:bg-gray-800 text-white shadow-md">
                            <Printer className="w-4 h-4 mr-2" /> Print PDF
                        </Button>
                    </div>

                    {/* A4 Paper Simulation (Target for Print) */}
                    <div id="printable-area" ref={printRef} className="bg-white shadow-lg p-10 w-full max-w-[210mm] min-h-[297mm] text-black">
                        <div className="text-center border-b-2 border-black pb-4 mb-6">
                            <h1 className="text-3xl font-bold uppercase tracking-wide">Weekly Menu</h1>
                            <p className="text-gray-500 mt-2">
                                {weekDays[0].sub} — {weekDays[4].sub}
                            </p>
                        </div>

                        <div className="space-y-8">
                            {weekDays.map(day => {
                                const dayFoods = getPreviewFoods(day.key);
                                if (dayFoods.length === 0) return null;

                                return (
                                    <div key={day.key} className="break-inside-avoid">
                                        <h3 className="text-lg font-bold bg-gray-100 p-2 border-l-4 border-black mb-3 flex justify-between items-center">
                                            {day.fullLabel}
                                            <span className="text-sm font-normal text-gray-500">{day.sub}</span>
                                        </h3>
                                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 pl-4">
                                            {dayFoods.map(food => (
                                                <div key={food._id} className="flex justify-between items-baseline border-b border-dashed border-gray-200 pb-1">
                                                    <span className="font-medium">{food.name}</span>
                                                    <span className="text-sm text-gray-600">GHS 123</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                            
                            {Object.values(schedule).every(arr => arr.length === 0) && (
                                <div className="text-center py-20 text-gray-400">
                                    <p>No menu items scheduled for this week.</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-12 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
                            Generated on {format(new Date(), "PPP")}
                        </div>
                    </div>
                </div>
            )}
        </DialogContent>
      </Dialog>

      <Toaster position="top-right" />
    </div>
  );
}