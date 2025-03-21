import { Metadata } from "next";
import { getCarBySlug } from "@/lib/db/cars";
import CarDetails from "@/components/ui/cars/CarDetails";

export async function generateMetadata({ params }: { params: Promise<{ carSlug: string }> }): Promise<Metadata> {
    const { carSlug } = await params;
    const car = await getCarBySlug(carSlug);

    if (!car) {
        return {
            title: "Car not found",
            description: "The requested car could not be found.",
        };
    }

    return {
        title: `Next Cars - ${car.make} ${car.carModel}`,
        description: `View details of the ${car.make} ${car.carModel} available at Next Cars.`,
        keywords: `Next Cars, ${car.make}, ${car.carModel}, ${car.category} rental, ${car.transmission} rental`,
        authors: [{ name: "Next Cars Team" }],
        robots: "index, follow",
    };
}


export default async function CarSlug({params, searchParams,}: {params: Promise<{ carSlug: string }>; searchParams: Promise<{ page: number, category: string, transmission: string }>;}) {
    const { carSlug } = await params;
    const { page, category, transmission } = await searchParams;
    const car = await getCarBySlug(carSlug);

    const filters = {
        category: category,
        transmission: transmission,
    };

    if (!car) {
        return (
            <div className="text-center text-red-500">
                <p>Failed to load car details. Please try again.</p>
            </div>
        );
    }

    return <CarDetails car={car} page={page} filters={filters} />;
}
