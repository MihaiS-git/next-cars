"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getAllCarsWithPictures } from "../actions/cars/actions";
import { getAllDrivers } from "../actions/drivers/actions";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import BookingCarousel from "@/components/ui/booking/booking-carousel";
import { bookCar } from "../actions/booking/actions";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { X } from "lucide-react";

export default function BookingPage() {
    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
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

    const carouselCars = useMemo(() => {
        const carsArray: { elementId: string; elementPicture: string }[] = [];
        cars?.forEach((car) => {
            if (
                typeof car?.carImagesAndDocuments &&
                typeof car.carImagesAndDocuments !== "string"
            ) {
                const carId = car?._id?.toString();
                const carPicture = car?.carImagesAndDocuments?.carImages[0];
                if (carId && carPicture) {
                    carsArray.push({
                        elementId: carId,
                        elementPicture: carPicture,
                    });
                }
            }
        });
        return carsArray;
    }, [cars]);

    const carouselDrivers = useMemo(() => {
        const driversArray: { elementId: string; elementPicture: string }[] =
            [];
        drivers?.forEach((driver) => {
            const elementId = driver?._id?.toString();
            const elementPicture = driver.pictureUrl;
            if (elementId && elementPicture) {
                driversArray.push({ elementId, elementPicture });
            }
        });
        return driversArray;
    }, [drivers]);

    useEffect(() => {
        const storedCarId = localStorage.getItem("data-car-id");
        const storedDriverId = localStorage.getItem("data-driver-id");

        if (storedCarId) {
            setCarId(storedCarId);
        } else if (carouselCars.length > 0) {
            setCarId(carouselCars[0].elementId);
        }

        if (storedDriverId) {
            setDriverId(storedDriverId);
        } else if (carouselDrivers.length > 0) {
            setDriverId(carouselDrivers[0].elementId);
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

    useEffect(() => {
        const car = cars?.find((car) => car._id!.toString() === carId);
        const driver = drivers?.find(
            (driver) => driver._id!.toString() === driverId
        );

        if (car || driver) {
            const title = car
                ? `Next Cars - Book ${car.make} ${car.carModel}`
                : `Next Cars - Book Driver ${driver?.name}`;
            const description = car
                ? `Book a ${car.make} ${car.carModel} from Next Cars`
                : `Book driver ${driver?.name} from Next Cars`;

            document.title = title;
            document
                .querySelector('meta[name="description"]')
                ?.setAttribute("content", description);
        }
    }, [carId, driverId, cars, drivers]);

    const handleClose = () => {
        redirect("/");
    };

    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4 mx-auto px-4">
                <h3 className="lg:col-span-2 w-full mt-4 font-semibold text-xl lg:font-bold lg:text-2xl text-center text-red-600">
                    <em>Book Form</em>
                </h3>
                <BookingCarousel
                    isLoading={isLoadingCars}
                    error={errorCars ? errorCars.message : null}
                    carouselRef={carCarouselRef}
                    carouselElements={carouselCars}
                    elementTag="car"
                    class_carousel_item="car-carousel-item"
                    baseLink="cars"
                    dataAttribute="data-car-id"
                />
                <BookingCarousel
                    isLoading={isLoadingDrivers}
                    error={errorDrivers ? errorDrivers.message : null}
                    carouselRef={driverCarouselRef}
                    carouselElements={carouselDrivers}
                    elementTag="driver"
                    class_carousel_item="driver-carousel-item"
                    baseLink="drivers"
                    dataAttribute="data-driver-id"
                />

                <div className="lg:col-span-2 flex flex-col items-center m-auto w-full">
                    <form
                        action={formAction}
                        className="flex flex-col justify-between align-middle pb-4 w-full lg:w-1/2 mt-4"
                    >
                        <input
                            type="hidden"
                            name="customerEmail"
                            value={customerEmail || ""}
                        />
                        <input type="hidden" name="carId" value={carId} />
                        <input type="hidden" name="driverId" value={driverId} />
                        <p className="flex flex-row justify-between m-2">
                            <label
                                htmlFor="startDate"
                                className="w-3/12 xl:w-2/12 my-auto"
                            >
                                Start Date:{" "}
                            </label>
                            <input
                                className="text-zinc-950 w-9/12 p-1 rounded-md"
                                id="startDate"
                                type="date"
                                name="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </p>
                        <p className="flex flex-row justify-between m-2">
                            <label htmlFor="daysNo">Days No.:</label>
                            <input
                                className="text-zinc-950 w-9/12 p-1 rounded-md"
                                id="daysNo"
                                type="number"
                                name="daysNo"
                                value={daysNo}
                                onChange={(e) => setDaysNo(+e.target.value)}
                            />
                        </p>

                        {formState?.message && (
                            <div
                                id="general-error"
                                className="text-center text-base text-red-600 py-8"
                            >
                                {formState.message.includes(
                                    "Please fill in your details first"
                                ) ? (
                                    <p>
                                        Missing required fields.
                                        <Link
                                            href="/account"
                                            className="underline"
                                        >
                                            Please fill in your details first.
                                        </Link>
                                    </p>
                                ) : (
                                    <p>{formState.message}</p>
                                )}
                            </div>
                        )}
                        <Button
                            type="submit"
                            variant="secondary"
                            size="lg"
                            className="mx-auto w-1/2 md:w-1/3 px-2"
                        >
                            Book Now
                        </Button>
                    </form>
                </div>
            </div>
            <div className="w-full flex flex-row justify-end pb-4 pe-4">
                <Button variant="destructive" size="icon" onClick={handleClose}>
                    <X />
                </Button>
            </div>
        </div>
    );
}
