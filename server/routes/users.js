const express = require("express");
const { Router } = express;
const router = Router();

const usersController = require("../controllers/usersController");

router.get("/:userId", usersController.getUser);
router.get("/:userId/posts", usersController.getUserPosts);
router.get("/:userId/comments", usersController.getUserComments);

module.exports = router;
