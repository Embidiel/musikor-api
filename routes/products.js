const express = require('express');
const router = express.Router();

const { 
    createProduct,
    getProduct,
    getProducts
} = require('../controllers/products');

router
    .route('/')
    .get(getProducts)
    .post(createProduct);

router
    .route('/:id')
    .get(getProduct);

module.exports = router;