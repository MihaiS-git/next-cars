import { getAllCarsWithPicturesPaginated } from "@/lib/db/cars";
import CarsPageClient from "./CarsPageClient";

export default async function CarsPageServer({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; category?: string, transmission?: string }>;
}) {
    const { page = "1", category = "All", transmission="All" } = await searchParams;
    const pageNo = parseInt(page || "1", 10);

    const filters = {
        category: category,
        transmission: transmission,
    };

    const { cars, totalCount } = await getAllCarsWithPicturesPaginated(
        pageNo,
        10,
        filters
    );

    return (
        <CarsPageClient
            cars={cars}
            totalCount={totalCount}
            pageNo={pageNo}
            filters={filters}
        />
    );
}
