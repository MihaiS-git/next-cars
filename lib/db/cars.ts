"use server";

import { IBooking, ICar, IPicture } from "@/lib/definitions";
import { connectDB } from "@/lib/mongoDb";
import { ObjectId } from "mongodb";

export async function getAllCarsWithOnePicture(): Promise<IPicture[]> {
    try {
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
            {
                $project: {
                    firstImageUrl: { $arrayElemAt: ["$carImagesAndDocuments.carImages", 0] },
                }
            }
        ]).toArray();

        if (!cars[0]) return [];

        const mappedCars: IPicture[] = cars.map(car => ({
            elementId: car._id.toString(),
            elementPicture: car.firstImageUrl,
        }));

        return mappedCars;
    } catch (error) {
        throw new Error(`Something wrong happened: ${error}`);
    }
}

export async function getCarsImagesForWelcomeCarousel() {
    try {
        const db = await connectDB();
        const carImages = await db.collection('cars').aggregate([
            {
                $lookup: {
                    from: 'carimagesanddocuments',
                    localField: 'carImagesAndDocuments',
                    foreignField: '_id',
                    as: 'carImagesAndDocuments'
                },
            },
            { $unwind: '$carImagesAndDocuments' },
            {
                $project: {
                    firstImageUrl: { $arrayElemAt: ["$carImagesAndDocuments.carImages", 0] },
                }
            }
        ]).toArray();

        if (!carImages[0]) return [];

        const mappedCarImages: string[] = carImages.map(car => car.firstImageUrl);

        return mappedCarImages;
    } catch (error) {
        throw new Error(`Something wrong happened: ${error}`);
    }
}

export async function getAllCarsWithPicturesPaginated(page: number = 1, limit: number = 10) {
    try {
        const db = await connectDB();
        const skip = (page - 1) * limit;

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
            { $skip: skip },
            { $limit: limit },
        ]).toArray();

        const totalCount = await db.collection("cars").countDocuments();

        if (!cars[0]) return { cars: [], totalCount };

        const mappedCars: ICar[] = cars.map(car => ({
            make: car.make,
            carModel: car.carModel,
            year: car.year,
            category: car.category,
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

            bookings: car.bookings
                ? car.bookings.map((booking: IBooking) => ({
                    _id: booking._id?.toString(),
                    customer: booking.customer?.toString(),
                    car: booking.car?.toString(),
                    driver: booking.driver?.toString(),
                    timeInterval: booking.timeInterval,
                    status: booking.status,
                    totalAmount: booking.totalAmount,
                }))
                : [],
            /* createdAt: car[0].createdAt, */
            /* updatedAt: car[0].updatedAt, */
        }));

        return { cars: mappedCars, totalCount };
    } catch (error) {
        throw new Error(`Something wrong happened: ${error}`);
    }
}

export const getCarBySlug = async (slug: string) => {
    try {
        const db = await connectDB();
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
                $unwind: {
                    path: "$bookings",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'bookings',
                    localField: 'bookings',
                    foreignField: '_id',
                    as: 'bookings'
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
                    bookings: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    __v: 1
                }
            }
        ]).toArray();

        if (!car[0]) return null;

        const mappedCar: ICar = ({
            _id: car[0]._id.toString(),
            make: car[0].make,
            carModel: car[0].carModel,
            year: car[0].year,
            category: car[0].category,
            mileage: car[0].mileage,
            fuelType: car[0].fuelType,
            transmission: car[0].transmission,
            seats: car[0].seats,
            doors: car[0].doors,

            carRentalDetails: car[0].carRentalDetails
                ? car[0].carRentalDetails._id
                    ? {
                        _id: car[0].carRentalDetails._id?.toString(),
                        rentalPricePerDay: car[0].carRentalDetails.rentalPricePerDay,
                        currency: car[0].carRentalDetails.currency,
                        availabilityStatus: car[0].carRentalDetails.availabilityStatus,
                        carLocation: car[0].carRentalDetails.carLocation,
                        minRentalPeriod: car[0].carRentalDetails.minRentalPeriod,
                        maxRentalPeriod: car[0].carRentalDetails.maxRentalPeriod
                    }
                    : car[0].carRentalDetails.toString()
                : null,

            carFeaturesAndSpecifications: car[0].carFeaturesAndSpecifications
                ? car[0].carFeaturesAndSpecifications._id
                    ? {
                        _id: car[0].carFeaturesAndSpecifications._id?.toString(),
                        airConditioning: car[0].carFeaturesAndSpecifications.airConditioning,
                        gps: car[0].carFeaturesAndSpecifications.gps,
                        bluetooth: car[0].carFeaturesAndSpecifications.bluetooth,
                        fuelPolicy: car[0].carFeaturesAndSpecifications.fuelPolicy,
                        insuranceIncluded: car[0].carFeaturesAndSpecifications.insuranceIncluded,
                        additionalFeatures: car[0].carFeaturesAndSpecifications.additionalFeatures
                    }
                    : car[0].carFeaturesAndSpecifications.toString()
                : null,

            carImagesAndDocuments: car[0].carImagesAndDocuments
                ? car[0].carImagesAndDocuments._id
                    ? {
                        _id: car[0].carImagesAndDocuments._id?.toString(),
                        carImages: car[0].carImagesAndDocuments.carImages,
                        registrationNumber: car[0].carImagesAndDocuments.registrationNumber,
                        insurancePolicyNumber: car[0].carImagesAndDocuments.insurancePolicyNumber
                    }
                    : car[0].carImagesAndDocuments.toString()
                : null,

            rentalAgencyDetails: car[0].rentalAgencyDetails
                ? car[0].rentalAgencyDetails._id
                    ? {
                        _id: car[0].rentalAgencyDetails._id?.toString(),
                        agencyName: car[0].rentalAgencyDetails.agencyName,
                        contactNumber: car[0].rentalAgencyDetails.contactNumber
                    }
                    : car[0].rentalAgencyDetails.toString()
                : null,

            bookings: car[0].bookings
                ? car[0].bookings.map((booking: IBooking) => ({
                    _id: booking._id?.toString(),
                    customer: booking.customer?.toString(),
                    car: booking.car?.toString(),
                    driver: booking.driver?.toString(),
                    timeInterval: booking.timeInterval,
                    status: booking.status,
                    totalAmount: booking.totalAmount,
                }))
                : [],
            /* createdAt: car[0].createdAt, */
            /* updatedAt: car[0].updatedAt, */
        });

        return mappedCar;
    } catch (error) {
        throw new Error(`Something wrong happened: ${error}`);
    }
};

export const getCarById = async (id: string) => {
    try {
        const db = await connectDB();
        const car = await db.collection('cars').aggregate([
            { $match: { _id: new ObjectId(id) } },
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
                $unwind: {
                    path: "$bookings",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'bookings',
                    localField: 'bookings',
                    foreignField: '_id',
                    as: 'bookings'
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
                    bookings: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    __v: 1
                }
            }
        ]).toArray();

        if (!car[0]) return null;

        const mappedCar: ICar = ({
            _id: car[0]._id.toString(),
            make: car[0].make,
            carModel: car[0].carModel,
            year: car[0].year,
            category: car[0].category,
            mileage: car[0].mileage,
            fuelType: car[0].fuelType,
            transmission: car[0].transmission,
            seats: car[0].seats,
            doors: car[0].doors,

            carRentalDetails: car[0].carRentalDetails
                ? car[0].carRentalDetails._id
                    ? {
                        _id: car[0].carRentalDetails._id?.toString(),
                        rentalPricePerDay: car[0].carRentalDetails.rentalPricePerDay,
                        currency: car[0].carRentalDetails.currency,
                        availabilityStatus: car[0].carRentalDetails.availabilityStatus,
                        carLocation: car[0].carRentalDetails.carLocation,
                        minRentalPeriod: car[0].carRentalDetails.minRentalPeriod,
                        maxRentalPeriod: car[0].carRentalDetails.maxRentalPeriod
                    }
                    : car[0].carRentalDetails.toString()
                : null,

            carFeaturesAndSpecifications: car[0].carFeaturesAndSpecifications
                ? car[0].carFeaturesAndSpecifications._id
                    ? {
                        _id: car[0].carFeaturesAndSpecifications._id?.toString(),
                        airConditioning: car[0].carFeaturesAndSpecifications.airConditioning,
                        gps: car[0].carFeaturesAndSpecifications.gps,
                        bluetooth: car[0].carFeaturesAndSpecifications.bluetooth,
                        fuelPolicy: car[0].carFeaturesAndSpecifications.fuelPolicy,
                        insuranceIncluded: car[0].carFeaturesAndSpecifications.insuranceIncluded,
                        additionalFeatures: car[0].carFeaturesAndSpecifications.additionalFeatures
                    }
                    : car[0].carFeaturesAndSpecifications.toString()
                : null,

            carImagesAndDocuments: car[0].carImagesAndDocuments
                ? car[0].carImagesAndDocuments._id
                    ? {
                        _id: car[0].carImagesAndDocuments._id?.toString(),
                        carImages: car[0].carImagesAndDocuments.carImages,
                        registrationNumber: car[0].carImagesAndDocuments.registrationNumber,
                        insurancePolicyNumber: car[0].carImagesAndDocuments.insurancePolicyNumber
                    }
                    : car[0].carImagesAndDocuments.toString()
                : null,

            rentalAgencyDetails: car[0].rentalAgencyDetails
                ? car[0].rentalAgencyDetails._id
                    ? {
                        _id: car[0].rentalAgencyDetails._id?.toString(),
                        agencyName: car[0].rentalAgencyDetails.agencyName,
                        contactNumber: car[0].rentalAgencyDetails.contactNumber
                    }
                    : car[0].rentalAgencyDetails.toString()
                : null,

            bookings: car[0].bookings
                ? car[0].bookings.map((booking: IBooking) => ({
                    _id: booking._id?.toString(),
                    customer: booking.customer?.toString(),
                    car: booking.car?.toString(),
                    driver: booking.driver?.toString(),
                    timeInterval: booking.timeInterval,
                    status: booking.status,
                    totalAmount: booking.totalAmount,
                }))
                : [],
            /* createdAt: car[0].createdAt, */
            /* updatedAt: car[0].updatedAt, */
        });

        return mappedCar;
    } catch (error) {
        throw new Error(`Something wrong happened: ${error}`);
    }
};