const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    district: {
        type: String,
        required: [true, 'Please add a district']
    },
    province: {
        type: String,
        required: [true, 'Please add a province']
    },
    tel: {
        type: String,
        required: [true, 'Please add a telephone number'],
        match: [/^\+?1?(\d{10}|\d{3}-\d{3}-\d{4})$/, "Please add a valid telephone number"]
    },
    region: {
        type: String,
        required: [true, 'Please add a region']
    }
}, {
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

//Reverse populate with virtuals
CarSchema.virtual('bookings',{
    ref: 'Booking',
    localField: '_id',
    foreignField: 'car',
    justOne: false
});

//Cascade delete booking when a car is deleted
CarSchema.pre('deleteOne',{document: true, query: false},async function(next){
    console.log(`Bookings being removed from car ${this._id}`);
    await this.model('Booking').deleteMany({car:this._id});
    next();
})

module.exports = mongoose.model('Car', CarSchema);