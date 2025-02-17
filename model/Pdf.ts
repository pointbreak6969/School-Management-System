import mongoose, {Schema, Document} from "mongoose";

export interface IPdf extends Document {
    email: string; // email of the requestor of the signature
    document: string; // storage reference to the actual PDF
    emails: string[]; // an array of users to sign the document
    xfdf: string[]; // array of signatures
    signedBy: string[]; // array of users who signed the document
    signed: boolean; // boolean to check if the document is signed by all users
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

// const PdfModel = (mongoose.models.Pdf as mongoose.Model<IPdf>) || mongoose.model<IPdf>('Pdf', PdfSchema);
const PdfModel = mongoose.models? (mongoose.models.Pdf as mongoose.Model<IPdf>) : mongoose.model<IPdf>('Pdf', PdfSchema);
export default PdfModel;