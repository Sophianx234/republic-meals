import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { getMongoClient } from "./db"

export const auth = betterAuth({
  database: mongodbAdapter({
    client: getMongoClient(),
    databaseName: "meal_ordering",
  }),

  session: {
    strategy: "database",
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  security: {
    password: {
      hashing: "bcrypt",
      saltRounds: 12,
    },
  },

  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.User
