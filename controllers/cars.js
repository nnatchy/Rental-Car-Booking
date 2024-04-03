//@desc Get all cars
//@route GET /api/v1/cars

const Car = require("../models/Car");

//@access Public
exports.getCars = async (req, res, next) => {
    try {
        const cars = await Car.find();
        res.status(200).json({ success: true, count: car.length, data: cars });
    } catch (err) {
        res.status(400).json({ success: false });
    }
}

//@desc Get single car
//@route Get /api/v1/cars/:id
//@access Public
exports.getCar = async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: car });
    } catch (err) {
        res.status(400).json({ success: false });
    }
}

//@desc Create new car
//@route POST /api/v1/cars
//@access Private
exports.createCar = async (req, res, next) => {
    const car = await Car.create(req.body);
    res.status(201).json({ success: true, data: car });
}

//@desc Update car
//@route PUT /api/v1/cars/:id
//@access Private
exports.updateCar = (req, res, next) => {
    res.status(200).json({ success: true, message: `Update car ${req.params.id}` });
}

//@desc Delete car
//@route DELETE /api/v1/cars/:id
//@access Private
exports.deleteCar = (req, res, next) => {
    res.status(200).json({ success: true, message: `Delete hospital ${req.params.id}` });
}