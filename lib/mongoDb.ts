import client from "@/db";

const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

export async function connectDB() {
    try {
        // Try pinging the database to check if the connection is active
        await client.db().admin().ping();
    } catch {
        try {
            await client.connect();
        } catch (connectError) {
            throw new Error(`Database connection failed: ${connectError}`);
        }
    }
    return client.db(MONGODB_DB_NAME);
}
