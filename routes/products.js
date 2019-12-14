const express = require('express');
const router = express.Router({ mergeParams: true });
const advancedResults = require('../middlewares/advancedResults');
const Product = require('../models/Product');

const { 
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    productPhotoUpload
} = require('../controllers/products');

router
    .route('/')
    .get(advancedResults(Product), getProducts)
    .post(createProduct);

router
    .route('/:id')
    .get(getProduct)
    .put(updateProduct)
    .delete(deleteProduct);

router
    .route('/:id/photo')
    .put(productPhotoUpload);

module.exports = router;