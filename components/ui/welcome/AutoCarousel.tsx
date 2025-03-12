"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { ICar } from "@/lib/definitions";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AutoCarousel({ cars }: { cars: ICar[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        const imagePromises = cars.map((car) => {
            return new Promise<void>((resolve, reject) => {
                const img = new window.Image();
                img.src =
                    `${car.carImagesAndDocuments}` &&
                    typeof car.carImagesAndDocuments !== "string"
                        ? `${car.carImagesAndDocuments!.carImages[0]}`
                        : "/cars/default-image.webp";
                img.onload = () => resolve();
                img.onerror = () => reject();
            });
        });

        Promise.all(imagePromises)
            .then(() => setImagesLoaded(true))
            .catch((error) => {
                console.error("Error loading images:", error);
                setImagesLoaded(true);
            });
    }, [cars]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeout(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex === cars.length - 1 ? 0 : prevIndex + 1
                );
            }, 500);
        }, 3000);

        return () => clearInterval(interval);
    }, [cars.length]);

    const imageUrls: string[] = useMemo(() => {
        return cars.map((car) => {
            if (
                car.carImagesAndDocuments &&
                typeof car.carImagesAndDocuments !== "string"
            ) {
                return car.carImagesAndDocuments.carImages[0];
            } else {
                return "/cars/default-image.webp";
            }
        });
    }, [cars]);

    if (!imagesLoaded) {
        return <p className="text-zinc-400 mx-auto my-56">Loading images...</p>;
    }

    return (
        <Carousel className="mx-auto w-full lg:w-8/12 mb-8">
            <CarouselContent>
                <CarouselItem key={currentIndex}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            <div className="h-[300px] md:h-[450px]">
                                <Image
                                    src={
                                        `${imageUrls[currentIndex]}` ||
                                        "/cars/default-image.webp"
                                    }
                                    alt="car image"
                                    width={845}
                                    height={475}
                                    quality={100}
                                    sizes="(max-width: 1024px) 335px, 845px"
                                    className="mb-8 mx-auto overflow-hidden shadow-red-500 shadow-sm"
                                    priority
                                />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </CarouselItem>
            </CarouselContent>
        </Carousel>
    );
}
