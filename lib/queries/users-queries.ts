'use server';

import { IBooking, User } from "@/lib/definitions";
import { withDb } from "@/lib/util/db-helper";
import { connectDB } from "../mongoDb";
import { getCarByIdWithBookings } from "@/app/actions/cars/actions";

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = withDb('users', async (collection) => {
    const user = (await collection.findOne({ email })) as User | null;
    if (user) {
      user._id = user._id!.toString();
      return user;
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

async function fetchUserByEmail(email: string) {
  const db = await connectDB();
  const fetchedUser = await db.collection('users').find({
    email
  }).toArray();
  if (!fetchedUser[0]) return null;
  return fetchedUser[0];
}

async function fetchBookingsByIds(bookingIds: any[]) {
  const db = await connectDB();
  const fetchedBookings = await db.collection('bookings').find({ _id: { $in: bookingIds } }).toArray();
  if (fetchedBookings.length === 0)
    return null;
  return fetchedBookings;
}

async function transformBookings(bookings: any[]): Promise<IBooking[]> {
  const db = await connectDB();
  return await Promise.all(bookings.map(async (booking: any) => {
    booking._id = booking._id.toString();
    booking.customer = booking.customer.toString();
    booking.timeInterval.start = new Date(booking.timeInterval.start);
    booking.timeInterval.end = new Date(booking.timeInterval.end);

    const car = await getCarByIdWithBookings(booking.car);
    const driver = await db.collection('users').findOne({ _id: booking.driver });

    return {
      _id: booking._id.toString(),
      customer: booking.customer.toString(),
      car: car ? {
        _id: car._id!.toString(),
        make: car.make,
        carModel: car.carModel,
        year: car.year,
        category: car.category,
        seats: car.seats,
        doors: car.doors,
        transmission: car.transmission,
        fuelType: car.fuelType,
        mileage: car.mileage,
        carRentalDetails: car.carRentalDetails?.toString() ? car.carRentalDetails : null,
        carFeaturesAndSpecifications: car.carFeaturesAndSpecifications?.toString() ? car.carFeaturesAndSpecifications : null,
        carImagesAndDocuments: car.carImagesAndDocuments?.toString() ? car.carImagesAndDocuments : null,
        rentalAgencyDetails: car.rentalAgencyDetails?.toString() ? car.rentalAgencyDetails : null,
        bookings: car.bookings?.toString() ? car.bookings : null
      } : null,
      driver: driver ? {
        _id: driver._id.toString(),
        email: driver.email,
        password: driver.password,
        name: driver.name,
        role: driver.role,
        address: driver.address,
        phone: driver.phone,
        dob: driver.dob.toISOString().split('T')[0] || null,
        drivingSince: driver.drivingSince.toISOString().split('T')[0] || null,
        pictureUrl: driver.pictureUrl,
        bookings: driver.bookings ? driver.bookings.map((booking: any) => booking.toString()) : null
      } : null,
      timeInterval: {
        start: booking.timeInterval.start,
        end: booking.timeInterval.end
      },
      status: booking.status,
      totalAmount: booking.totalAmount
    } as IBooking;
  }));
}

export async function getPastRentalsByUserEmail(email: string): Promise<User | null> {
  const fetchedUser = await fetchUserByEmail(email);
  if (!fetchedUser) return null;
  const bookings = await fetchBookingsByIds(fetchedUser.bookings);
  if (bookings?.length === 0) return null;
  const pastBookings = bookings!.filter((booking: any) => booking.timeInterval.end < new Date());

  const transformedBookings = await transformBookings(pastBookings);

  const transformedUser: User = {
    ...fetchedUser,
    _id: fetchedUser._id.toString(),
    email: fetchedUser.email,
    password: "",
    dob: fetchedUser.dob.toISOString().split('T')[0] || null,
    drivingSince: fetchedUser.drivingSince.toISOString().split('T')[0] || null,
    bookings: transformedBookings,
  };

  return transformedUser;
}

export async function getUpcomingRentalsByUserEmail(email: string): Promise<User | null> {
  const fetchedUser = await fetchUserByEmail(email);
  if (!fetchedUser) return null;

  const bookings = await fetchBookingsByIds(fetchedUser.bookings);
  if (bookings?.length === 0) return null;

  const upcomingBookings = bookings!.filter((booking: any) =>
    booking.timeInterval.start > new Date() ||
    (booking.timeInterval.start < new Date() && booking.timeInterval.end > new Date())
  );

  const transformedBookings = await transformBookings(upcomingBookings);

  const transformedUser: User = {
    ...fetchedUser,
    _id: fetchedUser._id.toString(),
    email: fetchedUser.email,
    password: "",
    dob: fetchedUser.dob.toISOString().split('T')[0] || null,
    drivingSince: fetchedUser.drivingSince.toISOString().split('T')[0] || null,
    bookings: transformedBookings,
  };

  return transformedUser;
}

export async function createNewUser(email: string, password: string) {
  return withDb('users', async (collection) => {
    const result = await collection.insertOne({ email, password });
    if (!result.acknowledged) return null;
    return { _id: result.insertedId, email };
  })
}
