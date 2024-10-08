const mongoose = require("mongoose");

// Define the city schema
const citySchema = mongoose.Schema({
    name: { type: String, required: true }, // City name
    code: { type: String, required: true }, // City code
    stateName: { type: String, required: true }, // State name (you can also use a reference to state model)
    status: { type: String, required: true } // Status (e.g., active, inactive)
});

// Create the city model
const cityModel = mongoose.model("city", citySchema);

// Export the model
module.exports = cityModel;
