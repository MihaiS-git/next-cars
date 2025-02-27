import { ICarFrontend } from "@/app/slices/carsSlice";
import { mapCarsToFrontend } from "./carMapper";

export const getCars = async (): Promise<ICarFrontend[]> => {
    console.log("fetchCars action called");

    try {
        const response = await fetch("/api/cars");

        if (!response.ok) {
            throw new Error("Failed to fetch cars");
        }

        const data = await response.json();
        const cars = mapCarsToFrontend(data);
        
        console.log("cars fetched in actions: ", cars.length);

        return cars;
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching cars from the database");
    }
};
