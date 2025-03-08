'use server';

import { IBooking, User } from "@/lib/definitions";
import { connectDB } from "@/lib/mongoDb";
import { ObjectId } from "mongodb";

export async function getAllDrivers() {
    try {
        const db = await connectDB();

        const drivers = await db.collection('users')
            .find({ role: 'DRIVER' })
            .toArray();

        if (!drivers[0]) return [];

        const mappedDrivers: User[] = drivers.map(driver => ({
            _id: driver._id.toString(),
            email: driver.email,
            password: '',
            name: driver.name,
            role: driver.role,
            address: driver.address,
            phone: driver.phone,
            dob: driver.dob,
            drivingSince: driver.drivingSince,
            pictureUrl: driver.pictureUrl,
            bookings: driver.bookings ? driver.bookings.map((booking: ObjectId) => booking.toString()) : [],
        }));

        return mappedDrivers;
    } catch (error: any) {
        throw new Error(`Something wrong happened: ${error.message}`);
    }
}

export async function getAllDriversPaginated(page: number = 1, limit: number = 10) {
    try {
        const db = await connectDB();
        const skip = (page - 1) * limit;

        const drivers = await db.collection('users')
            .find({ role: 'DRIVER' })
            .skip(skip)
            .limit(limit)
            .toArray();

        const totalCount = await db.collection('users').countDocuments({ role: 'DRIVER' });

        if (!drivers[0]) return { drivers: [], totalCount };

        const mappedDrivers: User[] = drivers.map(driver => ({
            _id: driver._id.toString(),
            email: driver.email,
            password: '',
            name: driver.name,
            role: driver.role,
            address: driver.address,
            phone: driver.phone,
            dob: driver.dob,
            drivingSince: driver.drivingSince,
            pictureUrl: driver.pictureUrl,
            bookings: driver.bookings ? driver.bookings.map((booking: ObjectId) => booking.toString()) : [],
        }));


        return { drivers: mappedDrivers, totalCount };
    } catch (error: any) {
        throw new Error(`Something wrong happened: ${error.message}`);
    }
}

export async function getDriverBySlug(slug: string) {
    try {
        const db = await connectDB();
        const result = await db.collection('users').find({ _id: new ObjectId(slug) }).toArray();

        if (!result[0]) return null;

        const mappedDriver: User = {
            _id: result[0]._id.toString(),
            email: result[0].email,
            password: "",
            name: result[0].name,
            role: result[0].role,
            address: result[0].address,
            phone: result[0].phone,
            dob: result[0].dob,
            drivingSince: result[0].drivingSince,
            pictureUrl: result[0].pictureUrl,
            bookings: result[0].bookings ? result[0].bookings.map((booking: ObjectId) => booking.toString()) : [],
        }

        return mappedDriver;
    } catch (error: any) {
        throw new Error(`Something wrong happened: ${error.message}`);
    }
}

export async function getDriverByIdWithBookings(id: string) {
    try {
        const db = await connectDB();
        const result = await db.collection('users').aggregate([
            { $match: { _id: new ObjectId(id) } },
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
                    email: 1,
                    password: 1,
                    name: 1,
                    role: 1,
                    address: 1,
                    phone: 1,
                    dob: 1,
                    drivingSince: 1,
                    pictureUrl: 1,
                    bookings: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    __v: 1
                }
            }
        ]).toArray();

        if (!result[0]) return null;

        const mappedDriver: User = {
            _id: result[0]._id.toString(),
            email: result[0].email,
            password: "",
            name: result[0].name,
            role: result[0].role,
            address: result[0].address,
            phone: result[0].phone,
            dob: result[0].dob,
            drivingSince: result[0].drivingSince,
            pictureUrl: result[0].pictureUrl,
            bookings: result[0].bookings ? result[0].bookings.map((booking: IBooking) => ({
                _id: booking._id?.toString(),
                customer: booking.customer?.toString(),
                car: booking.car?.toString(),
                driver: booking.driver?.toString(),
                timeInterval: { start: booking.timeInterval.start.toString(), end: booking.timeInterval.end.toString() }
            })) : [],
        }

        return mappedDriver;
    } catch (error: any) {
        throw new Error(`Something wrong happened: ${error.message}`);
    }
}