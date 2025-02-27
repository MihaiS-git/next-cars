export type User = {
    id?: string;
    email: string;
    password: string;
    name?: string;
};

export interface ICarFrontend {
    id?: string;
    make: string;
    model: string;
    year: number;
    category: 'Classic' | 'Sport' | 'Sedan' | 'SUV';
    seats: number;
    doors: number;
    transmission: 'Manual' | 'Automatic';
    fuelType: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid';
    mileage: number;
    carRentalDetails: string;
    carFeaturesAndSpecifications: string;
    carImagesAndDocuments: string;
    rentalAgencyDetails: string;
}