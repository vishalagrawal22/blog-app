const mongoose = require("mongoose");
const { Schema } = mongoose;

const { DateTime } = require("luxon");

const postSchema = new Schema({
  title: { type: String, maxlength: 100, required: true },
  description: String,
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  published: { type: Boolean, required: true },
});

postSchema.virtual("url").get(function () {
  return "/posts/" + this._id;
});

postSchema.virtual("createdAt").get(function () {
  return DateTime.fromJSDate(this._id.getTimestamp()).toLocaleString(
    DateTime.DATE_MED
  );
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
