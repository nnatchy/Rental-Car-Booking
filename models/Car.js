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
})

module.exports = mongoose.model('Car', CarSchema);