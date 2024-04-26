const User = require('../models/User')
const VerifiedController = require('../controllers/verified.js');
const EmailService = require('../config/email.js')
const crypto = require('crypto')

//@desc Register user
//@route POST /api/v1/auth/register
//@access Public
const register = async (req, res, next) => {
    try {
        const { name, email, tel, password, role } = req.body;
        const user = await User.create({
            name,
            email,
            tel,
            password,
            role
        });

        console.log("USER IN :", user)

        await VerifiedController.createVerification(user);

        // TODO: send email to user email ...

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(401).json({ success: false });
        console.log(err.stack);
    }
}

//@desc Login user
//@route POST /api/v1/auth/login
//@access Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, msg: 'Please provide an email and password' });
        }

        if (typeof email != "string" || typeof password != "string") {
            return res.status(400).json({ success: false, msg: 'Cannot convert email and password into string' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ success: false, msg: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, msg: "Invalid credentials" });
        }

        if (!user.verified) {
            return res.status(400).json({ success: false, msg: 'Please verify your email first. Check your email inbox' })
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false });
        console.log(err.stack);
    }
};

//@desc Log user out / clear cookie
//@route GET /api/v1/auth/logout
//@access Private
const logout = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        msg: "Logout successful",
        data: {}
    });
}

//@desc Get current Logged in user
//@route POST /api/v1/auth/me
//@access Private
const getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    });
};


//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken()
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false
    };
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        tel: user.tel,
        token
    })
}

//@desc Update verified in User Table
//@route PUT /api/v1/auth/verified/:id
//@access Public
const verifyUser = async (req, res, next) => {
    try {
        const user_id = req.params.id;
        const { otp } = req.body
        console.log("verifyUser:", user_id)
        const verificationData = await VerifiedController.getVerification(user_id)
        if (!verificationData) {
            return res.status(404).json({
                success: false,
                msg: `Verification from ${user_id} not found, might be because of token expired or user hasn't registered yet`,
            });
        }
        let verifiedUser = {
            "verified": true,
        }
        if (otp !== verificationData.otp) {
            return res.status(406).json({
                success: false,
                msg: "Incorrect OTP"
            })
        }
        await User.findByIdAndUpdate(user_id, verifiedUser)

        await VerifiedController.deleteVerification(user_id)

        res.status(200).json({
            success: true,
            msg: "Verified successful",
        })
    } catch (err) {
        console.error(err)
        res.status(400).json({
            success: false,
            msg: "Update verified in User error",
            error: err,
        });
    }
}

//@desc Forgot password - Send reset password instructions via email
//@route POST /api/v1/auth/forgotpassword
//@access Public
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Find user by email and update reset token and expiry time
        const user = await User.findOneAndUpdate(
            { email: email },
            { resetPasswordToken: resetToken, resetPasswordExpire: Date.now() + 3600000 }, // Reset token expires in 1 hour
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found",
            });
        }

        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${user._id}/${resetToken}`;
        const emailContent = `
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Google Sans', Roboto, Helvetica, Arial, sans-serif;
                        background-color: #ffffff;
                        color: #202124;
                        font-size: 16px;
                        line-height: 1.5;
                        margin: 0;
                        padding: 0;
                    }
                    .email-container {
                        width: 100%;
                        max-width: 680px;
                        background: #ffffff;
                        margin: 40px auto;
                        border: 1px solid #e0e0e0;
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                        border-radius: 8px;
                        overflow: hidden;
                    }
                    h3 {
                        font-size: 20px;
                        background-color: #f8f9fa;
                        color: #202124;
                        padding: 16px 24px;
                        border-bottom: 1px solid #e0e0e0;
                        margin: 0;
                    }
                    p {
                        font-size: 16px;
                        color: #5f6368;
                        padding: 20px 24px;
                        margin: 0;
                    }
                    a {
                        text-decoration: none;
                        color: #5cb85c;
                    }
                    .button {
                        display: block;
                        width: max-content;
                        color: #ffffff;
                        text-align: center;
                        border-radius: 4px;
                        padding: 10px 20px;
                        text-decoration: none;
                        margin: 20px 24px;
                        border: 1px solid #000000;
                    }
                    .signature {
                        text-align: center;
                        padding: 16px 24px;
                        background-color: #f8f9fa;
                        color: #5f6368;
                        font-size: 14px;
                        border-top: 1px solid #e0e0e0;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <h3>Password Reset Request</h3>
                    <p>Hello ${user.name},</p>
                    <p>We received a request to reset your password for your account. If you did not make this request, please ignore this email. Otherwise, you can reset your password using the button below.</p>
                    <a href="${resetUrl}" class="button">Reset Password</a>
                    <p>The link will expire in 1 hour.</p>
                    <div class="signature">
                        Thank you,<br>
                        The Support Team
                    </div>
                </div>
            </body>
            </html>
        `;

        // Send the email
        await EmailService.sendEmail(email, "Reset Your Password", '', emailContent);

        // Respond to the client
        res.status(200).json({
            success: true,
            msg: "Password reset instructions sent to your email.",
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            msg: "Error processing your request",
            error: err,
        });
    }
};



// @desc Reset password - Update user's password using reset token
// @route PUT /api/v1/auth/resetpassword/:id/:token
// @access Public
const resetPassword = async (req, res, next) => {
    try {
        const { id, token } = req.params;
        const { password } = req.body;

        // Find user by ID and reset token
        const user = await User.findOne({
            _id: id,
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            res.status(400).json({ success: false, msg: "Invalid or expired reset token" });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            msg: "Password reset successful",
            data: user
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            msg: "Error resetting password",
            error: err,
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    getMe,
    verifyUser,
    forgotPassword,
    resetPassword,
}