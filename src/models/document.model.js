import mongoose, { Schema } from "mongoose";

const DocumentSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  documentRef: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: [true, "Please provide a sender's email"],
  },
  recievers: [
    {
      type: String,
      required: [true, "Please provide a receiver email"],
    },
  ],
  status: {
    type: String,
    default: "pending",
  },
  signedBy: [
    {
      type: String,
    },
  ],
  signedTime: [
    {
      type: Date,
    },
  ],
  signatureField: [
    {
      x: {
        type: Number,
        required: [true, "Please provide a x coordinate"],
      },
      y: {
        type: Number,
        required: [true, "Please provide a y coordinate"],
      },
      height: {
        type: Number,
        required: [true, "Please provide a height"],
      },
      width: {
        type: Number,
        required: [true, "Please provide a width"],
      },
      pageNo: {
        type: Number,
        required: [true, "Please provide a page number"],
      },
    },
  ],
  signatures: [{ type: String }],
});
// Pre-save middleware to check signing status
DocumentSchema.pre('save', function(next) {
  // Skip this middleware if signedBy is not modified
  if (!this.isModified('signedBy') && this.status !== 'pending') {
    return next();
  }

  // Check if document has receivers
  if (!this.recievers || this.recievers.length === 0) {
    return next();
  }

  // Check if signedBy array exists and has values
  if (!this.signedBy) {
    this.signedBy = [];
  }

  // Create sets for easier comparison (removes duplicates)
  const receiversSet = new Set(this.recievers);
  const signedBySet = new Set(this.signedBy);
  
  // Check if all receivers have signed
  let allSigned = true;
  
  // Check if every receiver has signed
  for (const receiver of receiversSet) {
    if (!signedBySet.has(receiver)) {
      allSigned = false;
      break;
    }
  }

  // Update status based on signing status
  this.status = allSigned ? 'completed' : 'pending';
  
  next();
});
// Add method to check if document is fully signed
DocumentSchema.methods.isFullySigned = function() {
  if (!this.recievers || !this.signedBy) return false;
  
  const receiversSet = new Set(this.recievers);
  const signedBySet = new Set(this.signedBy);
  
  // If signers count is less than receivers, it's not fully signed
  if (signedBySet.size < receiversSet.size) return false;
  
  // Check if every receiver has signed
  for (const receiver of receiversSet) {
    if (!signedBySet.has(receiver)) {
      return false;
    }
  }
  
  return true;
};

const Document =
  mongoose.models.Document || mongoose.model("Document", DocumentSchema);
export default Document;
