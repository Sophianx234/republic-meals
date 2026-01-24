import mongoose, { Schema, Model } from "mongoose";

export interface IIssue {
  user: mongoose.Types.ObjectId;
  type: "Technical" | "Food Quality" | "Delivery" | "Other";
  priority: "Low" | "Medium" | "High";
  subject: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved";
  createdAt: Date;
}

const IssueSchema = new Schema<IIssue>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { 
      type: String, 
      enum: ["Technical", "Food Quality", "Delivery", "Other"], 
      default: "Other" 
    },
    priority: { 
      type: String, 
      enum: ["Low", "Medium", "High"], 
      default: "Low" 
    },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["Open", "In Progress", "Resolved"], 
      default: "Open" 
    },
  },
  { timestamps: true }
);

export const Issue: Model<IIssue> = mongoose.models?.Issue || mongoose.model<IIssue>("Issue", IssueSchema);