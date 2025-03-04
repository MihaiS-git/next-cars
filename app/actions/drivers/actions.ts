'use server';

import { User } from "@/lib/definitions";
import { connectDB } from "@/lib/mongoDb";
import { ObjectId } from "mongodb";

export async function getAllDriversPaginated(page: number = 1, limit: number = 10) {
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
    }));


    return {drivers: mappedDrivers, totalCount};
}

export async function getDriverBySlug(slug: string) {
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
    }

    return mappedDriver;
}