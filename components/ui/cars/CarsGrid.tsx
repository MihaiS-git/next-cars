import { ICar } from "@/lib/definitions";
import CarCard from "./CarCard";
import PaginationControls from "../navigation/PaginationControls";
import CloseButton from "../CloseButton";

export default function CarsGrid({
    initialCars,
    totalCount,
    currentPage,
}: {
    initialCars: ICar[];
    totalCount: number;
    currentPage: number;
}) {
    const totalPages = Math.ceil(totalCount / 10);

    return (
        <div className="p-4">
            <ul className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {initialCars?.map((car) => (
                    <li key={car._id}>
                        <CarCard car={car} slug={car._id?.toString() || ""} />
                    </li>
                ))}
            </ul>
            <PaginationControls searchParams={{ currentPage, totalPages }} />
            <div className="flex flex-row justify-end">
               <CloseButton target="/" />
            </div>
        </div>
    );
}
