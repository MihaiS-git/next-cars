import { ICar } from "@/lib/definitions";

export const getCars = async (): Promise<ICar[]> => {
    try {
        const response = await fetch("/api/cars");

        if (!response.ok) {
            throw new Error("Failed to fetch cars");
        }

        const result = await response.json();
        console.log("RESPONSE: ", result);

        const cars: ICar[] = result.data || [];
        console.log("CARS: ", cars);

        return cars;
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching cars from the database");
    }
};

