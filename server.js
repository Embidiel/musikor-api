const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config({ path: `./config/config.env`});

connectDB();

// Route Files
const admin = require('./routes/admin');
const customer = require('./routes/admin');
const role = require('./routes/admin');

// Load routers
app.use('/api/v1/admin', admin);
app.use('/api/v1/customer', customer);
app.use('/api/v1/role', role);

// Dev logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

const app = express();
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
})