const { body, validationResult, param } = require("express-validator");
const { Types } = require("mongoose");
const passport = require("passport");

const isPostAuthorOrIsPublished = [
  passport.authenticate("jwt", { failWithError: true, session: false }),
  (req, res, next) => {
    req.models.Comment.findById(req.params.commentId)
      .populate("post", {
        author: 1,
        published: 1,
      })
      .exec((err, comment) => {
        if (err) {
          return next(err);
        }

        if (!comment) {
          return res.status(404).json({
            message: "comment not found",
          });
        }

        if (comment.post.published) {
          return next();
        }

        if (comment.post.author.id === req.user.id) {
          return next();
        }

        return res.status(403).json({
          message: "access to comment is forbidden",
        });
      });
  },
];

const isAuthor = [
  (req, res, next) => {
    req.models.Comment.findById(req.params.commentId)
      .populate("author", {
        name: 1,
      })
      .exec((err, comment) => {
        if (err) {
          return next(err);
        }

        if (!comment) {
          return res.status(404).json({
            message: "comment not found",
          });
        }

        if (comment.author.id !== req.user.id) {
          return res.status(403).json({
            message: "access to comment is forbidden",
          });
        }

        req.data = {
          comment,
        };

        next();
      });
  },
];

module.exports.handleUpdateComment = [
  body("text")
    .trim()
    .isLength({
      min: 1,
    })
    .withMessage("text is required"),
  param("commentId").customSanitizer((value) => Types.ObjectId(value)),
  isPostAuthorOrIsPublished,
  isAuthor,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        comment: {
          text: req.body.text,
        },
        errors: errors.array(),
      });
    }

    const updatedData = { text: req.body.text };

    req.models.Comment.findByIdAndUpdate(
      req.params.commentId,
      updatedData,
      {
        runValidators: true,
      },
      (err) => {
        if (err) {
          return next(err);
        }

        res.status(204).json();
      }
    );
  },
];

module.exports.handleDeleteComment = [
  param("commentId").customSanitizer((value) => Types.ObjectId(value)),
  isPostAuthorOrIsPublished,
  isAuthor,
  (req, res, next) => {
    req.models.Comment.findByIdAndDelete(req.params.commentId, (err) => {
      if (err) {
        return next(err);
      }

      res.status(204).json();
    });
  },
];
