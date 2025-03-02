"use server";

import { ICar } from "@/lib/definitions";
import { connectDB } from "@/lib/mongoDb";
import { getCar } from "@/lib/queries/cars-queries";

export async function getAllCarsWithPictures() {
    const db = await connectDB();
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

    if (!cars[0]) return [];

    const mappedCars: ICar[] = cars.map(car => ({
        make: car.make,
        carModel: car.carModel,
        year: car.year,
        category: car.category,
        price: car.price,
        mileage: car.mileage,
        fuelType: car.fuelType,
        transmission: car.transmission,
        _id: car._id.toString(),
        seats: car.seats,
        doors: car.doors,

        carRentalDetails: car.carRentalDetails
            ? car.carRentalDetails._id
                ? {
                    _id: car.carRentalDetails._id?.toString(),
                    rentalPricePerDay: car.carRentalDetails.rentalPricePerDay,
                    currency: car.carRentalDetails.currency,
                    availabilityStatus: car.carRentalDetails.availabilityStatus,
                    carLocation: car.carRentalDetails.carLocation,
                    minRentalPeriod: car.carRentalDetails.minRentalPeriod,
                    maxRentalPeriod: car.carRentalDetails.maxRentalPeriod
                }
                : car.carRentalDetails.toString()
            : null,

        carFeaturesAndSpecifications: car.carFeaturesAndSpecifications
            ? car.carFeaturesAndSpecifications._id
                ? {
                    _id: car.carFeaturesAndSpecifications._id?.toString(),
                    airConditioning: car.carFeaturesAndSpecifications.airConditioning,
                    gps: car.carFeaturesAndSpecifications.gps,
                    bluetooth: car.carFeaturesAndSpecifications.bluetooth,
                    fuelPolicy: car.carFeaturesAndSpecifications.fuelPolicy,
                    insuranceIncluded: car.carFeaturesAndSpecifications.insuranceIncluded,
                    additionalFeatures: car.carFeaturesAndSpecifications.additionalFeatures
                }
                : car.carFeaturesAndSpecifications.toString()
            : null,

        carImagesAndDocuments: car.carImagesAndDocuments
            ? car.carImagesAndDocuments._id
                ? {
                    _id: car.carImagesAndDocuments._id?.toString(),
                    carImages: car.carImagesAndDocuments.carImages,
                    registrationNumber: car.carImagesAndDocuments.registrationNumber,
                    insurancePolicyNumber: car.carImagesAndDocuments.insurancePolicyNumber
                }
                : car.carImagesAndDocuments.toString()
            : null,

        rentalAgencyDetails: car.rentalAgencyDetails
            ? car.rentalAgencyDetails._id
                ? {
                    _id: car.rentalAgencyDetails._id?.toString(),
                    agencyName: car.rentalAgencyDetails.agencyName,
                    contactNumber: car.rentalAgencyDetails.contactNumber
                }
                : car.rentalAgencyDetails.toString()
            : null,
    }));

    return mappedCars;
}

export const fetchCarBySlug = async (slug: string) => {
    try {
        const car = await getCar(slug);
        return car;
    } catch (error: any) {
        console.error("Error fetching car:", error);
        throw new Error("Error fetching car from the database.");
    }
};