const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please add a first name']
    },
    lastName: {
        type: String,
        required: [true, 'Please add a first name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please enter a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: 6,
        select: false
    },
    mobileNumber: {
        type: String,
        require: [true, 'Please add a mobile number'],
        unique: true,
        match: [
            /^(09|\+639)\d{9}$/,
            'Please enter a valid PH mobile number'
        ]
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
      },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }  
});

module.exports = mongoose.model('User', UserSchema);