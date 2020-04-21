const mongoose = require("mongoose");

const CarsSpecs = new mongoose.Schema({
    numberPlate: {
        type: String,
        required: true,
        unique: true
    },
    fuelConsumption: {
        type: Number,
        required: true,
    }
});

const CarSpecs = mongoose.model("CarsSpecs", CarsSpecs);

module.exports = CarSpecs;