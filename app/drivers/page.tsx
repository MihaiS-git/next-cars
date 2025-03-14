"use client";

import DriversGrid from "@/components/ui/drivers/DriversGrid";
import { getAllDriversPaginated } from "@/lib/db/drivers";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { User } from "@/lib/definitions";

function DriversContent() {
    const [drivers, setDrivers] = useState<User[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const searchParams = useSearchParams();
    const page = searchParams.get("page");

    const currentPage = parseInt(page || "1", 10);

    useEffect(() => {
        async function getDriversPaginated() {
            if (currentPage) {
                const result = await getAllDriversPaginated(currentPage, 10);
                if (!result) {
                    setError("Failed to load drivers");
                    setIsLoading(false);
                    return;
                }
                const { drivers, totalCount } = result;
                if (!drivers || !totalCount) {
                    setError("Failed to load drivers");
                    setIsLoading(false);
                    return;
                }
                setDrivers(drivers);
                setTotalCount(totalCount);
                setIsLoading(false);
            }
        }
        getDriversPaginated();
    }, [currentPage]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600 m-8 mx-auto mt-48 mb-8"></div>
                <div className="text-zinc-400 mb-48">Loading drivers list...</div>
            </div>
        );
    }

    return (
        <>
            <h1 className="mb-4 mt-8 text-zinc-200 font-semibold text-xl lg:font-bold lg:text-2xl text-center">
                <em>Drivers List</em>
            </h1>
            {error && <h1>{error}</h1>}
            {!error && drivers.length === 0 && <h1>No drivers found</h1>}
            {!error && drivers.length > 0 && (
                <DriversGrid
                    initialDrivers={drivers}
                    totalCount={totalCount}
                    currentPage={currentPage}
                />
            )}
        </>
    );
}

export default function DriversPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DriversContent />
        </Suspense>
    );
}