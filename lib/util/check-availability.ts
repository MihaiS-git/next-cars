import { IBooking } from "../definitions";

export function isAvailableForBooking(bookings: IBooking[], startDate: Date, endDate: Date) {
    let isAvailable = true;
    for (const booking of bookings) {
        const bookedStart = new Date(booking.timeInterval.start);
        const bookedEnd = new Date(booking.timeInterval.end);

        if (startDate >= bookedStart && startDate <= bookedEnd ||
            endDate >= bookedStart && endDate <= bookedEnd ||
            startDate <= bookedStart && endDate >= bookedEnd) {
            isAvailable = false;
            break;
        }
    }
    return isAvailable;
}