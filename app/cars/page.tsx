"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useEffect } from "react";
import {
    getCarsFailure,
    getCarsStart,
    getCarsSuccess,
} from "../slices/carSlice";
import { getCars } from "../actions/cars/actions";

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
        <div>
            <h1>Cars</h1>
            <ul className="bg-zinc-50">
                {cars.map((car) => (
                    <li key={car.id}>
                        {car.make} {car.model} ({car.year})
                    </li>
                ))}
            </ul>
        </div>
    );
}
