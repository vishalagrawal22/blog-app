const express = require("express");
const { Router } = express;
const router = Router();

const commentsController = require("../controllers/commentsController");

router.put("/:commentId", commentsController.handleUpdateComment);
router.delete("/:commentId", commentsController.handleDeleteComment);

module.exports = router;
