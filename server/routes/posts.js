const express = require("express");
const { Router } = express;
const router = Router();

const postsController = require("../controllers/postsController");

router.get("/", postsController.handleGetAllPublishedPosts);
router.post("/", postsController.handleCreatePost);

router.get("/:postId", postsController.handleGetPost);
router.put("/:postId", postsController.handleUpdatePost);
router.delete("/:postId", postsController.handleDeletePost);

module.exports = router;
