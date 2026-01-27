"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user";
import { auth } from "@/lib/auth"; // Better Auth
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { Order } from "@/models/order";
import { eachDayOfInterval, endOfDay, format, startOfDay, startOfMonth, endOfMonth, isWeekend, subDays} from "date-fns";
import { Issue } from "@/models/issue";
import { Food } from "@/models/food";

// --- FETCH STAFF ---
export async function getStaffList(query: string = "") {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user.role !== "admin") return { success: false, users: [] };

    await connectToDatabase();

    const regex = new RegExp(query, "i");

    const users = await User.find({
      $or: [
        { name: { $regex: regex } },
        { email: { $regex: regex } },
        { department: { $regex: regex } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(100) // Safety limit
    .lean();

    return {
      success: true,
      users: users.map((u: any) => ({
        ...u,
        _id: u._id.toString(),
        createdAt: u.createdAt.toISOString()
      }))
    };
  } catch (error) {
    return { success: false, users: [] };
  }
}

// --- UPDATE ROLE / DEPT ---
export async function updateStaffMember(userId: string, data: { role: string; department: string; branch: string }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user.role !== "admin") return { success: false, error: "Unauthorized" };

    await connectToDatabase();

    await User.findByIdAndUpdate(userId, {
      role: data.role,
      department: data.department,
      branch: data.branch
    });

    revalidatePath("/admin/staff");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Update failed" };
  }
}

// --- TOGGLE BAN/ACTIVE ---
export async function toggleUserStatus(userId: string, isBanned: boolean) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user.role !== "admin") return { success: false, error: "Unauthorized" };

    await connectToDatabase();
    await User.findByIdAndUpdate(userId, { banned: isBanned });
    
    revalidatePath("/admin/staff");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Action failed" };
  }
}



export async function getFinancialReport(startDate: string, endDate: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user.role !== "admin") return { success: false, data: null };

    await connectToDatabase();

    const start = startOfDay(new Date(startDate));
    const end = endOfDay(new Date(endDate));

    // Fetch Completed Orders in Range
    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end },
      status: { $in: ["picked_up", "ready", "confirmed"] }, // Count confirmed revenue
    })
    .populate("user", "name department")
    .lean();

    // --- 1. HEADLINE STATS ---
    const totalRevenue = orders.reduce((acc, o: any) => acc + (o.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // --- 2. CHART DATA (Daily Revenue) ---
    // Create a map of all days in range initialized to 0
    const daysInterval = eachDayOfInterval({ start, end });
    const chartMap = new Map(daysInterval.map(day => [format(day, "yyyy-MM-dd"), 0]));

    orders.forEach((o: any) => {
      const dateKey = format(new Date(o.createdAt), "yyyy-MM-dd");
      if (chartMap.has(dateKey)) {
        chartMap.set(dateKey, (chartMap.get(dateKey) || 0) + (o.totalAmount || 0));
      }
    });

    const chartData = Array.from(chartMap.entries()).map(([date, amount]) => ({
      date: format(new Date(date), "MMM dd"), // "Jan 01"
      amount
    }));

    // --- 3. DEPARTMENT BREAKDOWN (For Billing) ---
    const deptMap = new Map<string, { count: number; total: number }>();

    orders.forEach((o: any) => {
      const dept = o.user?.department || "Unassigned";
      const current = deptMap.get(dept) || { count: 0, total: 0 };
      deptMap.set(dept, {
        count: current.count + 1,
        total: current.total + (o.totalAmount || 0)
      });
    });

    const departmentStats = Array.from(deptMap.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.total - a.total); // Highest spenders first

    return {
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        chartData,
        departmentStats
      }
    };

  } catch (error) {
    console.error("Finance Report Error:", error);
    return { success: false, data: null };
  }
}



const FIXED_PRICE = 40;
const BANK_PERCENT = 0.60;
const STAFF_PERCENT = 0.40;

export async function getSubsidyReport(monthStr: string, manualWorkingDays?: number) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user.role !== "admin") return { success: false, error: "Unauthorized" };

    await connectToDatabase();

    const date = new Date(monthStr + "-01");
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    // 1. Auto-calculate Working Days (Mon-Fri) if not provided
    let workingDays = manualWorkingDays;
    if (workingDays === undefined) {
      const days = eachDayOfInterval({ start, end });
      workingDays = days.filter(d => !isWeekend(d)).length;
    }

    // 2. Fetch Completed Orders for the Month
    // We only count orders that actually happened (picked_up) or are confirmed to happen
    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end },
      status: { $in: ["picked_up", "ready", "confirmed"] } 
    }).lean();

    // 3. Fetch All Users (to map Account Numbers)
    const users = await User.find({}).select("name accountNumber department image").lean();
    const userMap = new Map(users.map((u: any) => [u._id.toString(), u]));

    // 4. Aggregation Logic
    const reportMap = new Map<string, { userId: string; qty: number }>();

    orders.forEach((o: any) => {
      const uid = o.user.toString();
      const current = reportMap.get(uid) || { userId: uid, qty: 0 };
      reportMap.set(uid, { ...current, qty: current.qty + 1 });
    });

    // 5. Apply Cost Logic
    const reportData = Array.from(reportMap.values()).map(entry => {
      const user = userMap.get(entry.userId);
      const totalQty = entry.qty;

      // Logic: Subsidy applies ONLY up to 'workingDays'
      const subsidizedQty = Math.min(totalQty, workingDays!);
      const excessQty = Math.max(0, totalQty - workingDays!);

      // Costs
      // Bank pays 60% (24 GHS) ONLY on subsidized portion
      const bankCost = subsidizedQty * (FIXED_PRICE * BANK_PERCENT);

      // Staff pays 40% (16 GHS) on subsidized portion + 100% (40 GHS) on excess
      const staffCost = (subsidizedQty * (FIXED_PRICE * STAFF_PERCENT)) + (excessQty * FIXED_PRICE);

      return {
        userId: entry.userId,
        name: user?.name || "Unknown Staff",
        accountNumber: user?.accountNumber || "N/A",
        department: user?.department || "Unassigned",
        qty: totalQty,
        subsidizedQty,
        excessQty,
        bankCost,
        staffCost
      };
    });

    // Sort by Name
    reportData.sort((a, b) => a.name.localeCompare(b.name));

    // Summary Totals
    const totals = reportData.reduce((acc, curr) => ({
      bank: acc.bank + curr.bankCost,
      staff: acc.staff + curr.staffCost,
      qty: acc.qty + curr.qty
    }), { bank: 0, staff: 0, qty: 0 });

    return {
      success: true,
      data: reportData,
      totals,
      workingDays // Return accurate count used
    };

  } catch (error) {
    console.error("Subsidy Calc Error:", error);
    return { success: false, error: "Calculation failed" };
  }
}




export async function getAdminDashboardStats() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user.role !== "admin") return { success: false, data: null };

    await connectToDatabase();

    const today = startOfDay(new Date());
    const firstDayOfMonth = startOfMonth(new Date());
    const sevenDaysAgo = subDays(new Date(), 7);

    // --- 1. PARALLEL DATA FETCHING ---
    const [
      // Users
      totalUsers,
      kitchenStaff,
      bannedUsers,
      // Food
      totalFoodItems,
      outOfStockItems,
      // Orders Today
      todayOrdersDocs,
      // Orders Month
      monthOrdersCount,
      // Issues
      openIssues
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: "restaurant" }),
      User.countDocuments({ banned: true }),
      Food.countDocuments({}),
      Food.countDocuments({ available: false }),
      Order.find({ createdAt: { $gte: today } }).select("status totalAmount").lean(),
      Order.countDocuments({ createdAt: { $gte: firstDayOfMonth } }),
      Issue.countDocuments({ status: "Open" })
    ]);

    // --- 2. CALCULATE TODAY'S METRICS ---
    const todayStats = {
      total: todayOrdersDocs.length,
      revenue: todayOrdersDocs.reduce((acc, o: any) => acc + (o.totalAmount || 0), 0),
      pending: todayOrdersDocs.filter((o: any) => o.status === 'pending').length,
      cooking: todayOrdersDocs.filter((o: any) => o.status === 'confirmed').length,
      ready: todayOrdersDocs.filter((o: any) => o.status === 'ready').length,
      completed: todayOrdersDocs.filter((o: any) => o.status === 'picked_up').length,
      cancelled: todayOrdersDocs.filter((o: any) => o.status === 'cancelled').length,
    };

    // --- 3. CHART DATA (Last 7 Days) ---
    const rawDailyData = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const chartData = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      const dateStr = format(d, "yyyy-MM-dd");
      const dayLabel = format(d, "EEE"); 
      const found = rawDailyData.find((r: any) => r._id === dateStr);
      return { 
        date: dayLabel, 
        orders: found ? found.count : 0,
        revenue: found ? found.revenue : 0
      };
    });

    // --- 4. TOP FOOD ITEMS (All Time - or change date filter for monthly) ---
    // Aggregation to find most ordered items
    const topFoods = await Order.aggregate([
        { $unwind: "$items" },
        { $group: { _id: "$items.name", count: { $sum: "$items.quantity" } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);

    // --- 5. RECENT ACTIVITY ---
    const recentActivity = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name")
      .select("pickupCode status createdAt user totalAmount")
      .lean();

    return {
      success: true,
      data: {
        users: { total: totalUsers, kitchen: kitchenStaff, banned: bannedUsers },
        food: { total: totalFoodItems, outOfStock: outOfStockItems, topItems: topFoods },
        today: todayStats,
        month: { orders: monthOrdersCount },
        issues: { open: openIssues },
        chartData,
        recentActivity: recentActivity.map((a: any) => ({
          id: a._id.toString(),
          code: a.pickupCode || "---",
          user: a.user?.name || "Unknown",
          status: a.status,
          amount: a.totalAmount,
          time: a.createdAt.toISOString()
        }))
      }
    };

  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    return { success: false, data: null };
  }
}