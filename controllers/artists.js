const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const Artist  = require('../models/Artist');

/* 
DESC    Get artists
ROUTE   GET /api/v1/artists/
ACCESS  Public
*/
exports.getArtists = asyncHandler(async (req, res, next) => {
    let query;

    query = Artist.find();

    const artists = await query;

    res.status(200).json({
        success: true,
        count: artists.length,
        data: artists
    });
});

/* 
DESC    Delete a single artist
ROUTE   DELETE /api/v1/artists/:id
ACCESS  Private
*/
exports.deleteArtist = asyncHandler(async (req, res, next) => {
    const artist = await Artist.findById(req.params.id);

    if(!artist){
        return res.status(400).json({ success: false });
    }

    artist.remove();
    
    res.status(200).json({
        success: true,
        data: {}
    });  
})