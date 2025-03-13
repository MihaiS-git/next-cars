'use server';

import { IBooking, User } from "@/lib/definitions";
import { withDb } from "@/lib/util/db-helper";
import { connectDB } from "../mongoDb";
import { getCarByIdWithBookings } from "@/app/actions/cars/actions";
import { ObjectId } from "mongodb";

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = withDb('users', async (collection) => {
    const user = (await collection.findOne({ email })) as User | null;
    if (user) {
      return {
        ...user,
        _id: user._id!.toString(),
        bookings: user.bookings ? user.bookings.map((booking: any) => booking.toString()) : [],
      };
    }
    return null;
  });
  return user;
}

export async function getUserById(userId: string): Promise<User | null> {
  const user = withDb('users', async (collection) => {
    const user = (await collection.findOne({ _id: new ObjectId(userId) })) as User | null;
    if (user) {
      return {
        ...user,
        _id: user._id!.toString(),
        dob: user?.dob!.toString(),
        drivingSince: user?.drivingSince!.toString(),
        bookings: user.bookings ? user.bookings.map((booking: any) => booking.toString()) : [],
        invoices: user.invoices ? user.invoices.map((invoice: any) => invoice.toString()) : [],
        createdAt: user.createdAt?.toString(),
        updatedAt: user.updatedAt?.toString(),
      };
    }
    return null;
  });
  return user;
}

export async function getFullUserByEmail(email: string): Promise<User | null> {
  const user = withDb('users', async (collection) => {
    const user = (await collection.findOne({ email })) as User | null;
    if (!user) return null;

    const mappedUser: User = {
      _id: user._id?.toString(),
      email: user.email,
      password: "",
      name: user.name,
      role: user.role,
      address: user.address,
      phone: user.phone,
      dob: user.dob,
      drivingSince: user.drivingSince,
      pictureUrl: user.pictureUrl,
      bookings: user.bookings ? user.bookings.map((booking: any) => booking.toString()) : [],
    };

    return mappedUser;
  });
  return user;
}

export async function getUserDataForAccountUpdate(email: string): Promise<User | null> {
  const user = withDb('users', async (collection) => {
    const user = await collection.findOne({ email });
    if (!user) return null;

    const mappedUser = {
      _id: user._id?.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      address: user.address,
      phone: user.phone,
      dob: user.dob,
      drivingSince: user.drivingSince,
      pictureUrl: user.pictureUrl,
    };

    return mappedUser;
  });
  return user;
}

export async function fetchUserByEmail(email: string) {
  const db = await connectDB();
  const fetchedUser = await db.collection('users').find({
    email
  }).toArray();
  if (!fetchedUser[0]) return null;
  return fetchedUser[0];
}



export async function createNewUser(email: string, password: string) {
  return withDb('users', async (collection) => {
    const result = await collection.insertOne({ email, password });
    if (!result.acknowledged) return null;
    return { _id: result.insertedId, email };
  })
}
