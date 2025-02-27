import { ICarFrontend } from "@/lib/definitions";

export const mapCarToFrontend = (car: {
    _id: string;
    make: string;
    model: string;
    year: number;
    category: string;
    seats: number;
    doors: number;
    transmission: string;
    fuelType: string;
    mileage: number;
    carRentalDetails: { _id: string };
    carFeaturesAndSpecifications: { _id: string };
    carImagesAndDocuments: { _id: string };
    rentalAgencyDetails: { _id: string };
}): ICarFrontend => ({
    id: car._id,
    make: car.make,
    model: car.model,
    year: car.year,
    category: car.category as "Classic" | "Sport" | "Sedan" | "SUV",
    seats: car.seats,
    doors: car.doors,
    transmission: car.transmission as "Manual" | "Automatic",
    fuelType: car.fuelType as "Gasoline" | "Diesel" | "Electric" | "Hybrid",
    mileage: car.mileage,
    carRentalDetails: car.carRentalDetails._id,
    carFeaturesAndSpecifications: car.carFeaturesAndSpecifications._id,
    carImagesAndDocuments: car.carImagesAndDocuments._id,
    rentalAgencyDetails: car.rentalAgencyDetails._id,
});

export const mapCarsToFrontend = (cars: any[]): ICarFrontend[] =>
    cars.map(mapCarToFrontend);