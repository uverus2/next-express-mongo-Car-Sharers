const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');


const CarsSchema = new mongoose.Schema({
    numberPlate: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: String,
        required: true,
        trim: true
    },
    fuelType: {
        type: String,
        required: true,
        trim: true
    },
    fuelConsumption: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
    },
    slug: {
        type: String,
        unique: true
    },

});

CarsSchema.plugin(URLSlugs('numberPlate', { update: true }));
const Car = mongoose.model("Car", CarsSchema);

module.exports = Car;