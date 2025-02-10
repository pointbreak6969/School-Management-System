import axios from 'axios';
import {
    feeStructureRequest,
    feeStructureSuccess,
    getFeeStructureSuccess,
    updateFeeStructureSuccess,
    feeStructureFailed,
    feeStructureError
} from './feeStructureSlice';

export const createFeeStructure = (fields) => async (dispatch) => {
    dispatch(feeStructureRequest());
    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/feeStructure`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        
        if (result.data.success) {
            dispatch(feeStructureSuccess(result.data.data));
        } else {
            dispatch(feeStructureFailed(result.data.message));
        }
    } catch (error) {
        dispatch(feeStructureError(error.response?.data?.message || 'An error occurred'));
    }
};

export const getFeeStructure = (id) => async (dispatch) => {
    dispatch(feeStructureRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/feeStructure/${id}`);
        
        if (result.data.success) {
            dispatch(getFeeStructureSuccess(result.data.data));
        } else {
            dispatch(feeStructureFailed(result.data.message));
        }
    } catch (error) {
        dispatch(feeStructureError(error.response?.data?.message || 'Failed to fetch fee structure'));
    }
};

export const updateFeeStructure = (id, updates) => async (dispatch) => {
    dispatch(feeStructureRequest());
    try {
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/feeStructure/${id}`, updates, {
            headers: { 'Content-Type': 'application/json' },
        });
        
        if (result.data.success) {
            dispatch(updateFeeStructureSuccess(result.data.data));
        } else {
            dispatch(feeStructureFailed(result.data.message));
        }
    } catch (error) {
        dispatch(feeStructureError(error.response?.data?.message || 'Failed to update fee structure'));
    }
};