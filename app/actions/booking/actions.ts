"use server";

import { createInvoice } from "../invoice/actions";
import {
    checkCarAvailability,
    checkDriverAvailability,
    createBooking, getCustomerId,
    getTotalAmount,
    saveBookingInRelatedDocument,
    validateBookCarInputData
} from "@/lib/helpers/booking-helpers";
import { ICar, User } from "@/lib/definitions";
import { connectDB } from "@/lib/mongoDb";
import { ObjectId } from "mongodb";
import client from "@/db";

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

    const session = client.startSession();

    try {
        const startDate = new Date(sDate!);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + daysNo);
        
        // check Car availability
        let selectedCar: ICar | null = null;
        try {
            selectedCar = await checkCarAvailability(carId, startDate, endDate);
        } catch (error) {
            return { message: `${error}` };
        }
        
        // check Driver availability
        let selectedDriver: User | null = null;
        try { 
            selectedDriver = await checkDriverAvailability(driverId, startDate, endDate);
        } catch (error) {
            return { message: `${error}` };
        }
        
        // get customerId
        let customer: User | null = null;
        let customerId: string | null = null;
        try { 
            ({ customerId, customer } = await getCustomerId(customerEmail));
        } catch (error) {
            return { message: `Failed to fetch customer: ${error}` };
        }
        // calculate total amount
        const totalAmount = getTotalAmount(selectedCar, daysNo);

        session.withTransaction(async () => {
            // create new Booking
            const bookingId = (await createBooking(customerId, carId, driverId, { start: startDate, end: endDate }, 'Pending', totalAmount)).toString();
            // save the bookingId in the related documents
            await saveBookingInRelatedDocument(selectedCar, bookingId, 'cars');
            await saveBookingInRelatedDocument(selectedDriver, bookingId, 'users');
            await saveBookingInRelatedDocument(customer, bookingId, 'users');
            // create & save invoice object
            await createInvoice(customerId, bookingId, totalAmount);
        });

        return { message: "Booking saved successfully!" };
    } catch (error) {
        return { message: `Failed to create booking: ${error}` };
    } finally {
        session.endSession();
    }
}

export async function updateBookingStatus(id: string, newStatus: string) {
    try {
        const db = await connectDB();
        const result = await db.collection('bookings').updateOne({ _id: new ObjectId(id) }, { $set: { status: newStatus } });
        if (result.modifiedCount === 0) {
            return { message: "Booking status not updated." };
        }
        return { message: "Booking status updated successfully!" };
    } catch (error) {
        return { message: `Failed to update booking status: ${error}` };
    }
}