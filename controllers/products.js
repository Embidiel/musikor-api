const asyncHandler = require('../middlewares/async');
const Product = require('../models/Product');

/* 
DESC    Create new product
ROUTE   POST /api/v1/products/
ACCESS  Private
*/
exports.createProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(200).json({
        success: true,
        data: product
    });  
})

/* 
DESC    Get all products
ROUTE   GET /api/v1/products/
ACCESS  Public
*/
exports.getProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        data: products
    });  
})

/* 
DESC    Get a single product
ROUTE   GET /api/v1/products/:id
ACCESS  Public
*/
exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(400).json({ success: false });
    }
    
    res.status(200).json({
        success: true,
        data: product
    });  
})