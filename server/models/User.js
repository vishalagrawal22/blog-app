const mongoose = require("mongoose");
const { Schema } = mongoose;

const validator = require("validator");

const userSchema = new Schema({
  name: { type: String, maxlength: 100, unique: true, required: true },
  email: {
    type: String,
    unique: true,
    validate: [validator.isEmail, "Invalid email"],
  },
  password: { type: String, required: true },
});

userSchema.virtual("url").get(function () {
  return "/users/" + this._id;
});

const User = mongoose.model("User", userSchema);
module.exports = User;
