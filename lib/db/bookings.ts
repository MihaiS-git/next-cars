'use server';

import { getCarByIdWithBookings } from "@/app/actions/cars/actions";
import { IBooking } from "../definitions";
import { connectDB } from "../mongoDb";
import { fetchUserByEmail } from '@/lib/queries/users-queries';
import { ObjectId } from "mongodb";

async function fetchBookingsByIds(bookingIds: any[]) {
    const mappedIds = bookingIds.map((id) => new ObjectId(id));
    try {
        const db = await connectDB();
        const fetchedBookings = await db.collection('bookings').find({ _id: { $in: mappedIds } }).toArray();
        
        if (!fetchedBookings[0]) return null;
        return fetchedBookings;
    } catch (error: any) {
        throw new Error(`Failed to fetch bookings: ${error.message}`);
    }
}

async function transformBookings(bookings: any[]): Promise<IBooking[]> {
    const mappedBookings = bookings.map(async (booking: any) => {
        try {
            const db = await connectDB();
            const car = await getCarByIdWithBookings(booking.car);
            const driver = await db.collection('users').findOne({ _id: booking.driver });
            const mappedBooking = {
                _id: booking._id.toString(),
                customer: booking.customer.toString(),
                car: car ? {
                    ...car,
                    _id: car._id!.toString(),
                    carRentalDetails: car.carRentalDetails ? car.carRentalDetails?.toString() : null,
                    carFeaturesAndSpecifications: car.carFeaturesAndSpecifications ? car.carFeaturesAndSpecifications.toString() : null,
                    carImagesAndDocuments: car.carImagesAndDocuments ? car.carImagesAndDocuments.toString() : null,
                    rentalAgencyDetails: car.rentalAgencyDetails ? car.rentalAgencyDetails.toString() : null,
                    bookings: car.bookings ? car.bookings.map((booking: any) => booking.toString()) : undefined
                } : null,
                driver: driver ? {
                    ...driver,
                    _id: driver._id.toString(),
                    dob: driver.dob ? driver.dob.toISOString().split('T')[0] : null,
                    drivingSince: driver.drivingSince ? driver.drivingSince.toISOString().split('T')[0] : null,
                    bookings: driver.bookings ? driver.bookings.map((booking: any) => booking.toString()) : null,
                    email: driver.email,
                    password: driver.password
                } : null,
                timeInterval: {
                    start: booking.timeInterval.start,
                    end: booking.timeInterval.end
                },
                status: booking.status,
                totalAmount: booking.totalAmount
            }
            return mappedBooking;
        } catch (error: any) {
            throw new Error(`Failed to transform booking: ${error.message}`);
        }
    });
    return await Promise.all(mappedBookings);
}

export async function getUpcomingRentals(bookingIds: any[]) { 
    const bookings = await fetchBookingsByIds(bookingIds);
    if (!bookings) return null;
    const filteredBookings = bookings.filter((booking: any) =>
        booking.timeInterval.start >= new Date() ||
        (booking.timeInterval.start < new Date() && booking.timeInterval.end >= new Date())
    );
    
    const mappedBookings = await transformBookings(filteredBookings);
    return mappedBookings;
}

export async function getPastRentals(bookingIds: any[]) { 
    const bookings = await fetchBookingsByIds(bookingIds);
    if (!bookings) return null;
    const filteredBookings = bookings.filter((booking: any) =>
        booking.timeInterval.end < new Date()
    );
    const mappedBookings = await transformBookings(filteredBookings);
    return mappedBookings;
}