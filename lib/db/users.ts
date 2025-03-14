'use server';

import {  User } from "@/lib/definitions";
import { withDb } from "@/lib/util/db-helper";
import { ObjectId } from "mongodb";

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = withDb('users', async (collection) => {
    const user = await collection.findOne({ email });
    if (user) {
      return {
        ...user,
        _id: user._id ? user._id.toString() : undefined,
        dob: user.dob ? user.dob : undefined,
        drivingSince: user.drivingSince ? user.drivingSince : undefined,
        bookings: user.bookings ? user.bookings.map((bookingId: ObjectId) => bookingId.toString()) : [],
        invoices: user.invoices ? user.invoices.map((invoiceId: ObjectId) => invoiceId.toString()) : [],
        createdAt: user.createdAt ? user.createdAt : undefined,
        updatedAt: user.updatedAt ? user.updatedAt : undefined,
      };
    }
    return null;
  });
  return user;
}

export async function getUserById(userId: string): Promise<User | null> {
  const user = withDb('users', async (collection) => {
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (user) {
      return {
        ...user,
        _id: user._id.toString(),
        dob: user.dob.toISOString().split('T')[0],
        drivingSince: user?.drivingSince!.toISOString().split('T')[0],
        bookings: user.bookings.map((bookingId: ObjectId) => bookingId.toString()),
        invoices: user.invoices.map((invoiceId: ObjectId) => invoiceId.toString()),
        createdAt: user.createdAt.toISOString().split('T')[0],
        updatedAt: user.updatedAt.toISOString().split('T')[0],
      };
    }
    return null;
  });
  return user;
}
