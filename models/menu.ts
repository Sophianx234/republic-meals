

import { Schema, model, models, Document } from "mongoose";

export interface IMeal {
  name: string;
  price: number;
  category?: "Main" | "Side" | "Drink";
  image?: string;
}


export interface IMenu extends Document {
  date: Date;
  isLocked: boolean;
  meals: IMeal[];
}

const MealSchema = new Schema<IMeal>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ["Main", "Side", "Drink"],
    },
    image: { type: String },
  },
  { _id: false } // prevents extra _id on subdocuments
);

const MenuSchema = new Schema<IMenu>(
  {
    date: {
      type: Date,
      required: true,
      unique: true, // only one menu per day
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    meals: {
      type: [MealSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


export const Menu =
  models.Menu || model<IMenu>("Menu", MenuSchema);
