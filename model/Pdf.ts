import mongoose, {Schema, Document} from "mongoose";

export interface IPdf extends Document {
    email: string;
    document: string;
    emails: string[];
    xfdf: string[];
    signedBy: string[];
    signed: boolean;
}

const PdfSchema: Schema = new Schema({
    email: { type: String, required: true },
    document: { type: String, required: true },
    emails: { type: [String], required: true },
    xfdf: { type: [String], required: true },
    signedBy: { type: [String], required: true },
    signed: { type: Boolean, required: true },
},
{
    timestamps: true,


});

const PdfModel = (mongoose.models.Pdf as mongoose.Model<IPdf>) || mongoose.model<IPdf>('Pdf', PdfSchema);
export default PdfModel;