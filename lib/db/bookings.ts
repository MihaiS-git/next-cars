'use server';

import { getCarById } from "@/lib/db/cars";
import { IBooking, ICar, IInvoice, User } from "../definitions";
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

async function transformBookings(bookings: IBooking[]): Promise<IBooking[]> {
    const mappedBookings = bookings.map(async (booking: IBooking) => {
        try {
            const db = await connectDB();
            const car = typeof booking.car === 'string' ? await getCarById(booking.car) : null;
            if (!car) return null;
            const driver = typeof booking.driver === 'string' ? await db.collection('users').findOne({ _id: new ObjectId(booking.driver) }) : null;
            if (!driver) return null;
            const mappedBooking = {
                _id: booking._id!.toString(),
                customer: booking.customer!.toString(),
                car: {
                    _id: car._id ? car._id.toString() : '',
                    make: car.make,
                    carModel: car.carModel,
                    year: car.year,
                    category: car.category,
                    seats: car.seats,
                    doors: car.doors,
                    transmission: car.transmission,
                    fuelType: car.fuelType,
                    mileage: car.mileage,
                    carRentalDetails: car.carRentalDetails ? car.carRentalDetails.toString() : null,
                    carFeaturesAndSpecifications: car.carFeaturesAndSpecifications ? car.carFeaturesAndSpecifications.toString() : null,
                    carImagesAndDocuments: car.carImagesAndDocuments ? car.carImagesAndDocuments.toString() : null,
                    rentalAgencyDetails: car.rentalAgencyDetails ? car.rentalAgencyDetails.toString() : null,
                    bookings: car.bookings ? car.bookings : []
                } as ICar,
                driver: {
                    _id: driver._id.toString(),
                    email: driver.email,
                    password: driver.password,
                    name: driver.name,
                    role: driver.role,
                    address: driver.address,
                    phone: driver.phone,
                    dob: driver.dob ? driver.dob.toISOString().split('T')[0] : null,
                    drivingSince: driver.drivingSince ? driver.drivingSince.toISOString().split('T')[0] : null,
                    pictureUrl: driver.pictureUrl,
                    bookings: driver.bookings ? driver.bookings.map((booking: ObjectId) => booking.toString()) : null,
                    invoices: driver.invoices ? driver.invoices.map((invoice: ObjectId) => invoice.toString()) : null,
                    createdAt: driver.createdAt ? driver.createdAt.toISOString().split('T')[0] : null,
                    updatedAt: driver.updatedAt ? driver.updatedAt.toISOString().split('T')[0] : null
                } as User,
                timeInterval: {
                    start: booking.timeInterval.start,
                    end: booking.timeInterval.end
                },
                status: booking.status,
                totalAmount: booking.totalAmount,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt,
            }
            return mappedBooking;
        } catch (error) {
            throw new Error(`Failed to transform booking: ${error}`);
        }
    });
    return (await Promise.all(mappedBookings)) as IBooking[];
}

export async function getUpcomingRentals(bookingIds: string[]) {
    const bookings = await getBookingsByIds(bookingIds);
    if (!bookings) return null;
    const filteredBookings = (bookings as unknown as IBooking[]).filter((booking: IBooking) =>
        booking.timeInterval.start >= new Date() ||
        (booking.timeInterval.start < new Date() && booking.timeInterval.end >= new Date())
    );
    const mappedBookings = await transformBookings(filteredBookings);
    return mappedBookings;
}

export async function getPastRentals(bookingIds: string[]) {
    const bookings = await getBookingsByIds(bookingIds);
    if (!bookings) return null;
    const filteredBookings = (bookings as unknown as IBooking[]).filter((booking: IBooking) =>
        booking.timeInterval.end < new Date()
    );
    const mappedBookings = await transformBookings(filteredBookings as unknown as IBooking[]);
    return mappedBookings;
}


export async function getBookingById(bookingId: string) {
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
                /* createdAt: booking.customer.createdAt ? new Date(booking.customer.createdAt).toISOString().split("T")[0] : null, */
                /* updatedAt: booking.customer.updatedAt ? new Date(booking.customer.updatedAt).toISOString().split("T")[0] : null, */
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
                /* createdAt: booking.driver.createdAt ? new Date(booking.driver.createdAt).toISOString().split("T")[0] : null, */
                /* updatedAt: booking.driver.updatedAt ? new Date(booking.driver.updatedAt).toISOString().split("T")[0] : null, */
            } : null,
            timeInterval: {
                start: new Date(booking.timeInterval.start),
                end: new Date(booking.timeInterval.end),
            },
            status: booking.status,
            totalAmount: booking.totalAmount,
        };

        return formattedBooking;
    } catch (error) {
        throw new Error(`Failed to fetch booking: ${error}`);
    }
}