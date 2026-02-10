const Page = require("./pages.model");
const Event = require("../events/event.model"); // Import Event model
const { uploadToCloudinary } = require("../config/cloudinary");

// Helper to sync page image to event
async function syncEventImage(page) {
  if (!page || !page.slug) return;

  // 1. Try to get image from Hero Section
  const heroSection = page.sections && page.sections.find(s => s.key === 'hero');
  let imageUrl = heroSection?.content?.backgroundImage;

  // 2. Fallback to page.bannerImage if available (and if it's a string or has src)
  if (!imageUrl && page.bannerImage) {
    imageUrl = typeof page.bannerImage === 'string' ? page.bannerImage : page.bannerImage.src;
  }

  if (imageUrl) {
    console.log(`[Sync] Found image for page ${page.slug}:`, imageUrl);

    // Normalize slug to match bookingUrl variations
    // bookingUrl could be "yoga-therapy" or "/yoga-therapy"
    const slug = page.slug.replace(/^\//, ''); // Remove leading slash

    // Find corresponding event and update imageUrl
    // We try to match: strict slug, slug with slash, or whatever is in bookingUrl
    const event = await Event.findOne({
      $or: [
        { bookingUrl: slug },
        { bookingUrl: `/${slug}` },
        { bookingUrl: page.slug } // original
      ]
    });

    if (event) {
      event.imageUrl = imageUrl;
      await event.save();
      console.log(`[Sync] Updated event ${event.code} (${event.title}) with new image.`);
    } else {
      console.log(`[Sync] No matching event found for bookingUrl: ${slug}`);
    }
  }
}

async function handleImageUpload(file, defaultAlt = "Uploaded Image") {
  if (!file || !file.buffer) return null;
  const result = await uploadToCloudinary(file.buffer, "pages");
  return {
    src: result.secure_url,
    alt: file.originalname || defaultAlt,
  };
}

async function getAllPages(req, res) {
  try {
    const pages = await Page.find()
      .populate("parentHeader", "title slug")
      .sort({ createdAt: -1 });
    return res.status(200).json(pages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch pages" });
  }
}

async function getPageBySlug(req, res) {
  try {
    const page = await Page.findOne({ slug: req.params.slug })
      .populate("parentHeader", "title slug");
    if (!page) return res.status(404).json({ error: "Page not found" });
    return res.status(200).json(page);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch page" });
  }
}

async function createPage(req, res) {
  try {
    const data = JSON.parse(req.body.data);
    const files = req.files;

    if (files?.bannerImage?.[0]) {
      data.bannerImage = await handleImageUpload(files.bannerImage[0], "Banner Image");
    }

    if (files?.sectionImages) {
      let secImageIndex = 0;
      for (let i = 0; i < files.sectionImages.length; i++) {
        const uploaded = await handleImageUpload(files.sectionImages[i]);
        if (!data.sections[secImageIndex]) data.sections[secImageIndex] = { images: [] };
        if (!data.sections[secImageIndex].images) data.sections[secImageIndex].images = [];
        data.sections[secImageIndex].images.push(uploaded);
        secImageIndex++;
      }
    }

    const newPage = await Page.create(data);

    // SYNC EVENT IMAGE
    await syncEventImage(newPage);

    const populated = await newPage.populate("parentHeader", "title slug");
    return res.status(201).json(populated);

  } catch (error) {
    console.error(error);

    if (error.code === 11000 && error.keyPattern?.slug) {
      return res.status(400).json({ error: "This page link (slug) is already taken. Please choose another." });
    }

    if (error.name === "ValidationError") {
      const msg = Object.values(error.errors)
        .map((e) => e.message)
        .join(", ");
      return res.status(400).json({ error: msg });
    }

    return res.status(500).json({ error: "Failed to update page" });
  }

}

async function updatePage(req, res) {
  try {
    const data = JSON.parse(req.body.data);
    const files = req.files;

    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ error: "Page not found" });

    if (data.deleteBanner) {
      page.bannerImage = null;
    }

    if (files?.bannerImage?.[0]) {
      page.bannerImage = await handleImageUpload(files.bannerImage[0], "Banner Image");
    }

    if (files?.sectionImages) {
      let secImageIndex = 0;
      for (let i = 0; i < files.sectionImages.length; i++) {
        const uploaded = await handleImageUpload(files.sectionImages[i]);
        if (!data.sections[secImageIndex]) data.sections[secImageIndex] = { images: [] };
        if (!data.sections[secImageIndex].images) data.sections[secImageIndex].images = [];
        data.sections[secImageIndex].images.push(uploaded);
        secImageIndex++;
      }
    }

    page.title = data.title || page.title;
    page.slug = data.slug || page.slug;
    page.metaTitle = data.metaTitle || page.metaTitle;
    page.metaDescription = data.metaDescription || page.metaDescription;
    page.bannerPosition = data.bannerPosition || page.bannerPosition;
    page.headerType = data.headerType || page.headerType;
    page.displayLocations = data.displayLocations || page.displayLocations;
    page.content = data.content || page.content;
    page.sections = data.sections || page.sections;
    page.createdFrom = data.createdFrom || page.createdFrom; // Ensure createdFrom is updated
    page.parentHeader = data.parentHeader || null;

    await page.validate();

    const updated = await page.save({ validateBeforeSave: true });

    // SYNC EVENT IMAGE
    await syncEventImage(updated);

    const populated = await updated.populate("parentHeader", "title slug");
    return res.status(200).json(populated);

  } catch (error) {
    console.error(error);

    if (error.code === 11000 && error.keyPattern?.slug) {
      return res
        .status(400)
        .json({ error: "This page link (slug) is already taken. Please choose another." });
    }

    if (error.name === "ValidationError") {
      const msg = Object.values(error.errors)
        .map((e) => e.message)
        .join(", ");
      return res.status(400).json({ error: msg });
    }

    return res.status(500).json({ error: "Failed to update page" });
  }
}

async function deletePage(req, res) {
  try {
    const deleted = await Page.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Page not found" });
    return res.status(200).json({ message: "Page deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete page" });
  }
}


async function uploadImage(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No image provided" });
    const result = await handleImageUpload(req.file);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Image upload failed" });
  }
}

module.exports = {
  getAllPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
  uploadImage,
};
