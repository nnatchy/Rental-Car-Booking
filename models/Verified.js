const mongoose = require("mongoose");

const VerifiedSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    otp: {
        type: String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 7,
    },
});

module.exports = mongoose.model("Verified", VerifiedSchema);
