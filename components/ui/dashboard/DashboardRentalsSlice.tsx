import { IBooking, User } from "@/lib/definitions";
import DashboardBookingsTable from "./BookingsTable";
import { memo } from "react";

interface DashboardRentalsSliceProps {
    isLoading: boolean;
    bookingsData: IBooking[] | null;
    sliceTitle: string;
    user: User;
}

const DashboardRentalsSlice: React.FC<DashboardRentalsSliceProps> = ({
    isLoading,
    bookingsData,
    sliceTitle,
    user
}) => {
    return (
        <div className="bg-zinc-700 text-zinc-50 rounded-md p-4 border border-red-600">
            <h2 className="font-semibold text-base lg:font-bold lg:text-lg">
                {sliceTitle}
            </h2>
            {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600 m-8 mx-auto mt-48 mb-8"></div>
                    <div className="text-zinc-400 mb-48">
                        Loading bookings...
                    </div>
                </div>
            ) : bookingsData && bookingsData.length > 0 ? (
                    <DashboardBookingsTable bookingsData={bookingsData} user={user} />
            ) : (
                <div className="text-center h-80 flex items-center justify-center">
                    <p>No bookings data found.</p>
                </div>
            )}
        </div>
    );
}

export default memo(DashboardRentalsSlice);
