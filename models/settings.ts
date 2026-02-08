import mongoose, { Schema, model, models, Document } from "mongoose";

// 1. Define the TypeScript Interface for the Database Document
export interface ISettings extends Document {
  isOrderingOpen: boolean;
  orderCutoffTime: string;
  maintenanceMode: boolean;
  mealPrice: number;
  bankSubsidyPercent: number;
  staffSubsidyPercent: number;
  adminEmails: string; // Stored as a comma-separated string
  createdAt: Date;
  updatedAt: Date;
}

// 2. Apply the Interface to the Schema
const SettingsSchema = new Schema<ISettings>(
  {
    // Operational
    isOrderingOpen: { type: Boolean, default: true },
    orderCutoffTime: { type: String, default: "10:30" },
    maintenanceMode: { type: Boolean, default: false },

    // Financial
    mealPrice: { type: Number, default: 40.0 },
    bankSubsidyPercent: { type: Number, default: 60 },
    staffSubsidyPercent: { type: Number, default: 40 },

    // Notifications
    adminEmails: { type: String, default: "" },
  },
  { timestamps: true }
);

// 3. Export the Typed Model
export const Settings =
  (models.Settings as mongoose.Model<ISettings>) ||
  model<ISettings>("Settings", SettingsSchema);