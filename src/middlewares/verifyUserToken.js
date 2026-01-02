const { getUserByFilter } = require("../services/userService");
const AppError = require("../utils/appError");
const { verifyToken } = require("../utils/jwt");

exports.verifyUserToken = async (req, res, next) => {
  const token = req.signedCookies["user_token"];

  if (!token) {
    throw new AppError(401, "Token is missing");
  }

  // verify token
  const tokenData = verifyToken(token);
  if (tokenData.error) {
    throw new AppError(401, tokenData.message);
  }

  const user = await getUserByFilter(
    { token },
    "_id email phone first_name last_name is_blocked",
    {
      lean: true,
    }
  );

  if (!user) {
    throw new AppError(401, "Token has expired, Try login again");
  }

  if (user.is_blocked) {
    throw new AppError(400, "Temporarly blocked, reset password to login");
  }

  req.user = {
    id: user._id,
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone,
    email: user.email,
  };
  next();
};
