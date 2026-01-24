"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/order";
import { Food } from "@/models/food"; // Ensure you have a Food model
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function searchGlobal(query: string) {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !query.trim()) return { foods: [], orders: [] };

    await connectToDatabase();

    const regex = new RegExp(query, "i"); // Case-insensitive search

    // 1. Search Menu Items (Public)
    const foods = await Food.find({ 
      name: { $regex: regex },
      available: true 
    })
    .select("name image category price description")
    .limit(5)
    .lean();

    // 2. Search My Orders (Private - Scoped to User)
    // Matches if the query appears in the Pickup Code OR any Food Name in the items list
    const orders = await Order.find({
      user: session.user.id,
      $or: [
        { pickupCode: { $regex: regex } },
        { "items.name": { $regex: regex } }
      ]
    })
    .sort({ date: -1 })
    .limit(5)
    .lean();

    // Serialize MongoDB objects (convert _id to string)
    return {
      foods: foods.map(f => ({ ...f, _id: f._id.toString() })),
      orders: orders.map(o => ({ 
        ...o, 
        _id: o._id.toString(),
        items: o.items.map((i: any) => ({ ...i, _id: undefined })) // Clean items
      }))
    };

  } catch (error) {
    console.error("Search Error:", error);
    return { foods: [], orders: [] };
  }
}