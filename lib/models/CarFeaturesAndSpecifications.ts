import mongoose, { model, Schema } from "mongoose";

export interface ICarFeaturesAndSpecifications extends Document {
    id?: string;
    airConditioning: boolean;
    gps: boolean;
    bluetooth: boolean;
    fuelPolicy: 'Full-to-full' | 'Prepaid';
    insuranceIncluded: boolean;
    additionalFeatures: string[];
}

const CarFeaturesAndSpecificationsSchema = new Schema<ICarFeaturesAndSpecifications>({
    airConditioning: {
        type: Boolean,
        required: false
    },
    gps: {
        type: Boolean,
        required: false
    },
    bluetooth: {
        type: Boolean,
        required: false
    },
    fuelPolicy: {
        type: String,
        enum: ['Full-to-full', 'Prepaid'],
        required: false
    },
    insuranceIncluded: {
        type: Boolean,
        required: false
    },
    additionalFeatures: {
        type: [String],
        required: false
    }
},
    {
        timestamps: true,
    }
);

const CarFeaturesAndSpecifications = mongoose.models?.CarFeaturesAndSpecifications || model<ICarFeaturesAndSpecifications>('CarFeaturesAndSpecifications', CarFeaturesAndSpecificationsSchema);
export default CarFeaturesAndSpecifications;