"use client";

import { useDispatch, useSelector } from "react-redux";
import { Suspense, useEffect } from "react";

import {
    getCarsFailure,
    getCarsStart,
    getCarsSuccess,
} from "@/app/slices/carsSlice";
import { AppDispatch, RootState } from "@/app/store";
import { getCars } from "../actions/cars/actions";
import CarCard from "../../components/ui/cars/car-card";
import CarsGrid from "@/components/ui/cars/cars-grid";

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
            <Suspense fallback={<p className="text-red-600 text-lg font-bold"><em>Fetching cars...</em></p>}>
                <CarsGrid cars={cars}/>
            </Suspense>
        </div>
    );
}
