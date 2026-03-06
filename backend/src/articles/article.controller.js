const Article = require("./article.model");
const { uploadToCloudinary } = require("../config/cloudinary");
const Parser = require("rss-parser");
const axios = require("axios");
const cheerio = require("cheerio");

const parser = new Parser();

/* ---------------- SLUG FUNCTION ---------------- */

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");

/* ---------------- CREATE ARTICLE ---------------- */

const postAnArticle = async (req, res) => {
  try {
    const { title, description, type, author, readMoreText } = req.body;
    let imageUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "articles");
      imageUrl = result.secure_url;
    }

    let baseSlug = slugify(title);
    let slug = baseSlug;
    let suffix = 1;

    while (await Article.findOne({ slug })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const newArticle = new Article({
      title,
      slug,
      description,
      image: imageUrl,
      type: type || "article",
      author,
      readMoreText,
    });

    await newArticle.save();

    res.status(200).send({
      message: "Article created successfully",
      article: newArticle,
    });
  } catch (error) {
    console.error("❌ Failed to create article:", error);
    res.status(500).send({
      message: "Failed to create article",
      error: error.message,
    });
  }
};

/* ---------------- GET ALL ARTICLES ---------------- */

const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.status(200).send(articles);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to fetch articles" });
  }
};

/* ---------------- GET SINGLE ARTICLE ---------------- */

const getSingleArticle = async (req, res) => {
  try {
    const { slug } = req.params;

    let article = await Article.findOne({ slug });

    if (!article) {
      article = await Article.findById(slug);
    }

    if (!article) {
      return res.status(404).send({ message: "Article not found" });
    }

    res.status(200).send(article);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to fetch article" });
  }
};

/* ---------------- UPDATE ARTICLE ---------------- */

const updateArticle = async (req, res) => {
  try {
    const { slug } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "articles");
      updateData.image = result.secure_url;
    }

    let article = await Article.findOne({ slug });

    if (!article) {
      article = await Article.findById(slug);
    }

    if (!article) {
      return res.status(404).send({ message: "Article not found" });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      article._id,
      updateData,
      { new: true },
    );

    res.status(200).send({
      message: "Article updated successfully",
      article: updatedArticle,
    });
  } catch (error) {
    console.error("❌ Failed to update article:", error);
    res.status(500).send({
      message: "Failed to update article",
      error: error.message,
    });
  }
};

/* ---------------- DELETE ARTICLE ---------------- */

const deleteArticle = async (req, res) => {
  try {
    const { slug } = req.params;

    let article = await Article.findOne({ slug });

    if (!article) {
      article = await Article.findById(slug);
    }

    if (!article) {
      return res.status(404).send({ message: "Article not found" });
    }

    await Article.findByIdAndDelete(article._id);

    res.status(200).send({
      message: "Article deleted successfully",
      article,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to delete article" });
  }
};

/* ---------------- SUSPEND ARTICLE ---------------- */

const suspendArticle = async (req, res) => {
  try {
    const { slug } = req.params;

    let article = await Article.findOne({ slug });

    if (!article) {
      article = await Article.findById(slug);
    }

    if (!article) {
      return res.status(404).send({ message: "Article not found" });
    }

    article.suspended = !article.suspended;

    await article.save();

    res.status(200).send({
      message: `Article ${article.suspended ? "suspended" : "active"}`,
      article,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Failed to update article suspension",
    });
  }
};

/* ---------------- SUBSTACK SYNC ---------------- */

const syncSubstackArticles = async (req, res) => {
  try {

    let offset = 0;
    const limit = 20;
    let totalSynced = 0;

    while (true) {

      const response = await axios.get(
        `https://sitaseverson.substack.com/api/v1/archive?limit=${limit}&offset=${offset}`
      );

      const posts = response.data;

      if (!posts || posts.length === 0) break;

      for (const post of posts) {

        const slug = post.slug;

        const exists = await Article.findOne({ slug });

        if (exists) continue;

        /* -------- Fetch FULL article page -------- */

        const articleURL = `https://sitaseverson.substack.com/p/${slug}`;

        const page = await axios.get(articleURL);

        const $ = cheerio.load(page.data);

        const articleHTML = $(".available-content").html() || "";

        /* -------- Generate description -------- */

        const description = articleHTML
          .replace(/<[^>]*>?/gm, "")
          .substring(0, 100);

        /* -------- Save article -------- */

        const newArticle = new Article({
          title: post.title,
          slug: slug,
          description: description,
          content: articleHTML,
          author: post.author?.name || "Sita Severson",
          image: post.cover_image || "",
          type: "article",
          readMoreText: "Read More",
          createdAt: new Date(post.post_date),
        });

        await newArticle.save();

        totalSynced++;
      }

      offset += limit;

      console.log(`Fetched ${offset} posts so far...`);
    }

    res.status(200).send({
      message: "All Substack articles synced successfully",
      totalSynced
    });

  } catch (error) {

    console.error("Substack Sync Error:", error.response?.data || error.message);

    res.status(500).send({
      message: "Failed to sync Substack articles",
      error: error.message
    });
  }
};

/* ---------------- EXPORTS ---------------- */

module.exports = {
  postAnArticle,
  getAllArticles,
  getSingleArticle,
  updateArticle,
  deleteArticle,
  suspendArticle,
  syncSubstackArticles,
};
