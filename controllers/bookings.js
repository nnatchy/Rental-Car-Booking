const Booking = require('../models/Booking');
const Car = require("../models/Car");

//@desc Get all bookings
//@route GET /api/v1/booking
//@access Private
exports.getBookings = async (req,res,next) => {
    let query;
    //General users can see only their bookings!
    if (req.user.role !== 'admin') {
        query = Booking.find({user:req.user.id}).populate({
            path:'car',
            select: 'name address tel'
        });
    } else {
        query = Booking.find().populate({
            path: 'car',
            select: 'name address tel'
        });
    }

    try {
        const bookings = await query;
        
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        })
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({
            success: false,
            message: "Cannot find Booking"
        })
    }
}

//@desc Get sindle booking
//@route GET /api/v1/booking/:id
//@access Public
exports.getBooking = async (req,res,next) => {
    try {
        console.log(req.params.id)
        const booking = await Booking.findById(req.params.id).populate({
            path: 'car',
            select: 'name description tel'
        });

        if (!booking) {
            return res.status(404).json({
                success:false,
                message: `No booking with the id of ${req.params.id}`
            })
        } 

        res.status(200).json({
            succes:true,
            data: booking
        })
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({
            success: false,
            message: 'Cannot find Booking'
        })
    }
}

//desc @Add single booking
//@route POST /api/v1/car/:carId/bookings/
//@access Private
exports.addBooking = async (req,res,next) => {
    try {
        const car = await Car.findById(req.body.car);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: `No car with the id of ${req.params.carId}`
            })
        } console.log(req.body);

        //add user Id to reqbody
        req.body.user = req.user.id;
        //Check for existed booking
        const existedBooking = await Booking.find({user:req.user.id});

        if (existedBooking.length >= 3 && req.user.role == 'user') {
            return res.status(401).json({
                success: false, 
                message: `The user with ID ${req.user.id} has already made 3 bookings`
            })
        }

        const booking = await Booking.create(req.body);
        res.status(200).json({
            success:true,
            data: booking
        });
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({
            success: false,
            message: 'Cannot create booking'
        })
    }
}

//@desc Update booking
//@route PUT /api/v1/bookings/:id
//@access Private
exports.updateBooking = async(req,res,next) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            res.status(404).json({
                success: false,
                message: `No booking with id ${req.params.id}`
            })
        }

        if (booking.user.toString() != req.user.id && req.user.role != 'admin') {
            return res.status(401).json({
                success: false,
                message: `Cannot update another user booking`
            })
        }
        
        booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        res.status(200).json({success: true, data: booking});
    } catch(err) {
        console.log(err.stack);
        res.status(500).json({
            success:false,
            message: "Cannot update booking"
        });
    }
}

//@desc Delete booking
//@route DELETE /api/v1/booking/:id
//@access Private
exports.deleteBooking = async (req,res,next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({
                success:false,
                message: `No booking with the id ${req.params.id}`
            })
        }

        if (booking.user.toString() != req.user.id && req.user.role != 'admin') {
            return res.status(401).json({
                success: false,
                message: `Cannot delete another user booking`
            })
        }

        await booking.deleteOne();
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Cannot delete booking'
        })
    }
}