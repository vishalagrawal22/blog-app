const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const createRefreshToken = (userId) => {
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_VALID_TIME,
  });
  return refreshToken;
};

const createAccessToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_VALID_TIME,
  });
  return accessToken;
};

const sendUser = (req, res, userId) => {
  const refreshToken = createRefreshToken(userId);
  const accessToken = createAccessToken(userId);
  const secureCookie = req.app.get("env") === "development" ? false : true;
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      secure: secureCookie,
      httpOnly: true,
    })
    .json({
      accessToken: accessToken,
    });
};

module.exports.handleLogin = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next({
        status: 401,
        message: info,
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        return next(err);
      }

      return sendUser(req, res, user.id);
    });
  })(req, res);
};

module.exports.handleRegister = [
  body("username")
    .trim()
    .exists({
      checkFalsy: true,
    })
    .withMessage("username is required")
    .custom(
      (value, { req }) =>
        new Promise((resolve, reject) => {
          req.models.User.findOne({ name: value }).exec((err, user) => {
            if (err) {
              return reject(err);
            }

            if (!user) {
              resolve();
            } else {
              reject("username taken");
            }
          });
        })
    ),
  body("email")
    .optional({
      nullable: true,
    })
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("email should be valid")
    .custom(
      (value, { req }) =>
        new Promise((resolve, reject) => {
          req.models.User.findOne({ email: value }).exec((err, user) => {
            if (err) {
              return reject(err);
            }

            if (!user) {
              resolve();
            } else {
              reject("email taken");
            }
          });
        })
    ),
  body("password")
    .trim()
    .exists({
      checkFalsy: true,
    })
    .withMessage("password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        user: {
          name: req.body.username,
          email: req.body.email,
        },
        errors: errors.array(),
      });
    }

    bcrypt.hash(req.body.password, 10, (err, hashPassword) => {
      if (err) {
        return next(err);
      }

      const user = new req.models.User({
        name: req.body.username,
        email: req.body.email,
        password: hashPassword,
      });

      user.save((err) => {
        if (err) {
          return next(err);
        }

        return sendUser(req, res, user.id);
      });
    });
  },
];

module.exports.handleGenerateAccessToken = (req, res, next) => {
  const { refreshToken } = req.cookies;
  const valid = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  if (!valid) {
    return next({
      status: 401,
      message: "Invalid refresh token",
    });
  }

  const accessToken = createAccessToken(valid.userId);
  res.json({
    accessToken,
  });
};

module.exports.handleLogout = (req, res) => {
  res.status(204).clearCookie("refreshToken").end();
};
