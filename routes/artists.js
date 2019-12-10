const express = require('express');
const router = express.Router();

const { 
    getArtists
} = require('../controllers/artists');

router
    .route('/')
    .get(getArtists);

module.exports = router;