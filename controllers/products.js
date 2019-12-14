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
    res.status(200).json(res.advancedResults);  
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