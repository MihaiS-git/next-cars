import { getCarBySlug } from "@/lib/db/cars";
import CarDetails from "@/components/ui/cars/CarDetails";
import Head from "next/head";

export default async function CarSlug({ params }: { params: Promise<{ carSlug: string }> }) {
    const param = await params;
    const carSlug = param.carSlug;
    const car = await getCarBySlug(carSlug);

    if (!car) {
        return (
            <div className="text-center text-red-500">
                <p>Failed to load car details. Please try again.</p>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Next Cars - {car.make} {car.carModel}</title>
                <meta name="description" content={`View details of the ${car.make} ${car.carModel} available at Next Cars.`}/>
                <meta name="keywords" content={`Next Cars, ${car.make}, ${car.carModel}`} />
                <meta name="author" content="Next Cars Team" />
                <meta name="robots" content="index, follow" />
                <meta charSet="UTF-8" />
            </Head>
            <CarDetails car={car}/>
        </>
    );
}