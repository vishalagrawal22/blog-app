const express = require("express");
const { Router } = express;
const router = Router();

const auth = require("./auth");
const posts = require("./posts");

router.use("/posts", posts);

module.exports = {
  auth,
  api: router,
};
