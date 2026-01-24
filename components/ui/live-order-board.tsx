"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  PackageCheck, 
  RefreshCcw, 
  Search,
  Filter,
  Calendar as CalendarIcon,
  AlertCircle,
  UtensilsCrossed,
  ArrowRight,
  MoreHorizontal
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateOrderStatus, getLiveOrders } from "@/app/actions/restaurant";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// --- TYPES ---
interface KitchenOrder {
  _id: string;
  pickupCode: string;
  status: "pending" | "confirmed" | "ready" | "picked_up" | "cancelled";
  totalAmount: number;
  createdAt: string; 
  note?: string;
  user: {
    name: string;
    department?: string;
    branch?: string;
    image?: string;
  };
  items: {
    name: string;
    quantity: number;
    notes?: string;
  }[];
}

export function LiveOrderBoard({ initialOrders }: { initialOrders: KitchenOrder[] }) {
  const [orders, setOrders] = useState<KitchenOrder[]>(initialOrders);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState(format(new Date(), "yyyy-MM-dd"));

  useEffect(() => {
    const interval = setInterval(() => fetchOrders(true), 30000); 
    return () => clearInterval(interval);
  }, [dateFilter]);

  const fetchOrders = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    const result = await getLiveOrders(dateFilter);
    if (result.success) {
      setOrders(result.orders as KitchenOrder[]);
    }
    if (!isBackground) setLoading(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const oldOrders = [...orders];
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus as any } : o));
    
    const result = await updateOrderStatus(orderId, newStatus);
    
    if (!result.success) {
      toast.error(result.error || "Update failed");
      setOrders(oldOrders);
    } else {
      const messages: Record<string, string> = {
        confirmed: "Order started",
        ready: "Order marked ready",
        picked_up: "Order completed",
        cancelled: "Order cancelled"
      };
      toast.success(messages[newStatus]);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        (order.pickupCode?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const pendingOrders = filteredOrders.filter(o => o.status === 'pending');
  const prepOrders = filteredOrders.filter(o => o.status === 'confirmed');
  const readyOrders = filteredOrders.filter(o => o.status === 'ready');
  const historyOrders = filteredOrders.filter(o => ['picked_up', 'cancelled'].includes(o.status));

  return (
    // MAIN WRAPPER: Fits within the dashboard pane without window scroll
    <div className="flex flex-col h-[calc(100vh-8rem)] w-full bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      
      {/* --- COMPACT HEADER --- */}
      <div className="px-3 py-2 bg-white border-b border-slate-200 shrink-0 z-10 flex flex-col sm:flex-row justify-between items-center gap-2">
          
          {/* Title Area */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="h-7 w-7 rounded bg-orange-600 flex items-center justify-center shrink-0">
               <ChefHat className="w-4 h-4 text-white" />
            </div>
            <div className="leading-none">
              <h1 className="text-sm font-bold text-slate-900">KDS Board</h1>
              <span className="text-[10px] text-slate-500 font-medium">{format(new Date(), "MMM dd")} • Live</span>
            </div>
          </div>

          {/* Compact Filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
              <div className="relative group shrink-0">
                 <Search className="absolute left-2 top-2 w-3 h-3 text-slate-400" />
                 <Input 
                   placeholder="Search..." 
                   className="pl-7 h-7 w-[120px] lg:w-[160px] bg-slate-50 border-slate-200 text-xs focus-visible:ring-1"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>

              <input 
                 type="date" 
                 className="h-7 w-[110px] text-xs bg-white border border-slate-200 rounded px-2 text-slate-700 shrink-0"
                 value={dateFilter}
                 onChange={(e) => setDateFilter(e.target.value)}
              />

              <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-7 w-7 bg-white border-slate-200 hover:bg-slate-50 shrink-0"
                  onClick={() => fetchOrders()}
                  disabled={loading}
              >
                  <RefreshCcw className={cn("w-3 h-3 text-slate-600", loading && "animate-spin")} />
              </Button>
          </div>
      </div>

      {/* --- RESPONSIVE GRID BOARD --- */}
      <div className="flex-1 overflow-hidden p-2 bg-slate-100/50">
         {/* Grid Layout: Stacks on mobile, 2 cols on tablet, 4 cols on desktop */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 h-full">
            
            <Column 
                title="New Orders" 
                count={pendingOrders.length} 
                accentColor="border-t-red-500"
                bgAccent="bg-red-50"
                icon={<AlertCircle className="w-3.5 h-3.5 text-red-600" />}
            >
                {pendingOrders.map(order => (
                    <OrderCard key={order._id} order={order} onAction={handleStatusChange} />
                ))}
            </Column>

            <Column 
                title="Prep" 
                count={prepOrders.length} 
                accentColor="border-t-blue-500"
                bgAccent="bg-blue-50"
                icon={<UtensilsCrossed className="w-3.5 h-3.5 text-blue-600" />}
            >
                {prepOrders.map(order => (
                    <OrderCard key={order._id} order={order} onAction={handleStatusChange} />
                ))}
            </Column>

            <Column 
                title="Ready" 
                count={readyOrders.length} 
                accentColor="border-t-emerald-500"
                bgAccent="bg-emerald-50"
                icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            >
                {readyOrders.map(order => (
                    <OrderCard key={order._id} order={order} onAction={handleStatusChange} />
                ))}
            </Column>

            <Column 
                title="Done" 
                count={historyOrders.length} 
                accentColor="border-t-slate-400"
                bgAccent="bg-slate-100"
                icon={<PackageCheck className="w-3.5 h-3.5 text-slate-500" />}
            >
                {historyOrders.map(order => (
                    <OrderCard key={order._id} order={order} onAction={handleStatusChange} locked />
                ))}
            </Column>

         </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: COLUMN ---
function Column({ title, count, children, accentColor, icon }: any) {
    return (
        <div className="flex flex-col h-full rounded-md bg-slate-50 border border-slate-200 overflow-hidden shadow-sm">
            {/* Header */}
            <div className={`px-2 py-2 bg-white border-b border-slate-100 flex justify-between items-center ${accentColor} border-t-[3px] shrink-0`}>
                <div className="flex items-center gap-1.5">
                    {icon}
                    <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wide">{title}</h3>
                </div>
                <Badge variant="secondary" className="font-mono text-[10px] h-5 min-w-[20px] justify-center font-bold bg-slate-100 text-slate-600 border-slate-200 px-1">
                    {count}
                </Badge>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-1.5 space-y-2 custom-scrollbar">
                {children.length > 0 ? children : (
                    <div className="h-24 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-md bg-slate-50/50">
                        <span className="text-[10px] font-medium uppercase tracking-wider opacity-60">Empty</span>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- SUB-COMPONENT: COMPACT CARD ---
function OrderCard({ order, onAction, locked = false }: { order: KitchenOrder, onAction: any, locked?: boolean }) {
    const isPending = order.status === 'pending';
    const isPrep = order.status === 'confirmed';
    const isReady = order.status === 'ready';

    return (
        <Card className={cn(
            "relative overflow-hidden transition-all duration-200 border-l-[3px] group",
            locked 
                ? "bg-slate-100/50 border-slate-200 opacity-60" 
                : "bg-white shadow-sm hover:shadow-md border-slate-200",
            isPending && !locked && "border-l-red-500",
            isPrep && !locked && "border-l-blue-500",
            isReady && !locked && "border-l-emerald-500"
        )}>
            <div className="p-2 space-y-1.5">
                
                {/* 1. Header: Code & Time */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1.5">
                        <span className="font-mono text-sm font-bold text-slate-800">#{order.pickupCode || "-"}</span>
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-1 rounded border border-slate-100">
                           {format(new Date(order.createdAt), "h:mm a")}
                        </span>
                    </div>
                    {/* Tiny User Avatar */}
                    <div className="flex items-center gap-1.5 max-w-[50%]">
                        <span className="text-[10px] font-semibold text-slate-600 truncate">{order.user?.name}</span>
                        <Avatar className="h-4 w-4 border border-slate-100">
                           <AvatarImage src={order.user?.image} />
                           <AvatarFallback className="text-[6px]">{order.user?.name?.slice(0,1)}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <Separator className="opacity-50" />

                {/* 2. Items List (Compact) */}
                <div className="space-y-0.5">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex items-start text-[11px] leading-tight">
                            <span className="font-bold text-slate-800 w-4 shrink-0">{item.quantity}</span>
                            <span className="text-slate-600 line-clamp-1">{item.name}</span>
                        </div>
                    ))}
                </div>

                {/* 3. Note */}
                {order.note && (
                    <div className="bg-amber-50 rounded px-1.5 py-1 border border-amber-100 mt-1">
                        <p className="text-[10px] font-medium text-amber-800 leading-tight line-clamp-2">
                            <span className="font-bold">Note:</span> {order.note}
                        </p>
                    </div>
                )}

                {/* 4. Actions (Hover to show on Desktop, Always on Mobile) */}
                {!locked && (
                    <div className="pt-1.5 flex gap-1.5">
                        {isPending && (
                            <>
                                <Button 
                                    variant="ghost" 
                                    className="h-6 px-2 text-[10px] text-slate-400 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => onAction(order._id, "cancelled")}
                                >
                                    Reject
                                </Button>
                                <Button 
                                    className="flex-1 h-6 text-[10px] bg-slate-900 hover:bg-slate-800"
                                    onClick={() => onAction(order._id, "confirmed")}
                                >
                                    Accept
                                </Button>
                            </>
                        )}
                        {isPrep && (
                            <Button 
                                className="w-full h-6 text-[10px] bg-blue-600 hover:bg-blue-700"
                                onClick={() => onAction(order._id, "ready")}
                            >
                                Mark Ready
                            </Button>
                        )}
                        {isReady && (
                            <Button 
                                className="w-full h-6 text-[10px] bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => onAction(order._id, "picked_up")}
                            >
                                Complete
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}