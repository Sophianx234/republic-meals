"use client";

import { useState, useMemo } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { Save, Loader2, Search, Filter, Check, CalendarDays, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { publishWeeklySchedule } from "@/app/actions/restaurant";
import { Toaster } from "sonner"; // Ensure you are importing from your configured toaster

type FoodItem = { _id: string; name: string; category: string; price: number };

// Helper to get distinct categories
const getCategories = (foods: FoodItem[]) => {
  const cats = new Set(foods.map((f) => f.category));
  return ["All", ...Array.from(cats)];
};

export function WeeklyPlanner({ allFoods }: { allFoods: FoodItem[] }) {
  const [isPending, setIsPending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // --- DATE LOGIC ---
  const today = new Date();
  const startDate = startOfWeek(today, { weekStartsOn: 1 }); // Monday start

  // Generate 5 days (Mon-Fri)
  const weekDays = useMemo(() => Array.from({ length: 5 }).map((_, i) => {
    const date = addDays(startDate, i);
    return {
      label: format(date, "EEE"), // "Mon"
      fullLabel: format(date, "EEEE"), // "Monday"
      sub: format(date, "MMM d"), // "Jan 20"
      key: format(date, "yyyy-MM-dd"), // "2026-01-20"
    };
  }), []);

  // --- STATE MANAGEMENT ---
  // Map: { "2026-01-20": ["foodId1", "foodId2"] }
  const [schedule, setSchedule] = useState<Record<string, string[]>>({});

  // 1. Toggle Single Cell
  const toggleCell = (dateKey: string, foodId: string) => {
    setSchedule((prev) => {
      const currentList = prev[dateKey] || [];
      const exists = currentList.includes(foodId);
      
      return {
        ...prev,
        [dateKey]: exists 
          ? currentList.filter(id => id !== foodId) 
          : [...currentList, foodId]
      };
    });
  };

  // 2. Toggle Entire Row (Make item available all week)
  const toggleRowAllWeek = (foodId: string) => {
    // Check if currently enabled for ALL days
    const isAllEnabled = weekDays.every(day => schedule[day.key]?.includes(foodId));

    setSchedule(prev => {
      const next = { ...prev };
      weekDays.forEach(day => {
        const currentList = next[day.key] || [];
        if (isAllEnabled) {
          // Remove from all
          next[day.key] = currentList.filter(id => id !== foodId);
        } else {
          // Add to all (if not already there)
          if (!currentList.includes(foodId)) {
            next[day.key] = [...currentList, foodId];
          }
        }
      });
      return next;
    });
  };

  // 3. Clear Schedule
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
          toast.success("Weekly schedule published successfully!");
        } else {
          toast.error("Failed to save schedule.");
        }
    } catch (e) {
        toast.error("An unexpected error occurred.");
    }
    setIsPending(false);
  };

  return (
    <div className="space-y-6 flex flex-col h-full max-h-[calc(100vh-100px)]">
      
      {/* --- HEADER SECTION --- */}
      <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                    Weekly Menu Planner
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Scheduling for: <span className="font-medium text-gray-900">{weekDays[0].sub} - {weekDays[4].sub}</span>
                </p>
            </div>
            
            <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={clearAll} className="text-gray-500 hover:text-red-600">
                    <XCircle className="w-4 h-4 mr-2" /> Clear
                </Button>
                <Button onClick={handlePublish} disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
                    {isPending ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Publish Schedule
                </Button>
            </div>
        </div>

        {/* --- FILTERS --- */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                    placeholder="Search dishes..." 
                    className="pl-9 bg-gray-50 border-gray-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="w-full sm:w-[200px]">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
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

      {/* --- TABLE AREA (Scrollable) --- */}
      <div className="flex-1 overflow-hidden bg-white rounded-xl border shadow-sm relative">
        <div className="overflow-auto h-[600px] w-full">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 text-gray-700 font-semibold sticky top-0 z-20 shadow-sm">
                    <tr>
                        {/* Sticky Column Header */}
                        <th className="p-4 sticky left-0 z-20 bg-gray-50 border-b min-w-[200px] md:min-w-[250px]">
                            Dish Details
                        </th>
                        
                        {/* Day Headers */}
                        {weekDays.map(day => (
                            <th key={day.key} className="p-3 border-b text-center min-w-[100px]">
                                <div className="flex flex-col items-center">
                                    <span className="text-sm font-bold">{day.label}</span>
                                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{day.sub}</span>
                                </div>
                            </th>
                        ))}

                        {/* Actions Header */}
                        <th className="p-3 border-b text-center w-[80px] bg-gray-50">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">All Week</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredFoods.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="p-8 text-center text-gray-500">
                                No dishes found matching your search.
                            </td>
                        </tr>
                    ) : (
                        filteredFoods.map((food) => {
                            // Helper to check if row is fully selected
                            const isAllSelected = weekDays.every(day => schedule[day.key]?.includes(food._id));

                            return (
                                <tr key={food._id} className="hover:bg-gray-50 transition-colors group">
                                    {/* Sticky First Column: Food Info */}
                                    <td className="p-4 sticky left-0 bg-white group-hover:bg-gray-50 border-r border-gray-100 z-10">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900 truncate max-w-[180px]" title={food.name}>
                                                {food.name}
                                            </span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className="text-[10px] px-1.5 h-5 font-normal text-gray-500 bg-gray-100">
                                                    {food.category}
                                                </Badge>
                                                <span className="text-xs text-gray-400">GHS 123</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Days Columns */}
                                    {weekDays.map(day => {
                                        const isSelected = schedule[day.key]?.includes(food._id);
                                        return (
                                            <td key={`${food._id}-${day.key}`} className="p-2 text-center border-r border-gray-50 last:border-0">
                                                <button
                                                    onClick={() => toggleCell(day.key, food._id)}
                                                    className={`
                                                        w-full h-12 rounded-lg flex items-center justify-center transition-all duration-200 border
                                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                                                        ${isSelected 
                                                            ? "bg-blue-600 border-blue-600 shadow-sm" 
                                                            : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                                                        }
                                                    `}
                                                    title={`Serve ${food.name} on ${day.fullLabel}`}
                                                >
                                                    {isSelected && <Check className="w-5 h-5 text-white animate-in zoom-in-50 duration-200" />}
                                                </button>
                                            </td>
                                        );
                                    })}

                                    {/* All Week Toggle Column */}
                                    <td className="p-2 text-center bg-gray-50/30">
                                        <button
                                            onClick={() => toggleRowAllWeek(food._id)}
                                            className={`
                                                w-8 h-8 rounded-full flex items-center justify-center mx-auto transition-colors
                                                ${isAllSelected 
                                                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200" 
                                                    : "text-gray-300 hover:text-blue-600 hover:bg-gray-100"
                                                }
                                            `}
                                            title={isAllSelected ? "Remove from all days" : "Add to all days"}
                                        >
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
      <Toaster position="top-right" />
    </div>
  );
}