const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      trim: true,
      require: [true, "First name is required"],
    },
    last_name: {
      type: String,
      trim: true,
      require: [true, "Last name is required"],
    },
    email: {
      type: String,
      trim: true,
      require: [true, "Email is required"],
      unique: [true, "Email must be unique"],
    },
    password: {
      type: String,
      trim: true,
      require: [true, "Password is required"],
    },
    phone: {
      type: String,
      trim: true,
      require: [true, "Phone is required"],
    },
    token: {
      type: String,
      trim: true,
      require: [true, "Token is required"],
    },
    is_blocked: {
      type: Boolean,
      default: false,
    },
    last_login_date: {
      type: Number,
      default: new Date().getTime(),
    },
    date: {
      type: Number,
      default: new Date().getTime(),
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const UserModel = mongoose.model("user", userSchema);
module.exports = { UserModel };
