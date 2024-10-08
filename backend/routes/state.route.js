const express = require('express');
const stateModel = require('../models/state.model'); 
const router = express.Router();

router.post('/addState', async (req, res) => {
    try {
        const { name, code } = req.body;

        const newState = new stateModel({
            name,
            code,
            status: "Inactive"
        });

        await newState.save();

        return res.status(201).json({ message: "State added successfully!", data: newState });
    } catch (error) {
        return res.status(500).json({ message: "Error adding state", error: error.message });
    }
});

router.get('/getState', async (req, res) => {
    try {
        const states = await stateModel.find()
        return res.status(201).json({ data: states });
    } catch (error) {
        return res.status(500).json({ message: "Error adding state", error: error.message });
    }
});

router.delete('/deleteState/:id', async (req, res) => {
    const { id } = req.params; // Get the state ID from the URL parameters
    try {
        const deletedState = await stateModel.findByIdAndDelete(id);

        if (!deletedState) {
            return res.status(404).json({ message: "State not found" });
        }

        return res.status(200).json({ message: "State deleted successfully!", state: deletedState });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting state", error: error.message });
    }
});

router.put('/updateState/:id', async (req, res) => {
    const { id } = req.params; // Get the state ID from the URL parameters
    const { name, code, status } = req.body; // Destructure the request body

    try {
        const updatedState = await stateModel.findByIdAndUpdate(
            id,
            { name, code, status },
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        if (!updatedState) {
            return res.status(404).json({ message: "State not found" });
        }

        return res.status(200).json({ message: "State updated successfully!", state: updatedState });
    } catch (error) {
        return res.status(500).json({ message: "Error updating state", error: error.message });
    }
});

router.put('/updateState/:id', async (req, res) => {
    const { id } = req.params; // Get the state ID from the URL parameters
    const { name, code, status } = req.body; // Destructure the request body
    try {
        const updatedState = await stateModel.findByIdAndUpdate(
            id,
            { name, code, status },
            { new: true, runValidators: true } // Return the updated document and run validators
        );
        if (!updatedState) {
            return res.status(404).json({ message: "State not found" });
        }
        return res.status(200).json({ message: "State updated successfully!", state: updatedState });
    } catch (error) {
        return res.status(500).json({ message: "Error updating state", error: error.message });
    }
});

module.exports = router;
