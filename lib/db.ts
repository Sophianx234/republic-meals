import { MongoClient, type Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Missing environment variable: MONGODB_URI')
}

const uri = process.env.MONGODB_URI

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase(): Promise<{
  client: MongoClient
  db: Db
}> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(uri)
  await client.connect()

  const db = client.db("republic-meal") // 👈 your DB name

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function getMongoClient(): Promise<MongoClient> {
  const { client } = await connectToDatabase()
  return client
}
