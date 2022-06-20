const { body, param, validationResult } = require("express-validator");
const { Types } = require("mongoose");
const passport = require("passport");

module.exports.handleGetAllPublishedPosts = (req, res, next) => {
  req.models.Post.find({ published: true })
    .select({
      published: 0,
    })
    .populate("author", {
      name: 1,
    })
    .exec((err, posts) => {
      if (err) {
        return next(err);
      }

      res.status(200).json({
        posts: posts.map((post) => post.toObject({ virtuals: true })),
      });
    });
};

const isAuthor = [
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    req.models.Post.findById(req.params.postId)
      .populate("author", {
        name: 1,
      })
      .exec((err, post) => {
        if (err) {
          return next(err);
        }

        if (!post) {
          return res.status(404).json({
            message: "post not found",
          });
        }

        if (post.author.id !== req.user.id) {
          return res.status(403).json({
            message: "access to post is forbidden",
          });
        }

        req.data = {
          post,
        };

        next();
      });
  },
];

const isPresent = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

module.exports.handleGetPost = [
  param("postId").customSanitizer((value) => {
    return Types.ObjectId(value);
  }),
  (req, res, next) => {
    req.models.Post.findOne({ _id: req.params.postId, published: true })
      .populate("author", {
        name: 1,
      })
      .exec((err, post) => {
        if (err) {
          return next(err);
        }

        if (!post) {
          return next();
        }

        return res.status(200).json({
          post,
        });
      });
  },
  isAuthor,
  (req, res) => {
    return res.status(200).json({
      post: req.data.post,
    });
  },
];

module.exports.handleCreatePost = [
  passport.authenticate("jwt", { session: false }),
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("title should be 1-100 characters long"),
  body("description").trim(),
  body("published")
    .isBoolean()
    .withMessage("published should be true or false")
    .toBoolean(),
  (req, res, next) => {
    const postData = {
      title: req.body.title,
      author: req.user.id,
      published: req.body.published,
    };

    if (isPresent(req.body, "description")) {
      postData.description = req.body.description;
    }

    const post = new req.models.Post(postData);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    } else {
      post.save((err) => {
        if (err) {
          return next(err);
        }

        res.status(201).json({
          url: post.url,
        });
      });
    }
  },
];

module.exports.handleUpdatePost = [
  param("postId").customSanitizer((value) => {
    return Types.ObjectId(value);
  }),
  isAuthor,
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("title should be 1-100 characters long"),
  body("description").optional().trim(),
  body("published")
    .optional()
    .isBoolean()
    .withMessage("published should be true or false")
    .toBoolean(),
  (req, res, next) => {
    const updatedData = {};
    if (isPresent(req.body, "title")) {
      updatedData.title = req.body.title;
    }

    if (isPresent(req.body, "published")) {
      updatedData.published = req.body.published;
    }

    if (isPresent(req.body, "description")) {
      updatedData.description = req.body.description;
    }

    req.models.Post.findByIdAndUpdate(
      req.params.postId,
      updatedData,
      {
        runValidators: true,
      },
      (err, post) => {
        if (err) {
          return next(err);
        }

        return res.status(200).json({
          url: post.url,
        });
      }
    );
  },
];

module.exports.handleDeletePost = [
  param("postId").customSanitizer((value) => {
    return Types.ObjectId(value);
  }),
  isAuthor,
  (req, res, next) => {
    req.models.Post.findByIdAndDelete(req.params.postId, (err) => {
      if (err) {
        return next(err);
      }

      res.status(204).end();
    });
  },
];
