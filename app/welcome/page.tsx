"use client";

import AutoCarousel from "@/components/ui/welcome/AutoCarousel";
import { getAllCarsWithPictures } from "../actions/cars/actions";
import { Suspense, useEffect, useState } from "react";
import { ICar } from "@/lib/definitions";

export default function WelcomePage() {
    const [cars, setCars] = useState<ICar[]>([]);

    useEffect(() => {
        async function fetchCars() {
            const carsData = await getAllCarsWithPictures();
            setCars(carsData);
        }
        fetchCars();
    }, []);

    if (!cars) {
        return (
            <div className="flex items-center justify-center h-80">
                <p className="text-zinc-400 my-auto">Loading cars...</p>
            </div>
        );
    }

    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center h-80">
                    <p className="text-zinc-400 my-auto">Loading carousel...</p>
                </div>
            }
        >
            <AutoCarousel cars={cars} />
        </Suspense>
    );
}
