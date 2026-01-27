"use client";

import { 
  Users, 
  ShoppingBag, 
  AlertCircle, 
  TrendingUp, 
  CreditCard,
  ChefHat,
  Utensils,
  Ban,
  CheckCircle2,
  Clock,
  PackageX,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

export function OverviewDashboard({ data }: { data: any }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* --- SECTION 1: SYSTEM HEALTH (Static stats) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* USERS CARD */}
        <Card className="shadow-sm ">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Staff</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{data.users.total}</h3>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                </div>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs">
                <Badge variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-50 border-orange-100 font-normal">
                    {data.users.kitchen} Kitchen
                </Badge>
                {data.users.banned > 0 && (
                    <Badge variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-100 font-normal">
                        {data.users.banned} Suspended
                    </Badge>
                )}
            </div>
          </CardContent>
        </Card>

        {/* MENU CARD */}
        <Card className="shadow-sm ">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Menu Items</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{data.food.total}</h3>
                </div>
                <div className="p-2 bg-violet-50 rounded-lg">
                    <Utensils className="w-5 h-5 text-violet-600" />
                </div>
            </div>
            <div className="mt-3 text-xs">
                {data.food.outOfStock > 0 ? (
                    <span className="text-red-600 font-medium flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {data.food.outOfStock} items Out of Stock
                    </span>
                ) : (
                    <span className="text-emerald-600 font-medium flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        All items available
                    </span>
                )}
            </div>
          </CardContent>
        </Card>

        {/* REVENUE MONTH CARD */}
        <Card className="shadow-sm ">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Orders</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{data.month.orders}</h3>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                </div>
            </div>
            <div className="mt-3 text-xs text-slate-500">
                Processed this month
            </div>
          </CardContent>
        </Card>

        {/* SYSTEM ALERTS */}
        <Card className="shadow-sm ">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Alerts</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{data.issues.open}</h3>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
            </div>
            <div className="mt-3 text-xs text-slate-500">
                Open support tickets
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- SECTION 2: LIVE OPERATIONS (Today's Pulse) --- */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <ChefHat className="w-5 h-5 mr-2 text-slate-500" /> Today's Operations
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Status Breakdown */}
            <Card className="lg:col-span-2 shadow-sm border-slate-200">
                <CardContent className="p-6">
                    <div className="grid grid-cols-4 gap-4 text-center divide-x divide-slate-100">
                        <div className="space-y-1">
                            <span className="text-xs text-slate-500 uppercase font-bold">New</span>
                            <div className="text-2xl font-bold text-orange-600">{data.today.pending}</div>
                            <span className="text-[10px] text-slate-400">Needs Approval</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-slate-500 uppercase font-bold">Cooking</span>
                            <div className="text-2xl font-bold text-blue-600">{data.today.cooking}</div>
                            <span className="text-[10px] text-slate-400">In Preparation</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-slate-500 uppercase font-bold">Ready</span>
                            <div className="text-2xl font-bold text-emerald-600">{data.today.ready}</div>
                            <span className="text-[10px] text-slate-400">Waiting Pickup</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-slate-500 uppercase font-bold">Done</span>
                            <div className="text-2xl font-bold text-slate-700">{data.today.completed}</div>
                            <span className="text-[10px] text-slate-400">Completed</span>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                        <div>
                            <span className="text-2xl font-bold text-slate-900">GH₵{data.today.revenue.toLocaleString()}</span>
                            <p className="text-xs text-slate-500">Revenue Generated Today</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/restaurant/live">Go to Kitchen View</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-900 text-white shadow-md border-none">
                <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                    <CardDescription className="text-slate-400">Administrative shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button variant="secondary" className="w-full justify-start hover:bg-slate-100" asChild>
                        <Link href="/admin/staff"><Users className="w-4 h-4 mr-2" /> Manage Staff</Link>
                    </Button>
                    <Button variant="secondary" className="w-full justify-start hover:bg-slate-100" asChild>
                        <Link href="/admin/menu"><Utensils className="w-4 h-4 mr-2" /> Update Menu</Link>
                    </Button>
                    <Button variant="secondary" className="w-full justify-start hover:bg-slate-100" asChild>
                        <Link href="/admin/subsidy"><CreditCard className="w-4 h-4 mr-2" /> Payroll Report</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>

      {/* --- SECTION 3: TRENDS & DETAILS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        
        {/* Order Trend Chart */}
        <Card className="lg:col-span-4 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Order Volume (7 Days)</CardTitle>
            <CardDescription>Daily order counts for the past week.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
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
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorOrders)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Foods & Recent Activity Tabs */}
        <Card className="lg:col-span-3 shadow-sm border-slate-200">
            <CardHeader className="pb-3">
                <CardTitle>Top Selling Items</CardTitle>
                <CardDescription>Most popular dishes all-time.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                    {data.food.topItems.map((item: any, index: number) => (
                        <div key={item._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                                    index === 0 ? "bg-yellow-100 text-yellow-700" : 
                                    index === 1 ? "bg-slate-100 text-slate-700" :
                                    index === 2 ? "bg-orange-50 text-orange-700" : "bg-white text-slate-400 border border-slate-100"
                                )}>
                                    {index + 1}
                                </div>
                                <span className="text-sm font-medium text-slate-700">{item._id}</span>
                            </div>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal">
                                {item.count} orders
                            </Badge>
                        </div>
                    ))}
                    {data.food.topItems.length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-sm">No data available</div>
                    )}
                </div>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}