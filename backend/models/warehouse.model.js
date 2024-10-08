const mongoose = require("mongoose");

// Define the warehouse schema
const warehouseSchema = mongoose.Schema({
    name: { type: String, required: true }, // Warehouse name
    state: { type: String, required: true }, // State where the warehouse is located
    city: { type: String, required: true }, // City where the warehouse is located
    status: { type: String, required: true } // Status (e.g., active, inactive)
});

// Create the warehouse model
const warehouseModel = mongoose.model("Warehouse", warehouseSchema);

// Export the model
module.exports = warehouseModel;
