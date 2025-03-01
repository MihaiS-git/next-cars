import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { ICar } from "@/lib/definitions";
import Link from "next/link";

export default function CarCard({ car, slug }: { car: ICar; slug: string }) {
    return (
        <Link href={`/cars/${slug}`}>
            <Card className="bg-zinc-300 border border-red-600 shadow-lg shadow-red-200/50">
                <CardHeader>
                    <CardTitle>{car.make}</CardTitle>
                    <CardDescription className="text-zinc-950">
                        {car.carModel} ({car.year})
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                    <Image
                        src={
                            (typeof car.carImagesAndDocuments === "object" &&
                                car.carImagesAndDocuments?.carImages?.[0]) ||
                            "/cars/default-image.webp"
                        }
                        alt={`${car.make} ${car.carModel}`}
                        width={300}
                        height={200}
                        className="w-full"
                    />
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                    <p>Category: {car.category}</p>
                    <p>Doors: {car.doors}</p>
                    <p>Seats: {car.seats}</p>
                    <p>Fuel: {car.fuelType}</p>
                    <p>Mileage: {car.mileage}</p>
                    <p>Transmission: {car.transmission}</p>
                </CardFooter>
            </Card>
        </Link>
    );
}
