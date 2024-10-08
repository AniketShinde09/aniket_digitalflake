const express = require('express');
const cityModel = require('../models/city.model'); // Adjust the path based on your file structure
const router = express.Router();

// Route to add a new city
router.post('/addCity', async (req, res) => {
    try {
        const { name, code, stateName } = req.body;

        const newCity = new cityModel({
            name,
            code,
            stateName,
            status: "Inactive" // Default status
        });

        await newCity.save();

        return res.status(201).json({ message: "City added successfully!", data: newCity });
    } catch (error) {
        return res.status(500).json({ message: "Error adding city", error: error.message });
    }
});

// Route to get all cities
router.get('/getCity', async (req, res) => {
    try {
        const cities = await cityModel.find();
        return res.status(200).json({ data: cities });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching cities", error: error.message });
    }
});

// Route to delete a city by ID
router.delete('/deleteCity/:id', async (req, res) => {
    const { id } = req.params; // Get the city ID from the URL parameters
    try {
        const deletedCity = await cityModel.findByIdAndDelete(id);

        if (!deletedCity) {
            return res.status(404).json({ message: "City not found" });
        }

        return res.status(200).json({ message: "City deleted successfully!", city: deletedCity });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting city", error: error.message });
    }
});

// Route to update a city by ID
router.put('/updateCity/:id', async (req, res) => {
    const { id } = req.params; // Get the city ID from the URL parameters
    const { name, code, stateName, status } = req.body; // Destructure the request body

    try {
        const updatedCity = await cityModel.findByIdAndUpdate(
            id,
            { name, code, stateName, status },
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        if (!updatedCity) {
            return res.status(404).json({ message: "City not found" });
        }

        return res.status(200).json({ message: "City updated successfully!", city: updatedCity });
    } catch (error) {
        return res.status(500).json({ message: "Error updating city", error: error.message });
    }
});

module.exports = router;
