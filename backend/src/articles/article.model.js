const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
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
        enum: ['article', 'blogs'],
        default: 'article'
    },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
