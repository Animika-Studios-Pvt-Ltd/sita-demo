const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  content: { type: Object },
  author: { type: String, required: true },
  readMoreText: { type: String, required: false, default: 'Read More' },
  image: { type: String },
  suspended: { type: Boolean, default: false },
  type: {
    type: String,
    enum: ['blogs', 'inspiration'],
    default: 'blogs'
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
