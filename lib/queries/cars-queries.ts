import client from "@/db";
import { Db, ObjectId } from "mongodb";

export async function getCar(slug: string) {
    await client.connect();
    const db: Db = client.db(process.env.MONGODB_DB_NAME);

    const car = await db.collection('cars').aggregate([
        { $match: { _id: new ObjectId(slug) } },
        {
            $lookup: {
                from: 'carrentaldetails',
                localField: 'carRentalDetails',
                foreignField: '_id',
                as: 'carRentalDetails'
            }
        },
        {
            $lookup: {
                from: 'carfeaturesandspecifications',
                localField: 'carFeaturesAndSpecifications',
                foreignField: '_id',
                as: 'carFeaturesAndSpecifications'
            }
        },
        {
            $lookup: {
                from: 'carimagesanddocuments',
                localField: 'carImagesAndDocuments',
                foreignField: '_id',
                as: 'carImagesAndDocuments'
            }
        },
        {
            $lookup: {
                from: 'rentalagencydetails',
                localField: 'rentalAgencyDetails',
                foreignField: '_id',
                as: 'rentalAgencyDetails'
            }
        },
        {
            $project: {
              make: 1,
              carModel: 1,
              year: 1,
              category: 1,
              seats: 1,
              doors: 1,
              transmission: 1,
              fuelType: 1,
              mileage: 1,
              carRentalDetails: { $arrayElemAt: ["$carRentalDetails", 0] },
              carFeaturesAndSpecifications: { $arrayElemAt: ["$carFeaturesAndSpecifications", 0] },
              carImagesAndDocuments: { $arrayElemAt: ["$carImagesAndDocuments", 0] },
              rentalAgencyDetails: { $arrayElemAt: ["$rentalAgencyDetails", 0] },
              createdAt: 1,
              updatedAt: 1,
              __v: 1
            }
          }
    ]).toArray();
    
    return car.length > 0 ? car[0] : null;
}