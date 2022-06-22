const async = require("async");
const { Types } = require("mongoose");
const passport = require("passport");
const { param } = require("express-validator");

module.exports.getUser = (req, res, next) => {
  req.models.User.findById(req.params.userId)
    .select({
      password: 0,
    })
    .exec((err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(404).json({
          message: "user not found",
        });
      }

      res.status(200).json(user.toObject({ virtuals: true }));
    });
};

module.exports.getUserPosts = [
  param("userId").customSanitizer((value) => Types.ObjectId(value)),
  (req, res, next) => {
    async.parallel(
      {
        public: (cb) => {
          req.models.Post.find({
            published: true,
            author: req.params.userId,
          }).exec(cb);
        },
        private: (cb) => {
          passport.authenticate(
            "jwt",
            { failWithError: true, session: false },
            (err, user) => {
              if (err) {
                return cb(err);
              }

              if (!user || !user._id.equals(req.params.userId)) {
                return cb(null, []);
              }

              req.models.Post.find({
                published: false,
                author: req.params.userId,
              }).exec(cb);
            }
          )(req, res);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }

        res.status(200).json({
          posts: results.public
            .concat(results.private)
            .map((post) => post.toObject({ virtuals: true })),
        });
      }
    );
  },
];

module.exports.getUserComments = [
  param("userId").customSanitizer((value) => Types.ObjectId(value)),
  (req, res, next) => {
    req.models.Comment.find({ author: req.params.userId })
      .populate("post", {
        author: 1,
        title: 1,
        published: 1,
      })
      .exec((err, comments) => {
        if (err) {
          return next(err);
        }

        const filteredComments = comments.filter(
          (comment) => comment.post.published
        );

        passport.authenticate(
          "jwt",
          { failWithError: true, session: false },
          (err, user) => {
            if (err) {
              return next(err);
            }

            if (user) {
              const hiddenPostComments = comments.filter(
                (comment) =>
                  !comment.post.published &&
                  comment.post.author.equals(user._id)
              );
              filteredComments.push(...hiddenPostComments);
            }

            res.status(200).json({
              comments: filteredComments.map((comment) =>
                comment.toObject({ virtuals: true })
              ),
            });
          }
        )(req, res);
      });
  },
];
