'use client';

import { ICar } from "@/lib/definitions";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../../components/ui/carousel";
import Image from "next/image";

export default function CarDetailsCarousel({ car }: { car: ICar }) {
    return (
        <Carousel className="mx-auto w-full lg:w-8/12 lg:pt-8">
                    <CarouselContent>
                        {typeof car?.carImagesAndDocuments === "object" &&
                            car?.carImagesAndDocuments!.carImages.map(
                                (image: string, index) => {
                                    return (
                                        <CarouselItem key={index}>
                                            <Image
                                                src={`${image}`}
                                                alt={`${car!.make} ${car!.carModel} `}
                                                width={845}
                                                height={475}
                                                quality={75}
                                                sizes="(max-width: 1024px) 335px, 845px"
                                                className="mx-auto overflow-hidden rounded-t-lg"
                                                loading="lazy"
                                            />
                                        </CarouselItem>
                                    );
                                }
                            )}
                    </CarouselContent>
                    <CarouselPrevious className="hidden lg:block" />
                    <CarouselNext className="hidden lg:block" />
                </Carousel>
    );
}