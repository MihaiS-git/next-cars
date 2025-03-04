"use client";

import { getDriverBySlug } from "@/app/actions/drivers/actions";
import { useQuery } from "@tanstack/react-query";
import React, { use } from "react";
import DriverDetails from "@/components/ui/drivers/DriverDetails";

export default function DriverSlug({ params }: { params: Promise<{ driverSlug: string }> }) {
    const {driverSlug} = use(params);

    const {
        data: driver,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["driver", driverSlug],
        queryFn: () => getDriverBySlug(driverSlug),
        enabled: !!driverSlug
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-40">
                <p className="text-gray-500">Loading driver details...</p>
            </div>
        );
    }

    if (error || !driver) {
        return (
            <div className="text-center text-red-500">
                <p>Failed to load driver details. Please try again.</p>
            </div>
        );
    }

    return (
        <DriverDetails driver={driver}/>
    );
}
