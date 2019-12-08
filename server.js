const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/error');
const connectDB = require('./config/db');

dotenv.config({ path: `./config/config.env` });

connectDB();

// Route Files
const user = require('./routes/user');
const auth = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(cookieParser());

// Load routers
app.use('/api/v1/auth', auth);

app.use(errorHandler);

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