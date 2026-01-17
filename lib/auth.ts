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
        required: false, // Set to true if required on signup
        input: false,    // false = users can't set this themselves (API/Admin only)
      },
      department: {
        type: "string",
        required: false,
      },
      role: {
        type: "string",
        defaultValue: "staff",
      },
      profileColor: {
        type: "string",
        required: false,
        defaultValue: null 
      }
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});
