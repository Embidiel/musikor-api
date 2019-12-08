const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

/* 
DESC    Register a user
ROUTE   GET /api/v1/auth/register
ACCESS  Public
*/
exports.register = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, password, mobileNumber, role } = req.body;

    const user = await User.create({
        firstName, 
        lastName, 
        email, 
        password, 
        mobileNumber, 
        role
    });

    sendTokenResponse(user, 200, res);
})

/* 
DESC    Login a user
ROUTE   GET /api/v1/auth/login
ACCESS  Public
*/
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password){
        return next(new ErrorResponse('Please enter an email and password', 400));
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if(!user){
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check password
    const isMatch = await user.comparePasswords(password);
    if(!isMatch){
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
})

// Custom function to create token and then send cookie response.
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({ success: true, token });
}