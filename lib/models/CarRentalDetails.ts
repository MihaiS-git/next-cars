import mongoose, { model, Schema } from "mongoose";

export interface ICarRentalDetails extends Document {
    id?: string;
    rentalPricePerDay: number;
    currency: string;
    availabilityStatus: 'Available' | 'Rented' | 'Under Maintenance';
    carLocation: string;
    minRentalPeriod: number;
    maxRentalPeriod: number;
}

const CarRentalDetailsSchema = new Schema<ICarRentalDetails>({
    rentalPricePerDay: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: ["EUR"],
        required: true
    },
    availabilityStatus: {
        type: String,
        enum: ['Available', 'Rented', 'Under Maintenance'],
        required: true
    },
    carLocation: {
        type: String,
        required: true
    },
    minRentalPeriod: {
        type: Number,
        required: true
    },
    maxRentalPeriod: {
        type: Number,
        required: true
    }
},
    {
        timestamps: true,
    }
);

const CarRentalDetails = mongoose.models?.CarRentalDetails || model<ICarRentalDetails>("CarRentalDetails", CarRentalDetailsSchema);
export default CarRentalDetails;