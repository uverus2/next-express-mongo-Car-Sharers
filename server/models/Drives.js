const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');


const DrivesSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver"
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }],
    locationFrom: {
        type: String,
        required: true,
        trim: true
    },
    locationTo: {
        type: String,
        required: true,
        trim: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    fromCoordinates: {
        type: Array,
        trim: true
    },
    toCoordinates: {
        type: Array,
        trim: true
    },
    returnDate: {
        type: Date
    },
    distance: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },

});

DrivesSchema.plugin(URLSlugs(`locationFrom _id`, { update: true }, { unique: true }));
const Drives = mongoose.model("Drives", DrivesSchema);

module.exports = Drives;