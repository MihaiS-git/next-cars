import { ICar } from "@/lib/definitions";
import CarCard from "./CarCard";

export default function CarsGrid({
    initialCars,
    page,
    filters
}: {
    initialCars: ICar[];
        page: number;
        filters: { category: string, transmission: string };
}) {
    return (
        <div className="p-4">
            <ul className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {initialCars?.map((car) => (
                    <li key={car._id}>
                        <CarCard
                            car={car}
                            page={page}
                            filters={filters}
                            slug={car._id?.toString() || ""}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}
