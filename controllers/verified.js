const Verified = require('../models/Verified')

//@desc Get user verification
//@route Get /api/v1/verified/:id
//@access Public
const getVerification = async (user_id) => {
    try {
        const verification = await Verified.findOne({ user_id: user_id });
        if (!verification) {
            return;
        }
        return verification
    } catch (err) {
        console.error(err)
        return;
    }
}

//@desc Create new verification
//@route POST /api/v1/verified
//@access Public
const createVerification = async (user) => {
    try {
        const otp = generateOTP();
        console.log("USER_ID IN VERIFICATION:", user._id)
        await Verified.create({
            user_id: user._id,
            otp,
        });
    } catch (err) {
        console.error(err);
        return;
    }
};


const generateOTP = () => {
    const length = 6;
    var otp = '';
    for (var i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}

module.exports = {
    createVerification,
    getVerification,
}