import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../carousel";
import Image from "next/image";
import { ICar } from "@/lib/definitions";
import { Button } from "../button";
import { X } from "lucide-react";
import { redirect } from "next/navigation";

export default function CarDetails({ car }: { car: ICar }) {
    const handleClose = () => {
        redirect("/");
    };

    return (
        <div className="flex flex-col bg-zinc-800 text-zinc-50 w-full md:w-8/12 rounded-lg border border-red-600 mt-4 items-center lg:items-stretch">
            <div>
                <Carousel className="mx-auto w-full lg:w-8/12 lg:pt-8">
                    <CarouselContent>
                        {typeof car?.carImagesAndDocuments === "object" &&
                            car?.carImagesAndDocuments?.carImages.map(
                                (image: string) => {
                                    return (
                                        <CarouselItem key={image}>
                                            <Image
                                                src={image}
                                                alt={`${car!.make} ${
                                                    car!.carModel
                                                } `}
                                                width={900}
                                                height={600}
                                                quality={100}
                                                className="mx-auto overflow-hidden"
                                            />
                                        </CarouselItem>
                                    );
                                }
                            )}
                    </CarouselContent>
                    <CarouselPrevious className="hidden lg:block" />
                    <CarouselNext className="hidden lg:block" />
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
                        {typeof car!.carFeaturesAndSpecifications ===
                            "object" &&
                            car?.carFeaturesAndSpecifications?.airConditioning.toString()}
                    </p>
                    <p>
                        GPS:{" "}
                        {typeof car!.carFeaturesAndSpecifications ===
                            "object" &&
                            car?.carFeaturesAndSpecifications?.gps.toString()}
                    </p>
                    <p>
                        Bluetooth:
                        {typeof car!.carFeaturesAndSpecifications ===
                            "object" &&
                            car?.carFeaturesAndSpecifications?.bluetooth.toString()}
                    </p>
                    <p>
                        Fuel Policy:
                        {typeof car!.carFeaturesAndSpecifications ===
                            "object" &&
                            car?.carFeaturesAndSpecifications?.fuelPolicy}
                    </p>
                    <p>
                        Insurance Included:
                        {typeof car!.carFeaturesAndSpecifications ===
                            "object" &&
                            car?.carFeaturesAndSpecifications?.insuranceIncluded.toString()}
                    </p>
                    <div className="pt-0">
                        <h5 className="text-left font-semibold">
                            Additional Features:
                        </h5>
                        <ul className="list-disc ps-5">
                            {typeof car!.carFeaturesAndSpecifications ===
                                "object" &&
                                car?.carFeaturesAndSpecifications?.additionalFeatures.map(
                                    (feature: string) => (
                                        <li key={feature}>{feature}</li>
                                    )
                                )}
                        </ul>
                    </div>
                </div>
                <div>
                    <h4 className="text-left font-bold pb-2">Rental Details</h4>

                    <p>
                        Price Per Day:{" "}
                        {typeof car!.carRentalDetails === "object" &&
                            car?.carRentalDetails?.rentalPricePerDay}
                        {typeof car!.carRentalDetails === "object" &&
                            car?.carRentalDetails?.currency}
                    </p>
                    <p>
                        Availability:{" "}
                        {typeof car!.carRentalDetails === "object" &&
                            car?.carRentalDetails?.availabilityStatus}
                    </p>
                    <p>
                        Car Location:{" "}
                        {typeof car!.carRentalDetails === "object" &&
                            car?.carRentalDetails?.carLocation}
                    </p>
                    <p>
                        Rental Period:{" "}
                        {typeof car!.carRentalDetails === "object" &&
                            car?.carRentalDetails?.minRentalPeriod}{" "}
                        -
                        {typeof car!.carRentalDetails === "object" &&
                            car?.carRentalDetails?.maxRentalPeriod}{" "}
                        days
                    </p>
                    <div className="pt-0">
                        <h4 className="text-left font-semibold pb-0">
                            Documents:
                        </h4>
                        <p>
                            <span>Registration No: </span>
                            {typeof car!.carImagesAndDocuments === "object" &&
                                car?.carImagesAndDocuments?.registrationNumber}
                        </p>
                        <p>
                            <span>Insurance Policy No: </span>
                            {typeof car!.carImagesAndDocuments === "object" &&
                                car?.carImagesAndDocuments
                                    ?.insurancePolicyNumber}
                        </p>
                    </div>
                    <div className="pt-0">
                        <h5 className="text-left font-semibold pb-0">
                            Agency Details:
                        </h5>
                        <p>
                            Agency:{" "}
                            {typeof car!.rentalAgencyDetails === "object" &&
                                car?.rentalAgencyDetails?.agencyName}
                        </p>
                        <p>
                            Contact:{" "}
                            {typeof car!.rentalAgencyDetails === "object" &&
                                car?.rentalAgencyDetails?.contactNumber}
                        </p>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-row justify-end p-4">
                <Button variant="destructive" size="icon" onClick={handleClose}>
                    <X />
                </Button>
            </div>
        </div>
    );
}
