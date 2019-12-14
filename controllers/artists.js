const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const Artist  = require('../models/Artist');

/* 
DESC    Get artists
ROUTE   GET /api/v1/artists/
ACCESS  Public
*/
exports.getArtists = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

/* 
DESC    Get single artist
ROUTE   GET /api/v1/artists/:id
ACCESS  Public
*/
exports.getArtist = asyncHandler(async (req, res, next) => {
    const artist = await Artist.findById(req.params.id).populate({
        path: 'product',
        select: ''
    });

    if(!artist){
        return next(new ErrorResponse(`No artist with the id of ${req.params.id} was found`))
    }

    res.status(200).json({
        success: true,
        data: artist
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