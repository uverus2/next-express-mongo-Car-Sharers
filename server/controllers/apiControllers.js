const functions = require("../config/functions");
const { validationResult } = require('express-validator');

//Models
const Car = require("../models/Car");
const Fuel = require("../models/Fuel");
const User = require("../models/User");
const Driver = require("../models/Driver");
const CarSpecs = require("../models/CarSpecs");


exports.carGets = {
    getAll: async(req, res) => {
        const data = await functions.findAll(Car);
        if (data === "") throw ({ message: "Error has Occured", status: 404 });
        res.json(data);
    },
    checkNumberPlate: async(req, res) => {
        const data = await functions.isNumberPlateUnique(req.params.plate, Car);
        res.json(data);
    },
    getUserCar: async(req, res) => {
        const data = await functions.grabDriverCar(req.params.id);
        res.json(data);
    },
    getCarByUserEmail: async(req, res) => {
        const getUserId = await functions.findUserByEmail(req.params.email, User);
        if (getUserId === null) throw ({ message: "User not found", status: 404 });

        const ownerID = await functions.grabDriver(getUserId, Driver)
        if (ownerID === null) throw ({ message: "Driver not found", status: 404 });

        const data = await functions.grabDriverCar(ownerID.id);
        res.json(data);
    },
    getAllSpecs: async(req, res) => {
        const data = await functions.findAll(CarSpecs);
        if (data === "") throw ({ message: "Error has Occured", status: 404 });
        res.json(data);
    },
    addCar: async(req, res) => {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 401);

        const getUserId = await functions.findUserByEmail(req.body.email, User);
        if (getUserId === null) throw ({ message: "User not found", status: 404 });

        const ownerID = await functions.grabDriver(getUserId, Driver)
        if (ownerID === null) throw ({ message: "Driver not found", status: 404 });

        const isCarRegistered = await functions.doesUserHaveACar(ownerID);
        if (isCarRegistered) throw ({ message: "User already has a car registered", status: 403 });

        const carConsumption = await functions.addFuelConsumption(req.body.numberPlate, CarSpecs)

        const carData = {
            numberPlate: req.body.numberPlate,
            brand: req.body.brand,
            model: req.body.model,
            year: req.body.year,
            fuelType: req.body.fuelType,
            fuelConsumption: carConsumption,
            owner: ownerID._id,
        }

        const data = await functions.insertData(carData, Car);
        res.status(data.status).json(data.message);
    },
    addCarSpecs: async(req, res) => {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 401);

        const specData = {
            numberPlate: req.body.numberPlate,
            fuelConsumption: req.body.fuelConsumption
        };

        const data = await functions.insertData(specData, CarSpecs);
        res.status(data.status).json(data.message);
    },
    amendCar: async(req, res) => {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 401);

        const getUserId = await functions.findUserByEmail(req.body.email, User);
        if (getUserId === null) throw ({ message: "User not found", status: 404 });

        const ownerID = await functions.grabDriver(getUserId, Driver)
        if (ownerID === null) throw ({ message: "Driver not found", status: 404 });

        const carData = {
            numberPlate: req.body.numberPlate,
            brand: req.body.brand,
            model: req.body.model,
            year: req.body.year,
            fuelType: req.body.fuelType,
        }

        const data = await functions.updateCar(ownerID, carData);
        res.status(data.status).json(data.message);
    }
};


exports.fuelGets = {
    getAll: async(req, res) => {
        const data = await functions.findAll(Fuel);
        if (data === "") throw Error("Error has Occured");
        res.json(data);
    },
    getSpecificFuel: async(req, res) => {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 401);

        const fuelType = req.params.type;
        const data = await functions.duplicateFuelValue(Fuel, fuelType, false);
        if (data === "") throw ({ message: "Error has Occured", status: 404 });

        if (data === null) {
            throw ({ message: "No Results have been found", status: 404 });
        } else {
            res.json(data);
        }

    },
    addFuel: async(req, res) => {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 401);

        const fuelData = {
            type: req.body.type,
            price: req.body.price
        }

        const isItDuplicated = await functions.duplicateFuelValue(Fuel, fuelData.type, true);
        if (isItDuplicated) throw ({ message: "Type value must not be repeated", status: 422 });

        const data = await functions.insertData(fuelData, Fuel);
        res.status(data.status).json(data.message);
    },
};