"use server";

import { getCarById } from "@/lib/db/cars";
import { getDriverByIdWithBookings } from "@/lib/db/drivers";
import { createInvoice } from "../invoice/actions";
import { isAvailableForBooking } from "@/lib/util/check-availability";
import { createBooking, saveBookingInRelatedDocument, validateBookCarInputData } from "@/lib/helpers/booking-helpers";
import { getUserByEmail } from "@/lib/db/users";
import { ICar, User } from "@/lib/definitions";

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
                return { message: "Please fill in your Account details first." };
            }
            customerId = customer?._id!.toString();

            if (!customerId) {
                return { message: 'Please fill in your Account details first.' };
            }
        } catch (error) {
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
            if (!selectedCar) return { message: "Car not found." };
            if (selectedCar.bookings && selectedCar.bookings.length > 0) {
                isCarAvailable = isAvailableForBooking(selectedCar.bookings, startDate, endDate);
            }
            if (!isCarAvailable) return { message: "The selected car is not available for the chosen interval." }
        } catch (error) {
            return { message: `Failed to fetch car: ${error}` };
        }

        // check Driver availability
        let isDriverAvailable = true;
        let selectedDriver: User | null = null;
        try {
            selectedDriver = await getDriverByIdWithBookings(driverId);
            if (!selectedDriver) return { message: "Driver not found." }
            if (selectedDriver.bookings && selectedDriver.bookings.length > 0) {
                isDriverAvailable = isAvailableForBooking(selectedDriver.bookings, startDate, endDate);
            }
            if (!isDriverAvailable) return { message: "The selected driver is not available for the chosen interval." }
        } catch (error) {
            return { message: `Failed to fetch driver: ${error}` };
        }

        // calculate total amount
        const carRentalDetails = selectedCar.carRentalDetails;
        if (!carRentalDetails) {
            return { message: "Car rental details not found." };
        }
        if (typeof carRentalDetails === 'string') {
            return { message: "Invalid car rental details." };
        }
        const totalAmount = carRentalDetails.rentalPricePerDay * daysNo;

        // create new Booking
        const bookingId = (await createBooking(customerId, carId, driverId, { start: startDate, end: endDate }, 'Pending', totalAmount)).toString();

        // save the bookingId in the related documents
        saveBookingInRelatedDocument(selectedCar, bookingId, 'cars');
        saveBookingInRelatedDocument(selectedDriver, bookingId, 'users');
        saveBookingInRelatedDocument(customer, bookingId, 'users');

        // create & save invoice object
        createInvoice(customerId, bookingId.toString(), totalAmount);
        
        return { message: "Booking saved successfully!" };
    } catch (error) {
        return { message: `Failed to create booking: ${error}` };
    }
}
