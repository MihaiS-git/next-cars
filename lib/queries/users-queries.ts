'use server';

import { User } from "@/lib/definitions";
import { withDb } from "@/lib/util/db-helper";

export async function getUserByEmail(email: string): Promise<User | null> {
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
      bookings: Array.isArray(user.bookings)
        ? user.bookings.map((booking: any) => ({
          _id: booking._id?.toString(),
          customer: booking.customerId?.toString(),
          car: booking.carId?.toString(),
          driver: booking.driverId?.toString(),
          timeInterval: {
            start: booking.timeInterval?.start?.toString() || null,
            end: booking.timeInterval?.end?.toString() || null,
          },
        }))
        : [],
    };

    return mappedUser;
  });
  return user;
}


export async function createNewUser(email: string, password: string) {
  return withDb('users', async (collection) => {
    const result = await collection.insertOne({ email, password });
    if (!result.acknowledged) return null;
    return { _id: result.insertedId, email };
  })
}
