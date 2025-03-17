import { updateBookingStatus } from "@/app/actions/booking/actions";
import { IBooking, User } from "@/lib/definitions";
import { formatCurrency } from "@/lib/util/format-currency";
import { memo } from "react";

interface DashboardBookingsTableProps {
    bookingsData: IBooking[];
    user: User;
}

const DashboardBookingsTable: React.FC<DashboardBookingsTableProps> = ({ bookingsData, user }: { bookingsData: IBooking[], user: User }) => {

    const handleStatusChange = async (bookingId: string, newStatus: string) => {
        try {
            await updateBookingStatus(bookingId, newStatus);

            const bookingElement = document.getElementById(`booking-status-${bookingId}`);
            if (bookingElement) {
                (bookingElement as HTMLSelectElement).value = newStatus;
            }
        } catch (error) {
            console.error("Failed to update booking status", error);
        }
    };

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full mt-4 table-fixed">
                <thead>
                    <tr className="bg-zinc-800 text-zinc-50">
                        <th className="table-header border border-red-600 overflow-hidden">Crt.no.</th>
                        <th className="table-header border border-red-600 overflow-hidden">Car</th>
                        <th className="table-header border border-red-600 overflow-hidden">Driver</th>
                        <th className="table-header border border-red-600 overflow-hidden">Start Date</th>
                        <th className="table-header border border-red-600 overflow-hidden">End Date</th>
                        <th className="table-header border border-red-600 overflow-hidden">Status</th>
                        <th className="table-header border border-red-600 overflow-hidden">Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {bookingsData.map((booking: IBooking, index) => (
                        <tr key={booking._id}>
                            <td className="border border-zinc-600 ps-2 overflow-hidden text-center">{index + 1}</td>
                            <td className="border border-zinc-600 ps-2 overflow-hidden">{typeof booking.car !== 'string' ? booking.car!.make : 'N/A'} {typeof booking.car !== 'string' ? booking.car!.carModel : 'N/A'}</td>
                            <td className="border border-zinc-600 ps-2 overflow-hidden">{typeof booking.driver !== 'string' ? booking.driver!.name : 'N/A'}</td>
                            <td className="text-center border border-zinc-600 overflow-hidden">
                                {booking.timeInterval.start.toISOString().split('T')[0]}
                            </td>
                            <td className="text-center border border-zinc-600 overflow-hidden">{booking.timeInterval.end.toISOString().split('T')[0]}</td>
                            <td className="text-center border border-zinc-600 overflow-hidden">
                                {(user.role === 'CUSTOMER' || user.role === 'ADMIN') && booking.status}
                                {user.role === 'DRIVER' && (
                                    <select
                                        id={`booking-status-${booking._id}`}
                                        name="booking_status"
                                        value={booking.status || ""}
                                        onChange={(e) => handleStatusChange(booking._id!, e.target.value)}
                                        className="bg-zinc-600 text-zinc-50"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                )}
                            </td>
                            <td className="text-center border border-zinc-600 overflow-hidden">{booking.totalAmount ? formatCurrency(+booking.totalAmount) : null}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default memo(DashboardBookingsTable);