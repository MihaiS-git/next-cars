import client from "@/db";
import { Db, Collection } from "mongodb";

export async function withDb(collectionName: string, callback: (collection: Collection) => Promise<any>) {
  await client.connect();
  const db: Db = client.db(process.env.MONGODB_DB_NAME);
  const collection: Collection = db.collection(collectionName);

  try {
    return await callback(collection);
  } catch (error) {
    console.error("Error during database operation:", error);
    throw new Error("Database operation failed");
  } finally {
    await client.close();
  }
}
