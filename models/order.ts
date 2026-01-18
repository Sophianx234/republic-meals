import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId; // Link to Staff
  date: Date;                    // The date the food is for
  items: {
    name: string;
    price: number;
    quantity: number;
    note?: string;               // e.g., "No pepper"
  }[];
  totalAmount: number;
  status: "pending" | "confirmed" | "ready" | "picked_up" | "cancelled";
  pickupCode: string;            // A short 4-digit code for verification (optional)
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true }, // Snapshot price
        quantity: { type: Number, default: 1 },
        note: String
      }
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "ready", "picked_up", "cancelled"],
      default: "pending",
    },
    pickupCode: { type: String },
  },
  { timestamps: true }
);

// Indexes for fast Admin Reporting
OrderSchema.index({ date: 1 });        // "Show me orders for today"
OrderSchema.index({ user: 1 });        // "Show me Sophian's history"
OrderSchema.index({ status: 1 });      // "Show me active orders"

export const Order: Model<IOrder> = mongoose.models?.Order || mongoose.model("Order", OrderSchema);