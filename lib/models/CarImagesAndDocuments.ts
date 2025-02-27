import mongoose, { model, Schema } from "mongoose";

export interface ICarImagesAndDocuments extends Document {
    carImages: string[],
    registrationNumber: string,
    insurancePolicyNumber: string,
}

const CarImagesAndDocumentsSchema = new Schema<ICarImagesAndDocuments>({
    carImages: {
        type: [String],
        required: true
    },
    registrationNumber: {
        type: String,
        required: true
    },
    insurancePolicyNumber: {
        type: String,
        required: true
    },
},
    {
        timestamps: true,
    }
);

const CarImagesAndDocuments = mongoose.models?.CarImagesAndDocuments || model<ICarImagesAndDocuments>('CarImagesAndDocuments', CarImagesAndDocumentsSchema);
export default CarImagesAndDocuments;