"use client";

import { useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, 
  Receipt, 
  CreditCard,
  Search,
  FileSpreadsheet,
  CalendarCheck,
  Utensils,
  Printer, // Import Printer Icon
  XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format, startOfDay, endOfDay } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface OrderHistoryProps {
  data: {
    stats: { totalSpent: number; totalOrders: number; averageOrderValue: number };
    chartData: { name: string; total: number }[];
    orders: any[];
  };
}

export function OrderAnalytics({ data }: OrderHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // --- FILTER LOGIC ---
  const filteredOrders = data.orders.filter(order => {
    const matchesSearch = 
      order.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.pickupCode && order.pickupCode.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesDate = true;
    if (dateRange.start) {
      matchesDate = matchesDate && new Date(order.date) >= startOfDay(new Date(dateRange.start));
    }
    if (dateRange.end) {
      matchesDate = matchesDate && new Date(order.date) <= endOfDay(new Date(dateRange.end));
    }

    return matchesSearch && matchesDate;
  });

  // --- ACTIONS ---
  const handlePrint = () => {
    window.print();
  };

  const downloadCSV = () => {
    try {
      const headers = ["Date", "Order ID", "Items", "Total Cost (GHS)", "Status", "Pickup Code"];
      const rows = filteredOrders.map(order => [
        format(new Date(order.date), "yyyy-MM-dd HH:mm"),
        order.id,
        `"${order.summary}"`, 
        order.totalAmount.toFixed(2),
        order.status,
        order.pickupCode
      ]);

      const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `History_${format(new Date(), "yyyy-MM-dd")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Export Successful");
    } catch (e) {
      toast.error("Export Failed");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* --- HEADER (Hidden on Print) --- */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dining History</h1>
          <p className="text-sm text-gray-500">Track your meal frequency and past selections.</p>
        </div>
        <div className="flex gap-2">
          {/* PRINT BUTTON */}
          <Button onClick={handlePrint} variant="outline" className="gap-2 border-gray-300 hover:bg-gray-100">
            <Printer className="w-4 h-4 text-gray-600" />
            Print Table
          </Button>
          <Button onClick={downloadCSV} variant="outline" className="gap-2 border-gray-300 hover:bg-gray-100">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* --- PRINT ONLY HEADER (Visible ONLY on Paper) --- */}
      <div className="hidden print:block mb-6 pb-4 border-b border-black">
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-2xl font-bold text-black">Order History Report</h1>
                <p className="text-sm text-gray-600">Republic Bank Staff Dining</p>
            </div>
            <div className="text-right text-xs text-gray-500">
                <p>Generated: {format(new Date(), "PPP")}</p>
                <p>Rows: {filteredOrders.length}</p>
            </div>
        </div>
      </div>

      {/* --- KPI CARDS (Hidden on Print) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
        <Card className="border-l-4 border-l-black shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Meals</CardTitle>
            <Utensils className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.totalOrders}</div>
            <p className="text-xs text-gray-500 mt-1">All-time orders</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-black shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Month</CardTitle>
            <CalendarCheck className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.chartData.length > 0 ? data.chartData[data.chartData.length - 1].total : 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Orders this month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-black shadow-sm bg-gray-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Value</CardTitle>
            <CreditCard className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700">₵{data.stats.totalSpent.toFixed(0)}</div>
            <p className="text-xs text-gray-500 mt-1">Cumulative value</p>
          </CardContent>
        </Card>
      </div>

      {/* --- FREQUENCY CHART (Hidden on Print) --- */}
      <Card className="shadow-sm border-gray-200 print:hidden">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Dining Frequency</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chartData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} allowDecimals={false} />
              <Tooltip 
                cursor={{stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '4 4'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* --- TABLE SECTION (Optimized for Print) --- */}
      <Card className="shadow-sm border-gray-200 print:border-none print:shadow-none">
        
        {/* FILTERS (Hidden on Print) */}
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-gray-50 gap-4 print:hidden">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-gray-500" />
            <CardTitle className="text-base font-semibold">Transaction History</CardTitle>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* Date Filters */}
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-md border border-gray-200">
                <Input 
                  type="date" 
                  className="w-[130px] h-8 text-xs bg-transparent border-none shadow-none focus-visible:ring-0" 
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
                <span className="text-gray-400 text-[10px] uppercase font-bold">To</span>
                <Input 
                  type="date" 
                  className="w-[130px] h-8 text-xs bg-transparent border-none shadow-none focus-visible:ring-0" 
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
            </div>
            
            {/* Search */}
            <div className="relative w-full md:w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search items..." 
                className="pl-9 h-10 text-sm bg-gray-50" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Clear Button */}
            {(searchTerm || dateRange.start || dateRange.end) && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 text-gray-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => { setSearchTerm(""); setDateRange({ start: "", end: "" }); }}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        {/* DATA TABLE */}
        <CardContent className="p-0">
          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100 print:bg-transparent print:border-black print:text-black">
                <tr>
                  <th className="px-6 py-3 font-medium print:px-2">Date</th>
                  <th className="px-6 py-3 font-medium print:px-2">Meal Details</th>
                  <th className="px-6 py-3 font-medium print:px-2">Status</th>
                  <th className="px-6 py-3 font-medium text-right print:px-2">Reference</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors last:border-0 print:border-gray-300">
                      
                      {/* DATE */}
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 align-top print:px-2 print:py-2">
                        <div className="flex flex-col">
                           <span className="font-medium text-gray-900 print:text-black">{format(new Date(order.date), "MMM dd, yyyy")}</span>
                           <span className="text-xs print:text-gray-600">{format(new Date(order.date), "h:mm a")}</span>
                        </div>
                      </td>
                      
                      {/* MEAL DETAILS (Text Wrap enabled) */}
                      <td className="px-6 py-4 align-top print:px-2 print:py-2">
                        <div className="max-w-[350px] whitespace-normal break-words print:max-w-none">
                            <span className="text-gray-900 font-medium leading-snug print:text-black">
                                {order.summary}
                            </span>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4 align-top print:px-2 print:py-2">
                        <Badge variant="secondary" className={cn(
                          "capitalize font-normal print:border-black print:text-black print:bg-transparent print:px-0 print:shadow-none",
                          order.status === 'confirmed' ? "bg-blue-50 text-blue-700 border-blue-100" :
                          order.status === 'picked_up' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                          "bg-gray-100 text-gray-700"
                        )}>
                          {order.status.replace("_", " ")}
                        </Badge>
                      </td>
                      
                      {/* REF / AMOUNT */}
                      <td className="px-6 py-4 text-right align-top print:px-2 print:py-2">
                        <div className="flex flex-col items-end">
                            <span className="text-gray-400 font-mono text-xs print:text-black">
                                {order.pickupCode || order.id.slice(-6).toUpperCase()}
                            </span>
                            {/* Optional: Show Price in Print if needed */}
                            {/* <span className="font-bold text-gray-900 print:block hidden">₵{order.totalAmount}</span> */}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search className="w-8 h-8 opacity-20" />
                        <p>No orders found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}