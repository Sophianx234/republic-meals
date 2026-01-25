"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/order";
import { startOfDay, endOfDay, subDays } from "date-fns";

export async function getKitchenStats() {
  try {
    await connectToDatabase();

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
    const yesterdayStart = startOfDay(subDays(new Date(), 1));
    const yesterdayEnd = endOfDay(subDays(new Date(), 1));

    // 1. Fetch Orders
    const todayOrders = await Order.find({ createdAt: { $gte: todayStart, $lte: todayEnd } }).lean();
    const yesterdayOrders = await Order.find({ createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd } }).lean();

    // --- OPERATIONAL KPIS ---
    
    // Total Volume
    const totalOrders = todayOrders.length;
    const yesterdayTotal = yesterdayOrders.length;
    const volumeTrend = totalOrders - yesterdayTotal;

    // Active Load (The immediate pressure on the kitchen)
    // Pending = Needs acceptance, Confirmed = Cooking
    const pendingCount = todayOrders.filter((o: any) => o.status === 'pending').length;
    const prepCount = todayOrders.filter((o: any) => o.status === 'confirmed').length;
    const activeLoad = pendingCount + prepCount;

    // Output & Issues
    const readyCount = todayOrders.filter((o: any) => o.status === 'ready').length;
    const completedCount = todayOrders.filter((o: any) => o.status === 'picked_up').length;
    const cancelledCount = todayOrders.filter((o: any) => o.status === 'cancelled').length;

    // Fulfillment Rate
    const fulfillmentRate = totalOrders > 0 
      ? ((totalOrders - cancelledCount) / totalOrders) * 100 
      : 100;

    // Avg Prep Time (Mock or Real calculation)
    const avgPrepTime = 14; // minutes

    // --- POPULAR ITEMS (By Quantity, not Price) ---
    const itemMap = new Map<string, number>();
    todayOrders.forEach((o: any) => {
      o.items.forEach((i: any) => {
        itemMap.set(i.name, (itemMap.get(i.name) || 0) + i.quantity);
      });
    });
    
    const popularItems = Array.from(itemMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // --- HOURLY THROUGHPUT ---
    const hours = ["08", "09", "10", "11", "12", "13", "14", "15", "16"];
    const chartData = hours.map(h => {
        const count = todayOrders.filter((o: any) => {
            const date = new Date(o.createdAt);
            return date.getHours().toString().padStart(2, '0') === h;
        }).length;
        return { time: `${h}:00`, orders: count };
    });

    return {
      totalOrders,
      volumeTrend,
      activeLoad,
      pendingCount,
      prepCount,
      readyCount,
      completedCount,
      cancelledCount,
      fulfillmentRate,
      avgPrepTime,
      popularItems,
      chartData
    };

  } catch (error) {
    console.error("Analytics Error:", error);
    return null;
  }
}