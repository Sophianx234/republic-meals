import mongoose, { Schema, Model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  image?: string;
  role?: string;
  // Custom Fields
  department?: string;
  floor?: string;
  phone?: string;
  defaultNote?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String },
    role: { type: String, default: "staff" },
    
    // --- CRITICAL: Define your custom fields here ---
    department: { type: String },
    floor: { type: String },
    phone: { type: String },
    defaultNote: { type: String },
    // -----------------------------------------------
  },
  { 
    timestamps: true, 
    // Force Mongoose to use the existing 'user' collection from Better Auth
    collection: "user" 
  }
);

// Singleton model to prevent overwriting during hot reloads
export const User: Model<IUser> = mongoose.models?.User || mongoose.model<IUser>("User", UserSchema);