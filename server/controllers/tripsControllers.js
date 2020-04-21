const functions = require("../config/functions");
const { validationResult } = require('express-validator');

// Models
const Trips = require("../models/Trips");
const User = require("../models/User");
const Drives = require("../models/Drives");

exports.tripGets = {
    getAllTrips: async(req, res) => {
        const data = await functions.grabAllTrip(Trips);
        res.json(data);
    },
    getUserTrips: async(req, res) => {
        const data = await functions.grabTrip(req.params.userID, Trips);
        if (data === "") throw ({ message: "Error has Occured", status: 404 });
        res.json(data);
    },
    grabOneTrip: async(req, res) => {
        const data = await functions.userTripDetails(req.params.userID, req.params.drivesID, Trips);
        res.json(data);
    },
    removeTrip: async(req, res) => {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 401);

        const data = await functions.removeTripBySlug(req.body.slug, Trips, Drives);
        res.status(data.status).json(data.message);
    },
    updateTripStatus: async(req, res) => {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 401);

        const updatedStatus = await functions.userStatus(req.body.drivesID, req.body.status, Trips)
        res.status(updatedStatus.status).json(updatedStatus.message);
    },
    updateTripById: async(req, res) => {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 401);

        const updatedStatus = await functions.userStatusID(req.body.tripID, req.body.status, Trips)
        res.status(updatedStatus.status).json(updatedStatus.message);
    },
    awaitingUser: async(req, res) => {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 401);

        const insertTrip = await functions.acceptAwaitingUser(req.body.userID, req.body.drivesID, Drives, Trips)
        res.status(insertTrip.status).json(insertTrip.message);
    }
};