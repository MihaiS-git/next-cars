import mongoose, { model } from 'mongoose';

import { ICarRentalDetails } from '@/lib/models/CarRentalDetails';
import { ICarFeaturesAndSpecifications } from '@/lib/models/CarFeaturesAndSpecifications';
import { ICarImagesAndDocuments } from '@/lib/models/CarImagesAndDocuments';
import { IRentalAgencyDetails } from '@/lib/models/RentalAgencyDetails';
import { Schema } from 'mongoose';

export interface ICar extends Document {
    make: string;
    model: string;
    year: number;
    category: 'Classic' | 'Sport' | 'Sedan' | 'SUV';
    seats: number;
    doors: number;
    transmission: 'Manual' | 'Automatic';
    fuelType: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid';
    mileage: number;
    carRentalDetails: ICarRentalDetails;
    carFeaturesAndSpecifications: ICarFeaturesAndSpecifications;
    carImagesAndDocuments: ICarImagesAndDocuments;
    rentalAgencyDetails: IRentalAgencyDetails;
}

const CarSchema = new Schema<ICar>({
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['Classic', 'Sport', 'Sedan', 'SUV'],
        required: true
    },
    seats: {
        type: Number,
        required: true
    },
    doors: {
        type: Number,
        required: true
    },
    transmission: {
        type: String,
        enum: ['Manual', 'Automatic'],
        required: true
    },
    fuelType: {
        type: String,
        enum: ['Gasoline', 'Diesel', 'Electric', 'Hybrid'],
        required: true
    },
    mileage: {
        type: Number,
        required: true
    },
    carRentalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CarRentalDetails',
        required: true

    },
    carFeaturesAndSpecifications: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carFeaturesAndSpecifications',
        required: true
    },
    carImagesAndDocuments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CarImagesAndDocuments',
        required: true
    },
    rentalAgencyDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RentalAgencyDetails',
        required: true
    }
},
    {
        timestamps: true,
    }
);

const Car = mongoose.models?.Car || model<ICar>('Car', CarSchema);
export default Car;