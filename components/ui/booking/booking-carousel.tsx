import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "../carousel";
import Image from "next/image";

interface CarouselProps {
    carouselRef: React.RefObject<HTMLDivElement | null>;
    carouselElements: Array<{
        elementId: string;
        elementPicture: string;
    }>;
    elementTag: string;
    class_carousel_item: string;
    baseLink: string;
    dataAttribute: string;
}

export default function BookingCarousel({
    carouselRef,
    carouselElements,
    elementTag,
    class_carousel_item,
    baseLink,
    dataAttribute,
}: CarouselProps) {
    return (
        <>
            <div className="text-center">
                <h2 className="text-zinc-50 font-semibold text-lg lg:font-bold text-center">
                    Choose a {elementTag}
                </h2>
                <p className="text-sm text-zinc-200">
                    Swipe and click for more info
                </p>
                <Carousel ref={carouselRef}>
                    <CarouselContent>
                        {carouselElements.map((element) => (
                            <CarouselItem
                                key={element.elementId}
                                {...{ [dataAttribute]: element.elementId }}
                                className={`${class_carousel_item} my-auto`}
                            >
                                <Link
                                    href={`/${baseLink}/${element.elementId}`}
                                >
                                    <Image
                                        src={element.elementPicture}
                                        alt="Element picture"
                                        width={845}
                                        height={475}
                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                        quality={100}
                                        className="border border-red-600 mx-auto"
                                        loading="lazy"
                                    />
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </>
    );
}
