"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  PackageCheck, 
  RefreshCcw, 
  Search,
  AlertCircle,
  UtensilsCrossed,
  Undo2,
  LayoutDashboard,
  List,
  Printer,
  FileText,
  SearchIcon
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
  const [dateFilter, setDateFilter] = useState(format(new Date(), "yyyy-MM-dd"));
  const [viewMode, setViewMode] = useState<"board" | "table">("board");

  // 1. DEFINE THE FUNCTION FIRST
  // We use useCallback to ensure the function identity is stable
  const fetchOrders = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    const result = await getLiveOrders(dateFilter);
    if (result.success) {
      setOrders(result.orders as KitchenOrder[]);
    }
    if (!isBackground) setLoading(false);
  }, [dateFilter]); // Re-create function only if date changes

  // 2. THEN USE IT IN USEEFFECT
  useEffect(() => {
    // Initial fetch
    fetchOrders();

    // Polling interval
    const interval = setInterval(() => fetchOrders(true), 30000); 
    return () => clearInterval(interval);
  }, [fetchOrders]); // Safe to add as dependency now

  // --- ACTIONS ---
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const oldOrders = [...orders];
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus as any } : o));
    
    const result = await updateOrderStatus(orderId, newStatus);
    
    if (!result.success) {
      toast.error(result.error || "Update failed");
      setOrders(oldOrders);
    } else {
        const messages: Record<string, string> = {
            pending: "Order reverted to Pending",
            confirmed: "Order moved to Prep",
            ready: "Order marked Ready",
            picked_up: "Order Completed",
            cancelled: "Order Cancelled"
        };
        toast.success(messages[newStatus] || "Status updated");
    }
  };

  // --- PRINT SINGLE RECEIPT LOGIC ---
  const handlePrint = (order: KitchenOrder) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const displayId = order.pickupCode || order._id.slice(-6).toUpperCase();

    const htmlContent = `
      <html>
        <head>
          <title>Order #${displayId}</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 20px; max-width: 300px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
            .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .meta { font-size: 12px; margin-bottom: 15px; }
            .footer { margin-top: 20px; border-top: 2px dashed #000; padding-top: 10px; text-align: center; font-size: 12px; }
            .bold { font-weight: bold; }
            @media print { @page { margin: 0; } body { padding: 10px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>REPUBLIC LUNCH</h2>
            <h1>#${displayId}</h1>
          </div>
          <div class="meta">
            <div><strong>Date:</strong> ${format(new Date(order.createdAt), "PPP p")}</div>
            <div><strong>Staff:</strong> ${order.user?.name}</div>
            <div><strong>Dept:</strong> ${order.user?.department || 'N/A'}</div>
          </div>
          <hr/>
          <div class="items">
            ${order.items.map(item => `
              <div class="item">
                <span>${item.quantity}x ${item.name}</span>
              </div>
              ${item.notes ? `<div style="font-size:10px; font-style:italic;">Note: ${item.notes}</div>` : ''}
            `).join('')}
          </div>
          <hr/>
          ${order.note ? `<div style="margin: 10px 0;"><strong>ORDER NOTE:</strong><br/>${order.note}</div>` : ''}
          <div class="footer">
            <p>Thank you!</p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // --- PRINT ALL (MANIFEST) LOGIC ---
  const handlePrintAll = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Use filtered orders to print exactly what the user sees
    const ordersToPrint = filteredOrders;

    const htmlContent = `
      <html>
        <head>
          <title>Kitchen Manifest - ${dateFilter}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h1 { text-align: center; font-size: 24px; margin-bottom: 5px; }
            .meta { text-align: center; margin-bottom: 20px; font-size: 14px; color: #555; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th { background: #eee; text-align: left; padding: 8px; border-bottom: 2px solid #ddd; }
            td { padding: 8px; border-bottom: 1px solid #ddd; vertical-align: top; }
            .status { font-weight: bold; text-transform: uppercase; font-size: 10px; }
            @media print { 
                @page { margin: 1cm; size: landscape; } 
                body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <h1>Kitchen Manifest</h1>
          <div class="meta">Date: ${format(new Date(dateFilter), "PPPP")} • Total Orders: ${ordersToPrint.length}</div>
          
          <table>
            <thead>
              <tr>
                <th width="10%">ID</th>
                <th width="10%">Time</th>
                <th width="20%">Staff Member</th>
                <th width="40%">Items & Notes</th>
                <th width="10%">Status</th>
              </tr>
            </thead>
            <tbody>
              ${ordersToPrint.map(order => `
                <tr>
                  <td><strong>#${order.pickupCode || order._id.slice(-6).toUpperCase()}</strong></td>
                  <td>${format(new Date(order.createdAt), "h:mm a")}</td>
                  <td>
                    <strong>${order.user?.name}</strong><br/>
                    <span style="color:#666">${order.user?.department || ''}</span>
                  </td>
                  <td>
                    ${order.items.map(i => `<div><b>${i.quantity}x</b> ${i.name}</div>`).join('')}
                    ${order.note ? `<div style="margin-top:4px; color:red; font-style:italic;">Note: ${order.note}</div>` : ''}
                  </td>
                  <td><span class="status">${order.status.replace('_', ' ')}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // --- FILTERING ---
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        (order.pickupCode?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [orders, searchQuery]);

  const pendingOrders = filteredOrders.filter(o => o.status === 'pending');
  const prepOrders = filteredOrders.filter(o => o.status === 'confirmed');
  const readyOrders = filteredOrders.filter(o => o.status === 'ready');
  const historyOrders = filteredOrders.filter(o => ['picked_up', 'cancelled'].includes(o.status));

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] w-full bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      
      {/* HEADER */}
      <div className="px-3 py-2 bg-white border-b border-slate-200 shrink-0 z-10 flex flex-col sm:flex-row justify-between items-center gap-2">
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded bg-[#007DC5] flex items-center justify-center shrink-0">
                <ChefHat className="w-4 h-4 text-white" />
                </div>
                <div className="leading-none">
                <h1 className="text-sm font-bold text-slate-900">KDS Board</h1>
                <span className="text-[10px] text-slate-500 font-medium">{format(new Date(), "MMM dd")} • Live</span>
                </div>
            </div>

            {/* View Switcher */}
            <div className="hidden sm:flex bg-slate-100 p-0.5 rounded-md border border-slate-200">
                <button 
                    onClick={() => setViewMode("board")}
                    className={cn("p-1.5 rounded text-xs font-medium flex items-center gap-1 transition-all", viewMode === "board" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                >
                    <LayoutDashboard className="w-3.5 h-3.5" /> Board
                </button>
                <button 
                    onClick={() => setViewMode("table")}
                    className={cn("p-1.5 rounded text-xs font-medium flex items-center gap-1 transition-all", viewMode === "table" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                >
                    <List className="w-3.5 h-3.5" /> Table
                </button>
            </div>
          </div>

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
              
              {/* PRINT ALL BUTTON */}
              <Button 
                variant="outline" 
                size="icon" 
                className="h-7 w-7 bg-white border-slate-200 hover:bg-slate-50 shrink-0" 
                onClick={handlePrintAll} 
                disabled={loading || filteredOrders.length === 0}
                title="Print All Orders"
              >
                  <Printer className="w-3 h-3 text-slate-600" />
              </Button>

              <Button variant="outline" size="icon" className="h-7 w-7 bg-white border-slate-200 hover:bg-slate-50 shrink-0" onClick={() => fetchOrders()} disabled={loading}>
                  <SearchIcon className={cn("w-3 h-3 text-slate-600", loading && "animate-spin")} />
              </Button>
          </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-hidden bg-slate-100/50">
         {viewMode === "board" ? (
             // --- BOARD VIEW ---
             <div className="p-2 h-full overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 h-full">
                    <Column title="New Orders" count={pendingOrders.length} accentColor="border-t-red-500" icon={<AlertCircle className="w-3.5 h-3.5 text-red-600" />}>
                        {pendingOrders.map(order => <OrderCard key={order._id.slice(0, 8)} order={order} onAction={handleStatusChange} onPrint={handlePrint} />)}
                    </Column>
                    <Column title="Prep" count={prepOrders.length} accentColor="border-t-blue-500" icon={<UtensilsCrossed className="w-3.5 h-3.5 text-blue-600" />}>
                        {prepOrders.map(order => <OrderCard key={order._id} order={order} onAction={handleStatusChange} onPrint={handlePrint} />)}
                    </Column>
                    <Column title="Ready" count={readyOrders.length} accentColor="border-t-emerald-500" icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}>
                        {readyOrders.map(order => <OrderCard key={order._id.slice(0, 8)} order={order} onAction={handleStatusChange} onPrint={handlePrint} />)}
                    </Column>
                    <Column title="Done" count={historyOrders.length} accentColor="border-t-slate-400" icon={<PackageCheck className="w-3.5 h-3.5 text-slate-500" />}>
                        {historyOrders.map(order => <OrderCard key={order._id.slice(0, 8)} order={order} onAction={handleStatusChange} onPrint={handlePrint} isHistory />)}
                    </Column>
                </div>
             </div>
         ) : (
             // --- TABLE VIEW ---
             <div className="h-full overflow-auto custom-scrollbar p-0 bg-white">
                <Table>
                    <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead className="w-[180px]">User</TableHead>
                            <TableHead className="w-[120px]">Time</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead className="w-[120px]">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-slate-500">No orders found.</TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map((order) => (
                                <TableRow key={order._id} className="hover:bg-slate-50">
                                    <TableCell className="font-mono font-medium">
                                        {/* Shows PickupCode if available, otherwise last 6 chars of ID */}
                                        #{order.pickupCode || order._id.slice(-6).toUpperCase()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={order.user?.image} />
                                                <AvatarFallback className="text-[10px]">{order.user?.name?.slice(0,1)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium leading-none">{order.user?.name}</span>
                                                <span className="text-[10px] text-slate-500">{order.user?.department}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-slate-500">
                                        {format(new Date(order.createdAt), "h:mm a")}
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-xs space-y-1">
                                            {order.items.map((item, i) => (
                                                <div key={i}><span className="font-bold">{item.quantity}x</span> {item.name}</div>
                                            ))}
                                            {order.note && (
                                                <div className="text-amber-600 font-medium text-[10px] flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> {order.note}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={order.status} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-800" onClick={() => handlePrint(order)}>
                                                <Printer className="w-4 h-4" />
                                            </Button>
                                            <TableActions order={order} onAction={handleStatusChange} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
             </div>
         )}
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function Column({ title, count, children, accentColor, icon }: any) {
    return (
        <div className="flex flex-col h-full rounded-md bg-slate-50 border border-slate-200 overflow-hidden shadow-sm">
            <div className={`px-2 py-2 bg-white border-b border-slate-100 flex justify-between items-center ${accentColor} border-t-[3px] shrink-0`}>
                <div className="flex items-center gap-1.5">{icon}<h3 className="font-bold text-slate-700 text-xs uppercase tracking-wide">{title}</h3></div>
                <Badge variant="secondary" className="font-mono text-[10px] h-5 min-w-[20px] justify-center font-bold bg-slate-100 text-slate-600 border-slate-200 px-1">{count}</Badge>
            </div>
            <div className="flex-1 overflow-y-auto p-1.5 space-y-2 custom-scrollbar">
                {children.length > 0 ? children : <div className="h-24 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-md bg-slate-50/50"><span className="text-[10px] font-medium uppercase tracking-wider opacity-60">Empty</span></div>}
            </div>
        </div>
    );
}

function TableActions({ order, onAction }: { order: KitchenOrder, onAction: any }) {
    if (order.status === 'pending') {
        return (
            <div className="flex gap-1">
                <Button size="sm" variant="outline" className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-50" onClick={() => onAction(order._id, "cancelled")}>Reject</Button>
                <Button size="sm" className="h-7 text-xs bg-slate-900" onClick={() => onAction(order._id, "confirmed")}>Accept</Button>
            </div>
        )
    }
    if (order.status === 'confirmed') {
        return (
            <div className="flex gap-1">
                 <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => onAction(order._id, "pending")}><Undo2 className="w-4 h-4" /></Button>
                 <Button size="sm" className="h-7 text-xs bg-blue-600" onClick={() => onAction(order._id, "ready")}>Ready</Button>
            </div>
        )
    }
    if (order.status === 'ready') {
        return (
            <div className="flex gap-1">
                 <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => onAction(order._id, "confirmed")}><Undo2 className="w-4 h-4" /></Button>
                 <Button size="sm" className="h-7 text-xs bg-emerald-600" onClick={() => onAction(order._id, "picked_up")}>Complete</Button>
            </div>
        )
    }
    // History
    return (
        <Button size="sm" variant="ghost" className="h-7 text-xs text-slate-500" onClick={() => onAction(order._id, order.status === 'cancelled' ? 'pending' : 'ready')}>
            <Undo2 className="w-3 h-3 mr-1" /> Reopen
        </Button>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        pending: "bg-red-100 text-red-700 border-red-200",
        confirmed: "bg-blue-100 text-blue-700 border-blue-200",
        ready: "bg-emerald-100 text-emerald-700 border-emerald-200",
        picked_up: "bg-slate-100 text-slate-700 border-slate-200",
        cancelled: "bg-gray-100 text-gray-500 border-gray-200 line-through"
    }
    return <Badge variant="outline" className={cn("capitalize text-[10px]", styles[status])}>{status.replace("_", " ")}</Badge>
}

function OrderCard({ order, onAction, onPrint, isHistory = false }: { order: KitchenOrder, onAction: any, onPrint: any, isHistory?: boolean }) {
    return (
        <Card className={cn(
            "relative overflow-hidden transition-all duration-200 border-l-[3px] group bg-white shadow-sm hover:shadow-md border-slate-200",
            isHistory && "bg-slate-50 opacity-75",
            order.status === 'pending' && "border-l-red-500",
            order.status === 'confirmed' && "border-l-blue-500",
            order.status === 'ready' && "border-l-emerald-500"
        )}>
            <div className="p-2 space-y-1.5">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1.5">
                        <span className="font-mono text-sm font-bold text-slate-800">#{order.pickupCode || "-"}</span>
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-1 rounded border border-slate-100">
                           {format(new Date(order.createdAt), "h:mm a")}
                        </span>
                    </div>
                    {/* Print Button (Hidden by default, shows on hover) */}
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-slate-300 hover:text-slate-600 -mt-1 -mr-1" onClick={() => onPrint(order)} title="Print Receipt">
                        <Printer className="w-3 h-3" />
                    </Button>
                </div>
                
                <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-50">
                    <Avatar className="h-4 w-4 border border-slate-100">
                        <AvatarImage src={order.user?.image} />
                        <AvatarFallback className="text-[6px]">{order.user?.name?.slice(0,1)}</AvatarFallback>
                    </Avatar>
                    <span className="text-[10px] font-semibold text-slate-600 truncate max-w-[120px]">{order.user?.name}</span>
                </div>

                <div className="space-y-0.5">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex items-start text-[11px] leading-tight">
                            <span className="font-bold text-slate-800 w-4 shrink-0">{item.quantity}x</span>
                            <span className="text-slate-600 line-clamp-1">{item.name}</span>
                        </div>
                    ))}
                </div>

                {order.note && (
                    <div className="bg-amber-50 rounded px-1.5 py-1 border border-amber-100 mt-1">
                        <p className="text-[10px] font-medium text-amber-800 leading-tight line-clamp-2">
                            <span className="font-bold">Note:</span> {order.note}
                        </p>
                    </div>
                )}

                <div className="pt-1.5">
                    <div className="flex gap-1.5">
                        {order.status === 'pending' && (
                            <>
                                <Button variant="ghost" className="h-6 px-2 text-[10px] text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => onAction(order._id, "cancelled")}>Reject</Button>
                                <Button className="flex-1 h-6 text-[10px] bg-slate-900 hover:bg-slate-800" onClick={() => onAction(order._id, "confirmed")}>Accept</Button>
                            </>
                        )}
                        {order.status === 'confirmed' && (
                            <>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-slate-700" onClick={() => onAction(order._id, "pending")}><Undo2 className="w-3.5 h-3.5" /></Button>
                                <Button className="flex-1 h-6 text-[10px] bg-blue-600 hover:bg-blue-700" onClick={() => onAction(order._id, "ready")}>Mark Ready</Button>
                            </>
                        )}
                        {order.status === 'ready' && (
                            <>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-slate-700" onClick={() => onAction(order._id, "confirmed")}><Undo2 className="w-3.5 h-3.5" /></Button>
                                <Button className="flex-1 h-6 text-[10px] bg-emerald-600 hover:bg-emerald-700" onClick={() => onAction(order._id, "picked_up")}>Complete</Button>
                            </>
                        )}
                        {isHistory && (
                             <div className="flex items-center justify-between w-full">
                                <Badge variant="outline" className="text-[9px] bg-slate-50">Done</Badge>
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-slate-400 hover:text-blue-600" onClick={() => onAction(order._id, order.status === 'cancelled' ? 'pending' : 'ready')}>
                                    <Undo2 className="w-3 h-3 mr-1" /> Reopen
                                </Button>
                            </div>
                        )}
                     </div>
                </div>
            </div>
        </Card>
    );
}