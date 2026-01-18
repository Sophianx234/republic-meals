import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFood extends Document {
  name: string;
  description?: string;
  category: "Main" | "Side" | "Drink" | "Snack";
  images?: string[]; // Cloudinary URLs
  isArchived: boolean; // Soft delete (don't lose history)
}

const FoodSchema = new Schema<IFood>(
  {
    name: { type: String, required: true },
    description: String,
    category: { type: String, default: "Main" },
    images: [String],
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Food: Model<IFood> = mongoose.models?.Food || mongoose.model("Food", FoodSchema);