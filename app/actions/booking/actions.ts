"use server";

import { getCarById, getCarSummaryById } from "@/lib/db/cars";
import { getDriverByIdWithBookings, getDriverSummaryById } from "@/lib/db/drivers";
import { createInvoice } from "../invoice/actions";
import { isAvailableForBooking } from "@/lib/util/check-availability";
import { createBooking, saveBookingInRelatedDocument, validateBookCarInputData } from "@/lib/helpers/booking-helpers";
import { getUserByEmail } from "@/lib/db/users";
import { IBooking, ICar, User } from "@/lib/definitions";
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
    const customerEmail = formData.get('customerEmail') as string;
    const carId = formData.get('carId') as string;
    const driverId = formData.get('driverId') as string;
    const sDate = formData.get('startDate') as string;
    const daysNo = Number(formData.get('daysNo') as string);

    validateBookCarInputData(carId, driverId, sDate, daysNo);

    try {
        let customerId, customer = null;
        try {
            customer = await getUserByEmail(customerEmail);
            if (!customer) {
                console.error("Customer not found");
                return { message: "Please fill in your Account details first." };
            }
            customerId = customer?._id!.toString();

            if (!customerId) {
                console.error("Customer ID not found");
                return { message: 'Please fill in your Account details first.' };
            }
        } catch (error) {
            console.error(`Failed to fetch customer: ${error}`);
            return { message: `Failed to fetch customer: ${error}` };
        }

        const startDate = new Date(sDate!);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + daysNo);

        // check Car availability
        let isCarAvailable = true;
        let selectedCar: ICar | null = null;
        try {
            selectedCar = await getCarById(carId);
            if (!selectedCar) {
                console.error("Car not found");
                return { message: "Car not found." };
            }
            if (selectedCar.bookings && selectedCar.bookings.length > 0) {
                isCarAvailable = isAvailableForBooking(selectedCar.bookings.filter(booking => typeof booking !== 'string') as IBooking[], startDate, endDate);
            }
            if (!isCarAvailable) {
                console.error("Car not available");
                return { message: "The selected car is not available for the chosen interval." }
            }
        } catch (error) {
            console.error(`Failed to fetch car: ${error}`);
            return { message: `Failed to fetch car: ${error}` };
        }

        // check Driver availability
        let isDriverAvailable = true;
        let selectedDriver: User | null = null;
        try {
            selectedDriver = await getDriverByIdWithBookings(driverId);
            if (!selectedDriver) {
                console.error("Driver not found");
                return { message: "Driver not found." }
            }
            if (selectedDriver.bookings && selectedDriver.bookings.length > 0) {
                isDriverAvailable = isAvailableForBooking(selectedDriver.bookings.filter(booking => typeof booking !== 'string') as IBooking[], startDate, endDate);
            }
            if (!isDriverAvailable) {
                console.error("Driver not available");
                return { message: "The selected driver is not available for the chosen interval." }
            }
        } catch (error) {
            console.error(`Failed to fetch driver: ${error}`);
            return { message: `Failed to fetch driver: ${error}` };
        }

        // calculate total amount
        const carRentalDetails = selectedCar.carRentalDetails;
        if (!carRentalDetails) {
            console.error("Car rental details not found");
            return { message: "Car rental details not found." };
        }
        if (typeof carRentalDetails === 'string') {
            console.error("Invalid car rental details");
            return { message: "Invalid car rental details." };
        }
        const totalAmount = carRentalDetails.rentalPricePerDay * daysNo;

        // create new Booking
        const bookingId = (await createBooking(customerId, carId, driverId, { start: startDate, end: endDate }, 'Pending', totalAmount)).toString();
        
        const carToUpdate = await getCarSummaryById(carId);
        if(!carToUpdate) {
            console.error("Car not found");
            return { message: "Car not found." };
        }
        const driverToUpdate = await getDriverSummaryById(driverId);
        if(!driverToUpdate) {
            console.error("Driver not found");
            return { message: "Driver not found." };
        }

        // save the bookingId in the related documents
        saveBookingInRelatedDocument(carToUpdate, bookingId, 'cars');
        saveBookingInRelatedDocument(driverToUpdate, bookingId, 'users');
        saveBookingInRelatedDocument(customer, bookingId, 'users');

        // create & save invoice object
        createInvoice(customerId, bookingId.toString(), totalAmount);
        
        return { message: "Booking saved successfully!" };
    } catch (error) {
        console.error(`Failed to create booking: ${error}`);
        return { message: `Failed to create booking: ${error}` };
    }
}

export async function updateBookingStatus(id: string, newStatus: string) {
    try {
        const db = await connectDB();
        const result = await db.collection('bookings').updateOne({ _id: new ObjectId(id) }, { $set: { status: newStatus } });
        if(result.modifiedCount === 0) {
            return { message: "Booking status not updated." };
        }
        return { message: "Booking status updated successfully!" };
    } catch (error) {
        return { message: `Failed to update booking status: ${error}` };
    }
}