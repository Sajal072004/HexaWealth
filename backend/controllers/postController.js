const Post = require('../models/Post');

// Create a new post
exports.createPost = async (req, res) => {
    const { title, content, tags } = req.body;
    try {
        const newPost = new Post({
            userId: req.user.id,
            title,
            content,
            tags,
            isApproved: false,
        });
        await newPost.save();
        res.status(201).json({ message: 'Post created successfully and pending approval.' , newPost });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all approved posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find({ isApproved: true }).populate('userId', 'email');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSpecificPost = async (req, res) => {
    const { id } = req.params;  // Extract the post ID from the URL parameter

    try {
        // Find the post by ID and populate the userId field with email
        const post = await Post.findById(id).populate('userId', 'email firstName lastName isAdmin');
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        // Return the post details
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get user's pending posts
exports.getPendingPosts = async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.user.id});
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getApprovedPosts = async (req, res) => {
    try {
        const posts = await Post.find({ isApproved:true});
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllPendingPosts = async(req,res) => {
    try {
        const posts = await Post.find({isApproved: false });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Approve a post (admin only)
exports.approvePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        if (!post) return res.status(404).json({ error: 'Post not found.' });
        res.status(200).json({ message: 'Post approved successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a post (admin only)
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found.' });
        res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

