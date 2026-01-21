const Book = require("./book.model");
const Review = require("../review/review.model");
const { cloudinary, uploadToCloudinary } = require("../config/cloudinary.js");
const axios = require('axios');
const FormData = require('form-data');

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function uploadToIPFS(buffer, filename) {
  try {
    console.log(`📤 Uploading to IPFS: ${filename}`);

    const formData = new FormData();
    formData.append('file', buffer, { filename });

    const auth = Buffer.from(
      `${process.env.INFURA_PROJECT_ID}:${process.env.INFURA_API_KEY_SECRET}`
    ).toString('base64');

    const response = await axios.post(
      'https://ipfs.infura.io:5001/api/v0/add',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Basic ${auth}`
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    const cid = response.data.Hash;
    console.log(`✅ IPFS Upload Success! CID: ${cid}`);
    return cid;
  } catch (error) {
    console.error('❌ IPFS upload error:', error.response?.data || error.message);
    throw new Error('Failed to upload to IPFS: ' + error.message);
  }
}

const postABook = async (req, res) => {
  try {
    let baseSlug = slugify(req.body.title);
    let slug = baseSlug;
    let suffix = 1;

    while (await Book.findOne({ slug })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const bookData = {
      title: req.body.title,
      subtitle: req.body.subtitle || "",
      author: req.body.author,
      aboutBook: req.body.aboutBook || "",
      description: req.body.description,
      oldPrice: parseFloat(req.body.oldPrice) || 0,
      newPrice: parseFloat(req.body.newPrice) || 0,
      discount: parseFloat(req.body.discount) || 0,
      language: req.body.language || "",
      binding: req.body.binding || "",
      publisher: req.body.publisher || "",
      isbn: req.body.isbn || "",
      publishingDate: req.body.publishingDate || "",
      pages: parseInt(req.body.pages) || 0,
      height: parseFloat(req.body.height) || null,
      width: parseFloat(req.body.width) || null,
      length: parseFloat(req.body.length) || null,
      weight: parseFloat(req.body.weight) || null,
      stock: parseInt(req.body.stock) || 100,
      slug,
      ebookType: 'none',
      ipfsCID: null,
      ebookPath: null
    };

    if (req.files) {
      if (req.files.coverImage && req.files.coverImage[0]) {
        const coverResult = await uploadToCloudinary(
          req.files.coverImage[0].buffer,
          "bookstore/books/covers"
        );
        bookData.coverImage = coverResult.secure_url;
        bookData.coverImagePublicId = coverResult.public_id;
      }

      if (req.files.backImage && req.files.backImage[0]) {
        const backResult = await uploadToCloudinary(
          req.files.backImage[0].buffer,
          "bookstore/books/backs"
        );
        bookData.backImage = backResult.secure_url;
        bookData.backImagePublicId = backResult.public_id;
      }

      if (req.body.chapters) {
        try {
          bookData.chapters = JSON.parse(req.body.chapters);
        } catch (err) {
          console.warn("⚠️ Invalid chapters JSON, skipping:", err.message);
        }
      }

      if (req.files.ebookFile && req.files.ebookFile[0]) {
        const ebookBuffer = req.files.ebookFile[0].buffer;
        const ebookFilename = `${req.body.title}.epub`;

        console.log(`📚 Processing ebook: ${ebookFilename}`);

        try {
          const ipfsCID = await uploadToIPFS(ebookBuffer, ebookFilename);

          bookData.ebookType = 'ipfs';
          bookData.ipfsCID = ipfsCID;
          bookData.ebookPath = null;

          console.log(`✅ eBook saved to IPFS with CID: ${ipfsCID}`);
        } catch (ipfsError) {
          console.error('❌ IPFS upload failed:', ipfsError);
          return res.status(500).send({
            message: "Failed to upload eBook to IPFS",
            error: ipfsError.message
          });
        }
      }
    }

    const newBook = new Book(bookData);
    await newBook.save();

    console.log("✅ Book created successfully:", newBook.title);
    res.status(200).send({
      message: "Book posted successfully",
      book: newBook
    });
  } catch (error) {
    console.error("❌ Error creating book:", error);
    res.status(500).send({
      message: "Failed to create book",
      error: error.message
    });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).send(books);
  } catch (error) {
    console.error("Error fetching books", error);
    res.status(500).send({ message: "Failed to fetch books" });
  }
};

const getAllBooksForUsers = async (req, res) => {
  try {
    const books = await Book.find({ suspended: false }).sort({ createdAt: -1 });
    res.status(200).send(books);
  } catch (error) {
    console.error("Error fetching user books", error);
    res.status(500).send({ message: "Failed to fetch books" });
  }
};

const getSingleBook = async (req, res) => {
  try {
    const { slug } = req.params;

    console.log("🔍 Fetching book with:", slug);

    let book;
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(slug);

    if (isValidObjectId) {
      book = await Book.findById(slug).lean();
    }

    if (!book) {
      book = await Book.findOne({ slug }).lean();
    }

    if (!book) {
      console.log("❌ Book not found");
      return res.status(404).send({ message: "Book not found!" });
    }

    console.log("✅ Found book:", book.title);

    const reviews = await Review.find({ bookId: book._id })
      .sort({ createdAt: -1 })
      .lean();

    book.reviews = reviews;
    res.status(200).send(book);

  } catch (error) {
    console.error("❌ Error in getSingleBook:", error.message);
    res.status(500).send({
      message: "Failed to fetch book"
    });
  }
};

const updateBook = async (req, res) => {
  try {
    const { slug } = req.params;

    let existingBook = await Book.findOne({ slug });
    if (!existingBook) {
      existingBook = await Book.findById(slug);
    }

    if (!existingBook) {
      return res.status(404).send({ message: "Book not found!" });
    }

    const updateData = { ...existingBook._doc };

    const fieldsToUpdate = [
      "title", "subtitle", "author", "aboutBook", "description",
      "oldPrice", "newPrice", "discount", "language", "binding",
      "publisher", "isbn", "publishingDate", "pages",
      "height", "width", "length", "weight", "stock"
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        updateData[field] = isNaN(req.body[field])
          ? req.body[field]
          : parseFloat(req.body[field]);
      }
    });

    if (req.files) {
      if (req.files.coverImage && req.files.coverImage[0]) {
        if (existingBook.coverImagePublicId) {
          await cloudinary.uploader.destroy(existingBook.coverImagePublicId);
        }

        const coverResult = await uploadToCloudinary(
          req.files.coverImage[0].buffer,
          "bookstore/books/covers"
        );
        updateData.coverImage = coverResult.secure_url;
        updateData.coverImagePublicId = coverResult.public_id;
      }

      if (req.files.backImage && req.files.backImage[0]) {
        if (existingBook.backImagePublicId) {
          await cloudinary.uploader.destroy(existingBook.backImagePublicId);
        }

        const backResult = await uploadToCloudinary(
          req.files.backImage[0].buffer,
          "bookstore/books/backs"
        );
        updateData.backImage = backResult.secure_url;
        updateData.backImagePublicId = backResult.public_id;
      }
      if (req.body.chapters) {
        try {
          updateData.chapters = JSON.parse(req.body.chapters);
        } catch (err) {
          console.warn("⚠️ Invalid chapters JSON, skipping update:", err.message);
        }
      }

      if (req.files.ebookFile && req.files.ebookFile[0]) {
        const ebookBuffer = req.files.ebookFile[0].buffer;
        const ebookFilename = `${req.body.title || existingBook.title}.epub`;

        try {
          const ipfsCID = await uploadToIPFS(ebookBuffer, ebookFilename);

          updateData.ebookType = 'ipfs';
          updateData.ipfsCID = ipfsCID;
          updateData.ebookPath = null;

          console.log(`✅ eBook updated with new IPFS CID: ${ipfsCID}`);
        } catch (ipfsError) {
          console.error('❌ IPFS upload failed during update:', ipfsError);
          return res.status(500).send({
            message: "Failed to upload eBook to IPFS",
            error: ipfsError.message
          });
        }
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(
      existingBook._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    console.log("✅ Book updated successfully:", updatedBook.title);
    res.status(200).send({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error("❌ Error updating book:", error);
    res.status(500).send({
      message: "Failed to update book",
      error: error.message,
    });
  }
};

const deleteABook = async (req, res) => {
  try {
    const { slug } = req.params;

    let deletedBook = await Book.findOne({ slug });
    if (!deletedBook) {
      deletedBook = await Book.findById(slug);
    }

    if (!deletedBook) {
      return res.status(404).send({ message: "Book not found!" });
    }

    await Book.findByIdAndDelete(deletedBook._id);

    const deletePromises = [];
    if (deletedBook.coverImagePublicId) {
      deletePromises.push(
        cloudinary.uploader.destroy(deletedBook.coverImagePublicId)
          .then(() => console.log("✅ Cover image deleted from Cloudinary"))
          .catch(err => console.error("❌ Error deleting cover image:", err))
      );
    }

    if (deletedBook.backImagePublicId) {
      deletePromises.push(
        cloudinary.uploader.destroy(deletedBook.backImagePublicId)
          .then(() => console.log("✅ Back image deleted from Cloudinary"))
          .catch(err => console.error("❌ Error deleting back image:", err))
      );
    }

    await Promise.all(deletePromises);

    res.status(200).send({
      message: "Book deleted successfully",
      book: deletedBook,
    });
  } catch (error) {
    console.error("Error deleting book", error);
    res.status(500).send({
      message: "Failed to delete book",
      error: error.message
    });
  }
};

const suspendBook = async (req, res) => {
  try {
    const { slug } = req.params;

    let book = await Book.findOne({ slug });
    if (!book) {
      book = await Book.findById(slug);
    }

    if (!book) return res.status(404).send({ message: "Book not found" });

    book.suspended = true;
    await book.save();

    res.status(200).send({ message: "Book suspended successfully", book });
  } catch (error) {
    console.error("Error suspending book", error);
    res.status(500).send({ message: "Failed to suspend book" });
  }
};

const unsuspendBook = async (req, res) => {
  try {
    const { slug } = req.params;

    let book = await Book.findOne({ slug });
    if (!book) {
      book = await Book.findById(slug);
    }

    if (!book) return res.status(404).send({ message: "Book not found" });

    book.suspended = false;
    await book.save();

    res.status(200).send({ message: "Book unsuspended successfully", book });
  } catch (error) {
    console.error("Error unsuspending book", error);
    res.status(500).send({ message: "Failed to unsuspend book" });
  }
};

module.exports = {
  postABook,
  getAllBooks,
  getAllBooksForUsers,
  getSingleBook,
  updateBook,
  deleteABook,
  suspendBook,
  unsuspendBook,
};
