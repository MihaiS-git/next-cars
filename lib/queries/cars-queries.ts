import client from "@/db";
import { Db } from "mongodb";

export async function getCarsWithPictures() {
    try {
        await client.connect();
        const db: Db = client.db(process.env.MONGODB_DB_NAME);
        const cars = await db.collection('cars').aggregate([
            {
                $lookup: {
                    from: 'carimagesanddocuments',
                    localField: 'carImagesAndDocuments',
                    foreignField: '_id',
                    as: 'carImagesAndDocuments'
                },
            },
            { $unwind: '$carImagesAndDocuments' },
        ]).toArray();

        if (!cars[0]) return { success: false, error: "Car not found" };

        return { success: true, data: cars };
    } catch (error) {
        return { success: false, error: error };
    }
}