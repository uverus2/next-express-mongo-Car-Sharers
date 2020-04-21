const mongoose = require('mongoose');


const ReviewSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    review: {
        type: String,
        required: true
    }
});

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;