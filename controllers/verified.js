const Verified = require('../models/Verified')

//@desc Get user verification
//@route Get /api/v1/verified/:id
//@access Public
const getVerification = async (req,res,next) => {
    try {
        const verification = await Verified.findById(req.params.id);
        if (!verification) {
            return res.status(404).json({
                success:false,
                message: `Cannot get verification with ${req.params.id}`
            });
        }
        res.status(200).json({
            success: true,
            data: verification
        })
        return verification
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false
        })
    }
}

//@desc Create new verification
//@route POST /api/v1/verified
//@access Public
const createVerification = async (req,res,next) => {
    console.log(req.user.id);
    try {
        const otp = generateOTP();
        console.log("User_id in verification")
        await Verified.create({
            user_id: req.user.id,
            otp: otp,
        });
        res.status(200).json({
            success: true,
            
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false
        });
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