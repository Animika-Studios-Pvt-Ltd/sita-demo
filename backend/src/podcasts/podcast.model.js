const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String }, // Image URL from Cloudinary
    podcastLink: { type: String, required: true }, // Link to the podcast episode
    releaseDate: { type: Date, default: Date.now },
    host: { type: String },
    suspended: { type: Boolean, default: false },
}, { timestamps: true });

const Podcast = mongoose.model('Podcast', podcastSchema);

module.exports = Podcast;
