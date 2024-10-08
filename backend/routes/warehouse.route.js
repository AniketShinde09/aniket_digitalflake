const express = require('express');
const warehouseModel = require('../models/warehouse.model'); // Adjust the path based on your file structure
const router = express.Router();

// Route to add a new warehouse
router.post('/addWarehouse', async (req, res) => {
    try {
        const { name, state, city } = req.body; // Destructure request body

        const newWarehouse = new warehouseModel({
            name,
            state,
            city,
            status: "Inactive" // Default status
        });

        await newWarehouse.save();

        return res.status(201).json({ message: "Warehouse added successfully!", data: newWarehouse });
    } catch (error) {
        return res.status(500).json({ message: "Error adding warehouse", error: error.message });
    }
});

// Route to get all warehouses
router.get('/getWarehouse', async (req, res) => {
    try {
        const warehouses = await warehouseModel.find();
        return res.status(200).json({ data: warehouses });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching warehouses", error: error.message });
    }
});

// Route to delete a warehouse by ID
router.delete('/deleteWarehouse/:id', async (req, res) => {
    const { id } = req.params; // Get the warehouse ID from the URL parameters
    try {
        const deletedWarehouse = await warehouseModel.findByIdAndDelete(id);

        if (!deletedWarehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        return res.status(200).json({ message: "Warehouse deleted successfully!", warehouse: deletedWarehouse });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting warehouse", error: error.message });
    }
});

// Route to update a warehouse by ID
router.put('/updateWarehouse/:id', async (req, res) => {
    const { id } = req.params; // Get the warehouse ID from the URL parameters
    const { name, state, city, status } = req.body; // Destructure the request body

    try {
        const updatedWarehouse = await warehouseModel.findByIdAndUpdate(
            id,
            { name, state, city, status },
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        if (!updatedWarehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        return res.status(200).json({ message: "Warehouse updated successfully!", warehouse: updatedWarehouse });
    } catch (error) {
        return res.status(500).json({ message: "Error updating warehouse", error: error.message });
    }
});

module.exports = router;
