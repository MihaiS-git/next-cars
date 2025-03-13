import { IBooking } from "@/lib/definitions";
import { DashboardBookingsTable } from "./BookingsTable";

export default function DashboardRentalsSlice({ isLoading, bookingsData }: { isLoading: boolean; bookingsData: IBooking[] | null }) {
    return (
        <div className="bg-zinc-700 text-zinc-50 rounded-md p-4 border border-red-600">
            <h2 className="font-semibold text-base lg:font-bold lg:text-lg">
                Past Rentals
            </h2>
            {isLoading ? (
                <div className="text-center h-80 flex items-center justify-center">
                    <p>Loading bookings...</p>
                </div>
            ) : bookingsData && bookingsData.length > 0 ? (
                <DashboardBookingsTable bookingsData={bookingsData} />
            ) : (
                <div className="text-center h-80 flex items-center justify-center">
                    <p>No bookings data found.</p>
                </div>
            )}
        </div>
    );
}
