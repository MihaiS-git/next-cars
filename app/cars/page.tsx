import CarsGrid from "@/components/ui/cars/CarsGrid";
import { getAllCarsWithPicturesPaginated } from "@/app/actions/cars/actions";

export default async function CarsPage({ searchParams }: { searchParams: { page?: string } }) {
    const params = await searchParams;
    const currentPage = parseInt(params.page || "1", 10);
    const { cars, totalCount } = await getAllCarsWithPicturesPaginated(currentPage, 10);

    return (
        <>
            <h1 className="mb-4 mt-8 text-zinc-200 font-semibold text-xl lg:font-bold lg:text-2xl text-center">
                <em>Cars List</em>
            </h1>
            <CarsGrid initialCars={cars} totalCount={totalCount} currentPage={ currentPage} />
        </>
    );
}
