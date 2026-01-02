const bcrypt = require("bcrypt");

const {
  getUserByFilter,
  updateUserByFilter,
  registerUser,
} = require("../services/userService");
const AppError = require("../utils/appError");
const { generateToken } = require("../utils/jwt");

exports.registration = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  // generate jwt token
  const token = generateToken({ email });
  if (token.error) {
    throw new AppError(400, token.message);
  }

  // register
  const user = await registerUser({
    first_name: firstName,
    last_name: lastName,
    email,
    password,
    phone,
    token: token.data,
    last_login_date: new Date().getTime(),
  });

  if (!user) {
    throw new AppError(400, "Failed to register user");
  }

  // set the token as a cookie
  const isDev = process.env.NODE_ENV == "DEVELOPMENT";
  res.cookie("user_token", user.token, {
    httpOnly: true,
    secure: !isDev,
    maxAge:
      process.env.COOKIE_EXPIRATION_MILLISECONDS * 1 || 2 * 60 * 60 * 1000,
    signed: true,
    sameSite: isDev ? "Lax" : "None",
  });

  res.status(200).json({
    message: "Registration successful",
    error: false,
    data: {
      firstName,
      lastName,
      email,
      phone,
    },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // validate email
  const user = await getUserByFilter({ email }, "_id password", { lean: true });
  if (!user) {
    throw new AppError(400, "Email is not registered");
  }

  // validate password
  const isPassMatched = await bcrypt.compare(password, user.password);
  if (!isPassMatched) {
    throw new AppError(400, "Incorrect password");
  }

  // generate jwt token
  const token = generateToken({ email });
  if (token.error) {
    throw new AppError(400, token.message);
  }

  // update user
  const updatedUser = await updateUserByFilter(
    { email },
    {
      last_login_date: new Date().getTime(),
      token: token.data,
    },
    { new: true }
  );
  if (!updatedUser) {
    throw new AppError(400, "Failed to update user");
  }

  // set the token as a cookie
  const isDev = process.env.NODE_ENV == "DEVELOPMENT";
  res.cookie("user_token", updatedUser.token, {
    httpOnly: true,
    secure: !isDev,
    maxAge:
      process.env.COOKIE_EXPIRATION_MILLISECONDS * 1 || 2 * 60 * 60 * 1000,
    signed: true,
    sameSite: isDev ? "Lax" : "None",
  });

  res.status(200).json({
    message: "Login successful",
    error: false,
    data: {
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      email: updatedUser.email,
      phone: updatedUser.phone,
    },
  });
};

exports.logOut = (req, res) => {
  const isDev = process.env.NODE_ENV == "DEVELOPMENT";
  res.clearCookie("user_token", {
    httpOnly: true,
    secure: !isDev,
    signed: true,
    sameSite: isDev ? "Lax" : "None",
  });

  res.status(200).json({
    message: "Logged out successfully",
    error: false,
    data: null,
  });
};

exports.getUserProfile = async (req, res) => {
  if (!req.user) {
    throw new AppError(400, "User not authenticated");
  }

  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    data: req.user,
  });
};
