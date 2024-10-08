const mongoose = require("mongoose")

const stateSchema = mongoose.Schema({
    name: { type: String },
    code: { type: String },
    status: { type: String }
})

const stateModel = mongoose.model("state", stateSchema)

module.exports = stateModel
