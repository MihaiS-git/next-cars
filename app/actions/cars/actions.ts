import { ICarFrontend } from "@/lib/definitions";
import { mapCarsToFrontend } from "@/lib/mappers/carMapper";

export const getCars = async (): Promise<ICarFrontend[]> => {
    console.log("fetchCars action called");

    try {
        const response = await fetch("/api/cars");

        if (!response.ok) {
            throw new Error("Failed to fetch cars");
        }

        const data = await response.json();
        const cars = mapCarsToFrontend(data);
        
        return cars;
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching cars from the database");
    }
};