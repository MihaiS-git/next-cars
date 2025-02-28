import { object, z } from "zod";


export const carRentalDetailsSchema = object({
    _id: z.string().optional(),
    rentalPricePerDay: z.number().positive("Price can't be negative"),
    currency: z.string().min(1, "Currency must be specified"),
    availabilityStatus: z.enum(['Available', 'Rented', 'Under Maintenance']),
    carLocation: z.string().min(2),
    minRentalPeriod: z.number().min(1).max(30),
    maxRentalPeriod: z.number().min(1).max(30),
});

export const carFeaturesAndSpecificationsSchema = object({
    _id: z.string().optional(),
    airConditioning: z.boolean(),
    gps: z.boolean(),
    bluetooth: z.boolean(),
    fuelPolicy: z.enum(['Full-to-full', 'Prepaid']),
    insuranceIncluded: z.boolean(),
    additionalFeatures: z.array(z.string()).nonempty(),
});

export const carImagesAndDocumentsSchema = object({
    _id: z.string().optional(),
    carImages: z.array(z.string()),
    registrationNumber: z.string(),
    insurancePolicyNumber: z.string(),
});

export const rentalAgencyDetailsSchema = object({
    _id: z.string().optional(),
    agencyName: z.string(),
    contactNumber: z.string(),
});

export const carSchema = object({
    _id: z.string().optional(),
    make: z.string().min(1),
    carModel: z.string().min(1),
    year: z.number().min(1950).max(2025),
    category: z.enum(['Classic', 'Sport', 'Sedan', 'SUV']),
    seats: z.number(),
    doors: z.number(),
    transmission: z.enum(['Manual', 'Automatic']),
    fuelType: z.enum(['Gasoline', 'Diesel', 'Electric', 'Hybrid']),
    mileage: z.number(),
    carRentalDetails: z.string(),
    carFeaturesAndSpecifications: z.string(),
    carImagesAndDocuments: z.string(),
    rentalAgencyDetails: z.string(),
});

export const carPopulatedSchema = carSchema.extend({
    carRentalDetails: carRentalDetailsSchema,
    carFeaturesAndSpecifications: carFeaturesAndSpecificationsSchema,
    carImagesAndDocuments: carImagesAndDocumentsSchema,
    rentalAgencyDetails: rentalAgencyDetailsSchema,
});