const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter an artist name'],
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    description: {
        type: String,
        required: [true, 'Please enter artist description'],
        minlength: [30, 'Description must be more than 30 characters']
    },
    member: {
        type: [String]
    }
});

ArtistSchema.set('timestamps', true); 

module.exports = mongoose.model('Artist', ArtistSchema);