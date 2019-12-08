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

    // Create auth token
    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token });
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

    // Create auth token
    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token });
})