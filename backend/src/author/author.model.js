const mongoose = require('mongoose');

// Paragraph inside aboutAuthor and workingCreed
const ParagraphSchema = new mongoose.Schema({
  text: { type: String, required: true },
  style: { type: String, default: '' },
}, { _id: false });

const LinkSchema = new mongoose.Schema({
  text: { type: String, required: true },
  to: { type: String, required: true },
}, { _id: false });

// For images (all images use this format)
const ImageSchema = new mongoose.Schema({
  src: { type: String, required: true },
  alt: { type: String, required: true },
}, { _id: false });

// Section Heading with motif image
const SectionHeadingSchema = new mongoose.Schema({
  text: { type: String, required: true },
  motifImage: { type: ImageSchema, required: true },
}, { _id: false });

// About Author > Left Text
const AboutAuthorLeftTextSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  paragraphs: { type: [ParagraphSchema], required: true },
}, { _id: false });

// About Author section
const AboutAuthorSchema = new mongoose.Schema({
  leftText: { type: AboutAuthorLeftTextSchema, required: true },
  rightImage: { type: ImageSchema, required: true },
  middleImage: { type: ImageSchema },
}, { _id: false });

// Working Creed > Right Text
const WorkingCreedRightTextSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  paragraphs: { type: [ParagraphSchema], required: true },
  link: { type: LinkSchema, required: true },
}, { _id: false });

// Working Creed section - UPDATED to support multiple images
const WorkingCreedSchema = new mongoose.Schema({
  leftImage: { type: ImageSchema, required: true }, // Keep for backward compatibility
  images: { type: [ImageSchema], default: [] }, // NEW: Array of images
  rightText: { type: WorkingCreedRightTextSchema, required: true },
}, { _id: false });

// Main Author schema
const AuthorSchema = new mongoose.Schema({
  _id: { type: String, default: 'singleton_author' },
  sectionHeading: { type: SectionHeadingSchema, required: true },
  aboutAuthor: { type: AboutAuthorSchema, required: true },
  workingCreed: { type: WorkingCreedSchema, required: true },
}, {
  timestamps: true,
  _id: false,
});

module.exports = mongoose.model('Author', AuthorSchema);
