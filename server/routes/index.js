const express = require("express");
const { Router } = express;
const router = Router();

const auth = require("./auth");
const posts = require("./posts");
const comments = require("./comments");

router.use("/posts", posts);
router.use("/comments", comments);

module.exports = {
  auth,
  api: router,
};
