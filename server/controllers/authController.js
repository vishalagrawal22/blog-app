const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const createRefreshToken = ({ userId, userName }) => {
  const refreshToken = jwt.sign(
    { userId, userName },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_VALID_TIME,
    }
  );
  return refreshToken;
};

const createAccessToken = ({ userId, userName }) => {
  const accessToken = jwt.sign(
    { userId, userName },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_VALID_TIME,
    }
  );
  return accessToken;
};

const sendUser = (req, res, userData) => {
  const refreshToken = createRefreshToken(userData);
  const accessToken = createAccessToken(userData);
  const productionCookie =
    req.app.get("env") === "development"
      ? {}
      : {
          secure: true,
          sameSite: "none",
        };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      ...productionCookie,
      httpOnly: true,
    })
    .json({
      accessToken: accessToken,
    });
};

module.exports.handleLogin = (req, res, next) => {
  passport.authenticate(
    "local",
    { failWithError: true, session: false },
    (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json(info);
      }

      req.login(user, { session: false }, (err) => {
        if (err) {
          return next(err);
        }

        return sendUser(req, res, {
          userId: user.id,
          userName: user.name,
        });
      });
    }
  )(req, res);
};

module.exports.handleRegister = [
  body("username")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("username should be 1-100 characters long")
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
    .optional()
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
    .isLength({ min: 1 })
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

      const userData = {
        name: req.body.username,
        password: hashPassword,
      };

      if (Object.prototype.hasOwnProperty.call(req.body, "email")) {
        userData.email = req.body.email;
      }

      const user = new req.models.User(userData);

      user.save((err) => {
        if (err) {
          return next(err);
        }

        return sendUser(req, res, {
          userId: user.id,
          userName: user.name,
        });
      });
    });
  },
];

module.exports.handleGenerateAccessToken = (req, res) => {
  jwt.verify(
    req.cookies.refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, user) => {
      if (err || !user) {
        return res.status(401).clearCookie("refreshToken").json({
          message: "Invalid refresh token",
        });
      }

      const { userId, userName } = user;
      const accessToken = createAccessToken({
        userId,
        userName,
      });

      res.json({
        accessToken,
      });
    }
  );
};

module.exports.handleLogout = (req, res) => {
  res.status(204).clearCookie("refreshToken").json();
};
