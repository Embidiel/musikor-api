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
    let query;

    // Accept query parameters, and then add $ at front.
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    console.log(`Query: `, queryStr);
    
    query = Product.find(JSON.parse(queryStr));

    const products = await query;

    res.status(200).json({
        success: true,
        count: products.length,
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
});

/* 
DESC    Update a single product
ROUTE   PUT /api/v1/products/:id
ACCESS  Private
*/
exports.updateProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!product){
        return res.status(400).json({ success: false });
    }
    
    res.status(200).json({
        success: true,
        data: product
    });  
});

/* 
DESC    Delete a single product
ROUTE   DELETE /api/v1/products/:id
ACCESS  Private
*/
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if(!product){
        return res.status(400).json({ success: false });
    }
    
    res.status(200).json({
        success: true,
        data: {}
    });  
})