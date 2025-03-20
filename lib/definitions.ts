import { ObjectId } from "mongodb";

export interface User {
    _id?: string;
    email?: string;
    password?: string;
    name?: string;
    role?: 'ADMIN' | 'CUSTOMER' | 'DRIVER';
    address?: string;
    phone?: string;
    dob?: Date;
    drivingSince?: Date;
    pictureUrl?: string;
    bookings?: ObjectId[] | IBooking[];
    invoices?: ObjectId[] | IInvoice[];
    createdAt?: Date;
    updatedAt?: Date;
};

export interface ICarRentalDetails {
    _id?: string;
    rentalPricePerDay: number;
    currency: string;
    availabilityStatus: 'Available' | 'Rented' | 'Under Maintenance';
    carLocation: string;
    minRentalPeriod: number;
    maxRentalPeriod: number;
}

export interface ICarFeaturesAndSpecifications {
    _id?: string;
    airConditioning: boolean;
    gps: boolean;
    bluetooth: boolean;
    fuelPolicy: 'Full-to-full' | 'Prepaid';
    insuranceIncluded: boolean;
    additionalFeatures: string[];
}

export interface ICarImagesAndDocuments {
    _id?: string;
    carImages: string[];
    registrationNumber: string;
    insurancePolicyNumber: string;
}

export interface IRentalAgencyDetails {
    _id?: string;
    agencyName: string;
    contactNumber: string;
}

export interface ICar {
    _id?: string;
    make: string;
    carModel: string;
    year?: number;
    category?: 'Classic' | 'Sport' | 'Sedan' | 'SUV';
    seats?: number;
    doors?: number;
    transmission?: 'Manual' | 'Automatic';
    fuelType?: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid';
    mileage?: number;
    carRentalDetails?: string | ICarRentalDetails;
    carFeaturesAndSpecifications?: string | ICarFeaturesAndSpecifications;
    carImagesAndDocuments?: string | ICarImagesAndDocuments;
    rentalAgencyDetails?: string | IRentalAgencyDetails;
    bookings?: ObjectId[] | IBooking[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IDatesInterval {
    start: Date;
    end: Date;
}

export interface IBooking {
    _id?: string;
    customer: string | User;
    car: string | ICar;
    driver: string | User;
    timeInterval: IDatesInterval;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
    totalAmount: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IDashboardBooking {
    _id?: string;
    customer: string | User;
    car: {
        make: string;
        carModel: string;
    };
    driver: {
        name: string;
    };
    timeInterval: IDatesInterval;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
    totalAmount: number;
}

export interface IInvoice {
    _id?: string | ObjectId;
    customer: string | User | ObjectId;
    booking: string | IBooking | ObjectId;
    issueDate: Date | string;
    dueDate: Date | string;
    baseAmountDue: number;
    VAT: number;
    totalAmountDue: number;
    status: 'Paid' | 'Unpaid' | 'Overdue';
    paymentMethod: 'Credit Card' | 'Debit Card' | 'PayPal' | 'Bank Transfer';
    notes?: string;
}

export interface IPicture {
    elementId: string;
    elementPicture: string;
}