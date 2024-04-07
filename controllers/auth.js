const User = require('../models/User')
const VerifiedController = require('../controllers/verified.js')

//@desc Register user
//@route POST /api/v1/auth/register
//@access Public
const register = async (req, res, next) => {
    try {
        const { name, email, tel, password, role} = req.body;
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

    res.status(statusCode).cookie('token',token,options).json({
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
const updateVerification = async (req, res, next) => {
    try {
        const { user_id, otp } = req.body
        const verificationData = await VerifiedController.getVerification(user_id)
        if (!verificationData) {
            return res.status(404).json({
                success: false,
                msg: `Verification from ${user_id} not found`,
            });
        }
        let verifiedUser = {
            "verified": true,
        }
        if (otp !== verificationData.otp) {
            res.status(406).json({
                success: false,
                msg: "Incorrect OTP"
            })
        }
        await User.findByIdAndUpdate(user_id, verifiedUser)
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

module.exports = {
    register,
    login,
    logout,
    getMe,
    updateVerification,
}