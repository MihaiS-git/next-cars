"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useEffect } from "react";
import Image from "next/image";
import {
    getCarsFailure,
    getCarsStart,
    getCarsSuccess,
} from "../slices/carSlice";
import { getCars } from "../actions/cars/actions";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Cars() {
    const dispatch = useDispatch<AppDispatch>();
    const { cars, loading, error } = useSelector(
        (state: RootState) => state.cars
    );

    useEffect(() => {
        const loadCars = async () => {
            dispatch(getCarsStart());
            try {
                const data = await getCars();
                dispatch(getCarsSuccess(data));
            } catch (err: any) {
                dispatch(getCarsFailure(err.message));
            }
        };

        loadCars();
    }, [dispatch]);

    if (loading) {
        return <p>Loading cars...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="flex flex-col bg-zinc-800 text-zinc-50 w-full md:w-11/12 rounded-lg border border-red-600 mt-4">
            <h1 className="mb-4 mt-8 text-red-600 font-semibold text-2xl lg:font-bold lg:text-3xl text-center">
                <em>Cars</em>
            </h1>
            <div className="p-4">
                <ul className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {cars.map((car) => (
                        <li key={car._id}>
                            <Card className="bg-zinc-200 border border-red-600 shadow-lg shadow-red-200/50">
                                <CardHeader>
                                    <CardTitle>{car.make}</CardTitle>
                                    <CardDescription className="text-zinc-950">
                                        {car.carModel} ({car.year})
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <Image
                                        src={
                                            car.carImagesAndDocuments?.carImages?.[0]
                                        }
                                        alt={`${car.make} ${car.carModel}`}
                                        width={300}
                                        height={200}
                                        className="w-full"
                                    />
                                </CardContent>
                                <CardFooter className="flex flex-col items-start">
                                    <p>Category: {car.category}</p>
                                    <p>Doors: {car.doors}</p>
                                    <p>Seats: {car.seats}</p>
                                    <p>Fuel: {car.fuelType}</p>
                                    <p>Mileage: {car.mileage}</p>
                                    <p>Transmission: {car.transmission}</p>
                                </CardFooter>
                            </Card>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
