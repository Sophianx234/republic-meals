import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  date: Date;
  items: {
    food: mongoose.Types.ObjectId; // <--- ADD THIS
    name: string;
    price: number;
    quantity: number;
  }[];
  note?: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "ready" | "picked_up" | "cancelled";
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    items: [
      {
        food: { type: Schema.Types.ObjectId, ref: "Food", required: true }, // <--- ADD THIS
        name: { type: String, required: true },
        price: { type: Number, required: false },
        quantity: { type: Number, default: 1 },
      }
    ],
    totalAmount: { type: Number, required: true },
    note: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "ready", "picked_up", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Indexes
OrderSchema.index({ date: 1 });
OrderSchema.index({ user: 1 });
OrderSchema.index({ status: 1 });

export const Order: Model<IOrder> = mongoose.models?.Order || mongoose.model("Order", OrderSchema);