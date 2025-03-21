import { getAllCarsWithPicturesPaginated } from "@/lib/db/cars";
import { Metadata } from "next";
import CarsPageClient from "./CarsPageClient";

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ page: string; category: string }>;
}): Promise<Metadata> {
    const { page, category } = await searchParams;
    const pageNo = parseInt(page || "1", 10);

    const { cars } = await getAllCarsWithPicturesPaginated(
        pageNo,
        10,
        category
    );

    const keywords = cars
        .map((car) => `${car.make} - ${car.carModel}`)
        .join(", ");

    return {
        keywords,
    };
}

export default async function CarsPageServer({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; category?: string }>;
}) {
    const { page = "1", category = "All" } = await searchParams;
    const pageNo = parseInt(page || "1", 10);

    const { cars, totalCount } = await getAllCarsWithPicturesPaginated(
        pageNo,
        10,
        category
    );

    return (
        <CarsPageClient
            cars={cars}
            totalCount={totalCount}
            pageNo={pageNo}
            category={category}
        />
    );
}
