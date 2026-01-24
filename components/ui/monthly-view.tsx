"use client";

import { useState, useEffect } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday,
  isPast,
  setHours,
  setMinutes
} from "date-fns";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Loader2, 
  UtensilsCrossed,
  Check,
  ShoppingBag,
  Trash2,
  Receipt,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; 
import { Badge } from "@/components/ui/badge";
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getMonthlySchedule, submitComboOrder, cancelScheduledOrder } from "@/app/actions/staff"; 
import { toast, Toaster } from "sonner";

// --- TYPES ---
type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string | null;
  isSoldOut: boolean;
};

type OrderSummary = {
    id: string;
    items: { 
        name: string; 
        quantity: number; 
        image: string | null; 
    }[];
    totalAmount: number;
    status: string;
    note?: string;
};

export function MonthlyView({ userId }: { userId: string }) { 
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [scheduleData, setScheduleData] = useState<Record<string, MenuItem[]>>({});
  const [userOrders, setUserOrders] = useState<Record<string, OrderSummary>>({});
  const [loading, setLoading] = useState(false);

  const [selectedItems, setSelectedItems] = useState<string[]>([]); 
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // --- FETCH DATA ---
  const fetchMonthData = async () => {
    setLoading(true);
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const result = await getMonthlySchedule(year, month, userId);
    
    if (result.success) {
      setScheduleData(result.data);
      setUserOrders(result.userOrders || {});
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMonthData();
  }, [currentMonth]);

  useEffect(() => {
    setSelectedItems([]);
    setNote("");
  }, [selectedDate]);

  // --- HANDLERS ---
  const toggleItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handlePreOrder = async () => {
    if (selectedItems.length === 0) return;
    setIsSubmitting(true);
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const payload = selectedItems.map(id => ({ foodId: id, quantity: 1 }));

    try {
        const result = await submitComboOrder(userId, payload, note, dateStr);
        if (result.success) {
            toast.success("Order Placed");
            await fetchMonthData(); 
            setSelectedItems([]);
            setNote("");
        } else {
            toast.error("Failed", { description: result.error });
        }
    } catch (e) {
        toast.error("Network Error");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
      setIsCancelling(true);
      try {
          const result = await cancelScheduledOrder(orderId, userId);
          if (result.success) {
              toast.success("Order Cancelled");
              await fetchMonthData(); 
          } else {
              toast.error("Failed", { description: result.error });
          }
      } catch (e) {
          toast.error("Network Error");
      } finally {
          setIsCancelling(false);
      }
  };

  // Logic Helpers
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  
  const selectedDateKey = format(selectedDate, "yyyy-MM-dd");
  const menuItems = scheduleData[selectedDateKey] || [];
  const existingOrder = userOrders[selectedDateKey];
  
  const isDatePast = isPast(selectedDate) && !isToday(selectedDate);
  const canOrder = !isDatePast && menuItems.length > 0;
  
  // Cutoff Logic: 8:30 AM on Selected Date
  const cutoffTime = setMinutes(setHours(new Date(selectedDate), 8), 30);
  const now = new Date();
  
  // Locked if: (Today AND > 8:30) OR (Date is in past)
  const isOrderLocked = (isToday(selectedDate) && now > cutoffTime) || isDatePast;

  const formTotal = menuItems
    .filter(i => selectedItems.includes(i.id))
    .reduce((sum, i) => sum + i.price, 0);

  // Calendar Grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
      
      {/* LEFT: CALENDAR */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6" />
              {format(currentMonth, "MMMM yyyy")}
            </h1>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="py-3 text-center text-xs font-semibold text-gray-400 uppercase">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const hasMenu = scheduleData[dateKey]?.length > 0;
              const hasOrder = !!userOrders[dateKey];
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "min-h-[100px] p-2 border-b border-r border-gray-100 flex flex-col items-start justify-between transition-colors relative hover:bg-gray-50",
                    !isCurrentMonth && "bg-gray-50/30 text-gray-300",
                    isSelected && "bg-blue-50/50 ring-2 ring-inset ring-blue-500 z-10"
                  )}
                >
                  <span className={cn(
                    "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                    isToday(day) ? "bg-blue-600 text-white shadow-sm" : "text-gray-700",
                    !isCurrentMonth && "text-gray-300"
                  )}>
                    {format(day, "d")}
                  </span>
                  <div className="w-full flex gap-1 mt-2 flex-wrap content-end">
                    {hasOrder ? (
                         <div className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 w-full truncate border border-blue-200">
                            <Check className="w-3 h-3" /> Order
                         </div>
                    ) : hasMenu ? (
                        scheduleData[dateKey].slice(0, 3).map((item, i) => (
                           <div key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        ))
                    ) : isCurrentMonth && <span className="text-[10px] text-gray-300">-</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: DETAILS PANEL */}
      <div className="lg:col-span-4 space-y-6">
        <div className={cn(
            "bg-white rounded-2xl border shadow-sm p-6 sticky top-24 min-h-[400px] flex flex-col",
            isDatePast ? "border-gray-200 bg-gray-50" : "border-blue-100 shadow-md ring-1 ring-blue-50"
        )}>
            
            <div className="pb-4 border-b border-gray-100 mb-4">
               <h2 className="text-xl font-bold text-gray-900">{format(selectedDate, "EEEE, MMMM do")}</h2>
               {isDatePast ? (
                   <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded mt-2 inline-block">Past Date</span>
               ) : existingOrder ? (
                   <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded mt-2 inline-block flex items-center gap-1 w-fit">
                        <Check className="w-3 h-3" /> Order Confirmed
                   </span>
               ) : (
                   <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded mt-2 inline-block">
                       {menuItems.length > 0 ? "Accepting Orders" : "No Menu Published"}
                   </span>
               )}
            </div>

            {existingOrder ? (
                // --- EXISTING ORDER VIEW ---
                <div className="flex-1 flex flex-col animate-in fade-in">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <Receipt className="w-4 h-4"/> Your Meal
                            </h3>
                            <Badge variant="outline" className="bg-white capitalize">{existingOrder.status}</Badge>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                            {existingOrder.items.map((item, idx) => (
                                <div key={idx} className="flex gap-3 items-center bg-white p-2 rounded border border-gray-100 shadow-sm">
                                    <div className="w-10 h-10 relative bg-gray-100 rounded overflow-hidden shrink-0">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        ) : <UtensilsCrossed className="w-4 h-4 m-auto text-gray-400"/>}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 leading-tight">{item.name}</p>
                                    </div>
                                    <Badge variant="secondary" className="font-mono text-xs">x{item.quantity}</Badge>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900">
                            <span>Total</span>
                            <span>₵{existingOrder.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    {existingOrder.note && (
                        <div className="mb-6 p-3 bg-blue-50 rounded-md text-xs text-blue-800 border border-blue-100">
                            <span className="font-bold block mb-1">Your Note:</span> 
                            {existingOrder.note}
                        </div>
                    )}

                    <div className="mt-auto">
                        {isOrderLocked ? (
                            <div className="p-3 bg-amber-50 text-amber-800 rounded-md flex items-start gap-2 text-xs border border-amber-100">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>Cancellation is unavailable. The 8:30 AM cutoff has passed.</span>
                            </div>
                        ) : (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="w-full bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:text-red-700">
                                        {isCancelling ? <Loader2 className="animate-spin w-4 h-4"/> : <Trash2 className="w-4 h-4 mr-2" />}
                                        Cancel Order
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Cancel meal for {format(selectedDate, "MMM do")}?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will remove your order from the kitchen queue.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Keep Order</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleCancelOrder(existingOrder.id)} className="bg-red-600 hover:bg-red-700">
                                            Yes, Cancel
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                </div>
            ) : (
                // --- PRE-ORDER FORM ---
                <>
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[50vh]">
                    {menuItems.length > 0 ? (
                        menuItems.map((item) => {
                        const isChecked = selectedItems.includes(item.id);
                        return (
                            <div 
                                key={item.id} 
                                onClick={() => canOrder && toggleItem(item.id)}
                                className={cn(
                                    "group flex gap-3 items-center p-3 rounded-lg border transition-all cursor-pointer",
                                    isChecked ? "border-blue-500 bg-blue-50/50" : "border-gray-100 hover:border-blue-200 hover:bg-gray-50",
                                    !canOrder && "opacity-60 cursor-not-allowed grayscale"
                                )}
                            >
                                <div className={cn(
                                    "w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0",
                                    isChecked ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 bg-white"
                                )}>
                                    {isChecked && <Check className="w-3 h-3" />}
                                </div>
                                <div className="w-12 h-12 relative bg-gray-200 rounded overflow-hidden shrink-0">
                                {item.image ? (
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                ) : <UtensilsCrossed className="w-4 h-4 m-auto text-gray-400"/>}
                                </div>
                                <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 leading-none">{item.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                                </div>
                                <span className="text-sm font-mono font-bold text-gray-900">₵{item.price}</span>
                            </div>
                        );
                        })
                    ) : (
                        <div className="text-center py-10 text-gray-400">
                        <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No menu for this date.</p>
                        </div>
                    )}
                    </div>

                    {canOrder && menuItems.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-gray-100 space-y-4">
                            <Textarea 
                                placeholder="Special instructions (e.g. No pepper)..."
                                className="text-xs resize-none bg-gray-50"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600">Total</span>
                                <span className="text-xl font-bold text-gray-900">₵{formTotal.toFixed(2)}</span>
                            </div>
                            <Button 
                                className="w-full bg-gray-900 hover:bg-gray-800" 
                                disabled={selectedItems.length === 0 || isSubmitting}
                                onClick={handlePreOrder}
                            >
                                {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <ShoppingBag className="mr-2 h-4 w-4"/>}
                                {isToday(selectedDate) ? "Order Now" : `Pre-order for ${format(selectedDate, "MMM d")}`}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
        <Toaster position="top-right" />
      </div>
    </div>
  );
}