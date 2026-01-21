const Blog = require("./blog.model");
const { uploadToCloudinary } = require("../config/cloudinary");

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const postABlog = async (req, res) => {
  try {
    const { title, description, type } = req.body;
    let imageUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "blogs");
      imageUrl = result.secure_url;
    }

    let baseSlug = slugify(title);
    let slug = baseSlug;
    let suffix = 1;
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const newBlog = new Blog({
      title,
      slug,
      description,
      image: imageUrl,
      type,
    });

    await newBlog.save();
    res.status(200).send({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    console.error("❌ Failed to create blog:", error);
    res.status(500).send({ message: "Failed to create blog", error: error.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).send(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to fetch blogs" });
  }
};

const getSingleBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    let blog = await Blog.findOne({ slug });
    if (!blog) {
      blog = await Blog.findById(slug);
    }

    if (!blog) return res.status(404).send({ message: "Blog not found" });

    res.status(200).send(blog);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to fetch blog" });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "blogs");
      updateData.image = result.secure_url;
    }

    let blog = await Blog.findOne({ slug });
    if (!blog) {
      blog = await Blog.findById(slug);
    }

    if (!blog) return res.status(404).send({ message: "Blog not found" });

    const updatedBlog = await Blog.findByIdAndUpdate(
      blog._id,
      updateData,
      { new: true }
    );

    res.status(200).send({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    console.error("❌ Failed to update blog:", error);
    res.status(500).send({ message: "Failed to update blog", error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { slug } = req.params;

    let blog = await Blog.findOne({ slug });
    if (!blog) {
      blog = await Blog.findById(slug);
    }

    if (!blog) return res.status(404).send({ message: "Blog not found" });

    await Blog.findByIdAndDelete(blog._id);

    res.status(200).send({ message: "Blog deleted successfully", blog });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to delete blog" });
  }
};

const suspendBlog = async (req, res) => {
  try {
    const { slug } = req.params;

    let blog = await Blog.findOne({ slug });
    if (!blog) {
      blog = await Blog.findById(slug);
    }

    if (!blog) return res.status(404).send({ message: "Blog not found" });

    blog.suspended = !blog.suspended;
    await blog.save();

    res.status(200).send({
      message: `Blog ${blog.suspended ? "suspended" : "active"}`,
      blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to update blog suspension" });
  }
};

module.exports = {
  postABlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  suspendBlog,
};
