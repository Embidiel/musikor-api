const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

    const reqQuery = { ...req.query };

    const removeFields = ['select', 'sort', 'paginate', 'limit', 'page'];

    // Delete removable fields from request query.
    removeFields.forEach(field => delete reqQuery[field]);

    // Accept query parameters, and then add $ at front.
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    console.log(`Query: `, reqQuery);

    query = model.find(JSON.parse(queryStr));

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
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    if(populate){
        query = query.populate(populate);
    }
    
    const results = await query;

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

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }

    next();
};

module.exports = advancedResults;