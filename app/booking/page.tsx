"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { bookCar } from "../actions/booking/actions";
import { useSession } from "next-auth/react";
import { IPicture } from "@/lib/definitions";
import { getAllCarsWithOnePicture } from "@/lib/db/cars";
import { getAllDriversSummary } from "@/lib/db/drivers";

// Dynamically import components
const BookingCarousel = dynamic(() => import("@/components/ui/booking/booking-carousel"));
const BookingForm = dynamic(() => import("@/components/ui/booking/BookingForm"));
const CloseButton = dynamic(() => import("@/components/ui/CloseButton"));

export default function BookingPage() {
    const [carId, setCarId] = useState("");
    const [driverId, setDriverId] = useState("");
    const [cars, setCars] = useState<IPicture[]>([]);
    const [isLoadingCars, setIsLoadingCars] = useState(true);
    const [errorCars, setErrorCars] = useState("");
    const [drivers, setDrivers] = useState<IPicture[]>([]);
    const [isLoadingDrivers, setIsLoadingDrivers] = useState(true);
    const [errorDrivers, setErrorDrivers] = useState("");
    const carCarouselRef = useRef<HTMLDivElement | null>(null);
    const driverCarouselRef = useRef<HTMLDivElement>(null);
    const initialState = { message: "" };
    const [formState, formAction] = useActionState(bookCar, initialState);
    const { data: session } = useSession();

    const getCarCarouselsData = useMemo(() => async () => {
        const carsData = await getAllCarsWithOnePicture();
        if (!carsData || carsData.length === 0) {
            setIsLoadingCars(false);
            setErrorCars("No cars found");
            return;
        }
        setCars(carsData);
        setIsLoadingCars(false);
    }, []);

    const getDriverCarouselsData = useMemo(() => async () => {
        const driversData = await getAllDriversSummary();
        if (!driversData || driversData.length === 0) {
            setIsLoadingDrivers(false);
            setErrorDrivers("No drivers found");
            return;
        }
        setDrivers(driversData);
        setIsLoadingDrivers(false);
    }, []);

    useEffect(() => {
        getCarCarouselsData();
    }, [getCarCarouselsData]);

    useEffect(() => {
        getDriverCarouselsData();
    }, [getDriverCarouselsData]);
    
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
                    isLoading={isLoadingCars}
                    error={errorCars}
                    carouselRef={carCarouselRef}
                    carouselElements={cars}
                    elementTag="car"
                    class_carousel_item="car-carousel-item"
                    baseLink="cars"
                    dataAttribute="data-car-id"
                />
                <BookingCarousel
                    isLoading={isLoadingDrivers}
                    error={errorDrivers}
                    carouselRef={driverCarouselRef}
                    carouselElements={drivers}
                    elementTag="driver"
                    class_carousel_item="driver-carousel-item"
                    baseLink="drivers"
                    dataAttribute="data-driver-id"
                />
                <div className="lg:col-span-2 flex flex-col items-center m-auto w-full">
                    <BookingForm
                        formAction={formAction}
                        formState={formState}
                        customerEmail={customerEmail ?? ""}
                        carId={carId}
                        driverId={driverId}
                    />
                </div>
            </div>
            <div className="w-full flex flex-row justify-end pb-4 pe-4">
                <CloseButton target="/" />
            </div>
        </div>
    );
}