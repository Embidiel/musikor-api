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
        GET /api/v1/artists/:artistId/products
ACCESS  Public
*/
exports.getProducts = asyncHandler(async (req, res, next) => {
    let query;

    const reqQuery = { ...req.query };

    const removeFields = ['select', 'sort', 'paginate', 'limit'];

    // Delete removable fields from request query.
    removeFields.forEach(field => delete reqQuery[field]);

    // Accept query parameters, and then add $ at front.
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    console.log(`Query: `, reqQuery);

    // If artists id exists, find artists' product/s.
    if(req.params.artistId) {
        query = Product.find({ artist: req.params.artistId });
    } else {
        query = Product.find(JSON.parse(queryStr));
    }

    // Select fields to return
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort documents
    if(req.query.sort){
        const sortBy = req.query.select.split(',').join(' ');
        query = query.select(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments();

    query = query.skip(startIndex).limit(limit);

    const products = await query;

    // Pagination result
    const pagination = {};

    if(endIndex < total){
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    
    if(startIndex > 0){
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

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
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(400).json({ success: false });
    }

    product.remove();
    
    res.status(200).json({
        success: true,
        data: {}
    });  
})