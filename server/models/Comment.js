const mongoose = require("mongoose");
const { Schema } = mongoose;

const { DateTime } = require("luxon");

const commentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  text: { type: String, required: true },
});

commentSchema.virtual("createdAt").get(function () {
  return DateTime.fromJSDate(this._id.getTimestamp()).toLocaleString(
    DateTime.DATE_MED
  );
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
