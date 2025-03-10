"use client";

import { getDriverBySlug } from "@/app/actions/drivers/actions";
import { useQuery } from "@tanstack/react-query";
import React, { use, useEffect } from "react";
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

    useEffect(() => { 
        if (driver) {
            const title = `Next Cars - ${driver.name}`;
            const description = `View details of the driver ${driver.name} available at Next Cars.`;
            const keywords = `Next Cars, ${driver.name}`;
            document.title = title;
            document.querySelector('meta[name="description"]')!.setAttribute('content', description);
            document.querySelector('meta[name="keywords"]')!.setAttribute('content', keywords);
        }
    },[driver]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-80">
                <p className="text-gray-400">Loading driver details...</p>
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
