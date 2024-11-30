const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Ensure that a user can like a post only once by making userId and postId a unique combination
likeSchema.index({ userId: 1, postId: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
