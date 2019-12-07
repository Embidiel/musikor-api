const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db');

dotenv.config({ path: `./config/config.env` });

connectDB();

// Route Files
const admin = require('./routes/admin');

const app = express();

// Load routers

// Dev logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue.bold));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold.underline);
    server.close(() => process.exit(1));
})