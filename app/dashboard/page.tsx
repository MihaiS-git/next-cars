"use client";

import { IBooking } from "@/lib/definitions";
import { getUpcomingRentalsByUserEmail, getPastRentalsByUserEmail } from "@/lib/queries/users-queries";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const email = session?.user?.email;

    const {
        data: upcomingBookingsData,
        isLoading: isLoadingUpcomingBookingsData,
        isError: isUpcomingBookingsDataError,
    } = useQuery({
        queryKey: ["upcomingBookingsData", email],
        queryFn: () => getUpcomingRentalsByUserEmail(email as string),
        enabled: !!email,
    });

    const {
        data: pastBookingsData,
        isLoading: isLoadingPastBookingsData,
        isError: isPastBookingsDataError,
    } = useQuery({
        queryKey: ["pastBookingsData", email],
        queryFn: () => getPastRentalsByUserEmail(email as string),
        enabled: !!email,
    });

    if (isLoadingUpcomingBookingsData || isLoadingPastBookingsData) {
        return (
            <div className="flex items-center justify-center h-80">
                <p className="text-zinc-400">Loading bookings details...</p>
            </div>
        );
    }

    if (isUpcomingBookingsDataError || isPastBookingsDataError) {
        return (
            <div className="text-center text-red-500">
                <p>Failed to load bookings details. Please try again.</p>
            </div>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('de-DE', {style: 'currency', currency: 'EUR'}).format(amount);
    }

    return (
        <>
            <h1 className="mb-4 mt-8 text-red-600 font-semibold text-xl lg:font-bold lg:text-2xl text-center">
                <em>Dashboard</em>
            </h1>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-4">
                <div className="bg-zinc-700 text-zinc-200 rounded-lg p-4 border border-red-600 ">
                    <h3 className="font-semibold text-base lg:font-bold lg:text-lg">
                        Upcoming & Ongoing Rentals
                    </h3>
                    {upcomingBookingsData?.bookings && upcomingBookingsData.bookings.length > 0 ? (
                        <div className="w-full overflow-x-auto">
                            <table className="w-full mt-4 table-fixed">
                                <thead>
                                    <tr className="bg-zinc-800 text-zinc-50">
                                        <th className="table-header border border-red-600 overflow-hidden">Car</th>
                                        <th className="table-header border border-red-600 overflow-hidden">Driver</th>
                                        <th className="table-header border border-red-600 overflow-hidden">Start Date</th>
                                        <th className="table-header border border-red-600 overflow-hidden">End Date</th>
                                        <th className="table-header border border-red-600 overflow-hidden">Status</th>
                                        <th className="table-header border border-red-600 overflow-hidden">Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {upcomingBookingsData.bookings.map((booking: IBooking) => (
                                        <tr key={booking._id}>
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
                    ) : (
                        <p>No bookings found.</p>
                    )}
                </div>
                <div className="bg-zinc-700 text-zinc-50 rounded-lg p-4 border border-red-600">
                    <h3 className="font-semibold text-base lg:font-bold lg:text-lg">
                        Past Rentals
                    </h3>
                    {pastBookingsData?.bookings && pastBookingsData.bookings.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full mt-4 table-fixed">
                                <thead>
                                    <tr className="bg-zinc-800 text-zinc-50">
                                        <th className="table-header border border-red-600 overflow-hidden">Car</th>
                                        <th className="table-header border border-red-600 overflow-hidden">Driver</th>
                                        <th className="table-header border border-red-600 overflow-hidden">Start Date</th>
                                        <th className="table-header border border-red-600 overflow-hidden">End Date</th>
                                        <th className="table-header border border-red-600 overflow-hidden">Status</th>
                                        <th className="table-header border border-red-600 overflow-hidden">Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pastBookingsData.bookings.map((booking: IBooking) => (
                                        <tr key={booking._id}>
                                            <td className="border border-zinc-600 ps-2 overflow-hidden">{typeof booking.car !== 'string' ? booking.car!.make : 'N/A'} {typeof booking.car !== 'string' ? booking.car!.carModel : 'N/A'}</td>
                                            <td className="border border-zinc-600 ps-2 overflow-hidden">{typeof booking.driver !== 'string' ? booking.driver!.name : 'N/A'}</td>
                                            <td className="text-center border border-zinc-600 overflow-hidden">
                                                {booking.timeInterval!.start.toISOString().split('T')[0]}
                                            </td>
                                            <td className="text-center border border-zinc-600 overflow-hidden">{booking.timeInterval.end.toISOString().split('T')[0]}</td>
                                            <td className="text-center border border-zinc-600 overflow-hidden">{ booking.status}</td>
                                            <td className="text-center border border-zinc-600 overflow-hidden">{ booking.totalAmount ? formatCurrency(+booking.totalAmount) : null}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No bookings found.</p>
                    )}
                </div>
                <div className="bg-zinc-700 text-zinc-50 rounded-lg p-4 border border-red-600 xl:col-span-2">
                    <h3 className="font-semibold text-base lg:font-bold lg:text-lg">
                        Payment & Invoices
                        {/* (Pending payments, past invoices, payment methods) */}
                    </h3>
                </div>
            </div>
        </>
    );
}