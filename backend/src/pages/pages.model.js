const mongoose = require("mongoose");

// Image schema
const ImageSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    alt: { type: String, required: true },
    position: {
      type: String,
      enum: ["top", "bottom", "left", "right", "center"],
      default: "center",
    },
  },
  { _id: false }
);

// Text block schema
const TextBlockSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    alignment: {
      type: String,
      enum: ["left", "center", "right", "justify"],
      default: "left",
    },
  },
  { _id: false }
);

// Link schema
const LinkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    url: { type: String, required: true },
    style: {
      type: String,
      enum: ["primary", "secondary", "link"],
      default: "link",
    },
  },
  { _id: false }
);

// Section schema
const SectionSchema = new mongoose.Schema(
  {
    title: { type: String },
    subtitle: { type: String },
    backgroundColor: { type: String, default: "#ffffff" },
    layout: {
      type: String,
      enum: ["text-only", "image-left", "image-right", "full-banner", "split"],
      default: "text-only",
    },
    contentBlocks: [TextBlockSchema],
    images: [ImageSchema],
    links: [LinkSchema],
  },
  { _id: false }
);

const PageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    bannerImage: { type: ImageSchema },
    bannerPosition: {
      type: String,
      enum: ["top", "top-left", "top-right", "bottom", "hide"],
      default: "hide",
    },
    motif: { type: String, default: "/motif.webp" },

    displayLocations: {
      type: [String],
      enum: ["home", "header", "footer"],
      default: [],
    },

    headerType: {
      type: String,
      enum: ["heading", "subheading", "author-subheading", "publication-subheading", "Foundation-subheading", "letter-subheading", "beside-profile"],
      default: null,
    },

    createAnywhere: { type: Boolean, default: false },

    parentHeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page",
      default: null,
    },

    content: { type: String, default: "" },
    sections: [SectionSchema],
    suspended: { type: Boolean, default: false },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Page", PageSchema);
