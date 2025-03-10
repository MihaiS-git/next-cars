"use client";

import { getCarBySlug } from "@/app/actions/cars/actions";
import { useQuery } from "@tanstack/react-query";
import React, { use, useEffect } from "react";
import CarDetails from "@/components/ui/cars/CarDetails";
import Head from "next/head";

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

    useEffect(() => { 
        if (car) {
            const title = `Next Cars - ${car.make} ${car.carModel}`;
            const description = `View details of the ${car.make} ${car.carModel} available at Next Cars.`;
            const keywords = `Next Cars, ${car.make}, ${car.carModel}`;
            document.title = title;
            document.querySelector('meta[name="description"]')!.setAttribute('content', description);
            document.querySelector('meta[name="keywords"]')!.setAttribute('content', keywords);
        }
    },[car]);

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
        <>
            <Head>
                <title>Next Cars - Car Details</title>
                <meta name="description" content="View details of the car available at Next Cars."/>
                <meta name="keywords" content="Next Cars, Car Details" />
                <meta name="author" content="Next Cars Team" />
                <meta name="robots" content="index, follow" />
                <meta charSet="UTF-8" />
            </Head>
        <CarDetails car={car}/>
        </>
    );
}
