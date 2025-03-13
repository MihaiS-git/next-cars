"use client";

import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useRef, useState } from "react";
import BookingCarousel from "@/components/ui/booking/booking-carousel";
import { bookCar } from "../actions/booking/actions";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { User } from "@/lib/definitions";
import BookingForm from "@/components/ui/booking/BookingForm";
import CloseButton from "@/components/ui/CloseButton";

export default function BookingPage({
    cars,
    drivers,
}: {
    cars: any[];
    drivers: User[];
}) {
    const [startDate, setStartDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [daysNo, setDaysNo] = useState(1);
    const [carId, setCarId] = useState("");
    const [driverId, setDriverId] = useState("");
    const carCarouselRef = useRef<HTMLDivElement | null>(null);
    const driverCarouselRef = useRef<HTMLDivElement>(null);
    const initialState = { message: "", errors: {} };
    const [formState, formAction] = useActionState(bookCar, initialState);
    const { data: session, status } = useSession();

    const customerEmail = session?.user?.email;

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

    const carouselDrivers: { elementId: string; elementPicture: string }[] = [];
    drivers.forEach((driver) => {
        carouselDrivers.push({
            elementId: driver._id!.toString(),
            elementPicture: driver.pictureUrl!,
        });
    });

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
        <div className="flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4 mx-auto px-4">
                <h1 className="lg:col-span-2 w-full my-4 font-semibold text-xl lg:font-bold lg:text-2xl text-center text-zinc-200">
                    <em>Book Form</em>
                </h1>
                <BookingCarousel
                    carouselRef={carCarouselRef}
                    carouselElements={cars}
                    elementTag="car"
                    class_carousel_item="car-carousel-item"
                    baseLink="cars"
                    dataAttribute="data-car-id"
                />
                <BookingCarousel
                    carouselRef={driverCarouselRef}
                    carouselElements={carouselDrivers}
                    elementTag="driver"
                    class_carousel_item="driver-carousel-item"
                    baseLink="drivers"
                    dataAttribute="data-driver-id"
                />
                <div className="lg:col-span-2 flex flex-col items-center m-auto w-full">
                    <BookingForm formAction={formAction} formState={formState} customerEmail={customerEmail ?? ""} carId={carId} driverId={driverId} />
                </div>
            </div>
            <div className="w-full flex flex-row justify-end pb-4 pe-4">
                <CloseButton target="/" />
            </div>
        </div>
    );
}
