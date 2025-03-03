"use client";

import { ICar } from "@/lib/definitions";
import CarCard from "./CarCard";
import { getAllCarsWithPictures } from "@/app/actions/cars/actions";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function CarsGrid({ initialCars }: { initialCars: ICar[] }) {
    const [refetching, setRefetching] = useState(false);

    const {
        data: cars,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["cars"],
        queryFn: async () => {
            setRefetching(true);
            const data = await getAllCarsWithPictures();
            setRefetching(false);
            return data;
        },
        initialData: initialCars,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-40">
                <p className="text-gray-500">Loading cars...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                <p>Failed to load cars. Please try again.</p>
            </div>
        );
    }
    return (
        <div className="p-4">
            <ul className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {cars.map((car) => (
                    <li key={car._id}>
                        <CarCard car={car} slug={car._id!.toString()} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
