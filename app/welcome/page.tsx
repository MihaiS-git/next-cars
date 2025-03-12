"use client";

import AutoCarousel from "@/components/ui/welcome/AutoCarousel";
import { getAllCarsWithPictures } from "../actions/cars/actions";
import { useEffect, useState } from "react";
import { ICar } from "@/lib/definitions";

export default function WelcomePage() {
    const [cars, setCars] = useState<ICar[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCars() {
            const carsData = await getAllCarsWithPictures();
            setCars(carsData);
            setIsLoading(false);
        }
        fetchCars();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-80">
                <p className="text-zinc-400 my-auto">Loading cars...</p>
            </div>
        );
    }

    return (
            <AutoCarousel cars={cars} />
    );
}
