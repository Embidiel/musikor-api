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

// Enable virtuals.
ArtistSchema.set('toObject', { virtuals: true });
ArtistSchema.set('toJSON', { virtuals: true });
ArtistSchema.set('timestamps', true); 

// Reverse populate using virtuals
ArtistSchema.virtual('product', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'artist',
    justOne: false
});

// Delete artist's products when the artist is deleted.
ArtistSchema.pre('remove', async function (next) {
    console.log(`Products being deleted from Artist: ${this._id}`)
    await this.model('Product').deleteMany({ artist: this._id });
    next();
})

module.exports = mongoose.model('Artist', ArtistSchema);