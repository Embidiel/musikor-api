const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect({
        useFindAndModify: false,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
}

exports.default = connectDB;