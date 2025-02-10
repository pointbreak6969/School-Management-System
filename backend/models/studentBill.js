const mongoose = require('mongoose');

const studentBillSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    billNumber: {
        type: String,
        required: true,
        unique: true
    },
    billDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    billingPeriod: {
        startDate: Date,
        endDate: Date
    },
    billType: {
        type: String,
        enum: ['Monthly', 'Quarterly', 'Annual'],
        required: true
    },
    feeComponents: [{
        name: String,
        amount: Number
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Unpaid', 'Partially Paid', 'Paid'],
        default: 'Unpaid'
    },
    paymentHistory: [{
        amount: Number,
        paymentDate: Date,
        paymentMode: String,
        transactionId: String
    }]
}, { timestamps: true });

const StudentBill = mongoose.model('StudentBill', studentBillSchema);
module.exports = StudentBill;