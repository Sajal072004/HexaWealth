const mongoose = require('mongoose');
const Like = require('../models/Like'); // Adjust the path as needed

// Utility function to check and convert string to ObjectId
const toObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ObjectId');
  }
  return new mongoose.Types.ObjectId(id);
};

// POST: Like a post
const likePost = async (req, res) => {
  const { userId, postId } = req.body;

  try {
    // Validate userId and postId
    const userObjectId = toObjectId(userId);
    const postObjectId = toObjectId(postId);

    // Check if the user has already liked this post
    const existingLike = await Like.findOne({ userId: userObjectId, postId: postObjectId });

    if (existingLike) {
      return res.status(400).json({ message: 'You have already liked this post.' });
    }

    // Create a new like
    const newLike = new Like({ userId: userObjectId, postId: postObjectId });
    await newLike.save();

    res.status(201).json({ message: 'Post liked successfully.' });
  } catch (err) {
    console.error('Error liking post:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// DELETE: Remove like from a post
const removeLike = async (req, res) => {
  const { userId, postId } = req.body;

  try {
    // Validate userId and postId
    const userObjectId = toObjectId(userId);
    const postObjectId = toObjectId(postId);

    // Find and remove the like
    const like = await Like.findOneAndDelete({ userId: userObjectId, postId: postObjectId });

    if (!like) {
      return res.status(404).json({ message: 'Like not found.' });
    }

    res.status(200).json({ message: 'Like removed successfully.' });
  } catch (err) {
    console.error('Error removing like:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET: Check if the user has already liked the post
const checkLike = async (req, res) => {
  const { userId, postId } = req.query;

  try {
    // Validate userId and postId
    const userObjectId = toObjectId(userId);
    const postObjectId = toObjectId(postId);

    const likeExists = await Like.findOne({ userId: userObjectId, postId: postObjectId });

    if (likeExists) {
      return res.status(200).json({ exists: true });
    }

    res.status(200).json({ exists: false });
  } catch (err) {
    console.error('Error checking like status:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET: Get the number of likes for a post
const getLikesCount = async (req, res) => {
  const { postId } = req.query;

  try {
    // Check if the postId is valid
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid postId' });
    }

    // Aggregate to count the number of likes for the post
    const likeCount = await Like.aggregate([
      { $match: { postId: new mongoose.Types.ObjectId(postId) } },  // Match the postId
      { $count: "likesCount" }  // Count the number of likes
    ]);

    if (likeCount.length === 0) {
      return res.status(200).json({ likesCount: 0 });
    }

    // Send the count as the response
    res.status(200).json({ likesCount: likeCount[0].likesCount });
  } catch (err) {
    console.error('Error getting likes count:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



module.exports = { likePost, removeLike, checkLike, getLikesCount };
