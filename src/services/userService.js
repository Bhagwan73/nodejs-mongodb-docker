const { UserModel } = require("../models/userModel");

exports.registerUser = async (data) => {
  return UserModel.create(data);
};

exports.getUserById = (id, projections = null, options = {}) => {
  return UserModel.findById(id, projections, options);
};

exports.getUserByFilter = (filters = {}, projections = null, options = {}) => {
  return UserModel.findOne(filters, projections, options);
};

exports.getAllUserByFilter = (
  filters = {},
  projections = null,
  options = {}
) => {
  return UserModel.find(filters, projections, options);
};

exports.updateUserById = (id, updateObject, options = {}) => {
  return UserModel.findByIdAndUpdate(id, updateObject, options);
};

exports.updateUserByFilter = (
  filters = {},
  updateObject = {},
  options = {}
) => {
  return UserModel.findOneAndUpdate(filters, updateObject, options);
};

exports.updateAllUserByFilter = (
  filters = {},
  updateObject = {},
  options = {}
) => {
  return UserModel.updateMany(filters, updateObject, options);
};
