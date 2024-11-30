const express = require('express');
const { createComment, getComments, getCommentsCount } = require('../controllers/commentController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createComment);
router.get('/:postId', authMiddleware, getComments);

router.get('/', getCommentsCount);

module.exports = router;
