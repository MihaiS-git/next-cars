import { getCar } from "@/lib/queries/cars-queries";
import Image from "next/image";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

type Params = {
    params: {
        carSlug: string;
    };
};

export default async function CarSlug({ params }: Params) {
    const p = await params;
    const slug = p.carSlug;
    const car = await getCar(slug);

    return (
        <div className="flex flex-col bg-zinc-800 text-zinc-50 w-full md:w-11/12 rounded-lg border border-red-600 mt-4 items-center lg:items-stretch">
            <div>
                <Carousel className="mx-auto w-full lg:w-8/12">
                    <CarouselContent>
                        {car!.carImagesAndDocuments.carImages.map(
                            (image: string) => {
                                return (
                                    <CarouselItem key={image}>
                                        <Image
                                            src={image}
                                            alt={`${car!.make} ${car!.carModel} `}
                                            width={900}
                                            height={600}
                                            className="mx-auto overflow-hidden"
                                        />
                                    </CarouselItem>
                                );
                            }
                        )}
                    </CarouselContent>
                    <CarouselPrevious className="hidden lg:block"/>
                    <CarouselNext className="hidden lg:block"/>
                </Carousel>
            </div>
            <h1 className="mb-4 mt-4 text-red-600 font-semibold text-2xl lg:font-bold lg:text-3xl text-center">
                <em>
                    {car!.make} {car!.carModel}
                </em>
            </h1>

            <div className="flex flex-col md:flex-row justify-around align-top items-start text-left gap-4 p-4 lg:p-8">
                <div>
                    <h4 className="text-left font-bold pb-2">
                        Car Specifications
                    </h4>
                    <p>Category: {car!.category}</p>
                    <p>Year: {car!.year}</p>
                    <p>Seats: {car!.seats}</p>
                    <p>Doors: {car!.doors}</p>
                    <p>Transmission: {car!.transmission}</p>
                    <p>FuelType: {car!.fuelType}</p>
                    <p>Mileage: {car!.mileage} km</p>
                </div>
                <div className="flex flex-col text-left">
                    <h4 className="text-left font-bold pb-2">
                        Features & Specifications
                    </h4>
                    <p>
                        Air Conditioning:
                        {car!.carFeaturesAndSpecifications.airConditioning.toString()}
                    </p>
                    <p>
                        GPS: {car!.carFeaturesAndSpecifications.gps.toString()}
                    </p>
                    <p>
                        Bluetooth:
                        {car!.carFeaturesAndSpecifications.bluetooth.toString()}
                    </p>
                    <p>
                        Fuel Policy:
                        {car!.carFeaturesAndSpecifications.fuelPolicy}
                    </p>
                    <p>
                        Insurance Included:
                        {car!.carFeaturesAndSpecifications.insuranceIncluded.toString()}
                    </p>
                    <div className="pt-0">
                        <h5 className="text-left font-semibold">
                            Additional Features:
                        </h5>
                        <ul className="list-disc ps-5">
                            {car!.carFeaturesAndSpecifications.additionalFeatures.map(
                                (feature: string) => (
                                    <li key={feature}>{feature}</li>
                                )
                            )}
                        </ul>
                    </div>
                </div>
                <div>
                    <h4 className="text-left font-bold pb-2">
                        Rental Details
                    </h4>

                    <p>
                        Price Per Day: {car!.carRentalDetails.rentalPricePerDay}
                        {car!.carRentalDetails.currency}
                    </p>
                    <p>
                        Availability: {car!.carRentalDetails.availabilityStatus}
                    </p>
                    <p>Car Location: {car!.carRentalDetails.carLocation}</p>
                    <p>
                        Rental Period: {car!.carRentalDetails.minRentalPeriod} -
                        {car!.carRentalDetails.maxRentalPeriod} days
                    </p>
                    <div className="pt-0">
                        <h4 className="text-left font-semibold pb-0">
                            Documents:
                        </h4>
                        <p>
                            <span>Registration No: </span>
                            {car!.carImagesAndDocuments.registrationNumber}
                        </p>
                        <p>
                            <span>Insurance Policy No: </span>
                            {car!.carImagesAndDocuments.insurancePolicyNumber}
                        </p>
                    </div>
                    <div className="pt-0">
                        <h5 className="text-left font-semibold pb-0">
                            Agency Details:
                        </h5>
                        <p>Agency: {car!.rentalAgencyDetails.agencyName}</p>
                        <p>Contact: {car!.rentalAgencyDetails.contactNumber}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
