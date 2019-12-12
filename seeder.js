const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const colors = require('colors');

// Load up env variables.
dotenv.config({ path: './config/config.env'});

// Models
const Product = require('./models/Product');
const Artist = require('./models/Artist');

// Connect to Database
mongoose.connect(process.env.MONGO_URI, {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Read json files.
const products = JSON.parse(fs.readFileSync(`${__dirname}/_data/products.json`, `utf-8`));
const artists = JSON.parse(fs.readFileSync(`${__dirname}/_data/artists.json`, `utf-8`));


// Import into database.
const importData = async () => {
    try {
        await Product.create(products);
        await Artist.create(artists);

        console.log('Data is imported...'.green.inverse);
        process.exit();
    } catch(err) {
        console.log(err);
    }
}

// Delete data 
const deleteData = async () => {
    try {
        await Product.deleteMany();
        await Artist.deleteMany();

        console.log('Data is deleted...'.red.inverse);
        process.exit();
    } catch(err) {
        console.log(err);
    }
}

if(process.argv[2] === "-i"){
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}

