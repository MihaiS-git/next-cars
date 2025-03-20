'use server';

import { cache } from "react";
import { IBooking, IDashboardBooking, IInvoice } from "../definitions";
import { connectDB } from "../mongoDb";
import { ObjectId } from "mongodb";

export async function getBookingsByIds(bookingIds: string[]): Promise<IBooking[]> {
    const mappedIds = bookingIds.map((id) => new ObjectId(id));
    try {
        const db = await connectDB();
        const fetchedBookings = await db.collection('bookings').find({ _id: { $in: mappedIds } }).toArray();
        if (!fetchedBookings[0]) return [];
        const mappedBookings = fetchedBookings.map((booking) => {
            return {
                _id: booking._id.toString(),
                customer: booking.customer.toString(),
                car: booking.car.toString(),
                driver: booking.driver.toString(),
                timeInterval: {
                    start: booking.timeInterval.start,
                    end: booking.timeInterval.end
                },
                status: booking.status,
                totalAmount: booking.totalAmount,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt,
            }
        });
        return mappedBookings;
    } catch (error) {
        throw new Error(`Failed to fetch bookings: ${error}`);
    }
}

export const getUpcomingRentals = cache(async (bookingIds: string[]): Promise<IDashboardBooking[] | null> => {
    const mappedIds = bookingIds.map((id) => new ObjectId(id));
    const now = new Date();
    const todayMidNight = new Date(now.setUTCHours(0, 0, 0, 0));

    try {

        const db = await connectDB();
        const result = await db.collection('bookings').aggregate([
            {
                $match: {
                    $and: [
                        { _id: { $in: mappedIds } },
                        { 'timeInterval.start': { $gte: todayMidNight } }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'driver'
                }
            },
            { $unwind: { path: "$driver", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'cars',
                    localField: 'car',
                    foreignField: '_id',
                    as: 'car'
                }
            },
            { $unwind: { path: "$car", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customer'
                }
            },
            { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    driver: {
                        name: 1,
                    },
                    car: {
                        make: 1,
                        carModel: 1,
                    },
                    customer: 1,
                    timeInterval: 1,
                    status: 1,
                    totalAmount: 1,
                }
            }
        ]).toArray();

        if (!result[0]) return null;

        const bookings: IDashboardBooking[] = result.map((booking) => {
            return {
                _id: booking._id.toString(),
                driver: booking.driver,
                car: {
                    make: booking.car.make,
                    carModel: booking.car.carModel,
                },
                customer: booking.customer.toString(),
                timeInterval: {
                    start: new Date(booking.timeInterval.start),
                    end: new Date(booking.timeInterval.end),
                },
                status: booking.status,
                totalAmount: booking.totalAmount,
            }
        });

        return bookings;
    } catch (error) {
        throw new Error(`Failed to fetch upcoming rentals: ${error}`);
    }
});


export const getPastRentals = cache(async (bookingIds: string[]): Promise<IDashboardBooking[] | null> => {
    const mappedIds = bookingIds.map((id) => new ObjectId(id));
    const now = new Date();
    const todayMidNight = new Date(now.setUTCHours(23, 59, 59, 999));

    try {
        const db = await connectDB();
        const result = await db.collection('bookings').aggregate([
            {
                $match: {
                    $and: [
                        { _id: { $in: mappedIds } },
                        { 'timeInterval.end': { $lt: todayMidNight } }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'driver'
                }
            },
            { $unwind: { path: "$driver", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'cars',
                    localField: 'car',
                    foreignField: '_id',
                    as: 'car'
                }
            },
            { $unwind: { path: "$car", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customer'
                }
            },
            { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    driver: {
                        name: 1,
                    },
                    car: {
                        make: 1,
                        carModel: 1,
                    },
                    customer: 1,
                    timeInterval: 1,
                    status: 1,
                    totalAmount: 1,
                }
            }
        ]).toArray();

        if (!result[0]) return null;

        const bookings: IDashboardBooking[] = result.map((booking) => {
            return {
                _id: booking._id.toString(),
                driver: booking.driver,
                car: {
                    make: booking.car.make,
                    carModel: booking.car.carModel,
                },
                customer: booking.customer.toString(),
                timeInterval: {
                    start: new Date(booking.timeInterval.start),
                    end: new Date(booking.timeInterval.end),
                },
                status: booking.status,
                totalAmount: booking.totalAmount,
            }
        });

        return bookings;
    } catch (error) {
        throw new Error(`Failed to fetch upcoming rentals: ${error}`);
    }
});

export const getBookingById = cache(async (bookingId: string): Promise<IBooking | null> => {
    try {
        const db = await connectDB();
        const fetchedBooking = await db.collection('bookings').aggregate([
            { $match: { _id: new ObjectId(bookingId) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customer'
                }
            },
            { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'driver'
                }
            },
            { $unwind: { path: "$driver", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'cars',
                    localField: 'car',
                    foreignField: '_id',
                    as: 'car'
                }
            },
            { $unwind: { path: "$car", preserveNullAndEmptyArrays: true } },
        ]).toArray();

        if (fetchedBooking.length === 0) return null;

        const booking = fetchedBooking[0];

        const formattedBooking = {
            _id: booking._id.toString(),
            customer: booking.customer ? {
                ...booking.customer,
                _id: booking.customer._id.toString(),
                dob: booking.customer.dob ? new Date(booking.customer.dob) : null,
                drivingSince: booking.customer.drivingSince ? new Date(booking.customer.drivingSince) : null,
                bookings: booking.customer.bookings ? booking.customer.bookings.map((booking: IBooking) => booking.toString()) : [],
                invoices: booking.customer.invoices ? booking.customer.invoices.map((invoice: IBooking) => invoice.toString()) : [],
            } : null,
            car: booking.car ? {
                ...booking.car,
                _id: booking.car._id.toString(),
                carRentalDetails: booking.car.carRentalDetails ? booking.car.carRentalDetails.toString() : null,
                carFeaturesAndSpecifications: booking.car.carFeaturesAndSpecifications ? booking.car.carFeaturesAndSpecifications.toString() : null,
                carImagesAndDocuments: booking.car.carImagesAndDocuments ? booking.car.carImagesAndDocuments.toString() : null,
                rentalAgencyDetails: booking.car.rentalAgencyDetails ? booking.car.rentalAgencyDetails.toString() : null,
                bookings: booking.car.bookings ? booking.car.bookings.map((booking: IBooking) => booking.toString()) : [],
            } : null,
            driver: booking.driver ? {
                ...booking.driver,
                _id: booking.driver._id.toString(),
                dob: booking.driver.dob ? new Date(booking.driver.dob) : null,
                drivingSince: booking.driver.drivingSince ? new Date(booking.driver.drivingSince) : null,
                bookings: booking.driver.bookings ? booking.driver.bookings.map((booking: IBooking) => booking.toString()) : [],
                invoices: booking.driver.invoices ? booking.driver.invoices.map((invoice: IInvoice) => invoice.toString()) : [],
            } : null,
            timeInterval: {
                start: new Date(booking.timeInterval.start),
                end: new Date(booking.timeInterval.end),
            },
            status: booking.status,
            totalAmount: booking.totalAmount,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
        };

        return formattedBooking;
    } catch (error) {
        throw new Error(`Failed to fetch booking: ${error}`);
    }
});