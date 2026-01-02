const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const useragent = require("express-useragent");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./middlewares/globalErrorHandler");

require("dotenv").config();

// start express app
const app = express();
console.log("Running environment is ===>", app.get("env"));

// compress response bodies for all request
app.use(
  compression({
    level: 6,
    threshold: 0,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

// Global middlewares
// set security http headers
app.use(helmet());

// development logging
if (process.env.NODE_ENV === "DEVELOPMENT") {
  app.use(morgan("dev"));
}

// allow cross origin requets
app.use(cors());

// parse json request body
app.use(express.json({ limit: "3mb" }));

// parse json request url and set limit of request body size
app.use(express.urlencoded({ limit: "3mb", extended: true }));

// parse the Cookie header on the request
app.use(cookieParser(process.env.COOKIE_SIGNING_SECRET));

// express can read ip address from headers if it runs behind a proxy
app.set("trust proxy", true);

// middleware to expose user-agent details to the application
app.use(useragent.express());

// route imports
const userRouter = require("./routers/userRouter");

// route declarations
app.use("/api/v1/auth", userRouter);

// check whether requested url exist on this server or not
app.use((req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

// global error handler middleware
app.use(globalErrorHandler);

module.exports = app;
