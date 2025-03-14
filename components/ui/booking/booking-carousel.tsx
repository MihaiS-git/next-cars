"use client";

import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "../carousel";
import Image from "next/image";
import { IPicture } from "@/lib/definitions";
import React from "react";

interface CarouselProps {
    isLoading: boolean;
    error: string;
    carouselRef: React.RefObject<HTMLDivElement | null>;
    carouselElements: IPicture[];
    elementTag: string;
    class_carousel_item: string;
    baseLink: string;
    dataAttribute: string;
}

const LoadingCarouselItem = () => (
    <CarouselItem className="text-center">
        <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-red-600 m-8"></div>
            <p className="text-zinc-200 mb-8">Loading carousel...</p>
        </div>
    </CarouselItem>
);

const ErrorCarouselItem = ({ error }: { error: string }) => (
    <CarouselItem className="text-center">
        <p className="text-red-600">{error}</p>
    </CarouselItem>
);

const BookingCarousel: React.FC<CarouselProps> = ({
    isLoading,
    error,
    carouselRef,
    carouselElements,
    elementTag,
    class_carousel_item,
    baseLink,
    dataAttribute,
}) => {
    return (
        <div className="text-center">
            <h2 className="text-zinc-50 font-semibold text-lg lg:font-bold text-center">
                Choose a {elementTag}
            </h2>
            <p className="text-sm text-zinc-200">Swipe and click for more info</p>
            <Carousel ref={carouselRef}>
                <CarouselContent>
                    {isLoading && <LoadingCarouselItem />}
                    {error && <ErrorCarouselItem error={error} />}
                    {carouselElements.map((element, index) => (
                        <CarouselItem
                            key={index}
                            {...{ [dataAttribute]: element.elementId }}
                            className={`${class_carousel_item} my-auto`}
                        >
                            <Link href={`/${baseLink}/${element.elementId}`}>
                                <Image
                                    src={element.elementPicture || ""}
                                    alt="Element picture"
                                    width={640}
                                    height={480}
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                    quality={75}
                                    className="border border-red-600 mx-auto"
                                    loading="lazy"
                                />
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
};

export default React.memo(BookingCarousel);