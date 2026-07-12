class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // The Mongoose query object (e.g., Product.find())
    this.queryString = queryString; // The req.query object from Express
  }

  // 1. Dynamic Database Filtering
  filter() {
    const queryObj = { ...this.queryString };

    // Exclude API control parameters from matching database fields
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Handle advanced range operators: gte, gt, lte, lt (e.g., price[gte]=100)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this; // Allows method chaining
  }

  // 2. Select Specific Fields (Projecting fields)
  limitFields() {
    if (this.queryString.fields) {
      // Convert comma-separated string to space-separated string: 'name,price' -> 'name price'
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      // Default: Remove internal mongoose version key field
      this.query = this.query.select("-__v");
    }
    return this;
  }

  // 3. Limit Responses & Pagination
  paginate(totalDocs) {
    const page = Math.max(1, parseInt(this.queryString.page, 10) || 1);
    const limit = Math.max(1, parseInt(this.queryString.limit, 10) || 100); // default to 100 docs max
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(totalDocs / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    this.pagination = {
      page,
      limit,
      totalDocs,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default APIFeatures;
