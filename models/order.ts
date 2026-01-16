import { Schema, model, models, Types, Document } from "mongoose";

export interface IOrderItem {
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = "pending" | "served" | "cancelled";

export interface IOrder extends Document {
  user: Types.ObjectId;
  date: Date;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  servedBy?: string;
  orderedAt: Date;
}


const OrderItemSchema = new Schema<IOrderItem>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true, // date the food is for
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "served", "cancelled"],
      default: "pending",
    },
    servedBy: {
      type: String,
    },
    orderedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

export const Order =
  models.Order || model<IOrder>("Order", OrderSchema);
