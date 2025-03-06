import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "../carousel";
import Image from "next/image";

interface CarouselProps {
    isLoading: boolean;
    error: string | null;
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

export default function BookingCarousel({isLoading, error, carouselRef, carouselElements, elementTag, class_carousel_item, baseLink, dataAttribute}: CarouselProps) {
    return (
        <>
            <div className="text-center">
                <h4 className="text-zinc-50 font-semibold text-lg lg:font-bold text-center">
                    Choose a {elementTag}
                </h4>
                <p className="text-sm text-red-600">
                    Swipe and click for more info
                </p>
                {isLoading && <p>Loading...</p>}
                {error && <p>{`Failed to load elements. ${error}`}</p>}
                <Carousel ref={carouselRef}>
                    <CarouselContent>
                        {carouselElements.map((element) => (
                            <CarouselItem
                                key={element.elementId}
                                {...{ [dataAttribute]: element.elementId }}
                                className={`${ class_carousel_item } my-auto`}
                            >
                                <Link href={`/${baseLink}/${element.elementId}`}>
                                    <Image
                                        src={element.elementPicture}
                                        alt="Element picture"
                                        width={640}
                                        height={480}
                                        quality={80}
                                        className="border border-red-600 mx-auto"
                                        priority
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
