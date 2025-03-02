import CarsGrid from "@/components/ui/cars/CarsGrid";
import { getAllCarsWithPictures } from "@/app/actions/cars/actions";
import { Suspense } from "react";

export default async function CarsPage() {
    const cars = await getAllCarsWithPictures();

    return (
        <div className="flex flex-col bg-zinc-800 text-zinc-50 w-full md:w-11/12 rounded-lg border border-red-600 mt-4">
            <h1 className="mb-4 mt-8 text-red-600 font-semibold text-2xl lg:font-bold lg:text-3xl text-center">
                <em>Cars</em>
            </h1>
            <Suspense
                fallback={
                    <p className="text-red-600 text-lg font-bold">
                        <em>Fetching cars...</em>
                    </p>
                }
            >
                <CarsGrid initialCars={cars} />;
            </Suspense>
        </div>
    );
}
