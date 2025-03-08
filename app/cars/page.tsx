import CarsGrid from "@/components/ui/cars/CarsGrid";
import { getAllCarsWithPicturesPaginated } from "@/app/actions/cars/actions";

export default async function CarsPage() {
    const { cars, totalCount } = await getAllCarsWithPicturesPaginated(1, 10);

    return (
        <>
            <h1 className="mb-4 mt-8 text-red-600 font-semibold text-xl lg:font-bold lg:text-2xl text-center">
                <em>Cars List</em>
            </h1>
            <CarsGrid initialCars={cars} totalCount={totalCount} />
        </>
    );
}
