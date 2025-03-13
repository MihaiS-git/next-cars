import { IBooking } from "@/lib/definitions";
import { formatCurrency } from "@/lib/util/format-currency";

interface DashboardBookingsTableProps {
    bookingsData: IBooking[];
}
  
export const DashboardBookingsTable: React.FC<DashboardBookingsTableProps> = ({ bookingsData}: {bookingsData: IBooking[]}) => {
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
                            <td className="text-center border border-zinc-600 overflow-hidden">{ booking.status}</td>
                            <td className="text-center border border-zinc-600 overflow-hidden">{ booking.totalAmount ? formatCurrency(+booking.totalAmount) : null}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>               
    );
}