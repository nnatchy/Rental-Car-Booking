const { query } = require("express");
const Car = require("../models/Car");

//@desc Get all cars
//@route GET /api/v1/cars
//@access Public
exports.getCars = async (req, res, next) => {
    // let query;
        
    // //copy req.query
    // const reqQuery = [...req.query];

    // //Fields to exclude
    // const removeFields = ['select','sort','page','limit'];

    // //Loop over remove fields and delete them from reqQuery
    // removeFields.forEach(params => delete reqQuery[param]);
    // console.log(reqQuery);

    // let queryStr = JSON.stringify(req.query);
    // queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // //Select Fields
    // if (req.query.select) {
    //     const fields = req.query.select.split(',').join(' ');
    //     query = query.select(fields);
    // }

    // //Sort Fields
    // if (req.query.sort) {
    //     const sortBy = req.query.sort.split(',').join(' ');
    //     query = query.sort(sortBy);
    // } else {
    //     query = query.sort('name');
    // }

    // //Pagination
    // const page = parseInt(req.query.page,10) || 1;
    // const limit = parseInt(req.query.limit,10) || 25
    // const startIndex = (page-1)*limit;
    // const endIndex = page*limit;

    try {
        const cars = await Car.find(req.query);
        console.log(req.query);
        res.status(200).json({ success: true, 
            count: cars.length, 
            data: cars });
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

        res.status(200).json({ 
            success: true, 
            data: car,
        });
    } catch (err) {
        res.status(400).json({ success: false });
    }
}

//@desc Create new car
//@route POST /api/v1/cars
//@access Private
exports.createCar = async (req, res, next) => {
    try {
        const car = await Car.create(req.body);
        res.status(201).json({ 
            success: true, 
            data: car 
        });
    } catch(err) {
        res.status(400).json({success: false});
    }
}

//@desc Update car
//@route PUT /api/v1/cars/:id
//@access Private
exports.updateCar = async (req, res, next) => {
    try {
        const car = await Car.findByIdAndUpdate(req.params.id,req.body, {
            new: true,
            runValidators: true
        });

        if (!hospital) {
            return res.status(400).json({success: false});
        }

        res.status(200).json({
            success: true, 
            data: car
        })
    } catch (err) {
        res.status(400).json({ success: false});
    }
}

//@desc Delete car
//@route DELETE /api/v1/cars/:id
//@access Private
exports.deleteCar = async (req, res, next) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true, 
            data: {}, 
        })
    } catch (err) {
        res.status(400).json(({success: false}));
    }
}