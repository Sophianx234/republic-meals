import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";

const client = new MongoClient(process.env.MONGODB_URI?.replace('<password>', process.env.MONGODB_PASSWORD || '') || '' );
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    additionalFields: {
      staffID: {
        type: "string",
        required: false,
        input: false,
      },
      role: {
        type: "string",
        defaultValue: "staff",
      },
      profileColor: {
        type: "string",
        required: false,
        defaultValue: null 
      },
      // --- Added Custom Fields ---
      department: { type: "string", required: false },
      branch: { type: "string", required: false }, // New field for Branch
      floor: { type: "string", required: false },
      phone: { type: "string", required: false },
      defaultNote: { type: "string", required: false }
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});