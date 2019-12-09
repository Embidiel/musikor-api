const asyncHandler = require('../middlewares/async');
const Product = require('../models/Product');

/* 
DESC    Create new product
ROUTE   POST /api/v1/products/
ACCESS  Private
*/
exports.createProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        data: product
    });  
})