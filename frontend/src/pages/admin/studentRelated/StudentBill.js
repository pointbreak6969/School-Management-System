import React from 'react';
import { Paper, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { BlueButton } from '../../../components/buttonStyles';

const StudentBillPage = () => {

    // Static student data
    const studentInfo = {
        _id: '1',
        name: 'John Doe',
        rollNum: '1001',
        sclassName: { sclassName: 'Class 1' }
    };

    // Static bill data
    const studentBill = {
        studentId: '1',
        billNumber: 'BILL001',
        billDate: new Date(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        billingPeriod: { startDate: new Date(), endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)) },
        billType: 'Monthly',
        feeComponents: [
            { name: 'Tuition Fee', amount: 5000 },
            { name: 'Lab Fee', amount: 1000 },
            { name: 'Sports Fee', amount: 500 },
        ],
        totalAmount: 6500,
        paidAmount: 2000,
        balance: 4500,
        status: 'Partially Paid',
        paymentHistory: [
            { amount: 1000, paymentDate: new Date(), paymentMode: 'Credit Card', transactionId: 'TXN001' },
            { amount: 1000, paymentDate: new Date(), paymentMode: 'Cash', transactionId: 'TXN002' },
        ],
    };

    return (
        <Box sx={{ padding: 4 }}>
            {/* Student Info */}
            <Paper sx={{ padding: 3, marginBottom: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Student Information
                </Typography>
                <Typography variant="body1">
                    <strong>Name:</strong> {studentInfo.name}
                </Typography>
                <Typography variant="body1">
                    <strong>Roll Number:</strong> {studentInfo.rollNum}
                </Typography>
                <Typography variant="body1">
                    <strong>Class:</strong> {studentInfo.sclassName.sclassName}
                </Typography>
            </Paper>

            {/* Bill Info */}
            <Paper sx={{ padding: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Bill Information
                </Typography>
                <Typography variant="body1">
                    <strong>Bill Number:</strong> {studentBill.billNumber}
                </Typography>
                <Typography variant="body1">
                    <strong>Bill Date:</strong> {new Date(studentBill.billDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">
                    <strong>Due Date:</strong> {new Date(studentBill.dueDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">
                    <strong>Billing Period:</strong> {new Date(studentBill.billingPeriod.startDate).toLocaleDateString()} to {new Date(studentBill.billingPeriod.endDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">
                    <strong>Bill Type:</strong> {studentBill.billType}
                </Typography>

                {/* Fee Components */}
                <Typography variant="h6" gutterBottom>
                    Fee Components
                </Typography>
                <List>
                    {studentBill.feeComponents.map((component, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={`${component.name}: ₹${component.amount}`} />
                        </ListItem>
                    ))}
                </List>

                {/* Total Amount, Paid Amount, Balance */}
                <Typography variant="body1">
                    <strong>Total Amount:</strong> ₹{studentBill.totalAmount}
                </Typography>
                <Typography variant="body1">
                    <strong>Paid Amount:</strong> ₹{studentBill.paidAmount}
                </Typography>
                <Typography variant="body1">
                    <strong>Balance:</strong> ₹{studentBill.balance}
                </Typography>

                {/* Payment History */}
                <Typography variant="h6" gutterBottom>
                    Payment History
                </Typography>
                <List>
                    {studentBill.paymentHistory.length > 0 ? (
                        studentBill.paymentHistory.map((payment, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={`Amount: ₹${payment.amount}, Mode: ${payment.paymentMode}, Date: ${new Date(payment.paymentDate).toLocaleDateString()}`}
                                    secondary={`Transaction ID: ${payment.transactionId}`}
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body1">No payments made yet.</Typography>
                    )}
                </List>

                {/* Bill Status */}
                <Typography variant="body1" sx={{ fontWeight: 'bold', marginTop: 2 }}>
                    Status: {studentBill.status}
                </Typography>

                {/* Generate Payment Button */}
                {studentBill.status !== 'Paid' && (
                    <Box sx={{ marginTop: 2 }}>
                        <BlueButton variant="contained" onClick={() => alert('Payment page (static)')}>
                            Pay Bill
                        </BlueButton>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default StudentBillPage;
