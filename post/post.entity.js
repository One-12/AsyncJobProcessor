const mongoose = require('mongoose');

const postSchema = {
  title: { type: String, required: true },
  content: { type: String, required: true },
  resImages: [
    {
      size: { type: Number },
      content: { type: String },
    },
  ],
  views: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  type: { type: String, required: true },
  tags: { type: [String] },
  postedOn: { type: Date, default: Date.now },
  commentsCount: { type: Number, default: 0 },
  likesCount: { type: Number, default: 0 },
  userId: { type: String, required: true },
};

module.exports = mongoose.model('posts', postSchema);
