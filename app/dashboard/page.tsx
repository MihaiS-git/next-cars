"use client";

import { getUserByEmail } from "@/lib/db/users";
import { getInvoicesByUser } from "@/lib/db/invoices";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import CloseButton from "@/components/ui/CloseButton";
import { IBooking, IInvoice, User } from "@/lib/definitions";
import { getPastRentals, getUpcomingRentals } from "@/lib/db/bookings";
import DashboardRentalsSlice from "@/components/ui/dashboard/DashboardRentalsSlice";
import DashboardInvoicesSlice from "@/components/ui/dashboard/DashboardInvoicesSlice";

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [upcomingBookingsData, setUpcomingBookingsData] = useState<
        IBooking[] | null
    >(null);
    const [pastBookingsData, setPastBookingsData] = useState<IBooking[] | null>(
        null
    );
    const [invoices, setInvoices] = useState<IInvoice[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const { data: session, status } = useSession();
    const email = session?.user?.email;

    const fetchData = useCallback(async () => {
        if (status === "authenticated" && email) {
            try {
                const fetchedUser = await getUserByEmail(email);
                if (!fetchedUser) {
                    setError("User not found");
                    return;
                }
                setUser(fetchedUser);

                const fetchedUserBookings = fetchedUser.bookings
                    ? fetchedUser.bookings!.map((booking) => booking.toString())
                    : [];

                if (fetchedUser) {
                    const [
                        upcomingBookingsData,
                        pastBookingsData,
                        invoicesData,
                    ] = await Promise.all([
                        getUpcomingRentals(fetchedUserBookings),
                        getPastRentals(fetchedUserBookings),
                        getInvoicesByUser(fetchedUser._id!.toString()),
                    ]);

                    setUpcomingBookingsData(upcomingBookingsData);
                    setPastBookingsData(pastBookingsData);
                    setInvoices(invoicesData);
                }
            } catch (error) {
                setError(`Failed to fetch data: ${error}`);
            } finally {
                setIsLoading(false);
            }
        }
    }, [status, email]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600 m-8 mx-auto mt-48 mb-8"></div>
                <div className="text-zinc-400 mb-48">Loading...</div>
            </div>
        );
    }

    return (
        <>
            {error ? (
                <div className="text-center h-80 flex items-center justify-center">
                    {error.includes("User not found") ? (
                        <p>
                            Please fill in your{" "}
                            <a href="/account" className="underline">
                                Account
                            </a>{" "}
                            details first.
                        </p>
                    ) : (
                        <p>{error}</p>
                    )}
                </div>
            ) : (
                <>
                    <h1 className="mb-4 mt-8 text-zinc-200 font-semibold text-xl lg:font-bold lg:text-2xl text-center">
                        <em>Dashboard</em>
                    </h1>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-4">
                        <DashboardRentalsSlice
                            isLoading={isLoading}
                            bookingsData={upcomingBookingsData}
                            sliceTitle="Upcoming Rentals"
                            user={user}
                        />
                        <DashboardRentalsSlice
                            isLoading={isLoading}
                            bookingsData={pastBookingsData}
                            sliceTitle="Past Rentals"
                            user={user}
                        />
                        <DashboardInvoicesSlice
                            isLoading={isLoading}
                            invoices={invoices}
                        />
                    </div>
                </>
            )}
            <div className="w-full flex flex-row justify-end pb-4 pe-4">
                <CloseButton target="/" />
            </div>
        </>
    );
}
