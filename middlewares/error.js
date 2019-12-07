const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {

    let error = { ...err };
    error.message = err.message;

    console.log(err.stack.red.underline);

    // Handle duplicate key
    if (err.code === 11000) {
        const msg = 'Duplicate field value entered';
        error = new ErrorResponse(msg, 400);
    }

    // Handle validation error
    if (err.name === 'ValidationError') {
        const msg = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(msg, 400);
    }

    // Handle bad Object ID
    if (err.name === 'CastError') {
        const msg = `Resource not found`;
        error = new ErrorResponse(msg, 404);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;