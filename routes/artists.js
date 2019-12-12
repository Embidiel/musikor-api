const express = require('express');
const router = express.Router();

const { 
    getArtists,
    getArtist,
    deleteArtist
} = require('../controllers/artists');

// Include other routers
const productsRouter = require('./products');

// Re-route into other routers.
router.use('/:artistId/products', productsRouter);

router
    .route('/')
    .get(getArtists);

router
    .route('/:id')
    .get(getArtist)
    .delete(deleteArtist);

module.exports = router;