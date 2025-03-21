"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AutoCarousel({ carImages }: { carImages: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeout(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex === carImages.length - 1 ? 0 : prevIndex + 1
                );
            }, 500);
        }, 3000);

        return () => clearInterval(interval);
    }, [carImages.length]);

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
                                        `${carImages[currentIndex]}` ||
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
