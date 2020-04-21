const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    postcode: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
});

const Driver = mongoose.model("Driver", DriverSchema);

module.exports = Driver;