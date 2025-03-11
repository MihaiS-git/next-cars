export interface User {
    _id?: string;
    email: string;
    password: string;
    name?: string;
    role?: 'ADMIN' | 'CUSTOMER' | 'DRIVER';
    address?: string;
    phone?: string;
    dob?: string;
    drivingSince?: string;
    pictureUrl?: string;
    bookings?: IBooking[];
    invoices?: IInvoice[];
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
    carImages: string[],
    registrationNumber: string,
    insurancePolicyNumber: string,
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
    carRentalDetails?: string | ICarRentalDetails | null;
    carFeaturesAndSpecifications?: string | ICarFeaturesAndSpecifications | null;
    carImagesAndDocuments?: string | ICarImagesAndDocuments | null;
    rentalAgencyDetails?: string | IRentalAgencyDetails | null;
    bookings?: IBooking[];
}

export interface IDatesInterval {
    start: Date;
    end: Date;
}

export interface IBooking {
    _id?: string;
    customer: string | User | null;
    car: string | ICar | null;
    driver: string | User | null;
    timeInterval: IDatesInterval;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
    totalAmount: number;
}

export interface IInvoice {
    _id?: string;
    customer: string | User | null;
    booking: string | IBooking | null;
    issueDate: string | Date;
    dueDate: string | Date;
    baseAmountDue: number;
    VAT: number;
    totalAmountDue: number;
    status: 'Paid' | 'Unpaid' | 'Overdue';
    paymentMethod: 'Credit Card' | 'Debit Card' | 'PayPal' | 'Bank Transfer';
    notes?: string;
}