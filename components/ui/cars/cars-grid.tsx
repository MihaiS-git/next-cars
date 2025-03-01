import { ICar } from "@/lib/definitions";
import CarCard from "./car-card";

export default function CarsGrid({ cars }: { cars: ICar[] }) {
    return (
        <div className="p-4">
                <ul className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {cars.map((car) => (
                        <li key={car._id}>
                            <CarCard car={car} slug={ car._id!.toString()} />
                        </li>
                    ))}
                </ul>
            </div>
    );
}