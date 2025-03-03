import CarsGrid from "@/components/ui/cars/CarsGrid";
import { getAllCarsWithPicturesPaginated } from "@/app/actions/cars/actions";

export default async function CarsPage() {
    const {cars, totalCount} = await getAllCarsWithPicturesPaginated(1, 10);

    return (
        <div className="flex flex-col bg-zinc-800 text-zinc-50 w-full md:w-11/12 rounded-lg border border-red-600 mt-4">
            <h1 className="mb-4 mt-8 text-red-600 font-semibold text-2xl lg:font-bold lg:text-3xl text-center">
                <em>Cars List</em>
            </h1>
                <CarsGrid initialCars={cars} totalCount={totalCount} />
        </div>
    );
}
