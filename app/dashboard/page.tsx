"use client";

import { DashboardBookingsTable } from "@/components/ui/dashboard/BookingsTable";
import DashboardInvoicesTable from "@/components/ui/dashboard/InvoicesTable";
import { getFullUserByEmail } from "@/lib/queries/users-queries";
import { getInvoicesByUser } from "../actions/invoice/actions";
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import CloseButton from "@/components/ui/CloseButton";
import { User } from "@/lib/definitions";
import { IBooking, IInvoice } from "@/lib/definitions";
import { getPastRentals, getUpcomingRentals } from "@/lib/db/bookings";

export default function DashboardPage() {
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [customer, setCustomer] = useState<User | null>(null);
    const [upcomingBookingsData, setUpcomingBookingsData] = useState<
        IBooking[] | null
    >(null);
    const [isLoadingUpcomingBookings, setIsLoadingUpcomingBookings] =
        useState<boolean>(true);
    const [errorUpcomingBookings, setErrorUpcomingBookings] =
        useState<string>("");

    const [pastBookingsData, setPastBookingsData] = useState<IBooking[] | null>(
        null
    );
    const [isLoadingPastBookings, setIsLoadingPastBookings] =
        useState<boolean>(true);
    const [errorPastBookings, setErrorPastBookings] = useState<string>("");

    const [invoices, setInvoices] = useState<IInvoice[] | null>(null);
    const [isLoadingInvoices, setIsLoadingInvoices] = useState<boolean>(true);
    const [errorInvoices, setErrorInvoices] = useState<string>("");

    const [error, setError] = useState<string>("");

    const { data: session, status } = useSession();
    const email = session?.user?.email;

    useEffect(() => {
        if (status === "authenticated" && email) {
            const fetchCustomer = async () => {
                try {
                    const fetchedCustomer = await getFullUserByEmail(email!);
                    if (fetchedCustomer) {
                        setCustomerId(fetchedCustomer._id!.toString());
                        setCustomer(fetchedCustomer);
                    }
                } catch (error: any) {
                    setError(`Failed to fetch user details: ${error.message}`);
                }
            };
            fetchCustomer();
        }
    }, [status, email]);

    useEffect(() => {
        if (status === "authenticated" && customer) {
            const fetchData = async () => {
                const bookingIds = customer.bookings;

                const upcomingBookingsData = await getUpcomingRentals(
                    bookingIds!
                );

                if (
                    !upcomingBookingsData ||
                    upcomingBookingsData.length === 0
                ) {
                    setErrorUpcomingBookings(
                        "No upcoming bookings data found."
                    );
                    setIsLoadingUpcomingBookings(false);
                    return;
                }
                setUpcomingBookingsData(upcomingBookingsData);
                setIsLoadingUpcomingBookings(false);
            };
            fetchData();
        }
    }, [customer]);

    useEffect(() => {
        if (status === "authenticated" && customer) {
            const fetchData = async () => {
                const bookingIds = customer.bookings;
                const pastBookingsData = await getPastRentals(bookingIds!);
                if (!pastBookingsData || pastBookingsData.length === 0) {
                    setErrorPastBookings("No past bookings data found.");
                    setIsLoadingPastBookings(false);
                    return;
                }
                setPastBookingsData(pastBookingsData);
                setIsLoadingPastBookings(false);
            };
            fetchData();
        }
    }, [customer]);

    useEffect(() => {
        if (status === "authenticated" && customerId) {
            const fetchData = async () => {
                const invoicesData = await getInvoicesByUser(customerId!);
                if (!invoicesData || invoicesData.length === 0) {
                    setErrorInvoices("No invoices found.");
                    setIsLoadingInvoices(false);
                    return;
                }
                setInvoices(invoicesData);
                setIsLoadingInvoices(false);
            };
            fetchData();
        }
    }, [customerId]);

    return (
        <>
            {error ? (
                <div className="text-center h-80 flex items-center justify-center">
                    <p>{error}</p>
                </div>
            ) : (
                <Suspense fallback={<div>Loading dashboard...</div>}>
                    <h1 className="mb-4 mt-8 text-zinc-200 font-semibold text-xl lg:font-bold lg:text-2xl text-center">
                        <em>Dashboard</em>
                    </h1>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-4">
                        <div className="bg-zinc-700 text-zinc-200 rounded-md p-4 border border-red-600 ">
                            <h2 className="font-semibold text-base lg:font-bold lg:text-lg">
                                Upcoming & Ongoing Rentals
                            </h2>
                            {isLoadingUpcomingBookings && (
                                <div className="text-center h-80 flex items-center justify-center">
                                    <p>Loading upcoming bookings...</p>
                                </div>
                            )}
                            {upcomingBookingsData &&
                            upcomingBookingsData.length > 0 ? (
                                <DashboardBookingsTable
                                    bookingsData={upcomingBookingsData}
                                />
                            ) : (
                                <div className="text-center h-80 flex items-center justify-center">
                                    <p>{errorUpcomingBookings}</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-zinc-700 text-zinc-50 rounded-md p-4 border border-red-600">
                            <h2 className="font-semibold text-base lg:font-bold lg:text-lg">
                                Past Rentals
                            </h2>
                            {isLoadingPastBookings && (
                                <div className="text-center h-80 flex items-center justify-center">
                                    <p>Loading past bookings...</p>
                                </div>
                            )}
                            {pastBookingsData && pastBookingsData.length > 0 ? (
                                <DashboardBookingsTable
                                    bookingsData={pastBookingsData}
                                />
                            ) : (
                                <div className="text-center h-80 flex items-center justify-center">
                                    <p>{errorPastBookings}</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-zinc-700 text-zinc-50 rounded-md p-4 border border-red-600 xl:col-span-2">
                            <h2 className="font-semibold text-base lg:font-bold lg:text-lg">
                                Payment & Invoices
                            </h2>
                            {isLoadingInvoices && (
                                <div className="text-center h-80 flex items-center justify-center">
                                    <p>Loading invoices...</p>
                                </div>
                            )}
                            {invoices && invoices.length > 0 ? (
                                <DashboardInvoicesTable
                                    invoicesData={invoices}
                                />
                            ) : (
                                <div className="text-center h-80 flex items-center justify-center">
                                    <p>{errorInvoices}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Suspense>
            )}
            <div className="w-full flex flex-row justify-end pb-4 pe-4">
                <CloseButton target="/" />
            </div>
        </>
    );
}
