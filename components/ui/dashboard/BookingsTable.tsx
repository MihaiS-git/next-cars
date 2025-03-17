import { IBooking, User } from "@/lib/definitions";
import { formatCurrency } from "@/lib/util/format-currency";
import { memo } from "react";

interface DashboardBookingsTableProps {
    bookingsData: IBooking[];
    user: User;
}
  
const DashboardBookingsTable: React.FC<DashboardBookingsTableProps> = ({ bookingsData, user}: {bookingsData: IBooking[], user: User}) => {
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
                                    <select name="booking_status" id="booking_status" value={ booking.status} onChange={(e) => console.log(e.target.value)}>
                                        <option value="Pending" selected={booking.status === 'Pending'}>Pending</option>
                                        <option value="Confirmed" selected={booking.status === 'Confirmed'}>Confirmed</option>
                                        <option value="Cancelled" selected={booking.status === 'Cancelled'}>Cancelled</option>
                                        <option value="Completed" selected={booking.status === 'Completed'}>Completed</option>
                                    </select>
                                ) }
                            </td>
                            <td className="text-center border border-zinc-600 overflow-hidden">{ booking.totalAmount ? formatCurrency(+booking.totalAmount) : null}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>               
    );
}

export default memo(DashboardBookingsTable);