const express = require("express");
const apiRoutes = express.Router();
const functions = require("../config/functions");
const { carGets, fuelGets } = require("../controllers/apiControllers");
const { check, validationResult } = require('express-validator');

apiRoutes.get("/fuel", functions.asyncHandler(fuelGets.getAll));

apiRoutes.get("/fuel/:type", [check("type").exists().withMessage("Fuel type must be supplied").isAlpha().withMessage("Fuel type should be letters only")], functions.asyncHandler(fuelGets.getSpecificFuel));

apiRoutes.get("/cars", functions.asyncHandler(carGets.getAll));

apiRoutes.get("/cars/driver/:id", functions.asyncHandler(carGets.getUserCar));

apiRoutes.get("/cars/driver/email/:email", functions.asyncHandler(carGets.getCarByUserEmail));

apiRoutes.get("/cars-specs", functions.asyncHandler(carGets.getAllSpecs));

apiRoutes.get("/car/numberPlate/:plate", functions.asyncHandler(carGets.checkNumberPlate));

apiRoutes.post("/cars-specs/insert", [
    check("numberPlate").exists().withMessage("Number Plate is required").isLength({ min: 7, max: 7 }).withMessage("Number plate must be exactly 7 characters").custom(async data => {
        try {
            const CarSpecs = require("../models/CarSpecs");

            const doesNumberPlateExist = await functions.isNumberPlateUnique(data, CarSpecs);
            if (doesNumberPlateExist) {
                return Promise.resolve();
            } else {
                return Promise.reject("Number plate is already registered");
            }
        } catch (e) {
            console.log(e)
        }
    }),
    check("fuelConsumption").exists().withMessage("Fuel Consumption must be supplied").isInt().withMessage('Fuel Consumption must be a number').isLength({ min: 0, max: 2 }).withMessage("Number must only be between 2 characters long. It must be a positive number as well")

], functions.asyncHandler(carGets.addCarSpecs));

apiRoutes.post("/fuel/insert", [
    check("type").exists().withMessage("Fuel type must be supplied").isAlpha().withMessage("Fuel type should be letters only"),
    check("price").exists().withMessage("Price must be supplied").isInt().withMessage('Price must be a number').isLength({ min: 0 }).withMessage("It must be a positive number")
], functions.asyncHandler(fuelGets.addFuel));

apiRoutes.post("/car/insert", [
    check("email").exists().withMessage("Email is required").isEmail().withMessage("Value must be an email"),
    check("numberPlate").exists().withMessage("Number Plate is required").isLength({ min: 7, max: 7 }).withMessage("Number plate must be exactly 7 characters").custom(async data => {
        try {
            const doesNumberPlateExist = await functions.isNumberPlateUnique(data);
            if (doesNumberPlateExist) {
                return Promise.resolve();
            } else {
                return Promise.reject("Number plate is already registered");
            }
        } catch (e) {
            console.log(e)
        }
    }),
    check("brand").exists().withMessage("Brand is required").isAlpha().withMessage("Only letters allowed"),
    check("model").exists().withMessage("Model is required").isAlpha().withMessage("Only letters allowed"),
    check("year").exists().withMessage("Year is required").isInt().withMessage("Only numbers allowed"),
    check("fuelType").exists().withMessage("Fuel Type is required").isAlpha().withMessage("Only letters allowed").isIn(["petrol", "diesel"]).withMessage("Must be either petrol or diesel")
], functions.asyncHandler(carGets.addCar));


apiRoutes.put("/car/update", [
    check("email").exists().withMessage("Email is required").isEmail().withMessage("Value must be an email"),
    check("numberPlate").exists().withMessage("Number Plate is required").isLength({ min: 7, max: 7 }).withMessage("Number plate must be exactly 7 characters"),
    check("brand").exists().withMessage("Brand is required").isAlpha().withMessage("Only letters allowed"),
    check("model").exists().withMessage("Model is required").isAlpha().withMessage("Only letters allowed"),
    check("year").exists().withMessage("Year is required").isInt().withMessage("Only numbers allowed"),
    check("fuelType").exists().withMessage("Fuel Type is required").isAlpha().withMessage("Only letters allowed").isIn(["petrol", "diesel"]).withMessage("Must be either petrol or diesel")

], functions.asyncHandler(carGets.amendCar));



module.exports = apiRoutes;