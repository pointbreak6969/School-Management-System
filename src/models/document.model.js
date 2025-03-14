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
  Semail: {
    type: String,
    required: [true, "Please provide a sender's email"],
  },
  Remail: [
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
      }
    },
  ],
  signatures: [{ type: String }],
});
