import CarsGrid from "@/components/ui/cars/CarsGrid";
import { getAllCarsWithPicturesPaginated } from "@/lib/db/cars";
import PaginationControls from "@/components/ui/navigation/PaginationControls";
import CloseButton from "@/components/ui/CloseButton";
import { Suspense } from "react";
import { Metadata } from "next";

export async function generateMetadata({searchParams,}: {searchParams: Promise<{ page: string }>;}): Promise<Metadata> {
    const { page } = await searchParams;
    const pageNo = parseInt(page || "1", 10);
    const { cars } = await getAllCarsWithPicturesPaginated(pageNo, 10);

    const keywords = cars
        .map((car) => `${car.make} - ${car.carModel}`)
        .join(", ");

    return {
        keywords,
    };
}

export default async function CarsPage({
    searchParams,
}: {
    searchParams: Promise<{ page: string }>;
}) {
    const { page } = await searchParams;
    const pageNo = parseInt(page || "1", 10);
    const { cars, totalCount } = await getAllCarsWithPicturesPaginated(
        pageNo,
        10
    );

    return (
        <Suspense
            fallback={
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600 m-8 mx-auto mt-48 mb-8"></div>
                    <div className="text-zinc-400 mb-48">
                        Loading cars list...
                    </div>
                </div>
            }
        >
            <h1 className="mb-4 mt-8 text-zinc-200 font-semibold text-xl lg:font-bold lg:text-2xl text-center">
                <em>Cars List</em>
            </h1>
            {cars.length === 0 ? (
                <h1>No cars found</h1>
            ) : (
                <CarsGrid initialCars={cars} page={pageNo} />
            )}
            <PaginationControls
                searchParams={{
                    currentPage: pageNo,
                    totalPages: Math.ceil(totalCount / 10),
                }}
            />
            <div className="flex flex-row justify-end">
                <CloseButton target="/" />
            </div>
        </Suspense>
    );
}
