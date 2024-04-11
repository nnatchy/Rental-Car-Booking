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
            await SendEmailVerification(user.email, otp);
            console.log("Success:", verify);
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
                        font-family: 'Helvetica Neue', Arial, sans-serif;
                        font-size: 16px;
                        line-height: 1.6;
                        margin: 0;
                        padding: 20px;
                        color: #333;
                        background-color: #f3f3f3;
                    }
                    .email-container {
                        background-color: #fff;
                        width: 100%;
                        max-width: 600px;
                        margin: 40px auto;
                        padding: 20px;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                        border-top: 4px solid #5cb85c;
                        border-radius: 8px;
                    }
                    h3 {
                        font-size: 24px;
                        color: #333;
                        text-align: center;
                        margin-top: 0;
                        margin-bottom: 20px;
                    }
                    p {
                        color: #555;
                        margin-bottom: 15px;
                        line-height: 1.4;
                    }
                    .otp {
                        font-size: 20px;
                        font-weight: bold;
                        color: #5cb85c;
                    }
                    .signature {
                        font-style: normal;
                        margin-top: 40px;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <h3>Email Verification Required</h3>
                    <p>Dear User,</p>
                    <p>Your One-Time Password (OTP) is: <span class="otp">${otp}</span></p>
                    <p>Please use this OTP to complete your email verification.</p>
                    <p class="signature">Best Regards,<br>CV-Natchy Rental Car Booking Team</p>
                </div>
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