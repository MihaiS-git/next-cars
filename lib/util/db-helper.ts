import client from "@/db";
import { Db, Collection } from "mongodb";

export async function withDb(collectionName: string, callback: (collection: Collection) => Promise<any>) {
  try {
    await client.connect();
    const db: Db = client.db(process.env.MONGODB_DB_NAME);
    if (!db) {
      throw new Error("Database connection failed");
    }
    const collection: Collection = db.collection(collectionName);

    return await callback(collection);
  } catch (error) {
    console.error("Error during database operation:", error);
    throw new Error("Database operation failed");
  } finally {
    await client.close();
  }
}
