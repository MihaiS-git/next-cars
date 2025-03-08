import client from "@/db";

const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

export async function connectDB() {
    try {
        // Check if the client is already connected by attempting a ping
        await client.db().admin().ping();
    } catch (error) {
        // If ping fails, reconnect
        await client.connect();
    }
    return client.db(MONGODB_DB_NAME);
}
