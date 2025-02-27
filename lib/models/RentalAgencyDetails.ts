import mongoose, { model, Schema } from "mongoose";

export interface IRentalAgencyDetails extends Document {
    agencyName: string;
    contactNumber: string;
}

const RentalAgencyDetailsSchema = new Schema<IRentalAgencyDetails>({
    agencyName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
},
    {
        timestamps: true,
    }
);

const RentalAgencyDetails = mongoose.models?.RentalAgencyDetails || model<IRentalAgencyDetails>('RentalAgencyDetails', RentalAgencyDetailsSchema);
export default RentalAgencyDetails;