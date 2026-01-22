const express = require("express");
const router = express.Router();
const CmsPage = require("./pages.model");
const multer = require("multer");
const { uploadToCloudinary } = require("../config/cloudinary");

// Configure Multer (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });


// ✅ Mock Middleware (since original files are missing)
const tenantMiddleware = (req, res, next) => {
  req.tenantId = "demo-tenant"; // Default tenant
  next();
};

const ensureCmsEnabled = (req, res, next) => {
  // Always enabled for demo
  next();
};

const auth0Middleware = (req, res, next) => {
  // Mock admin user with valid ObjectId
  req.user = { type: "admin", id: "507f1f77bcf86cd799439011" };
  next();
};


/* ---------- PUBLIC: Get published CMS page ---------- */
router.get("/:slug", tenantMiddleware, ensureCmsEnabled, async (req, res) => {
  try {
    const page = await CmsPage.findOne({
      tenantId: req.tenantId,
      slug: req.params.slug,
      status: "published",
    }).lean();

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json(page);
  } catch (err) {
    console.error("❌ CMS get page error:", err);
    res.status(500).json({ message: "Failed to load page" });
  }
});

/* ---------- ADMIN: Get CMS page (any status) ---------- */
router.get("/admin/:slug", auth0Middleware, tenantMiddleware, async (req, res) => {
  try {
    const page = await CmsPage.findOne({
      tenantId: req.tenantId,
      slug: req.params.slug,
    });

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json(page);
  } catch (err) {
    console.error("❌ CMS admin get page error:", err);
    res.status(500).json({ message: "Failed to load page" });
  }
});

/* ---------- ADMIN: List CMS pages ---------- */
router.get("/", auth0Middleware, tenantMiddleware, async (req, res) => {
  try {
    const pages = await CmsPage.find({ tenantId: req.tenantId })
      .select('slug status updatedAt editorType')
      .sort({ updatedAt: -1 });

    res.json(pages);
  } catch (err) {
    console.error("❌ CMS list error:", err);
    res.status(500).json({ message: "Failed to fetch pages" });
  }
});

/* ---------- ADMIN: Create/Update CMS page ---------- */
router.post("/", auth0Middleware, tenantMiddleware, async (req, res) => {
  try {
    const { slug, sections, status, editorType } = req.body;

    if (!slug || !sections) {
      return res.status(400).json({ message: "slug and sections are required" });
    }

    // Handle both array and object formats
    let normalizedSections;

    if (Array.isArray(sections)) {
      normalizedSections = sections;
    } else {
      // Convert object to array format
      normalizedSections = Object.entries(sections).map(([key, content]) => ({ key, content }));
    }

    const page = await CmsPage.findOneAndUpdate(
      { tenantId: req.tenantId, slug },
      {
        tenantId: req.tenantId,
        slug,
        sections: normalizedSections,
        status: status || "published",
        editorType: editorType || "json", // Track which editor was used
        createdBy: req.user.id,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json(page);
  } catch (err) {
    console.error("❌ CMS save error:", err);
    res.status(500).json({ message: "Failed to save CMS page", error: err.message });
  }
});

/* ---------- ADMIN: Toggle publish/unpublish ---------- */
router.patch("/:slug/status", auth0Middleware, tenantMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["published", "draft"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const page = await CmsPage.findOneAndUpdate(
      { tenantId: req.tenantId, slug: req.params.slug },
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json(page);
  } catch (err) {
    console.error("❌ CMS status error:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
});

/* ---------- ADMIN: Delete CMS page ---------- */
router.delete("/:slug", auth0Middleware, tenantMiddleware, async (req, res) => {
  try {
    const page = await CmsPage.findOneAndDelete({
      tenantId: req.tenantId,
      slug: req.params.slug,
    });

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ CMS delete error:", err);
    res.status(500).json({ message: "Failed to delete page" });
  }
});

/* ---------- ADMIN: Upload image for CMS ---------- */
router.post("/upload", auth0Middleware, tenantMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Reuse existing cloudinary config
    const result = await uploadToCloudinary(
      req.file.buffer,
      "pages" // Using "pages" folder instead of complex tenant folder
    );

    // Return format compatible with GrapesJS Asset Manager & Editor
    res.json({
      success: true,
      url: result.secure_url,
      filename: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      data: [result.secure_url]
    });
  } catch (err) {
    console.error("❌ CMS upload error:", err);
    res.status(500).json({ message: "Failed to upload image", error: err.message });
  }
});


// Special Suspend Route for CmsList Compatibility (Optional, or update Frontend)
// The frontend uses PUT /suspend. Reference uses PATCH /status.
// Adapter:
router.put("/pages/:id/suspend", auth0Middleware, tenantMiddleware, async (req, res) => {
  try {
    const { suspended } = req.body;
    const status = suspended ? 'draft' : 'published';

    const page = await CmsPage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!page) return res.status(404).json({ error: "Page not found" });
    res.json({ ...page.toObject(), suspended: page.status === 'draft' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Adapter for DELETE /:id (Frontend might use ID instead of slug)
router.delete("/pages/id/:id", auth0Middleware, tenantMiddleware, async (req, res) => {
  try {
    const page = await CmsPage.findByIdAndDelete(req.params.id);
    if (!page) return res.status(404).json({ error: "Page not found" });
    res.json({ message: "Page deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete page" });
  }
});


module.exports = router;
