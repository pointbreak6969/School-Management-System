import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    feeStructures: [],
    currentFeeStructure: null,
    loading: false,
    error: null,
    response: null,
    status: 'idle'
};

const feeStructureSlice = createSlice({
    name: 'feeStructure',
    initialState,
    reducers: {
        feeStructureRequest: (state) => {
            state.loading = true;
            state.status = 'loading';
        },
        feeStructureSuccess: (state, action) => {
            state.loading = false;
            state.feeStructures = [...state.feeStructures, action.payload];
            state.status = 'success';
            state.error = null;
            state.response = null;
        },
        getFeeStructureSuccess: (state, action) => {
            state.loading = false;
            state.currentFeeStructure = action.payload;
            state.status = 'success';
            state.error = null;
            state.response = null;
        },
        updateFeeStructureSuccess: (state, action) => {
            state.loading = false;
            state.currentFeeStructure = action.payload;
            state.feeStructures = state.feeStructures.map(fee => 
                fee._id === action.payload._id ? action.payload : fee
            );
            state.status = 'success';
            state.error = null;
            state.response = null;
        },
        feeStructureFailed: (state, action) => {
            state.loading = false;
            state.status = 'failed';
            state.response = action.payload;
        },
        feeStructureError: (state, action) => {
            state.loading = false;
            state.status = 'error';
            state.error = action.payload;
        }
    }
});

export const {
    feeStructureRequest,
    feeStructureSuccess,
    getFeeStructureSuccess,
    updateFeeStructureSuccess,
    feeStructureFailed,
    feeStructureError
} = feeStructureSlice.actions;

export const feeStructureReducer = feeStructureSlice.reducer;