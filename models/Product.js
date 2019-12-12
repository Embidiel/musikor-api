const mongoose = require('mongoose');
const slugify = require('slugify');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true
    },
    slug: String,
    tracklist: {
        type: [String],
        default: []
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        minlength: [40, 'Description must be more than 40 characters']
    },
    stock: {
        type: Number,
        required: [true, 'Please enter the number of stocks'],
    },
    photos: {
        type: [String],
        default: 'no-photo.jpg'
    },
    price: {
        type: Number,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    artist: {
        type: mongoose.Schema.ObjectId,
        ref: 'Artist',
        required: true
    }
});

ProductSchema.set('timestamps', true); 

ProductSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

module.exports = mongoose.model('Product', ProductSchema);