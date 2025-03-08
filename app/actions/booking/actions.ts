"use server";

import { log } from "console";
import { getCarByIdWithBookings } from "../cars/actions";
import { getDriverByIdWithBookings } from "../drivers/actions";
import { connectDB } from "@/lib/mongoDb";
import { ObjectId } from "mongodb";

export type State = {
    errors?: {
        carId: string;
        driverId: string;
        startDate: string;
        daysNo: number;
    };
    message?: string | null;
};

export async function bookCar(prevState: State, formData: FormData) {
    const customerEmail = formData.get('customerEmail') as string | null;
    const carId = formData.get('carId') as string | null;
    const driverId = formData.get('driverId') as string | null;
    const sDate = formData.get('startDate') as string | null;
    const daysNo = formData.get('daysNo') as string | null;

    try {
        const db = await connectDB();
        const customer = await db.collection('users').findOne({ email: customerEmail });
        const customerId = customer?._id.toString();

        if (!carId || !driverId || !sDate || !daysNo) {
            return { message: 'Missing required fields.' };
        }
        if (!customerId) {
            return { message: 'Please fill in your Account details first.' };
        }

        const startDate = new Date(sDate!);
        let endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + Number(daysNo));

        let isCarAvailable = true;
        let isDriverAvailable = true;

        // check Car availability
        const selectedCar = await getCarByIdWithBookings(carId);
        if (!selectedCar) return { message: "Car not found." };

        if (selectedCar.bookings && selectedCar.bookings.length > 0) {
            for (const booking of selectedCar.bookings) {
                const bookedStart = new Date(booking.timeInterval.start);
                const bookedEnd = new Date(booking.timeInterval.end);

                if (startDate >= bookedStart && startDate <= bookedEnd ||
                    endDate >= bookedStart && endDate <= bookedEnd ||
                    startDate <= bookedStart && endDate >= bookedEnd
                ) {
                    isCarAvailable = false;
                    break;
                }
            }
        }
        if (!isCarAvailable) return { message: "The selected car is not available for the chosen interval." }
        

        // check Driver availability
        const selectedDriver = await getDriverByIdWithBookings(driverId);
        if (!selectedDriver) return { message: "Driver not found." };

        if (selectedDriver.bookings && selectedDriver.bookings.length > 0) {
            for (const booking of selectedDriver!.bookings!) {
                const bookedStart = new Date(booking.timeInterval.start);
                const bookedEnd = new Date(booking.timeInterval.end);

                if (startDate >= bookedStart && startDate <= bookedEnd ||
                    endDate >= bookedStart && endDate <= bookedEnd ||
                    startDate <= bookedStart && endDate >= bookedEnd
                ) {
                    isDriverAvailable = false;
                    break;
                }
            }
        }
        if (!isDriverAvailable) return { message: "The selected driver is not available for the chosen interval." }

        // create new Booking
        const newBooking = {
            customer: new ObjectId(customerId!),
            car: new ObjectId(carId),
            driver: new ObjectId(driverId),
            timeInterval: { start: startDate, end: endDate },
        };

        const bookingResult = await db.collection('bookings').insertOne(newBooking);
        if (!bookingResult) return { message: "Failed to save the booking" };

        const bookingId = bookingResult.insertedId;

        // save the bookingId in the related documents
        const lightCar = await db.collection('cars').findOne({ _id: new ObjectId(carId) }, { projection: { bookings: 1 } });
        if (lightCar) {
            if (!lightCar.bookings) lightCar.bookings = [];
            const updatedBookingsOnCar = [...lightCar.bookings, new ObjectId(bookingId)];
            const carResult = await db.collection('cars').updateOne(
                { _id: new ObjectId(carId) },
                { $set: { bookings: updatedBookingsOnCar } }
            );
        }

        const lightDriver = await db.collection('users').findOne({ _id: new ObjectId(driverId) }, { projection: { bookings: 1 } });
        if (lightDriver) {
            if (!lightDriver.bookings) lightDriver.bookings = [];
            const updatedBookingsOnDriver = [...lightDriver.bookings, new ObjectId(bookingId)];
            const driverResult = await db.collection('users').updateOne(
                { _id: new ObjectId(driverId) },
                { $set: { bookings: updatedBookingsOnDriver } }
            );
        }

        const lightCustomer = await db.collection('users').findOne({ _id: new ObjectId(customerId) }, { projection: { bookings: 1 } });
        if (lightCustomer) {
            if (!lightCustomer.bookings) lightCustomer.bookings = [];
            const updatedBookingsOnCustomer = [...lightCustomer.bookings, new ObjectId(bookingId)];
            const customerResult = await db.collection('users').updateOne(
                { _id: new ObjectId(customerId) },
                { $set: { bookings: updatedBookingsOnCustomer } }
            );
        }

        return { message: "Booking saved successfully!" };
    } catch (error: any) {
        return { message: `Something wrong happened: ${error}` };
    }
}