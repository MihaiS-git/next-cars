"use server";

import { getCarByIdWithBookingsAndPrice } from "../cars/actions";
import { getDriverDataForBooking } from "../drivers/actions";
import { connectDB } from "@/lib/mongoDb";
import { ObjectId } from "mongodb";
import { createInvoice } from "../invoice/actions";
import { isAvailableForBooking } from "@/lib/util/check-availability";
import { createBooking, saveBookingInRelatedDocument, validateBookCarInputdata } from "@/lib/helpers/booking-helpers";
import { getUserByEmail } from "@/lib/queries/users-queries";

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
    const customerEmail = formData.get('customerEmail') as string;
    const carId = formData.get('carId') as string;
    const driverId = formData.get('driverId') as string;
    const sDate = formData.get('startDate') as string;
    const daysNo = Number(formData.get('daysNo') as string);

    validateBookCarInputdata(carId, driverId, sDate, daysNo);

    let customerId, customer = null;
    try {
        customer = await getUserByEmail(customerEmail);
        customerId = customer?._id!.toString();

        if (!customerId) {
            return { message: 'Please fill in your Account details first.' };
        }
    } catch (error: any) {
        return { message: `Failed to fetch customer: ${error.message}` };
    }

    const startDate = new Date(sDate!);
    let endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + daysNo);

    // check Car availability
    let isCarAvailable = true;
    let selectedCar = null;
    try {
        selectedCar = await getCarByIdWithBookingsAndPrice(carId);
        if (!selectedCar) return { message: "Car not found." };

        if (selectedCar.bookings && selectedCar.bookings.length > 0) {
            isCarAvailable = isAvailableForBooking(selectedCar.bookings, startDate, endDate);
        }
        if (!isCarAvailable) return { message: "The selected car is not available for the chosen interval." }
    } catch (error: any) {
        return { message: `Failed to fetch car: ${error.message}` };
    }

    // check Driver availability
    let isDriverAvailable = true;
    let selectedDriver = null;
    try {
        selectedDriver = await getDriverDataForBooking(driverId);
        if (!selectedDriver) return { message: "Driver not found." };

        if (selectedDriver.bookings && selectedDriver.bookings.length > 0) {
            isDriverAvailable = isAvailableForBooking(selectedDriver.bookings, startDate, endDate);
        }
        if (!isDriverAvailable) return { message: "The selected driver is not available for the chosen interval." }
    } catch (error: any) {
        return { message: `Failed to fetch driver: ${error.message}` };
    }

    // calculate total amount
    const carRentalDetails = selectedCar.carRentalDetails;
    const totalAmount = +carRentalDetails.rentalPricePerDay * daysNo;

    // create new Booking
    const bookingId = (await createBooking(customerId, carId, driverId, { start: startDate, end: endDate }, 'Pending', totalAmount)).toString();

    // save the bookingId in the related documents
    saveBookingInRelatedDocument(selectedCar, bookingId, 'cars');
    saveBookingInRelatedDocument(selectedDriver, bookingId, 'users');
    saveBookingInRelatedDocument(customer, bookingId, 'users');

    // create & save invoice object
    createInvoice(customerId, bookingId.toString(), totalAmount);

    return { message: "Booking saved successfully!" };
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