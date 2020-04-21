const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');


const TripsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        default: "none",
        enum: ["none", "accepted", "rejected", "payed", "awaiting", "expired"],
    },
    drive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Drives",
        default: null
    },
    slug: {
        type: String,
        unique: true
    }
});

TripsSchema.plugin(URLSlugs(`_id`, { update: true }, { unique: true }));
const Trips = mongoose.model("Trips", TripsSchema);

module.exports = Trips;