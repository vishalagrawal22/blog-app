const express = require("express");
const { Router } = express;
const router = Router();

const auth = require("./auth");
const posts = require("./posts");
const comments = require("./comments");
const users = require("./users");

router.use("/posts", posts);
router.use("/comments", comments);
router.use("/users", users);

module.exports = {
  auth,
  api: router,
};
