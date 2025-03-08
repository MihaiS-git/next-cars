"use client";

import { getCarBySlug } from "@/app/actions/cars/actions";
import { useQuery } from "@tanstack/react-query";
import React, { use } from "react";
import CarDetails from "@/components/ui/cars/CarDetails";

export default function CarSlug({ params }: { params: Promise<{ carSlug: string }> }) {
    const {carSlug} = use(params);

    const {
        data: car,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["car", carSlug],
        queryFn: () => getCarBySlug(carSlug),
        enabled: !!carSlug
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-80">
                <p className="text-gray-400">Loading car details...</p>
            </div>
        );
    }

    if (error || !car) {
        return (
            <div className="text-center text-red-500">
                <p>Failed to load car details. Please try again.</p>
            </div>
        );
    }

    return (
        <CarDetails car={car}/>
    );
}
