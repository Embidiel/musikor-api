const express = require('express');
const router = express.Router();

const { 
    getArtists,
    getArtist,
    deleteArtist
} = require('../controllers/artists');

const Artist = require('../models/Artist');
const advancedResults = require('../middlewares/advancedResults');

// Include other routers
const productsRouter = require('./products');

// Re-route into other routers.
router.use('/:artistId/products', productsRouter);

router
    .route('/')
    .get(advancedResults(Artist), getArtists);

router
    .route('/:id')
    .get(getArtist)
    .delete(deleteArtist);

module.exports = router;