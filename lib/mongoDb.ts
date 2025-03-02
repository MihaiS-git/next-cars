import client from "@/db";
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

let isConnected = false;

export async function connectDB() {
    if (!isConnected) {
        await client.connect();
        isConnected = true;
    }
    return client.db(MONGODB_DB_NAME);
}
