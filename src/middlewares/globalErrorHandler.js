const globalErrorHandler = (err, req, res, _next) => {
  // set default error values if missing
  err.statusCode = err?.statusCode || 500;
  err.message = err?.message || "Internal Server Error!";
  err.errorCode = err?.errorCode || "";
  err.data = err?.data || null;

  process.env.NODE_ENV === "PRODUCTION"
    ? sendErrProd(err, res)
    : sendErrDev(err, res);
};

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    error: true,
    data: err.data || null,
    // statusCode: err.statusCode,
    // errorCode: err.errorCode,
    // completeErr: err.completeErr || null,
    // stack: err.stack,
  });
};

const sendErrProd = (err, res) => {
  // operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode * 1).json({
      statusCode: err.statusCode,
      message: err.message,
      error: true,
      errorCode: err.errorCode,
      data: err.data || null,
    });
  } else {
    // programming or other unknown error: don't leak error details
    res.status(500).json({
      statusCode: 500,
      message: err.message || "Something went wrong!",
      error: true,
      errorCode: err.errorCode || "",
      data: err.data || null,
    });
  }
};

module.exports = globalErrorHandler;
