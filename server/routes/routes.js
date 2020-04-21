const express = require("express");
const router = express.Router();
const functions = require("../config/functions");
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const passwordValidator = require("password-validator");

// Models 
const User = require("../models/User");

// Controllers
const { getUsers, getDrivers } = require("../controllers/userControlers");
const { reviewGets } = require("../controllers/reviewController");
const { tripGets } = require("../controllers/tripsControllers");
const { drivesGets } = require("../controllers/drivesController");

const passwordValidation = new passwordValidator();
passwordValidation.has().uppercase().has().lowercase().has().digits().has().symbols().has().not().spaces();

// GET Routes
router.get("/user/all", functions.asyncHandler(getUsers.getAll));
router.get("/user/:id", functions.asyncHandler(getUsers.getUser));
router.get("/driver/all", functions.asyncHandler(getDrivers.getAll));
router.get("/drives/all", functions.asyncHandler(drivesGets.getAllDrives));
router.get("/drives/search", functions.asyncHandler(drivesGets.searchDrives));


router.get("/user/emailCheck/:email", [
    check("email").exists().withMessage("Email is required").isEmail().withMessage("Value must be an email")
], functions.asyncHandler(getUsers.isEmailTaken));

router.get("/driver/exists/:id", functions.asyncHandler(getDrivers.doesDriverExist));

router.get("/reviews/driver/:driverEmail", functions.asyncHandler(reviewGets.getAll));

router.get("/drives/driver/:slug", functions.asyncHandler(drivesGets.getDrives));

router.get("/trips/user", [
    check("email").exists().withMessage("Email is required").isEmail().withMessage("Value must be an email"),
], functions.asyncHandler(tripGets.getUserTrips));

router.get("/trips/all", functions.asyncHandler(tripGets.getAllTrips));
router.get("/trips/user/:userID", functions.asyncHandler(tripGets.getUserTrips));
router.get("/trips/oneTrip/:userID&:drivesID", functions.asyncHandler(tripGets.grabOneTrip));



// Works on user ID
router.get("/driver/:id", [
    check("id").exists().withMessage("Value must be given").custom(async data => {
        const validId = mongoose.Types.ObjectId.isValid(data);

        if (validId) {
            return Promise.resolve();
        } else {
            return Promise.reject("Value not valid");
        }
    }).custom(async data => {
        const doesIDExist = await functions.doesIDExist(data, User);
        try {
            if (doesIDExist) {
                return Promise.resolve();
            } else {
                return Promise.reject("User not found");
            }
        } catch (e) {
            console.log(e);
        }
    })
], functions.asyncHandler(getDrivers.grabDriver));

// POST routes
router.post("/user/insert", [
    check("email").exists().withMessage("Email is required").isEmail().withMessage("Value must be an email"),
    check("password").exists().withMessage("Password must be supplied").isLength({ min: 8 }).withMessage("Password must be longer than 8 characters, have an upper character, a low character, a symbol, a number and have no spaces").custom(pass => {
        const isPasswordValid = passwordValidation.validate(pass);
        if (!isPasswordValid) {
            return Promise.reject("Password must contain one upper character, a low character, a symbol, a number and have no spaces");
        } else {
            return Promise.resolve();
        }
    }),
    check("fullName").exists().withMessage("Full Name must be supplied"),
    check("interests").exists().withMessage("Interest must be entered"),
    check("gender").exists().withMessage("Gender must be supplied").isIn(["male", "female", "other"]),
], functions.asyncHandler(getUsers.insertUser));

// Drives
router.post("/trips/awaiting", [
    check("userID").exists(),
    check("drivesID").exists(),
], functions.asyncHandler(tripGets.awaitingUser));

// Drives

router.post("/drive/insert", [
    check("email").exists().withMessage("Email is required").isEmail().withMessage("Value must be an email"),
    check("fromDate").exists().withMessage("From Date is required"),
    check("fromCoordinates").exists().withMessage("From Coordinates is required"),
    check("toCoordinates").exists().withMessage("To Coordinates is required"),
    check("distance").exists().withMessage("Distance is required").isFloat().withMessage("Only numbers allowed"),
    check("price").exists().withMessage("Price is required"),
], functions.asyncHandler(drivesGets.createDrive));

router.post("/reviews/insert", [
    check("driverID").exists().withMessage("ID is required"),
    check("userEmail").exists().withMessage("Email is required").isEmail().withMessage("Value must be an email"),
    check("review").exists().withMessage("Review is required"),
], functions.asyncHandler(reviewGets.insertReviews));

router.post("/driver/insert", [
    check("email").exists().withMessage("Email is required").isEmail().withMessage("Value must be an email"),
    check("address").exists().withMessage("Adress is required"),
    check("postcode").exists().withMessage("Post Code is required"),
    check("phone").exists().withMessage("Phone is required").isInt().withMessage("Value must be a number")
], functions.asyncHandler(getDrivers.insertDriver));

// Delete Routes
router.delete("/reviews/remove", [
    check("email").exists().withMessage("Email is required").isEmail().withMessage("Value must be an email"),
], functions.asyncHandler(reviewGets.removeReview));

router.delete("/drive/remove", [
    check("slug").exists().withMessage("Slug is required"),
], functions.asyncHandler(drivesGets.removeDrive));

router.delete("/trips/remove", [
    check("slug").exists().withMessage("Slug is required"),
], functions.asyncHandler(tripGets.removeTrip));


// Update Routes
router.put("/reviews/update", [
    check("email").exists().withMessage("Email is required").isEmail().withMessage("Value must be an email"),
    check("review").exists().withMessage("Review is required"),
], functions.asyncHandler(reviewGets.updateReview));

router.put("/trips/status/update", [
    check("drivesID").exists(),
    check("status").exists().isIn(["none", "accepted", "rejected", "payed", "awaiting", "expired"]).withMessage('Type must be either a "none", "accepted", "rejected", "payed", "awaiting", "expired"')
], functions.asyncHandler(tripGets.updateTripStatus));

router.put("/trips/status/update/tripID", [
    check("tripID").exists(),
    check("status").exists().isIn(["none", "accepted", "rejected", "payed", "awaiting", "expired"]).withMessage('Type must be either a "none", "accepted", "rejected", "payed", "awaiting", "expired"')
], functions.asyncHandler(tripGets.updateTripById));


router.put("/user/google-update", [
    check("email").exists().withMessage("Email is required").isEmail().withMessage("Value must be an email"),
    check("interests").exists().withMessage("Interest must be entered"),
    check("gender").exists().withMessage("Gender must be supplied").isIn(["male", "female", "other"]),
], functions.asyncHandler(getUsers.updateGoogleUser));

router.put("/drive/addUser", [
    check("userEmail").exists().withMessage("User email is required").isEmail().withMessage("Value must be an email"),
    check("driverEmail").exists().withMessage("Driver email is required").isEmail().withMessage("Value must be an email"),
    check("slug").exists().withMessage("Slug is required"),
], functions.asyncHandler(drivesGets.acceptAUser));

router.put("/drive/removeUser", [
    check("userEmail").exists().withMessage("User email is required").isEmail().withMessage("Value must be an email"),
    check("driverEmail").exists().withMessage("Driver email is required").isEmail().withMessage("Value must be an email"),
], functions.asyncHandler(drivesGets.removeAUser));

router.put("/user/update", [
    check("id").exists().withMessage("Id is required"),
    check("email").exists().withMessage("Email is required").isEmail().withMessage("Value must be an email"),
    check("fullName").exists().withMessage("Full Name must be supplied"),
    check("interests").exists().withMessage("Interest must be entered"),
    check("gender").exists().withMessage("Gender must be supplied").isIn(["male", "female", "other"]),
], functions.asyncHandler(getUsers.updateUser));

router.put("/driver/update", [
    check("email").exists().withMessage("Email is required").isEmail().withMessage("Value must be an email"),
    check("address").exists().withMessage("Adress is required"),
    check("postcode").exists().withMessage("Post Code is required"),
    check("phone").exists().withMessage("Phone is required").isInt().withMessage("Value must be a number")
], functions.asyncHandler(getDrivers.updateDriver));


module.exports = router;