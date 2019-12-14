const asyncHandler = require('../middlewares/async');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');

/* 
DESC    Create new product
ROUTE   POST /api/v1/products/
ACCESS  Private
*/
exports.createProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.create(request);
    
    res.status(200).json({
        success: true,
        data: product
     });  
});

// DESC      Upload photo for product
// ROUTE     PUT /api/v1/products/:id/photo
// ACCESS    Private
exports.productPhotoUpload = asyncHandler(async (req, res, next) => {
    let photos = [];
    const product = await Product.findById(req.params.id);
  
    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
      );
    }
  
    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }
  
    const files = req.files.files;

    files.forEach((file, x) => {
        
        // Make sure the file is a photo
        if (!file.mimetype.startsWith('image')) {
            return next(new ErrorResponse(`Please upload an image file`, 400));
        }

        // Check filesize
        if (file.size > process.env.MAX_FILE_UPLOAD) {
            return next(
            new ErrorResponse(
                `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
                400
            )
            );
        }

        // Create custom filename
        file.name = `product_${product.id}_${x+1}_${path.parse(file.name).ext}`;

        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
            if (err) {
                console.error(err);
                return next(new ErrorResponse(`Problem with file upload`, 500));
            }
        
        // Add photo name to array.
        photos.push(file.name);   
        });
        
    });
    await Product.findByIdAndUpdate(req.params.id, { photos: photos });
  
    res.status(200).json({
      success: true,
      data: photos
    });

  });

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