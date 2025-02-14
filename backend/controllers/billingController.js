const StudentBill = require("../models/studentBill.js");
const ApiError = require('../utils/ApiError.js');
const FeeStructure = require('../models/FeeStructure.js');
const Student = require('../models/studentSchema.js');

const generateMonthlyBill = async (req, res, next) => {
    try {
        const { studentId, month, year } = req.body;

        if (!studentId || month === undefined || !year) {
            return next(new ApiError(400, 'Please provide studentId, month and year'));
        }

        const student = await Student.findById(studentId)
            .populate('sclassName school');

        if (!student) {
            return next(new ApiError(404, 'Student not found'));
        }

        const feeStructure = await FeeStructure.findOne({
            school: student.school,
            className: student.sclassName,
            academicYear: `${year}-${year + 1}`
        });

        if (!feeStructure) {
            return next(new ApiError(404, 'Fee structure not found'));
        }

        const monthlyFees = feeStructure.fees.find(fee => fee.type === 'Monthly');
        if (!monthlyFees) {
            return next(new ApiError(404, 'Monthly fee structure not found'));
        }

        let components = [...monthlyFees.components];

        // Add annual fees in first month
        if (month === 3) {
            const annualFees = feeStructure.fees.find(fee => fee.type === 'Annual');
            if (annualFees) {
                components = [...components, ...annualFees.components];
            }
        }

        // Add quarterly fees
        if ([3, 6, 9, 0].includes(month)) {
            const quarterlyFees = feeStructure.fees.find(fee => fee.type === 'Quarterly');
            if (quarterlyFees) {
                components = [...components, ...quarterlyFees.components];
            }
        }

        const totalAmount = components.reduce((sum, component) => sum + component.amount, 0);

        const bill = await StudentBill.create({
            student: studentId,
            billNumber: `BILL/${year}/${month + 1}/${studentId.toString().substr(-4)}`,
            billDate: new Date(year, month),
            dueDate: new Date(year, month, 10),
            billingPeriod: {
                startDate: new Date(year, month, 1),
                endDate: new Date(year, month + 1, 0)
            },
            billType: 'Monthly',
            feeComponents: components,
            totalAmount,
            balance: totalAmount
        });

        res.status(201).json({
            success: true,
            data: bill
        });
    } catch (error) {
        return next(new ApiError(500, `Failed to generate bill: ${error.message}`));
    }
};
const recordPayment = async (req, res) => {
    try {
        const { billId } = req.params;
        const { amount, paymentMode, transactionId } = req.body;

        const bill = await StudentBill.findById(billId);
        
        if (!bill) {
            throw new ApiError(404, 'Bill not found');
        }

        if (amount > bill.balance) {
            throw new ApiError(400, 'Payment amount exceeds balance');
        }

        bill.paidAmount += amount;
        bill.balance -= amount;
        bill.status = bill.balance === 0 ? 'Paid' : 'Partially Paid';
        
        bill.paymentHistory.push({
            amount,
            paymentDate: new Date(),
            paymentMode,
            transactionId
        });

        await bill.save();

        res.status(200).json({
            success: true,
            data: bill
        });
    } catch (error) {
        throw new ApiError(400, 'Failed to record payment');
    }
};

const getBillingSummary = async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const { startDate, endDate } = req.query;

        if (!studentId) {
            return next(new ApiError(400, 'Student ID is required'));
        }

        let query = { student: studentId };

        // Add date range if provided
        if (startDate && endDate) {
            // Convert dates to start of day and end of day
            const startDateTime = new Date(startDate);
            startDateTime.setHours(0, 0, 0, 0);

            const endDateTime = new Date(endDate);
            endDateTime.setHours(23, 59, 59, 999);

            query.billDate = {
                $gte: startDateTime,
                $lte: endDateTime
            };
        }

        // Fetch bills with populated references if needed
        console.log(query);
        const bills = await StudentBill.find(query)
            .sort({ billDate: -1 });

        if (!bills || bills.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No bills found for the specified period',
                data: []
            });
        }

        res.status(200).json({
            success: true,
            count: bills.length,
            data: bills
        });
    } catch (error) {
        return next(new ApiError(500, `Failed to fetch billing summary: ${error.message}`));
    }
};


const getPendingBills = async (req, res) => {
    try {
        const { studentId } = req.params;

        const bills = await StudentBill.find({
            student: studentId,
            status: { $ne: 'Paid' }
        }).sort({ billDate: 1 });

        res.status(200).json({
            success: true,
            data: bills
        });
    } catch (error) {
        throw new ApiError(400, 'Failed to fetch pending bills');
    }
};

module.exports = {
    generateMonthlyBill,
    recordPayment,
    getBillingSummary,
    getPendingBills
};