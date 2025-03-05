"use client";

import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import { getAllCarsWithPictures } from "../actions/cars/actions";
import Image from "next/image";
import { getAllDrivers } from "../actions/drivers/actions";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function AppointmentPage() {
    const [carId, setCarId] = useState("");
    const [driverId, setDriverId] = useState("");
    const carCarouselRef = useRef<HTMLDivElement>(null);
    const driverCarouselRef = useRef<HTMLDivElement>(null);

    const setupIntersectionObserver = (
        ref: React.RefObject<HTMLDivElement | null>,
        className: string,
        setId: React.Dispatch<React.SetStateAction<string>>,
        attribute: string
    ) => {
        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            const visibleEntry = entries.find((entry) => entry.isIntersecting);
            if (visibleEntry) {
                const id = visibleEntry.target.getAttribute(attribute);
                if (id) {
                    setId(id);
                    localStorage.setItem(attribute, id);
                }
            }
        };

        const observer = new IntersectionObserver(handleIntersection, {
            root: ref.current,
            threshold: 0.7,
        });

        const items = ref.current?.querySelectorAll(className);
        items?.forEach((item) => observer.observe(item));

        return () => {
            items?.forEach((item) => observer.unobserve(item));
        };
    };

    const {
        data: cars,
        isLoading: isLoadingCars,
        error: errorCars,
    } = useQuery({
        queryKey: ["cars"],
        queryFn: () => getAllCarsWithPictures(),
    });

    const {
        data: drivers,
        isLoading: isLoadingDrivers,
        error: errorDrivers,
    } = useQuery({
        queryKey: ["drivers"],
        queryFn: () => getAllDrivers(),
    });

    const carouselCars: { carId: string; carPicture: string }[] = [];
    cars?.forEach((car) => {
        if (
            typeof car?.carImagesAndDocuments &&
            typeof car.carImagesAndDocuments !== "string"
        ) {
            const carId = car?._id?.toString();
            const carPicture = car?.carImagesAndDocuments?.carImages[0];
            if (carId && carPicture) {
                carouselCars.push({ carId, carPicture });
            }
        }
    });

    const carouselDrivers: { driverId: string; driverPicture: string }[] = [];
    drivers?.forEach((driver) => {
        const driverId = driver?._id?.toString();
        const driverPicture = driver.pictureUrl;
        if (driverId && driverPicture) {
            carouselDrivers.push({ driverId, driverPicture });
        }
    });

    useEffect(() => {
        const storedCarId = localStorage.getItem("data-car-id");
        const storedDriverId = localStorage.getItem("data-driver-id");

        if (storedCarId) {
            setCarId(storedCarId);
        } else if (carouselCars.length > 0) {
            setCarId(carouselCars[0].carId);
        }

        if (storedDriverId) {
            setDriverId(storedDriverId);
        } else if (carouselDrivers.length > 0) {
            setDriverId(carouselDrivers[0].driverId);
        }
    }, [carouselCars, carouselDrivers]);

    useEffect(() => {
        if (cars && cars.length > 0) {
            setupIntersectionObserver(
                carCarouselRef,
                ".car-carousel-item",
                setCarId,
                "data-car-id"
            );
        }
    }, [cars]);

    useEffect(() => {
        if (drivers && drivers.length > 0) {
            setupIntersectionObserver(
                driverCarouselRef,
                ".driver-carousel-item",
                setDriverId,
                "data-driver-id"
            );
        }
    }, [drivers]);

    return (
        <div className="flex flex-col w-full sm:w-11/12 lg:grid lg:grid-cols-3 lg:gap-8 lg:px-8 lg:py-32 sm:mt-4 bg-zinc-800 text-zinc-50 rounded-lg border border-red-600">
            <div className="text-center my-auto">
                <h4 className="text-zinc-50 font-semibold text-xl lg:font-bold lg:mt-8 text-center">
                    Choose a car
                </h4>
                <p className="text-sm text-red-600">
                    Swipe and click for more info
                </p>
                {isLoadingCars && <p>Loading cars...</p>}
                {errorCars && <p>{`Failed to load cars. ${errorCars}`}</p>}
                <Carousel ref={carCarouselRef} className="lg:mb-8">
                    <CarouselContent>
                        {carouselCars.map((car) => (
                            <CarouselItem
                                key={car.carId}
                                data-car-id={car.carId}
                                className="car-carousel-item"
                            >
                                <Link href={`/cars/${car.carId}`}>
                                    <Image
                                        src={car.carPicture}
                                        alt="Car picture"
                                        width={640}
                                        height={480}
                                        quality={80}
                                        className="border border-red-600 mx-auto"
                                    />
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <p className="text-white">CID: {carId}</p>
            </div>
            <div className="text-center my-auto">
                <h4 className="text-zinc-50 font-semibold text-xl lg:font-bold lg:mt-8 text-center">
                    Choose a driver
                </h4>
                <p className="text-sm text-red-600">
                    Swipe and click for more info
                </p>
                {isLoadingDrivers && <p>Loading drivers...</p>}
                {errorDrivers && (
                    <p>{`Failed to load drivers. ${errorDrivers}`}</p>
                )}
                <Carousel ref={driverCarouselRef} className="lg:mb-8">
                    <CarouselContent>
                        {carouselDrivers.map((driver) => (
                            <CarouselItem
                                key={driver.driverId}
                                data-driver-id={driver.driverId}
                                className="driver-carousel-item"
                            >
                                <Link href={`/drivers/${driver.driverId}`}>
                                    <Image
                                        src={driver.driverPicture}
                                        alt="Driver picture"
                                        width={640}
                                        height={480}
                                        quality={80}
                                        className="border border-red-600 mx-auto"
                                    />
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <p className="text-white">DID: {driverId}</p>
            </div>
            <div className="flex flex-col items-center my-auto">
                <h3 className="mt-4 font-semibold text-xl lg:font-bold lg:text-2xl text-center text-red-600">
                    <em>Book Form</em>
                </h3>
                <form
                    action=""
                    className="flex flex-col gap-2 justify-between align-middle w-full p-4"
                >
                    <p className="flex flex-row justify-between m-2">
                        <label htmlFor="startDate">Start Date: </label>
                        <input
                            className="text-zinc-950 w-8/12 p-1 rounded-md"
                            id="startDate"
                            type="date"
                            name="startDate"
                        />
                    </p>
                    <p className="flex flex-row justify-between m-2">
                        <label htmlFor="daysNo">Days No.:</label>
                        <input
                            className="text-zinc-950 w-8/12 p-1 rounded-md"
                            id="daysNo"
                            type="number"
                            name="daysNo"
                        />
                    </p>

                    <p className="flex flex-row justify-between m-2">
                        <span>Total price: $</span>
                    </p>
                    <Button
                        type="submit"
                        variant="secondary"
                        size="lg"
                        className="mx-auto w-3/4 md:w-1/2"
                    >
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    );
}