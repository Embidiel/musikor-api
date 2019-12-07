const asyncHandler = require('../middlewares/async');
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

    res.status(200).json({ success: true });
})