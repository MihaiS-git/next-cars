import { getAllCarsWithPicturesPaginated } from "@/lib/db/cars";
import CarsPageServer from "./CarsPageServer";
import { Metadata } from "next";

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; category?: string; transmission?: string }>;
}): Promise<Metadata> {
    const resolvedSearchParams = await searchParams;

    const pageNo = parseInt(resolvedSearchParams.page || "1", 10);

    const filters = {
        category: resolvedSearchParams.category || "All",
        transmission: resolvedSearchParams.transmission || "All",
    };

    const { cars } = await getAllCarsWithPicturesPaginated(pageNo, 10, filters);

    const keywords = cars
        .map((car) => `${car.make} - ${car.carModel}`)
        .join(", ");

    return {
        title: "Next Cars - Browse Cars",
        description: "Browse our collection of cars available for rent.",
        keywords,
    };
}

export default CarsPageServer;