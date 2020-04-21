const functions = require("../config/functions");
const { validationResult } = require('express-validator');

// Models
const User = require("../models/User");
const Driver = require("../models/Driver");

exports.getUsers = {
    getAll: async(req, res) => {
        const data = await functions.findAll(User);
        if (data === "") throw Error("Error has Occured");
        res.json(data);
    },
    getUser: async(req, res) => {
        const data = await functions.findUserByID(User, req.params.id);
        if (data === "") throw Error("Error has Occured");
        res.json(data);
    },
    updateUser: async(req, res) => {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 401);

        const userData = {
            id: req.body.id,
            email: req.body.email,
            fullName: req.body.fullName,
            interests: req.body.interests,
            gender: req.body.gender
        }

        const data = await functions.updateUser(userData, User);
        res.status(data.status).json(data.message);
    },
    isEmailTaken: async(req, res) => {
        console.log(req.body.email)
        const isEmailTaken = await functions.doesEmailExist(req.params.email, User);
        console.log(isEmailTaken);
        res.json(isEmailTaken);
    },
    updateGoogleUser: async(req, res) => {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 401);

        const userData = {
            email: req.body.email,
            interests: req.body.interests,
            gender: req.body.gender
        }

        const data = await functions.AddAditional(userData, User);
        res.status(data.status).json(data.message);
    },
    insertUser: async(req, res) => {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 401);

        const userData = {
            email: req.body.email,
            password: req.body.password,
            fullName: req.body.fullName,
            interests: req.body.interests,
            gender: req.body.gender
        }

        const data = await functions.insertUser(userData, User);
        res.status(data.status).json(data.message);
    }
};

exports.getDrivers = {
    getAll: async(req, res) => {
        const data = await functions.findAll(Driver);
        if (data === "") throw Error("Error has Occured");
        res.json(data);
    },
    doesDriverExist: async(req, res) => {
        const data = await functions.doesDriverExist(req.params.id, Driver);
        res.json(data);
    },
    insertDriver: async(req, res) => {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 401);

        const userID = await functions.findUserByEmail(req.body.email, User);
        if (userID === null) throw Error({ message: "User not found" });
        const driverData = {
            user: userID,
            postcode: req.body.postcode,
            address: req.body.address,
            phone: req.body.phone
        }

        const data = await functions.insertData(driverData, Driver);
        res.status(data.status).json(data.message);
    },
    updateDriver: async(req, res) => {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 401);

        const userID = await functions.findUserByEmail(req.body.email, User);
        if (userID === null) throw Error({ message: "User not found" });

        const driverData = {
            user: userID,
            postcode: req.body.postcode,
            address: req.body.address,
            phone: req.body.phone
        }

        const data = await functions.updateDriver(driverData, Driver);
        res.status(data.status).json(data.message);
    },
    grabDriver: async(req, res) => {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 401);

        const id = req.params.id;
        const data = await functions.grabDriver(id, Driver);
        res.json(data);
    }
}