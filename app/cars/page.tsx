"use client";

import CarsGrid from "@/components/ui/cars/CarsGrid";
import { getAllCarsWithPicturesPaginated } from "@/lib/db/cars";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ICar } from "@/lib/definitions";

function CarsContent() {
    const [cars, setCars] = useState<ICar[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const searchParams = useSearchParams();
    const page = searchParams.get("page");

    const currentPage = parseInt(page || "1", 10);

    useEffect(() => {
        async function getCarsPaginated() {
            if (currentPage) {
                const { cars, totalCount } =
                    await getAllCarsWithPicturesPaginated(currentPage, 10);
                if (!cars || !totalCount) {
                    setError("Failed to load cars");
                    setIsLoading(false);
                    return;
                }
                setCars(cars);
                setTotalCount(totalCount);
                setIsLoading(false);
            }
        }
        getCarsPaginated();
    }, [currentPage]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600 m-8 mx-auto mt-48 mb-8"></div>
                <div className="text-zinc-400 mb-48">Loading cars list...</div>
            </div>
        );
    }

    return (
        <>
            <h1 className="mb-4 mt-8 text-zinc-200 font-semibold text-xl lg:font-bold lg:text-2xl text-center">
                <em>Cars List</em>
            </h1>
            {error && <h1>{error}</h1>}
            {!error && cars.length === 0 && <h1>No cars found</h1>}
            {!error && cars.length > 0 && (
                <CarsGrid
                    initialCars={cars}
                    totalCount={totalCount}
                    currentPage={currentPage}
                />
            )}
        </>
    );
}

export default function CarsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CarsContent />
        </Suspense>
    );
}