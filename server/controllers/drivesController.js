const functions = require("../config/functions");
const { validationResult } = require('express-validator');

// Models
const Drives = require("../models/Drives");
const Trips = require("../models/Trips");
const User = require("../models/User");
const Driver = require("../models/Driver");

exports.drivesGets = {
    getAllDrives: async(req, res) => {
        const data = await functions.findAllDrives(Drives);
        if (data === "") throw Error("Error has Occured");
        res.json(data);
    },
    getDrives: async(req, res) => {
        console.log(req.params.slug);
        const data = await functions.grabDriveBySlug(req.params.slug, Drives);
        if (data === "") throw ({ message: "Error has Occured", status: 404 });
        res.json(data);
    },
    searchDrives: async(req, res) => {

        let locationData = {
            "locationFrom": {
                $regex: req.query.location,
                $options: 'i'
            },
            "locationTo": {
                $regex: req.query.to,
                $options: 'i'
            }
        }

        if (req.query.driveDate) {
            const slitDate = req.query.driveDate.split("/");
            const fromThisDate = new Date(Date.UTC(slitDate[2], slitDate[1] - 1, slitDate[0]));

            if (req.query.time) {
                const time = req.query.time.split(":");
                fromThisDate.setHours(Number(time[0]) + 1);
                fromThisDate.setMinutes(time[1]);
                locationData.fromDate = fromThisDate.toISOString();
            }

            if (!req.query.time) {
                const nextDay = new Date(fromThisDate);
                nextDay.setDate(nextDay.getDate() + 1);
                locationData.fromDate = {
                    $gte: fromThisDate.toISOString(),
                    $lt: nextDay.toISOString()
                }
            }
            console.log(locationData);
        }

        const data = await functions.searchDrives(Drives, locationData);
        console.log(data)
            // if (data === "") throw Error("Error has Occured");
        res.json(data);


    },
    /// YOU NEED NEW DRIVER ROUTE
    getATrip: async(req, res) => {
        // User ID
        const userID = await functions.findUserByEmail(req.body.email, User);
        if (userID === null) throw ({ message: "User not found", status: 404 });

        const data = await functions.grabTrip(userID, Drives);
        if (data === "") throw ({ message: "Error has Occured", status: 404 });
        res.json(data);
    },
    createDrive: async(req, res) => {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 401);

        // Driver ID
        const getDriverId = await functions.findUserByEmail(req.body.email, User);
        if (getDriverId === null) throw ({ message: "User not found", status: 404 });

        const driverID = await functions.grabDriver(getDriverId, Driver);
        if (driverID === null) throw ({ message: "Driver not found", status: 404 });

        const driveData = {
            driver: driverID._id,
            fromDate: req.body.fromDate,
            timeFrom: req.body.time,
            locationFrom: req.body.locationFrom,
            locationTo: req.body.locationTo,
            fromCoordinates: req.body.fromCoordinates,
            toCoordinates: req.body.toCoordinates,
            returnDate: req.body.returnDate,
            distance: req.body.distance,
            price: req.body.price
        };

        const data = await functions.insertData(driveData, Drives);
        res.status(data.status).json(data.message);
    },
    removeAUser: async(req, res) => {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 401);

        // Driver ID
        const getDriverId = await functions.findUserByEmail(req.body.driverEmail, User);
        if (getDriverId === null) throw ({ message: "User not found", status: 404 });

        const driverID = await functions.grabDriver(getDriverId, Driver);
        if (driverID === null) throw ({ message: "Driver not found", status: 404 });

        // User ID
        const userID = await functions.findUserByEmail(req.body.userEmail, User);
        if (userID === null) throw ({ message: "User not found", status: 404 });

        const data = await functions.removeUser(userID, req.body.slug, Drives, Trips);
        res.status(data.status).json(data.message);
    },
    removeDrive: async(req, res) => {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 401);

        const data = await functions.removeDriveBySlug(req.body.slug, Drives);
        res.status(data.status).json(data.message);
    }
};