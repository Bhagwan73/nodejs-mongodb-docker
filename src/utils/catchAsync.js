const { validationResult } = require("express-validator");
require("dotenv").config();

const AppError = require("./appError");

exports.catchAsync = (fnName, fn) => {
  return async (req, res, next) => {
    try {
      const { errors } = validationResult(req);
      if (errors.length > 0) {
        throw new AppError(400, errors[0].msg || "Bad request");
      }

      await fn(req, res, next);
    } catch (err) {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.error(`Error in catch block of ${fnName} ===>`, err);
      }
      next(err);
    }
  };
};
