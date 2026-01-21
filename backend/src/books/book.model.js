const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    subtitle: { type: String },
    author: { type: String, required: true },
    aboutBook: { type: String },
    description: { type: String, required: true },
    coverImage: { type: String },
    coverImagePublicId: { type: String },
    backImage: { type: String },
    backImagePublicId: { type: String },
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    language: { type: String },
    binding: { type: String },
    publisher: { type: String },
    isbn: { type: String },
    publishingDate: { type: String },
    pages: { type: Number },
    height: { type: Number },
    width: { type: Number },
    length: { type: Number },
    weight: { type: Number },
    sold: { type: Number, default: 0 },
    stock: { type: Number, default: 100 },
    suspended: { type: Boolean, default: false },
    ebookType: { type: String, enum: ['local', 'ipfs', 'none'], default: 'none' },
    ebookPath: { type: String },
    ipfsCID: { type: String },
    lastReadPositions: {
      type: Map,
      of: String,
      default: {}
    },
    chapters: [
      {
        title: { type: String },
        description: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
