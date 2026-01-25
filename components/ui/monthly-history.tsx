"use client";

import { useState, useEffect } from "react";
import { 
  CalendarDays, 
  Printer, 
  Search, 
  FileText,
  Users,
  ShoppingBag,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getMonthlyOrders } from "@/app/actions/restaurant";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function MonthlyHistory() {
  // Default to current month "YYYY-MM"
  const currentMonth = format(new Date(), "yyyy-MM");
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, uniqueUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Data when Month Changes
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const result = await getMonthlyOrders(selectedMonth);
      if (result.success) {
        setOrders(result.orders);
        setStats(result.stats);
      } else {
        toast.error("Failed to load history");
      }
      setLoading(false);
    }
    fetchData();
  }, [selectedMonth]);

  // Client-side Filter
  const filteredOrders = orders.filter(o => 
    o.pickupCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- PRINT FUNCTION ---
  const handlePrintMonth = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Use filtered orders so user can print specific subsets if they searched
    const ordersToPrint = filteredOrders;
    const monthLabel = format(parseISO(selectedMonth + "-01"), "MMMM yyyy");

    const htmlContent = `
      <html>
        <head>
          <title>Monthly Report - ${monthLabel}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; font-size: 12px; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            h1 { margin: 0; font-size: 24px; text-transform: uppercase; }
            .meta { color: #666; margin-top: 5px; }
            
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #f3f4f6; text-align: left; padding: 8px; border-bottom: 1px solid #000; font-weight: bold; }
            td { padding: 8px; border-bottom: 1px solid #ddd; vertical-align: top; }
            
            .stats { display: flex; justify-content: space-between; margin-bottom: 20px; background: #f9fafb; padding: 10px; border: 1px solid #e5e7eb; }
            .stat-box { text-align: center; }
            .stat-val { font-size: 18px; font-weight: bold; }
            .stat-label { font-size: 10px; text-transform: uppercase; color: #666; }

            @media print { 
               @page { margin: 1cm; }
               body { -webkit-print-color-adjust: exact; } 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Sales Archive</h1>
            <div class="meta">Period: ${monthLabel}</div>
          </div>

          <div class="stats">
             <div class="stat-box">
                <div class="stat-val">${ordersToPrint.length}</div>
                <div class="stat-label">Total Orders</div>
             </div>
             <div class="stat-box">
                <div class="stat-val">${new Set(ordersToPrint.map(o => o.user?.name)).size}</div>
                <div class="stat-label">Unique Staff</div>
             </div>
             <div class="stat-box">
                <div class="stat-val">${format(new Date(), "PP p")}</div>
                <div class="stat-label">Printed On</div>
             </div>
          </div>

          <table>
            <thead>
              <tr>
                <th width="15%">Date</th>
                <th width="10%">Code</th>
                <th width="25%">Staff Member</th>
                <th width="40%">Order Details</th>
                <th width="10%">Status</th>
              </tr>
            </thead>
            <tbody>
              ${ordersToPrint.map(order => `
                <tr>
                  <td>${format(parseISO(order.createdAt), "MMM d, h:mm a")}</td>
                  <td><strong>#${order.pickupCode || order._id.slice(-6).toUpperCase()}</strong></td>
                  <td>
                    ${order.user?.name || "Unknown"}<br/>
                    <span style="color:#666; font-size:10px;">${order.user?.department || ""}</span>
                  </td>
                  <td>
                    ${order.items.map((i: any) => `<div>${i.quantity}x ${i.name}</div>`).join('')}
                  </td>
                  <td>${order.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      
      {/* --- CONTROL BAR --- */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-md border border-slate-200">
                <CalendarDays className="w-4 h-4 ml-2 text-slate-500" />
                <input 
                  type="month" 
                  className="bg-transparent border-none text-sm p-1.5 focus:outline-none text-slate-700 font-medium"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
             </div>
             
             {/* Stats Pills */}
             <div className="hidden md:flex gap-4 border-l border-slate-200 pl-4">
                <div className="flex flex-col">
                   <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Orders</span>
                   <span className="text-lg font-bold text-slate-900 leading-none flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3 text-blue-500" />
                      {loading ? "..." : stats.totalOrders}
                   </span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Staff</span>
                   <span className="text-lg font-bold text-slate-900 leading-none flex items-center gap-1">
                      <Users className="w-3 h-3 text-emerald-500" />
                      {loading ? "..." : stats.uniqueUsers}
                   </span>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search user or code..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <Button 
                className="bg-slate-900 text-white hover:bg-slate-800 shrink-0" 
                onClick={handlePrintMonth}
                disabled={loading || orders.length === 0}
             >
                <Printer className="w-4 h-4 mr-2" />
                Print Report
             </Button>
          </div>

        </CardContent>
      </Card>

      {/* --- DATA TABLE --- */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-200 py-3">
           <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Records for {format(parseISO(selectedMonth + "-01"), "MMMM yyyy")}
           </CardTitle>
        </CardHeader>
        
        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex items-center justify-center h-64 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin" />
             </div>
          ) : filteredOrders.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <FileText className="w-12 h-12 mb-2 opacity-20" />
                <p>No records found for this period.</p>
             </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead>Time</TableHead>
                  <TableHead>Order Code</TableHead>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id} className="hover:bg-slate-50/50">
                    <TableCell className="text-xs text-slate-500 font-medium">
                       {format(parseISO(order.createdAt), "d MMM, h:mm a")}
                    </TableCell>
                    <TableCell className="font-mono font-bold text-slate-700">
                       #{order.pickupCode || order._id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">{order.user?.name || "Unknown"}</span>
                          <span className="text-xs text-slate-500">{order.user?.department}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="text-sm space-y-1">
                          {order.items.map((item: any, i: number) => (
                             <div key={i} className="flex items-center gap-2">
                                <span className="font-bold text-slate-600 text-xs">{item.quantity}x</span>
                                <span className="text-slate-700">{item.name}</span>
                             </div>
                          ))}
                       </div>
                    </TableCell>
                    <TableCell>
                       <Badge variant="outline" className={cn(
                          "capitalize text-xs font-normal",
                          order.status === 'picked_up' ? "bg-slate-100 text-slate-600 border-slate-200" : 
                          order.status === 'cancelled' ? "bg-red-50 text-red-600 border-red-100 line-through" :
                          "bg-blue-50 text-blue-600 border-blue-100"
                       )}>
                          {order.status.replace("_", " ")}
                       </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}