"use client";

import { getUserByEmail } from "@/lib/db/users";
import { getInvoicesByUser } from "@/lib/db/invoices";
import { useSession } from "next-auth/react";
import CloseButton from "@/components/ui/CloseButton";
import { IDashboardBooking, IInvoice, User } from "@/lib/definitions";
import { getPastRentals, getUpcomingRentals } from "@/lib/db/bookings";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";

const DashboardInvoicesSlice = dynamic(() => import('@/components/ui/dashboard/DashboardInvoicesSlice'), { ssr: false });
const DashboardRentalsSlice = dynamic(() => import('@/components/ui/dashboard/DashboardRentalsSlice'), { ssr: false });

export default function DashboardPage() {
    const { data: session } = useSession();
    const email = session?.user?.email;

    const {
        data: user,
        isLoading: isUserLoading,
        error: userError,
    } = useQuery<User | null>({
        queryKey: ["user", email],
        queryFn: async () => {
            if (!email) return null;
            return getUserByEmail(email as string);
        },
        enabled: !!email,
        staleTime: 6 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const {
        data: upcomingBookingsData,
        isLoading: isUpcomingBookingsLoading,
        error: upcomingBookingsError,
    } = useQuery<IDashboardBooking[] | null>({
        queryKey: ["upcomingBookings", user],
        queryFn: async () => {
            if (!email) return null;
            return getUpcomingRentals(
                user?.bookings?.map((booking) => booking.toString()) || []
            );
        },
        enabled: !!user,
        staleTime: 6 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const {
        data: pastBookingsData,
        isLoading: isPastBookingsLoading,
        error: pastBookingsError,
    } = useQuery<IDashboardBooking[] | null>({
        queryKey: ["pastBookings", user],
        queryFn: async () => {
            if (!email) return null;
            return getPastRentals(
                user?.bookings?.map((booking) => booking.toString()) || []
            );
        },
        enabled: !!user,
        staleTime: 6 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const {
        data: invoicesData,
        isLoading: isInvoicesLoading,
        error: invoicesError,
    } = useQuery<IInvoice[] | null>({
        queryKey: ["invoices", email],
        queryFn: async () => {
            if (!user!._id) return null;
            return getInvoicesByUser(user?._id!.toString() || "");
        },
        enabled: !!user,
        staleTime: 6 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const isLoading =
        isUserLoading ||
        isUpcomingBookingsLoading ||
        isPastBookingsLoading ||
        isInvoicesLoading;

    const error = userError ? userError.message : "";

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600 m-8 mx-auto mt-48 mb-8"></div>
                <div className="text-zinc-400 mb-48">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
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
        );
    }

    return (
        <>
            <div className="container mx-auto">
                <h1 className="mb-4 mt-8 text-zinc-200 font-semibold text-xl lg:font-bold lg:text-2xl text-center">
                    <em>Dashboard</em>
                </h1>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-4">
                    <DashboardRentalsSlice
                        error={upcomingBookingsError}
                        isLoading={isLoading}
                        bookingsData={upcomingBookingsData ?? null}
                        sliceTitle="Upcoming Rentals"
                        user={user!}
                    />
                    <DashboardRentalsSlice
                        error={pastBookingsError}
                        isLoading={isLoading}
                        bookingsData={pastBookingsData ?? null}
                        sliceTitle="Past Rentals"
                        user={user!}
                    />
                    <DashboardInvoicesSlice
                        error={invoicesError}
                        isLoading={isLoading}
                        invoices={invoicesData ?? null}
                    />
                </div>
            </div>
            <div className="w-full flex flex-row justify-end pb-4 pe-4">
                <CloseButton target="/" />
            </div>
        </>
    );
}
