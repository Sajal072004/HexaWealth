const express = require('express');
const { likePost, removeLike, checkLike, getLikesCount } = require('../controllers/likeController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

// POST: Like a post
router.post('/', authMiddleware, likePost);

// DELETE: Remove like from a post
router.delete('/', authMiddleware, removeLike);

// GET: Check if user has already liked the post
router.get('/', authMiddleware, checkLike);

router.get('/likes', getLikesCount);

module.exports = router;
