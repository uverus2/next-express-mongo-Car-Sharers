const mongoose = require('mongoose');


const FuelSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    }
});

const Fuel = mongoose.model("Fuel", FuelSchema);

module.exports = Fuel;