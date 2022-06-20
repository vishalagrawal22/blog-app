const express = require("express");

const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const createHttpError = require("http-errors");
const cookieParser = require("cookie-parser");
const xssClean = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
passport.use(
  new LocalStrategy(function (username, password, done) {
    models.User.findOne({ name: username }).exec((err, user) => {
      if (err) {
        done(err);
      }

      if (!user) {
        return done(null, false, {
          message: "Invalid username",
        });
      }

      const userPassword = user.password;
      delete user._doc.password;
      bcrypt.compare(password, userPassword, (err, res) => {
        if (err) {
          done(err);
        }

        if (res) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: "Invalid password",
          });
        }
      });
    });
  })
);

const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    },
    function (jwtPayload, done) {
      if (!jwtPayload) {
        done(null, false, { message: "Invalid token" });
      }

      models.User.findById(jwtPayload.userId)
        .select({
          password: 0,
        })
        .exec((err, user) => {
          if (err) {
            done(err);
          }

          if (!user) {
            done(null, false, { message: "Invalid user id" });
          }

          done(null, user);
        });
    }
  )
);

const models = require("./models");
const routes = require("./routes");

const app = express();

app.use(xssClean());
app.use(
  mongoSanitize({
    allowDots: true,
  })
);
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  req.models = models;
  next();
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: "));

app.use("/", routes.auth);
app.use("/api/v1", routes.api);

// 404 handler
app.use((req, res, next) => {
  next(createHttpError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const response = {
    message: err.message,
  };

  if (app.get("env") === "development") {
    response.error = err;
  }

  res.status(err.status || 500);
  res.json(response);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
