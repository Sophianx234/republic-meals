"use client";

import { useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { Save, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { publishWeeklySchedule } from "@/app/actions/restaurant";
import { Toaster } from "./sonner";

type FoodItem = { _id: string; name: string; category: string; price: number };

export function WeeklyPlanner({ allFoods }: { allFoods: FoodItem[] }) {
  const [isPending, setIsPending] = useState(false);

  // Get start of current week (Monday)
  const today = new Date();
  const startDate = startOfWeek(today, { weekStartsOn: 1 }); // 1 = Monday

  // State: A map of "DateString" -> [Array of Food IDs]
  // Example: { "2026-01-20": ["id1", "id2"] }
  const [schedule, setSchedule] = useState<Record<string, string[]>>({});

  const toggleFoodForDate = (dateStr: string, foodId: string) => {
    setSchedule((prev) => {
      const currentList = prev[dateStr] || [];
      if (currentList.includes(foodId)) {
        // Remove
        return {
          ...prev,
          [dateStr]: currentList.filter((id) => id !== foodId),
        };
      } else {
        // Add
        return { ...prev, [dateStr]: [...currentList, foodId] };
      }
    });
  };

  const handlePublish = async () => {
    setIsPending(true);

    // Transform state into array for Server Action
    const payload = Object.entries(schedule).map(([date, foodIds]) => ({
      date: new Date(date),
      foodIds,
    }));

    const result = await publishWeeklySchedule(payload);

    if (result.success) {
      toast.success("Weekly schedule published successfully!");
    } else {
      toast.error("Failed to save schedule");
    }
    setIsPending(false);
  };

  // Generate 5 days (Mon-Fri)
  const weekDays = Array.from({ length: 5 }).map((_, i) => {
    const date = addDays(startDate, i);
    return {
      label: format(date, "EEEE"), // "Monday"
      sub: format(date, "MMM d"), // "Jan 20"
      key: format(date, "yyyy-MM-dd"), // "2026-01-20"
      dateObj: date,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
        <div>
          <h2 className="text-lg font-bold">Weekly Planner</h2>
          <p className="text-sm text-gray-500">
            Select foods for {weekDays[0].sub} - {weekDays[4].sub}
          </p>
        </div>
        <Button onClick={handlePublish} disabled={isPending}>
          {isPending ? (
            <Loader2 className="animate-spin w-4 h-4 mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Publish Week
        </Button>
      </div>

      {/* The Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {weekDays.map((day) => (
          <div
            key={day.key}
            className="bg-white rounded-xl border flex flex-col h-[600px]"
          >
            {/* Column Header */}
            <div className="p-3 border-b bg-gray-50 text-center">
              <span className="block font-bold text-gray-900">{day.label}</span>
              <span className="text-xs text-gray-500">{day.sub}</span>
            </div>

            {/* Food List Checkboxes */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {allFoods.map((food) => {
                const isSelected = schedule[day.key]?.includes(food._id);
                return (
                  <div
                    key={food._id}
                    onClick={() => toggleFoodForDate(day.key, food._id)}
                    className={`
                      cursor-pointer text-sm p-2 rounded-lg border flex items-center gap-2 transition-all
                      ${
                        isSelected
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-white border-transparent hover:bg-gray-50 text-gray-600"
                      }
                    `}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium truncate">{food.name}</p>
                      <p className="text-xs opacity-70">GHS {food.price}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <Toaster />
      </div>
    </div>
  );
}
