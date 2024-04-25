const mongoose = require("mongoose");

const VerifiedSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        default: Date.now() + 60 * 60 * 24 * 7,
    },
});

module.exports = mongoose.model("Verified", VerifiedSchema);
