"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  ClipboardList, 
  Flame, 
  Clock, 
  CheckCircle2,
  ChefHat,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardProps {
  stats: {
    totalOrders: number;
    volumeTrend: number;
    activeLoad: number;
    pendingCount: number;
    prepCount: number;
    readyCount: number;
    completedCount: number;
    cancelledCount: number;
    fulfillmentRate: number;
    avgPrepTime: number;
    popularItems: { name: string; count: number }[];
    chartData: { time: string; orders: number }[];
  };
}

export function KitchenDashboard({ stats }: DashboardProps) {
  
  const TrendBadge = ({ value, prefix = "" }: { value: number, prefix?: string }) => {
    const isPositive = value >= 0;
    return (
      <div className={cn(
        "flex items-center text-xs font-medium px-2 py-0.5 rounded-full",
        isPositive ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"
      )}>
        {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {isPositive ? "+" : ""}{prefix}{value.toFixed(0)}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
        </div>
        <div className="flex gap-3">
           <Button asChild className="bg-slate-900 hover:bg-slate-800">
             <Link href="/restaurant/orders">
               <ChefHat className="w-4 h-4 mr-2" /> View Live Orders
             </Link>
           </Button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* TOTAL VOLUME */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Orders</CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalOrders}</div>
            <div className="flex items-center mt-1 gap-2">
                <TrendBadge value={stats.volumeTrend} />
                <p className="text-xs text-slate-500">vs yesterday</p>
            </div>
          </CardContent>
        </Card>

        {/* ACTIVE LOAD (Critical for Staffing) */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Current Queue</CardTitle>
            <Flame className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.activeLoad} <span className="text-sm font-normal text-slate-500">active</span></div>
            <div className="flex items-center mt-1 gap-2">
                <div className="text-xs text-slate-500 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-1.5 animate-pulse"></div>
                    {stats.pendingCount} New
                </div>
                <div className="h-3 w-px bg-slate-300"></div>
                <div className="text-xs text-slate-500 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></div>
                    {stats.prepCount} Cooking
                </div>
            </div>
          </CardContent>
        </Card>

        {/* AVG PREP TIME */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Avg. Turnaround</CardTitle>
            <Clock className="h-4 w-4 text-violet-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.avgPrepTime} <span className="text-sm font-normal text-slate-500">min</span></div>
            <div className="flex items-center mt-1">
               <Progress value={75} className="h-1.5 w-20 bg-slate-100" indicatorClassName="bg-violet-500" />
               <span className="text-xs text-slate-500 ml-2">Target: 12m</span>
            </div>
          </CardContent>
        </Card>

        {/* FULFILLMENT / COMPLETION */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Completed / Ready</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.completedCount + stats.readyCount}</div>
            <div className="flex items-center mt-1 gap-1 text-xs text-slate-500">
               <AlertCircle className="w-3 h-3 text-red-400" />
               <span>{stats.cancelledCount} cancelled today</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS & LISTS */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        
        {/* VOLUME CHART */}
        <Card className="lg:col-span-4 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Hourly Order Volume</CardTitle>
            <CardDescription>Peak demand periods throughout the day.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fill: '#64748b'}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fill: '#64748b'}} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#0284c7" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorOrders)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* MOST ORDERED ITEMS */}
        <Card className="lg:col-span-3 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Popular Choices</CardTitle>
            <CardDescription>Items with highest demand today.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {stats.popularItems.length > 0 ? (
                  stats.popularItems.map((item, i) => (
                    <div key={item.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700 truncate max-w-[200px]">{item.name}</span>
                        <span className="font-bold text-slate-900">{item.count}</span>
                      </div>
                      <Progress 
                        value={(item.count / stats.popularItems[0].count) * 100} 
                        className="h-2 bg-slate-100" 
                        indicatorClassName={i === 0 ? "bg-slate-800" : "bg-slate-400"} 
                      />
                    </div>
                  ))
              ) : (
                  <div className="text-center py-10 text-slate-400 text-sm">No orders yet today.</div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100">
               <Button variant="ghost" className="w-full text-sm text-slate-500 hover:text-slate-900 justify-between group">
                  View Full Item Breakdown 
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
               </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}