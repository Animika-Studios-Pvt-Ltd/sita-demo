// src/author/author.controller.js

const Author = require('./author.model');
const { uploadToCloudinary } = require('../config/cloudinary');
const { v4: uuidv4 } = require('uuid');

// Upload a single image file to Cloudinary
async function handleImageUpload(file, defaultAlt = 'Uploaded Image') {
  if (!file || !file.buffer) return null;
  const result = await uploadToCloudinary(file.buffer, 'author');
  return {
    src: result.secure_url,
    alt: file.originalname || defaultAlt || uuidv4(),
  };
}

async function getAuthorContent(req, res) {
  try {
    const content = await Author.findById('singleton_author');
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Author content not found',
        message: 'No author content has been created yet.'
      });
    }
    return res.status(200).json(content);
  } catch (error) {
    console.error('❌ Get Author Error:', error);
    return res.status(500).json({ error: 'Failed to fetch author content' });
  }
}

async function upsertAuthorContent(req, res) {
  try {
    const data = JSON.parse(req.body.data);
    const files = req.files;

    if (files?.motifImage?.[0]) {
      data.sectionHeading.motifImage = await handleImageUpload(files.motifImage[0], 'Motif Image');
    }

    if (files?.rightImage?.[0]) {
      data.aboutAuthor.rightImage = await handleImageUpload(files.rightImage[0], 'About Author Right Image');
    }

    if (files?.leftImage?.[0]) {
      data.workingCreed.leftImage = await handleImageUpload(files.leftImage[0], 'Working Creed Left Image');
    }

    if (files?.middleImage?.[0]) {
      data.aboutAuthor.middleImage = await handleImageUpload(files.middleImage[0], 'Middle Author Image');
    }

    const updated = await Author.findOneAndUpdate(
      { _id: 'singleton_author' },
      { ...data, _id: 'singleton_author' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json(updated);
  } catch (error) {
    console.error('❌ Upsert Author Error:', error);
    return res.status(500).json({ error: 'Failed to save author content' });
  }
}

// NEW: Upload Working Creed Image
async function uploadWorkingCreedImage(req, res) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageData = await handleImageUpload(file, 'Working Creed Image');
    
    const author = await Author.findById('singleton_author');
    if (!author) {
      return res.status(404).json({ error: 'Author content not found' });
    }

    // Add new image to the images array
    if (!author.workingCreed.images) {
      author.workingCreed.images = [];
    }
    author.workingCreed.images.push(imageData);
    
    await author.save();
    return res.status(200).json({ success: true, image: imageData });
  } catch (error) {
    console.error('❌ Upload Working Creed Image Error:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
}

// NEW: Delete Working Creed Image
async function deleteWorkingCreedImage(req, res) {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const author = await Author.findById('singleton_author');
    if (!author) {
      return res.status(404).json({ error: 'Author content not found' });
    }

    // Remove the image from the array
    author.workingCreed.images = author.workingCreed.images.filter(
      img => img.src !== imageUrl
    );
    
    await author.save();
    return res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('❌ Delete Working Creed Image Error:', error);
    return res.status(500).json({ error: 'Failed to delete image' });
  }
}

module.exports = {
  getAuthorContent,
  upsertAuthorContent,
  uploadWorkingCreedImage,
  deleteWorkingCreedImage,
};
