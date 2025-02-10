import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    bills: [],
    currentBill: null,
    pendingBills: [],
    billingSummary: [],
    loading: false,
    error: null,
    response: null,
    status: 'idle'
};

const studentBillSlice = createSlice({
    name: 'studentBill',
    initialState,
    reducers: {
        billRequest: (state) => {
            state.loading = true;
            state.status = 'loading';
        },
        generateBillSuccess: (state, action) => {
            state.loading = false;
            state.bills = [...state.bills, action.payload];
            state.currentBill = action.payload;
            state.status = 'success';
            state.error = null;
            state.response = null;
        },
        recordPaymentSuccess: (state, action) => {
            state.loading = false;
            state.currentBill = action.payload;
            state.bills = state.bills.map(bill => 
                bill._id === action.payload._id ? action.payload : bill
            );
            state.pendingBills = state.pendingBills.filter(bill => 
                bill._id !== action.payload._id || action.payload.status !== 'Paid'
            );
            state.status = 'success';
            state.error = null;
            state.response = null;
        },
        getBillingSummarySuccess: (state, action) => {
            state.loading = false;
            state.billingSummary = action.payload;
            state.status = 'success';
            state.error = null;
            state.response = null;
        },
        getPendingBillsSuccess: (state, action) => {
            state.loading = false;
            state.pendingBills = action.payload;
            state.status = 'success';
            state.error = null;
            state.response = null;
        },
        billFailed: (state, action) => {
            state.loading = false;
            state.status = 'failed';
            state.response = action.payload;
        },
        billError: (state, action) => {
            state.loading = false;
            state.status = 'error';
            state.error = action.payload;
        }
    }
});

export const {
    billRequest,
    generateBillSuccess,
    recordPaymentSuccess,
    getBillingSummarySuccess,
    getPendingBillsSuccess,
    billFailed,
    billError
} = studentBillSlice.actions;

export const studentBillReducer = studentBillSlice.reducer;