// models/FeeType.js
const mongoose = require('mongoose');

const feeTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Monthly', 'Quarterly', 'Annual']
    },
    description: String
}, { timestamps: true });

const FeeType = mongoose.model('FeeType', feeTypeSchema);
module.exports = FeeType;