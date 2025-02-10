const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    className: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },
    fees: [{
        type: {
            type: String,
            required: true,
            enum: ['Monthly', 'Quarterly', 'Annual']
        },
        components: [{
            name: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        }]
    }]
}, { timestamps: true });

const FeeStructure = mongoose.model('FeeStructure', feeStructureSchema);
module.exports = FeeStructure;
