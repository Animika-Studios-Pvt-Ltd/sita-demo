const express = require("express");
const router = express.Router();
const multer = require("multer");
const Page = require("./pages.model");
const { cache } = require('../utils/cache');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  getAllPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
} = require("./pages.controller");

// Public route
router.get('/:slug', cache(60), getPageBySlug);

// Admin routes
router.get('/', cache(180), getAllPages);
router.post(
  "/",
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "sectionImages", maxCount: 50 },
  ]),
  createPage
);
router.put(
  "/:id",
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "sectionImages", maxCount: 50 },
  ]),
  updatePage
);
router.delete("/:id", deletePage);

router.put("/:id/suspend", async (req, res) => {
  try {
    const { suspended } = req.body;
    const page = await Page.findByIdAndUpdate(
      req.params.id,
      { suspended },
      { new: true }
    );
    if (!page) return res.status(404).json({ error: "Page not found" });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
