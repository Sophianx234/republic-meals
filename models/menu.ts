import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMenu extends Document {
  date: Date;
  items: {
    food: mongoose.Types.ObjectId;
    isSoldOut: boolean;
  }[];
}

const MenuSchema = new Schema<IMenu>(
  {
    date: { type: Date, required: true, unique: true },
    items: [
      {
        food: { type: Schema.Types.ObjectId, ref: "Food" },
        isSoldOut: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

// Only export a singleton model (avoids Fast Refresh issues)
export const Menu: Model<IMenu> =
  mongoose.models.Menu || mongoose.model<IMenu>("Menu", MenuSchema);
