const Article = require("./article.model");
const { uploadToCloudinary } = require("../config/cloudinary");

const slugify = (str) =>
    str
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-")
        .replace(/^-+|-+$/g, "");

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
            type: type || 'article',
            author,
            readMoreText,
        });

        await newArticle.save();
        res.status(200).send({ message: "Article created successfully", article: newArticle });
    } catch (error) {
        console.error("❌ Failed to create article:", error);
        res.status(500).send({ message: "Failed to create article", error: error.message });
    }
};

const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.status(200).send(articles);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch articles" });
    }
};

const getSingleArticle = async (req, res) => {
    try {
        const { slug } = req.params;
        let article = await Article.findOne({ slug });
        if (!article) {
            article = await Article.findById(slug);
        }

        if (!article) return res.status(404).send({ message: "Article not found" });

        res.status(200).send(article);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch article" });
    }
};

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

        if (!article) return res.status(404).send({ message: "Article not found" });

        const updatedArticle = await Article.findByIdAndUpdate(
            article._id,
            updateData,
            { new: true }
        );

        res.status(200).send({ message: "Article updated successfully", article: updatedArticle });
    } catch (error) {
        console.error("❌ Failed to update article:", error);
        res.status(500).send({ message: "Failed to update article", error: error.message });
    }
};

const deleteArticle = async (req, res) => {
    try {
        const { slug } = req.params;

        let article = await Article.findOne({ slug });
        if (!article) {
            article = await Article.findById(slug);
        }

        if (!article) return res.status(404).send({ message: "Article not found" });

        await Article.findByIdAndDelete(article._id);

        res.status(200).send({ message: "Article deleted successfully", article });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to delete article" });
    }
};

const suspendArticle = async (req, res) => {
    try {
        const { slug } = req.params;

        let article = await Article.findOne({ slug });
        if (!article) {
            article = await Article.findById(slug);
        }

        if (!article) return res.status(404).send({ message: "Article not found" });

        article.suspended = !article.suspended;
        await article.save();

        res.status(200).send({
            message: `Article ${article.suspended ? "suspended" : "active"}`,
            article,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to update article suspension" });
    }
};

module.exports = {
    postAnArticle,
    getAllArticles,
    getSingleArticle,
    updateArticle,
    deleteArticle,
    suspendArticle,
};
