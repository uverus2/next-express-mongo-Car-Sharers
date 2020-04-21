const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    interests: {
        type: Array,
        required: true,
        default: []
    },
    gender: {
        type: String,
        required: true,
        default: "None"
    }
});

const User = mongoose.model("User", UserSchema, "Users");

module.exports = User;