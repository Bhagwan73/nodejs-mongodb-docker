const router = require("express").Router();
const { body } = require("express-validator");

const { catchAsync } = require("../utils/catchAsync");
const {
  registration,
  login,
  logOut,
  getUserProfile,
} = require("../controllers/userController");
const { verifyUserToken } = require("../middlewares/verifyUserToken");

const registrationValidator = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
  body("phone")
    .notEmpty()
    .trim()
    .withMessage("The field phone is missing")
    .custom(async (val, { req }) => {
      if (/^[6-9]{1}[0-9]{9}$/.test(val)) {
        return true;
      } else {
        throw new Error("Invalid phone number");
      }
    }),
];

const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

router
  .post(
    "/registration",
    registrationValidator,
    catchAsync("registration api", registration)
  )
  .post("/login", loginValidator, catchAsync("login api", login))
  .post(
    "/logout",
    catchAsync("verifyUserToken middleware", verifyUserToken),
    catchAsync("logOut api", logOut)
  )
  .get(
    "/profile",
    catchAsync("verifyUserToken middleware", verifyUserToken),
    catchAsync("getUserProfile api", getUserProfile)
  );

module.exports = router;
