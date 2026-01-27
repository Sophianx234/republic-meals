import mongoose, { Schema, model, models } from "mongoose";

const SettingsSchema = new Schema({
  // Operational
  isOrderingOpen: { type: Boolean, default: true },
  orderCutoffTime: { type: String, default: "10:30" }, // 24hr format
  maintenanceMode: { type: Boolean, default: false },
  
  // Financial
  mealPrice: { type: Number, default: 40.00 },
  bankSubsidyPercent: { type: Number, default: 60 },
  staffSubsidyPercent: { type: Number, default: 40 },
  
  // Notifications
  adminEmails: { type: String, default: "" }, // Comma separated
}, { timestamps: true });

export const Settings = models.Settings || model("Settings", SettingsSchema);