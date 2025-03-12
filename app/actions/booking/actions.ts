"use server";

import { getCarByIdWithBookings, getCarByIdWithBookingsAndPrice } from "../cars/actions";
import { getDriverByIdWithBookings, getDriverDataForBooking } from "../drivers/actions";
import { connectDB } from "@/lib/mongoDb";
import { ObjectId } from "mongodb";
import { ICarRentalDetails } from "@/lib/definitions";
import { createInvoice } from "../invoice/actions";
import { create } from "domain";

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
        const selectedCar = await getCarByIdWithBookingsAndPrice(carId);
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
        const selectedDriver = await getDriverDataForBooking(driverId);
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

        const carRentalDetails = selectedCar.carRentalDetails as ICarRentalDetails;
        const totalAmount = +carRentalDetails.rentalPricePerDay * Number(daysNo);

        // create new Booking
        const newBooking = {
            customer: new ObjectId(customerId!),
            car: new ObjectId(carId),
            driver: new ObjectId(driverId),
            timeInterval: { start: startDate, end: endDate },
            status: 'Pending',
            totalAmount: totalAmount,
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

        // create & save invoice object
        createInvoice(customerId, bookingId.toString(), totalAmount);

        return { message: "Booking saved successfully!" };
    } catch (error: any) {
        return { message: `Something wrong happened: ${error}` };
    }
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
                dob: booking.customer.dob ? new Date(booking.customer.dob).toISOString().split("T")[0] : null,
                drivingSince: booking.customer.drivingSince ? new Date(booking.customer.drivingSince).toISOString().split("T")[0] : null,
                bookings: booking.customer.bookings ? booking.customer.bookings.map((booking: any) => booking.toString()) : [],
                invoices: booking.customer.invoices ? booking.customer.invoices.map((invoice: any) => invoice.toString()) : [],
                createdAt: booking.customer.createdAt ? new Date(booking.customer.createdAt).toISOString().split("T")[0] : null,
                updatedAt: booking.customer.updatedAt ? new Date(booking.customer.updatedAt).toISOString().split("T")[0] : null,
            } : null,
            car: booking.car ? {
                ...booking.car,
                _id: booking.car._id.toString(),
                carRentalDetails: booking.car.carRentalDetails ? booking.car.carRentalDetails.toString() : null,
                carFeaturesAndSpecifications: booking.car.carFeaturesAndSpecifications ? booking.car.carFeaturesAndSpecifications.toString() : null,
                carImagesAndDocuments: booking.car.carImagesAndDocuments ? booking.car.carImagesAndDocuments.toString() : null,
                rentalAgencyDetails: booking.car.rentalAgencyDetails ? booking.car.rentalAgencyDetails.toString() : null,
                bookings: booking.car.bookings ? booking.car.bookings.map((booking: any) => booking.toString()) : [],
            } : null,
            driver: booking.driver ? {
                ...booking.driver,
                _id: booking.driver._id.toString(),
                dob: booking.driver.dob ? new Date(booking.driver.dob).toISOString().split("T")[0] : null,
                drivingSince: booking.driver.drivingSince ? new Date(booking.driver.drivingSince).toISOString().split("T")[0] : null,
                bookings: booking.driver.bookings ? booking.driver.bookings.map((booking: any) => booking.toString()) : [],
                invoices: booking.driver.invoices ? booking.driver.invoices.map((invoice: any) => invoice.toString()) : [],
                createdAt: booking.driver.createdAt ? new Date(booking.driver.createdAt).toISOString().split("T")[0] : null,
                updatedAt: booking.driver.updatedAt ? new Date(booking.driver.updatedAt).toISOString().split("T")[0] : null,
            } : null,
            timeInterval: {
                start: new Date(booking.timeInterval.start).toISOString().split("T")[0],
                end: new Date(booking.timeInterval.end).toISOString().split("T")[0],
            },
            status: booking.status,
            totalAmount: booking.totalAmount,
        };

        return formattedBooking;
    } catch (error: any) {
        throw new Error(`Failed to fetch booking: ${error.message}`);
    }
}