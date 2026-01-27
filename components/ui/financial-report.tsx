"use client";

import { useState, useEffect } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Download, 
  Calendar as CalendarIcon, 
  FileSpreadsheet,
  Briefcase,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { format, subDays } from "date-fns";
import { toast } from "sonner";
import { getFinancialReport } from "@/app/actions/admin";

export function FinancialReport() {
  // Default to Last 30 Days
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd")
  });

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const result = await getFinancialReport(dateRange.start, dateRange.end);
    if (result.success) {
      setData(result.data);
    } else {
      toast.error("Failed to load financial data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  // --- CSV EXPORT ---
  const handleExportCSV = () => {
    if (!data) return;
    
    const headers = ["Department", "Orders Count", "Total Value"];
    const rows = data.departmentStats.map((dept: any) => [
      `"${dept.name}"`, 
      dept.count, 
      dept.total.toFixed(2)
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map((e: any[]) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `financial_report_${dateRange.start}_${dateRange.end}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Financial Performance</h2>
          <p className="text-sm text-slate-500">Revenue analysis and departmental billing breakdown.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-lg border shadow-sm">
           <div className="flex items-center gap-2 px-2">
              <CalendarIcon className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600">Period:</span>
           </div>
           <Input 
             type="date" 
             className="h-8 w-auto text-xs border-slate-200"
             value={dateRange.start}
             onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
           />
           <span className="text-slate-300">-</span>
           <Input 
             type="date" 
             className="h-8 w-auto text-xs border-slate-200"
             value={dateRange.end}
             onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
           />
           <Button 
             variant="default" 
             size="sm" 
             className="h-8 ml-2 bg-slate-900"
             onClick={handleExportCSV}
             disabled={loading || !data}
           >
             <Download className="w-3 h-3 mr-2" /> Export CSV
           </Button>
        </div>
      </div>

      {loading || !data ? (
         <div className="h-64 w-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
         </div>
      ) : (
        <>
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-emerald-500 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Revenue</CardTitle>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">GH₵{data.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center">
                   <TrendingUp className="w-3 h-3 mr-1" /> Gross Income
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Transactions</CardTitle>
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{data.totalOrders}</div>
                <p className="text-xs text-slate-500 mt-1">
                   Paid Orders
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-violet-500 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Avg. Order Value</CardTitle>
                <CreditCard className="w-4 h-4 text-violet-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">GH₵{data.averageOrderValue.toFixed(2)}</div>
                <p className="text-xs text-slate-500 mt-1">
                   Per transaction
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* CHART */}
            <Card className="lg:col-span-2 shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Daily income over selected period.</CardDescription>
              </CardHeader>
              <CardContent className="pl-0">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.chartData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 12, fill: '#64748b'}} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 12, fill: '#64748b'}} 
                        tickFormatter={(value) => `GH₵${value}`}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`GH₵${value.toLocaleString()}`, "Revenue"]}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* DEPARTMENT BREAKDOWN */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-500" />
                    Department Billing
                </CardTitle>
                <CardDescription>Cost allocation by department.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[350px] overflow-y-auto custom-scrollbar">
                    <Table>
                        <TableHeader className="bg-slate-50 sticky top-0">
                            <TableRow>
                                <TableHead className="w-[180px]">Department</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.departmentStats.map((dept: any) => (
                                <TableRow key={dept.name}>
                                    <TableCell>
                                        <div className="font-medium text-sm text-slate-800">{dept.name}</div>
                                        <div className="text-[10px] text-slate-500">{dept.count} orders</div>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-slate-700">
                                        GH₵{dept.total.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
              </CardContent>
            </Card>

          </div>
        </>
      )}
    </div>
  );
}