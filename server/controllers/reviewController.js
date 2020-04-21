const functions = require("../config/functions");
const { validationResult } = require('express-validator');

// Models
const Review = require("../models/Reviews");
const User = require("../models/User");
const Driver = require("../models/Driver");

exports.reviewGets = {
    getAll: async(req, res) => {

        const getDriverId = await functions.findUserByEmail(req.params.driverEmail, User);
        if (getDriverId === null) throw ({ message: "User not found", status: 404 });

        const driverID = await functions.grabDriver(getDriverId, Driver);
        if (driverID === null) throw ({ message: "Driver not found", status: 404 });

        const data = await functions.reviewsForADriver(driverID, Review);
        res.json(data);
    },
    insertReviews: async(req, res) => {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 401);

        const userID = await functions.findUserByEmail(req.body.userEmail, User);
        if (userID === null) throw ({ message: "User not found", status: 404 });

        const reviewData = {
            driver: req.body.driverID,
            user: userID._id,
            review: req.body.review
        }

        const data = await functions.insertData(reviewData, Review);
        res.status(data.status).json(data.message);
    },
    removeReview: async(req, res) => {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 401);

        const userID = await functions.findUserByEmail(req.body.email, User);
        if (userID === null) throw ({ message: "User not found", status: 404 });

        const data = await functions.removeReviewsForADriver(userID._id, Review);
        res.status(data.status).json(data.message);
    },
    updateReview: async(req, res) => {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 401);

        const getUserId = await functions.findUserByEmail(req.body.email, User);
        if (getUserId === null) throw ({ message: "User not found", status: 404 });

        const reviewData = req.body.review;

        const data = await functions.updateReview(getUserId, reviewData, Review);
        res.status(data.status).json(data.message);
    }
};