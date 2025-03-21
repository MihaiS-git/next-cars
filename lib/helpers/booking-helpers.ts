import { ObjectId } from "mongodb";
import { connectDB } from "../mongoDb";
import { IBooking, ICar, IDatesInterval, User } from "../definitions";
import { getCarById } from "../db/cars";
import { isAvailableForBooking } from "../util/check-availability";
import { getDriverByIdWithBookings } from "../db/drivers";
import { getUserByEmail } from "../db/users";

export async function createBooking(customerId: string, carId: string, driverId: string, timeInterval: IDatesInterval, status: string, totalAmount: number): Promise<string> {
    const newBooking = {
        customer: new ObjectId(customerId!),
        car: new ObjectId(carId),
        driver: new ObjectId(driverId),
        timeInterval: { start: timeInterval.start, end: timeInterval.end },
        status: 'Pending',
        totalAmount: totalAmount,
    };
    const db = await connectDB();
    const bookingResult = await db.collection('bookings').insertOne(newBooking);
    if (!bookingResult) {
        throw new Error("Failed to save the booking");
    }

    return bookingResult.insertedId.toString();
}

export async function saveBookingInRelatedDocument(document: ICar | User, bookingId: string, collection: string) {
    if (!document.bookings) {
        document.bookings = [];
    } else {
        document.bookings = document.bookings.map(booking =>
            typeof booking === 'string' ? new ObjectId(booking) : new ObjectId(booking.toString())
        );
    }

    const updatedBookingsOnDocument = [...(document.bookings || []), new ObjectId(bookingId)];

    if (!document._id) throw new Error("Document ID is undefined");
    const db = await connectDB();
    const result = await db.collection(collection).updateOne(
        { _id: new ObjectId(document._id.toString()) },
        { $set: { bookings: updatedBookingsOnDocument } }
    );
    if (!result) {
        throw new Error(`Failed to save the booking in the related ${document}.`);
    }
}

export function validateBookCarInputData(carId: string, driverId: string, sDate: string, daysNo: number) {
    if (!carId || !driverId || !sDate || !daysNo) {
        return { message: 'Missing required fields.' };
    }

    if (new Date(sDate) < new Date(new Date().setDate(new Date().getDate() - 1))) {
        return { message: 'Invalid date.' };
    }

    if (daysNo < 1) {
        return { message: 'Invalid days number.' };
    }
}


export async function checkCarAvailability(carId: string, startDate: Date, endDate: Date) {
    let isCarAvailable = true;
    let selectedCar: ICar | null = null;

    try {
        selectedCar = await getCarById(carId);
    } catch (error) {
        throw new Error(`Failed to fetch car: ${error}`);
    }

    if (!selectedCar) {
        throw new Error("Car not found.");
    }
    if (selectedCar.bookings && selectedCar.bookings.length > 0) {
        isCarAvailable = isAvailableForBooking(
            selectedCar.bookings.filter(booking => typeof booking !== 'string') as IBooking[],
            startDate,
            endDate
        );
    }
    if (!isCarAvailable) {
        throw new Error("The selected car is not available for the chosen interval.");
    }

    return selectedCar;
}

export async function checkDriverAvailability(driverId: string, startDate: Date, endDate: Date) {
    let isDriverAvailable = true;
    let selectedDriver: User | null = null;

    try {    
        selectedDriver = await getDriverByIdWithBookings(driverId);
    } catch (error) {
        throw new Error(`Failed to fetch driver: ${error}`);
    }

    if (!selectedDriver) {
        throw new Error("Driver not found.");
    }
    if (selectedDriver.bookings && selectedDriver.bookings.length > 0) {
        isDriverAvailable = isAvailableForBooking(
            selectedDriver.bookings.filter(booking => typeof booking !== 'string') as IBooking[],
            startDate,
            endDate
        );
    }
    if (!isDriverAvailable) {
        throw new Error("The selected driver is not available for the chosen interval.");
    }

    return selectedDriver;
}

export function getTotalAmount(selectedCar: ICar, daysNo: number): number {
    const carRentalDetails = selectedCar?.carRentalDetails;
    if (!carRentalDetails) {
        throw new Error("Car rental details not found.");
    }
    if (typeof carRentalDetails === 'string') {
        throw new Error("Invalid car rental details.");
    }
    const totalAmount = carRentalDetails.rentalPricePerDay * daysNo;

    return totalAmount;
}

export async function getCustomerId(customerEmail: string): Promise<{ customerId: string, customer: User }> {
    let customerId, customer = null;
    try {
        customer = await getUserByEmail(customerEmail);
        if (!customer) {
            throw new Error("Please fill in your Account details first.");
        }
        customerId = customer._id ? customer._id.toString() : null;
        if (!customerId) {
            throw new Error('Please fill in your Account details first.');
        }
        return { customerId, customer };
    } catch (error) {
        throw new Error(`Failed to fetch customer: ${error}`);
    }
}