const Verified = require('../models/Verified')
const EmailService = require('../config/email')

//@desc Get user verification
//@route Get /api/v1/verified/:id
//@access Public
const getVerification = async (userId) => {
    try {
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
const updateVerification = async (user) => {
    try {
        const otp = generateOTP();
        if (!user._id) {
            console.error("Invalid UserId", user._id);
            return;
        }
        const verified = await Verified.findOneAndUpdate({ user_id: user._id }, { otp: otp });
    
        await SendEmailVerification(user.email, otp)

        console.log("Success:", verified)
        res.status(200).json({
            success: true,
            data: verified
        })
    } catch (err) {
        console.error(err)
        res.status(400).json({
            success: false,
            msg: "Update otp in verified table error",
            error: err,
        });
    }

}

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
        await EmailService.sendEmail(email, subject, '', emailContent);
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