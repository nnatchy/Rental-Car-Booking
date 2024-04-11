const User = require("../models/User")
const Verified = require('../models/Verified')
const EmailService = require('../config/email')

const getVerification = async (userId) => {
    try {
        console.log("[getVerification]: userID", userId)
        const verification = await Verified.findOne({ user_id: userId });
        if (!verification) {
            console.error("No verification found for userId:", userId);
            return;
        }
        return verification;
    } catch (err) {
        console.error(err);
        return;
    }
}

//@desc Create new verification
//@route POST /api/v1/verified
//@access Public
const createVerification = (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            const otp = generateOTP();
            console.log("USER_ID IN VERIFICATION:", user._id)
            if (!user._id) {
                console.error("Invalid UserId", user._id)
                reject("Invalid UserId");
            }
            const verify = await Verified.create({
                user_id: user._id,
                otp: otp,
            });
            // Send email with OTP
            await SendEmailVerification(user.email, otp)
            console.log("Success:", verify)
            resolve(verify);
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
};

//@desc Update OTP Verification
//@route PUT /api/v1/verified/:userId
//@access Public
const updateVerification = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const otp = generateOTP();

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            console.error("Invalid UserId");
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        // Update OTP in the verified table
        const verified = await Verified.findOneAndUpdate(
            { user_id: user._id },
            { otp: otp, expiresAt: Date.now() + 24 * 60 * 60 * 1000 }, // Set expiration for 1 day
            { new: true, upsert: true } // Create if not exists
        );

        // Send email verification
        await SendEmailVerification(user.email, otp);

        console.log("Success:", verified);
        res.status(200).json({
            success: true,
            msg: "Resend OTP successful",
            data: verified
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            msg: "Update OTP in verified table error",
            error: err,
        });
    }
};

const SendEmailVerification = async (email, otp) => {
    try {
        const emailContent = `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    line-height: 1.6;
                    margin: 40px auto;
                    max-width: 600px;
                    color: #333333;
                }
                h3 {
                    font-size: 24px;
                    margin-bottom: 20px;
                    color: #333333;
                }
                p {
                    margin-bottom: 20px;
                    color: #666666;
                }
                .signature {
                    margin-top: 20px;
                    font-style: italic;
                }
                .otp {
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <h3>Dear user,</h3>
            <p>Your OTP is: <span class="otp">${otp}</span></p>
            <p>Please use this OTP to verify your email address.</p>
            <p class="signature">Best regards,<br>CV-Natchy Rental Car Booking team</p>
        </body>
        </html>
        `;
        await EmailService.sendEmail(email, "Email Verification OTP", '', emailContent);
    } catch (err) {
        console.error(err);
    }
}

const deleteVerification = async (userId) => {
    try {
        const verification = await Verified.findOneAndDelete({ user_id: userId });
        if (!verification) {
            console.error("No verification found for userId:", userId);
            return;
        }
    } catch (err) {
        console.error(err);
        return;
    }
}


const generateOTP = () => {
    const length = 6;
    var otp = '';
    for (var i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}

module.exports = {
    getVerification,
    createVerification,
    updateVerification,
    deleteVerification,
}