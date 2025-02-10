import axios from 'axios';
import {
    billRequest,
    generateBillSuccess,
    recordPaymentSuccess,
    getBillingSummarySuccess,
    getPendingBillsSuccess,
    billFailed,
    billError
} from './studentBillSlice';

export const generateMonthlyBill = (billData) => async (dispatch) => {
    dispatch(billRequest());
    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/studentBill/generate`, billData, {
            headers: { 'Content-Type': 'application/json' },
        });
        
        if (result.data.success) {
            dispatch(generateBillSuccess(result.data.data));
        } else {
            dispatch(billFailed(result.data.message));
        }
    } catch (error) {
        dispatch(billError(error.response?.data?.message || 'Failed to generate bill'));
    }
};

export const recordPayment = (billId, paymentData) => async (dispatch) => {
    dispatch(billRequest());
    try {
        const result = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/studentBill/${billId}/payment`,
            paymentData,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        
        if (result.data.success) {
            dispatch(recordPaymentSuccess(result.data.data));
        } else {
            dispatch(billFailed(result.data.message));
        }
    } catch (error) {
        dispatch(billError(error.response?.data?.message || 'Failed to record payment'));
    }
};

export const getBillingSummary = (studentId, dateRange) => async (dispatch) => {
    dispatch(billRequest());
    try {
        let url = `${process.env.REACT_APP_BASE_URL}/studentBill/summary/${studentId}`;
        if (dateRange?.startDate && dateRange?.endDate) {
            url += `?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
        }
        
        const result = await axios.get(url);
        
        if (result.data.success) {
            dispatch(getBillingSummarySuccess(result.data.data));
        } else {
            dispatch(billFailed(result.data.message));
        }
    } catch (error) {
        dispatch(billError(error.response?.data?.message || 'Failed to fetch billing summary'));
    }
};

export const getPendingBills = (studentId) => async (dispatch) => {
    dispatch(billRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/studentBill/pending/${studentId}`);
        
        if (result.data.success) {
            dispatch(getPendingBillsSuccess(result.data.data));
        } else {
            dispatch(billFailed(result.data.message));
        }
    } catch (error) {
        dispatch(billError(error.response?.data?.message || 'Failed to fetch pending bills'));
    }
};