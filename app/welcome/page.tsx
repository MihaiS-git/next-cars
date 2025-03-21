"use client";

import AutoCarousel from "@/app/welcome/AutoCarousel";
import { getCarsImagesForWelcomeCarousel } from "@/lib/db/cars";
import { useEffect, useState } from "react";

export default function WelcomePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [carImages, setCarImages] = useState<string[]>([]);

    useEffect(() => {
        async function getWelcomeCarouselImages() {
            const fetchedCarImages = await getCarsImagesForWelcomeCarousel();
            if (!fetchedCarImages) {
                setError("Failed to load welcome carousel images");
                setIsLoading(false);
                return;
            }
            setIsLoading(false);
            setCarImages(fetchedCarImages);
        }
        getWelcomeCarouselImages();
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600 m-8 mx-auto mt-48 mb-8"></div>
                <div className="text-zinc-400 mb-48">Loading images...</div>
            </div>
        );
    }

    return (
        <>
            {error && <h1>{error}</h1>}
            {!error && carImages.length === 0 && (
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600 m-8 mx-auto mt-48 mb-8"></div>
                    <div className="text-zinc-400 mb-48">Loading images...</div>
                </div>
            )}
            {!error && carImages.length > 0 && (
                <AutoCarousel carImages={carImages} />
            )}
        </>
    );
}
