// Common Functions
const findAll = (model) => {
    return new Promise((resolve, reject) => {
        model.find({}, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const jsonData = data;
                resolve(jsonData);
            }
        });

    });
};


const insertData = (insertData, model) => {
    return new Promise((resolve, reject) => {
        model.create(insertData, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const resolved = {
                    data,
                    message: "Added Succesfully",
                    status: 201
                };
                resolve(resolved);
            }
        });

    });
};


const errorCheck = (errors, status) => {
    let error = {
        msg: "",
        status: "",
    };
    return new Promise((resolve, reject) => {
        if (!errors.isEmpty()) {
            error.status = status;
            error.message = errors.mapped();
            reject(error);
        } else {
            resolve();
        }
    });
};

const asyncHandler = cb => {
    return async(req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (err) {
            const statusCode = err.status || 503;
            res.status(statusCode).json(err.message);
        }
    }
}

//Fuel API 
const duplicateFuelValue = (model, value, dataFormat) => {
    return new Promise((resolve, reject) => {
        model.findOne({ type: value }, (err, data) => {
            if (err) {
                reject(err)
            }
            if (dataFormat) {
                if (data) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                const jsonData = data;
                resolve(jsonData);
            }
        });
    });
};

// Car API
const Car = require("../models/Car");

const isNumberPlateUnique = (numberPlate, model) => {
    if (typeof model === "undefined") model = Car;
    return new Promise((resolve, reject) => {
        model.findOne({ numberPlate: numberPlate }, (err, data) => {
            if (err) reject(err);
            if (data) resolve(false);
            if (!data) resolve(true);
        });
    });
};

const grabDriverCar = (id) => {
    return new Promise((resolve, reject) => {
        Car.findOne({ owner: id }).exec((err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log(data)
                const jsonData = data;
                resolve(jsonData);
            }
        });
    });
};


const addFuelConsumption = (numberPlate, model) => {
    return new Promise((resolve, reject) => {
        model.findOne({ numberPlate: numberPlate }, (err, data) => {
            if (err) reject(err);
            if (data) resolve(data.fuelConsumption);
            if (!data) resolve(69);
        });
    });
};

const doesUserHaveACar = (ownerID) => {
    return new Promise((resolve, reject) => {
        Car.findOne({ owner: ownerID }, (err, data) => {
            if (err) reject(err);
            if (data) resolve(true);
            if (!data) resolve(false);
        });
    });
};

const updateCar = (ownerID, carData) => {
    return new Promise((resolve, reject) => {
        Car.updateOne({ owner: ownerID }, { $set: carData }, err => {
            if (err) {
                reject({ message: "Unexpected Internal Error", status: 503 });
            } else {
                const resolved = {
                    message: "Updated Succesfully",
                    status: 202
                };
                resolve(resolved);
            }
        });
    });
};

// Users
const findUserByEmail = (email, model) => {
    return new Promise((resolve, reject) => {
        model.findOne({ email: email }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                if (!data) {
                    resolve(null);
                } else {
                    const jsonData = data._id;
                    resolve(jsonData);
                }
            }
        });

    });
};

const findUserByID = (model, id) => {
    return new Promise((resolve, reject) => {
        model.findOne({ _id: id }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                if (!data) {
                    resolve(null);
                } else {
                    const jsonData = data;
                    resolve(jsonData);
                }
            }
        });

    });
};

const AddAditional = (data, model) => {
    return new Promise((resolve, reject) => {
        model.updateOne({ email: data.email }, { gender: data.gender, interests: data.interests }, (err) => {
            if (err) {
                reject({ message: "Unexpected Internal Error", status: 503 });
            } else {
                const resolved = {
                    message: "Updated Succesfully",
                    status: 202
                };
                resolve(resolved);
            }
        });
    });
};


const findUserByEmailGoogle = (email, model) => {
    return new Promise((resolve, reject) => {
        model.findOne({ email: email }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                if (data) {
                    resolve(data);
                } else {
                    resolve(false);
                }
            }
        });

    });
};

const doesIDExist = (id, model) => {
    return new Promise((resolve, reject) => {
        model.findById(id, (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            }

            if (data) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};

const doesEmailExist = (email, model) => {
    return new Promise((resolve, reject) => {
        model.findOne({ email: email }, (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            if (data) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};


const userLogin = (model, email, done) => {
    return new Promise((resolve, reject) => {
        model.findOne({ email: email }, (err, data) => {
            if (err) {
                reject({ message: err, status: 500 });
            } else {
                if (!data) {
                    reject(done(null, false, { message: "That email is not registered" }));
                }
                resolve(data);
            }
        });
    });
};

const bcrypt = require("bcrypt");

const insertUser = (data, model) => {
    return new Promise((resolve, reject) => {
        let errorMessage = {
            errorDetails: {
                msg: "",
                status: 500
            }
        };
        // Hash Password
        //takes in salt characters, err, and our salt
        bcrypt.genSalt(10, (err, salt) => {
            // to hash it add the password and the salt, third param is callback with err param and our hashed password
            bcrypt.hash(data.password, salt, (err, hash) => {
                if (err) {
                    errorMessage.errorDetails.msg = err;
                    reject(errorMessage);
                } else {
                    // set password to hashed
                    data.password = hash;
                    model.create(data, (err) => {
                        if (err) {
                            errorMessage.errorDetails.msg = err;
                            reject(errorMessage);
                        } else {
                            const successMessage = {
                                message: "User Added Succesfully",
                                status: 201
                            };
                            resolve(successMessage);
                        }
                    }); // end of insert
                } // end of else
            }); // end of bcrypt hash
        }); // end of bcrypt
    });
};

const updateUser = (data, model) => {
    return new Promise((resolve, reject) => {
        model.updateOne({ _id: data.id }, { email: data.email, fullName: data.fullName, gender: data.gender, interests: data.interests }, err => {
            if (err) {
                reject({ message: "Unexpected Internal Error", status: 503 });
            } else {
                const resolved = {
                    message: "Updated Succesfully",
                    status: 202
                };
                resolve(resolved);
            }
        });
    });
};

//Reviews

const reviewsForADriver = (driverID, model) => {
    return new Promise((resolve, reject) => {
        model.find({ driver: driverID }).populate({ path: "user", select: ["fullName", "email"] }).exec((err, data) => {
            if (err) {
                reject(err);
            } else {
                const jsonData = data;
                resolve(jsonData);
            }
        });
    });
};

const updateReview = (userID, review, model) => {
    return new Promise((resolve, reject) => {
        model.updateOne({ user: userID }, { review: review }, err => {
            if (err) {
                reject({ message: "Unexpected Internal Error", status: 503 });
            } else {
                const resolved = {
                    message: "Updated Succesfully",
                    status: 202
                };
                resolve(resolved);
            }
        });
    });
};

const removeReviewsForADriver = (userID, model) => {
    return new Promise((resolve, reject) => {
        model.findOneAndRemove({ user: userID }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                if (data === null) {
                    reject({ message: "Review not found", status: 404 });
                } else {
                    const resolved = {
                        message: "Removed Succesfully",
                        status: 202
                    };
                    resolve(resolved);
                }
            }
        });
    });
};

// Driver 
const grabDriver = (id, model) => {
    return new Promise((resolve, reject) => {
        model.findOne({ user: id }).populate({ path: "user", select: ["fullName", "email"] }).exec((err, data) => {
            if (err) {
                reject(err);
            } else {
                const jsonData = data;
                resolve(jsonData);
            }
        });
    });
};

const updateDriver = (data, model) => {
    return new Promise((resolve, reject) => {
        model.updateOne({ user: data.id }, { postcode: data.postcode, address: data.address, phone: data.phone }, err => {
            if (err) {
                reject({ message: "Unexpected Internal Error", status: 503 });
            } else {
                const resolved = {
                    message: "Updated Succesfully",
                    status: 202
                };
                resolve(resolved);
            }
        });
    });
};

const doesDriverExist = (id, model) => {
    return new Promise((resolve, reject) => {
        model.findOne({ user: id }, (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            if (data === null) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};

// Trips
const grabTrip = (id, model) => {
    return new Promise((resolve, reject) => {

        model.find({ user: id }).populate({ path: "drive", populate: { path: "driver", populate: { path: "user", model: "User", select: ["fullName", "email"] } }, select: ["driver", "locationFrom", "locationTo", "fromDate", "returnDate", "distance", "price", "slug"] }).populate().exec((err, data) => {
            if (err) {
                reject(err);
            } else {
                const jsonData = data;
                resolve(jsonData);
            }
        });
    });
};

const grabAllTrip = (model) => {
    return new Promise((resolve, reject) => {
        model.find({}).populate({ path: "drive", populate: { path: "driver", populate: { path: "user", model: "User", select: ["fullName", "email"] } }, select: ["driver", "locationFrom", "locationTo", "fromDate", "returnDate", "distance", "price", "slug"] }).populate().exec((err, data) => {
            if (err) {
                reject(err);
            } else {
                const jsonData = data;
                resolve(jsonData);
            }
        });
    });
};


const userTripDetails = (id, drivesID, model) => {
    return new Promise((resolve, reject) => {
        model.find({ user: id, drive: drivesID }).populate({ path: "user", select: ["fullName", "email"] }).populate({ path: "drive", select: ["driver"] }).exec((err, data) => {
            if (err) {
                reject(err);
            } else {
                const jsonData = data;
                resolve(jsonData);
            }
        });
    });
};

const userStatus = (driveID, status, model) => {
    return new Promise(async(resolve, reject) => {
        model.updateOne({ drive: driveID }, { $set: { status: status } }, (err) => {
            if (err) {
                reject({ message: "Unexpected Internal Error", status: 503 });
            } else {
                const resolved = {
                    message: "Updated Succesfully",
                    status: 202
                };
                resolve(resolved);
            }
        })
    })
};

const userStatusID = (id, status, model) => {
    return new Promise(async(resolve, reject) => {
        model.updateOne({ _id: id }, { $set: { status: status } }, (err) => {
            if (err) {
                reject({ message: "Unexpected Internal Error", status: 503 });
            } else {
                const resolved = {
                    message: "Updated Succesfully",
                    status: 202
                };
                resolve(resolved);
            }
        })
    })
};


const changeStatus = async(model) => {
    try {
        const statusData = await model.find({}).populate({ path: "drive", select: ["fromDate"] }).exec();
        if (statusData.length > 0) {
            const todayDate = new Date();
            statusData.map(async i => {
                const tripDate = new Date(i.drive.fromDate);
                // console.log(todayDate);
                // console.log(i);
                // console.log(todayDate > tripDate);
                if (todayDate > tripDate) {
                    await userStatus(i.drive._id, "expired", model);
                    console.log("expired");
                } else {
                    return;
                }
            });
        }
    } catch (e) {
        console.log(e)
    }
};


const deleteUserTrips = (userID, model) => {
    return new Promise((resolve, reject) => {
        model.deleteOne({ user: userID }, err => {
            if (err) {
                reject({ message: "Unexpected Internal Error", status: 503 });
            } else {
                const resolved = {
                    message: "Trip Data deleted",
                };
                resolve(resolved);
            }
        });
    });
}

const removeTrip = (userID, driveID, model) => {
    return new Promise(async(resolve, reject) => {

        model.findOneAndUpdate({ user: userID }, { $pull: { drive: driveID } }, (err, data) => {
            if (err) {
                reject({ message: "Unexpected Internal Error", status: 503 });
            } else {
                if (data.drive.length <= 0) deleteUserTrips(userID, model);
                const resolved = {
                    message: "Removed Succesfully",
                    status: 202
                };
                resolve(resolved);
            }
        });
    });
}


const removeUserFromDrive = (driveID, userID, model) => {
    return new Promise((resolve, reject) => {
        model.findOneAndUpdate({ _id: driveID }, { $pull: { users: userID } }, async(err) => {
            if (err) {
                reject(err);
            } else {
                const resolved = {
                    message: "Removed Succesfully",
                    status: 202
                };
                resolve(resolved);
            }
        })
    });
};

const removeTripBySlug = (slug, model, model2) => {
    return new Promise((resolve, reject) => {
        model.findOneAndRemove({ slug: slug }, async(err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log(data)
                if (data === null) {
                    reject({ message: "Drive not found", status: 404 });
                } else {
                    try {
                        await removeUserFromDrive(data.drive[0], data.user, model2)

                        const resolved = {
                            message: "Removed Succesfully",
                            status: 202
                        };
                        resolve(resolved);
                    } catch (e) {
                        reject(e)
                    }
                }
            }
        });
    });
};

// Drives 

const findAllDrives = (model) => {
    return new Promise((resolve, reject) => {
        model.find({}).populate({ path: "driver", model: "Driver" }).populate({ path: "driver", populate: { path: "user", model: "User", select: ["fullName", "email"] } }).sort({ _id: -1 }).exec((err, data) => {
            if (err) {
                reject(err);
            } else {
                const jsonData = data;
                resolve(jsonData);
            }
        });

    });
};


const searchDrives = (model, data) => {
    return new Promise((resolve, reject) => {
        model.find(data).populate({ path: "driver", model: "Driver" }).populate({ path: "driver", populate: { path: "user", model: "User", select: ["fullName", "email", "gender", "interests"] } }).exec((err, data) => {
            if (err) {
                reject(err);
            } else {
                const jsonData = data;
                resolve(jsonData);
            }
        })

    })
}

const grabDriveBySlug = (slug, model) => {
    return new Promise((resolve, reject) => {
        model.findOne({ slug: slug }).populate({ path: "users", select: ["fullName", "email"] }).populate({ path: "driver", model: "Driver" }).populate({ path: "driver", populate: { path: "user", model: "User", select: ["fullName", "email", "gender", "interests"] } }).exec((err, data) => {
            if (err) {
                reject(err);
            } else {
                const jsonData = data;
                resolve(jsonData);
            }
        });
    });
};

const grabDrive = (id, model) => {
    return new Promise((resolve, reject) => {
        model.find({ driver: id }).populate({ path: "users", select: ["fullName", "email"] }).populate({ path: "driver", model: "Driver" }).exec((err, data) => {
            if (err) {
                reject(err);
            } else {
                const jsonData = data;
                resolve(jsonData);
            }
        });
    });
};


const isUserPartOfDrive = (driveID, userID, model) => {
    return new Promise((resolve, reject) => {
        model.findOne({ _id: driveID, users: userID }, (err, data) => {
            if (err) {
                reject({ message: "Unexpected Internal Error", status: 503 });
            } else {
                console.log(data);
                if (data) {
                    resolve(true)
                }
                resolve(false);
            }
        });
    });
}

const acceptAwaitingUser = (userID, drivesID, model, model2) => {
    return new Promise(async(resolve, reject) => {
        // Check if user is already in the drive
        try {
            const checkIfUserExists = await isUserPartOfDrive(drivesID, userID, model);
            console.log(checkIfUserExists)
            if (checkIfUserExists) return reject({ message: "User is already part of this drive", status: 400 });
            model.findOneAndUpdate({ _id: drivesID }, { $push: { users: userID } }).exec(async(err, data) => {
                if (err) {
                    reject({ message: "Unexpected Internal Error", status: 503 });
                } else {
                    try {
                        await insertData({ user: userID, drive: drivesID, status: "awaiting" }, model2);
                        const resolved = {
                            message: "Added Succesfully",
                            status: 202
                        };
                        resolve(resolved);
                    } catch (e) {
                        reject(e)
                    }
                }
            })
        } catch (e) {
            reject(e)
        }
    })
}

const removeUser = (userID, slug, model, model2) => {
    return new Promise((resolve, reject) => {
        model.findOneAndUpdate({ slug: slug }, { $pull: { users: userID } }, async(err, data) => {
            if (err) {
                reject({ message: "Unexpected Internal Error", status: 503 });
            } else {
                try {
                    await removeTrip(userID, data._id, model2);
                    const resolved = {
                        message: "Removed Succesfully",
                        status: 202
                    };
                    resolve(resolved);
                } catch (e) {
                    reject(e)
                }
            }
        })
    })
}

const removeDriveBySlug = (slugValue, model) => {
    return new Promise((resolve, reject) => {
        model.findOneAndRemove({ slug: slugValue }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log(data)
                if (data === null) {
                    reject({ message: "Drive not found", status: 404 });
                } else {
                    const resolved = {
                        message: "Removed Succesfully",
                        status: 202
                    };
                    resolve(resolved);
                }
            }
        });
    });
};

// Validation
const dateValidation = (date) => {
    if (date.toString().substring(0, 2) > 31) {
        return Promise.reject("Day must be lower than 31");
    }
    if (date.toString().substring(2, 4) > 12) {
        return Promise.reject("The year has only 12 months therefore number cannot be larger than 12");
    }
    if (date.toString().substring(4, 7) >= new Date().getFullYear()) {
        return Promise.reject("Date provided must be in the future");
    }
    return Promise.resolve();
}

const timeValidation = (time) => {
    if (time.toString().substring(0, 2) > 23) {
        return Promise.reject("Day hour cannot be more than 23");
    }
    if (time.toString().substring(2, 4) > 59) {
        return Promise.reject("Minutes cannot be more than 59");
    }
    return Promise.resolve();
}

module.exports = {
    asyncHandler,
    findAll,
    changeStatus,
    userStatus,
    userStatusID,
    findAllDrives,
    acceptAwaitingUser,
    AddAditional,
    userTripDetails,
    findUserByID,
    grabDriveBySlug,
    searchDrives,
    updateDriver,
    errorCheck,
    duplicateFuelValue,
    isNumberPlateUnique,
    insertData,
    userLogin,
    updateCar,
    findUserByEmail,
    grabDriver,
    doesDriverExist,
    grabDriverCar,
    doesUserHaveACar,
    doesIDExist,
    addFuelConsumption,
    reviewsForADriver,
    removeReviewsForADriver,
    updateReview,
    updateUser,
    grabTrip,
    grabAllTrip,
    grabDrive,
    removeUser,
    findUserByEmailGoogle,
    insertUser,
    removeDriveBySlug,
    removeTripBySlug,
    dateValidation,
    timeValidation,
    doesEmailExist
}