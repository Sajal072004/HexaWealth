const Comment = require('../models/Comment');
const mongoose = require('mongoose');

// Create a comment
exports.createComment = async (req, res) => {
    const { postId, content } = req.body;
    try {
        const newComment = new Comment({
            postId,
            userId: req.user.id,
            content,
        });
        await newComment.save();
        res.status(201).json({ message: 'Comment added successfully.', newComment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get comments for a post
exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).populate('userId', 'email firstName lastName');
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET: Get the number of likes for a post
exports.getCommentsCount = async (req, res) => {
  const { postId } = req.query; // Extract postId from query

  try {
    // Debug: Log the received postId
    console.log("Received postId:", postId);

    // Validate postId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid postId" });
    }

    // Aggregate to count comments
    const commentCount = await Comment.aggregate([
      { $match: { postId: new mongoose.Types.ObjectId(postId) } }, // Match the postId
      { $count: "commentsCount" } // Count the number of comments
    ]);

    // If no comments found, return 0
    if (commentCount.length === 0) {
      return res.status(200).json({ commentsCount: 0 });
    }

    // Return the count
    res.status(200).json({ commentsCount: commentCount[0].commentsCount });
  } catch (err) {
    console.error("Error getting comments count:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
