export const errorMiddleware = (err, req, res, next) => {

  console.log(err , "errrrrr");
  if (err.name === "TokenExpiredError") {
    err.message = "Invalid token, Please login again";
    err.statusCode = 401;
  }

  if (err.name === "JsonWebTokenError") {
    err.message = "Unauthorized, Please login again";
    err.statusCode = 401;
  }

  if (process.env.NODE_ENV === "development") {
    developmentError(err, res);
  } else {
    productionError(err, res);
  }
};

const productionError = (err, res) => {
  const statusCode = err.statusCode || 500;
  const message = err?.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message,
  });
};

const developmentError = (err, res) => {
  const statusCode = err.statusCode || 500;
  const message = err?.message || "Internal Server Error";
  const stack = err?.stack;
  const error = err;
  res.status(statusCode).json({
    success: false,
    message,
    stack,
    error,
  });
};
