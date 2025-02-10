const FeeStructure = require('../models/FeeStructure.js');
const ApiError = require('../utils/ApiError.js');

const createFeeStructure = async (req, res) =>{
    try {
        const feeStructure = await FeeStructure.create(req.body);
        res.status(201).json({
            success: true,
            data: feeStructure
        });
    } catch (error) {
        
    }
}

const updateFeeStructure = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Find existing fee structure
        const existingFeeStructure = await FeeStructure.findById(id);
        
        if (!existingFeeStructure) {
            throw new ApiError(404, 'Fee structure not found');
        }

        // Handle fee components updates
        if (updates.fees) {
            updates.fees.forEach(updatedFee => {
                const existingFeeIndex = existingFeeStructure.fees.findIndex(
                    fee => fee.type === updatedFee.type
                );

                if (existingFeeIndex !== -1) {
                    // Update existing components or add new ones
                    updatedFee.components.forEach(updatedComponent => {
                        const existingComponentIndex = existingFeeStructure.fees[existingFeeIndex].components.findIndex(
                            comp => comp.name === updatedComponent.name
                        );

                        if (existingComponentIndex !== -1) {
                            // Update existing component
                            existingFeeStructure.fees[existingFeeIndex].components[existingComponentIndex] = {
                                ...existingFeeStructure.fees[existingFeeIndex].components[existingComponentIndex],
                                ...updatedComponent
                            };
                        } else {
                            // Add new component
                            existingFeeStructure.fees[existingFeeIndex].components.push(updatedComponent);
                        }
                    });
                } else {
                    // Add new fee type with components
                    existingFeeStructure.fees.push(updatedFee);
                }
            });
        }

        // Handle other fields
        const allowedUpdates = ['school', 'className', 'academicYear'];
        allowedUpdates.forEach(field => {
            if (updates[field] !== undefined) {
                existingFeeStructure[field] = updates[field];
            }
        });

        // Save the updated document
        const updatedFeeStructure = await existingFeeStructure.save();

        res.status(200).json({
            success: true,
            data: updatedFeeStructure
        });
    } catch (error) {
        throw new ApiError(400, `Failed to update fee structure: ${error.message}`);
    }
};

// Get fee structure by ID
const getFeeStructure = async (req, res) => {
    try {
        const feeStructure = await FeeStructure.findById(req.params.id);
        
        if (!feeStructure) {
            throw new ApiError(404, 'Fee structure not found');
        }

        res.status(200).json({
            success: true,
            data: feeStructure
        });
    } catch (error) {
        throw new ApiError(400, 'Failed to fetch fee structure');
    }
};
module.exports = {
    createFeeStructure,
    updateFeeStructure,
    getFeeStructure
};