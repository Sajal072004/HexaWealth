const express = require('express');
const { 
    createPost, 
    getPosts, 
    getPendingPosts, 
    approvePost, 
    deletePost, 
    getAllPendingPosts,  // Import the new function
    getApprovedPosts, getSpecificPost
} = require('../controllers/postController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

// User routes
router.post('/', authMiddleware, createPost);
router.get('/', authMiddleware, getPosts); // Get all posts
router.get('/post/:id', authMiddleware , getSpecificPost )
router.get('/pending', authMiddleware, getPendingPosts);

// Admin routes
router.get('/admin/pending', adminMiddleware, getAllPendingPosts); // Admin-specific pending posts
router.get('/admin/approved' , adminMiddleware , getApprovedPosts );
router.patch('/:id/approve', authMiddleware, adminMiddleware, approvePost);
router.delete('/:id', authMiddleware, adminMiddleware, deletePost);

module.exports = router;
