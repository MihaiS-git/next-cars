"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getCarsStart,
  getCarsSuccess,
  getCarsFailure,
} from "@/app/slices/carsSlice";
import { RootState, AppDispatch } from "@/app/store";
import { getCars } from "@/app/actions/cars/actions"; // Ensure correct path

const CarsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cars, loading, error } = useSelector(
    (state: RootState) => state.cars
  );

  useEffect(() => {
    const loadCars = async () => {
      dispatch(getCarsStart()); // ✅ Set loading state before fetching

      try {
        const data = await getCars(); // ✅ Calls fixed Server Action
        dispatch(getCarsSuccess(data)); // ✅ Save data in Redux
      } catch (err: any) {
        dispatch(getCarsFailure(err.message)); // ✅ Save error in Redux
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
      <h1>Cars List</h1>
      <ul>
        {cars.map((car) => (
          <li key={car.id}>
            {car.make} {car.model} ({car.year})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CarsList;
