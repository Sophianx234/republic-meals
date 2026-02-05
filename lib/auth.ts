import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { Resend } from 'resend';
import { User } from "@/models/user";

const client = new MongoClient(process.env.MONGODB_URI?.replace('<password>', process.env.MONGODB_PASSWORD || '') || '' );
const db = client.db();
const resend = new Resend(process.env.RESEND_API_KEY);
export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    additionalFields: {
      staffID: { type: "string", required: false, input: false },
      role: { type: "string", defaultValue: "staff" },
      profileColor: { type: "string", required: false, defaultValue: null },
      banned: { type: "boolean", defaultValue: false },
      department: { type: "string", required: false },
      branch: { type: "string", required: false },
      floor: { type: "string", required: false },
      phone: { type: "string", required: false },
      defaultNote: { type: "string", required: false }
    },
  },
  emailAndPassword: {
    enabled: true,
    // --- FIX: Add this handler to enable Forget Password ---
  async sendResetPassword({ user, url }, request) {
  // Better Auth already provides the user object!
  // Note: user.name is available if it's in your schema
  
  try {
    await resend.emails.send({
      from: 'RepublicLunch <onboarding@resend.dev>',
      to: user.email,
      subject: 'Reset your RepublicLunch Password',
      html: `
        <div style="background-color: #f8fafc; padding: 40px 0; font-family: 'Segoe UI', sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="padding: 32px; border-bottom: 1px solid #f1f5f9; text-align: center;">
               <img src="https://res.cloudinary.com/dtytb8qrc/image/upload/v1770313610/rb_ygx3xc.png" alt="RB" width="34" height="34" style="display: inline-block; vertical-align: middle;" />
               <span style="font-size: 22px; font-weight: 800; color: #0f172a; vertical-align: middle; margin-left: 10px;">Republic<span style="color: #0090BF;">Lunch</span></span>
            </div>
            <div style="padding: 40px 32px;">
              <h2 style="color: #1e293b; font-size: 20px; font-weight: 700;">Password Reset Request</h2>
              <p style="color: #475569; font-size: 16px;">
                Hello ${user.name || 'Staff Member'},
              </p>
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                We received a request to reset the password for your <strong>Republic Bank Staff Welfare</strong> account. Click the button below to proceed.
              </p>
              <div style="margin: 32px 0; text-align: center;">
                <a href="${url}" style="display: inline-block; background-color: #0090BF; color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700;">
                  Reset Password
                </a>
              </div>
              <p style="color: #64748b; font-size: 13px; background-color: #f1f5f9; padding: 16px; border-radius: 8px;">
                <strong>Security Notice:</strong> This link is valid for 60 minutes. If you did not request this, please ignore this email.
              </p>
            </div>
          </div>
        </div>
      `
    });
  } catch (err) {
    console.error("Resend failed to send reset email:", err);
    // Better Auth handles the internal error state
  }
}},
  plugins: [nextCookies()],
});