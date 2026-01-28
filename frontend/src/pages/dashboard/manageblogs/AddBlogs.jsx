import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AddBlogs = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: { title: "", author: "", description: "", image: null },
  });

  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/blogs`);
      const data = await res.json();

      const filtered = data.filter((blog) => blog.type && blog.type === "blogs");

      setBlogs(filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const onSubmit = async (data) => {
    if (!description) {
      Swal.fire("Error", "Description is required", "error");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("author", data.author);
      formData.append("description", description);
      formData.append("type", "blogs");

      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      const url = editingId
        ? `${BACKEND_BASE_URL}/api/blogs/edit/${editingId}`
        : `${BACKEND_BASE_URL}/api/blogs/create-blog`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire(
          editingId ? "Blog Updated" : "Blog Added",
          editingId ? "Blog updated successfully!" : "Blog added successfully!",
          "success"
        );
        reset();
        setImagePreview(null);
        setDescription("");
        setEditingId(null);
        setViewMode("list");
        fetchBlogs();
      } else {
        Swal.fire("Error", result.message || "Something went wrong", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to save blog", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setValue("title", blog.title);
    setValue("author", blog.author);
    setDescription(blog.description);

    if (blog.image) {
      const imageUrl = blog.image.startsWith("http")
        ? blog.image
        : `${BACKEND_BASE_URL}${blog.image}`;
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }

    setViewMode("form");
  };

  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const requiredWidth = 1000;
      const requiredHeight = 500;
      const withinRange =
        Math.abs(img.width - requiredWidth) <= 25 &&
        Math.abs(img.height - requiredHeight) <= 25;

      const proceed = () => {
        setImagePreview(URL.createObjectURL(file));
        setValue("image", [file]);
      };

      if (!withinRange) {
        Swal.fire({
          icon: "warning",
          title: "Image Size Warning",
          html: `
          <p>Recommended size: <b>${requiredWidth} × ${requiredHeight} px</b></p>
          <p>You uploaded: <b>${img.width} × ${img.height} px</b></p>
          <p>Do you want to continue with this image?</p>
        `,
          showCancelButton: true,
          confirmButtonText: "Yes, use it",
          cancelButtonText: "Re-upload",
        }).then((result) => {
          if (result.isConfirmed) proceed();
        });
      } else {
        proceed();
      }
    };
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the blog!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b91c1c",
      cancelButtonColor: "#2563eb",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();

      if (res.ok) {
        Swal.fire("Deleted!", "Blog has been deleted.", "success");
        fetchBlogs();
      } else {
        Swal.fire("Error", result.message || "Failed to delete blog", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete blog", "error");
    }
  };

  const handleSuspend = async (blog) => {
    const action = blog.suspended ? "unsuspend" : "suspend";

    const result = await Swal.fire({
      title: `Are you sure you want to ${action} this blog?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: action === "suspend" ? "Yes, suspend!" : "Yes, unsuspend!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/blogs/suspend/${blog._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Success", `Blog ${action}ed successfully`, "success");
        fetchBlogs();
      } else {
        Swal.fire("Error", data.message || `Failed to ${action} blog`, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", `Failed to ${action} blog`, "error");
    }
  };

  const BlogCard = ({ blog }) => {
    const [expanded, setExpanded] = useState(false);
    const contentRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState(0);

    const toggleExpand = () => setExpanded(!expanded);

    const truncateHTML = (html, wordLimit = 40) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      let wordCount = 0;

      const traverse = (node) => {
        if (wordCount >= wordLimit) {
          node.remove();
          return;
        }

        if (node.nodeType === Node.TEXT_NODE) {
          const words = node.textContent.split(" ");
          if (wordCount + words.length > wordLimit) {
            node.textContent = words.slice(0, wordLimit - wordCount).join(" ") + "...";
            wordCount = wordLimit;
          } else {
            wordCount += words.length;
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          Array.from(node.childNodes).forEach(traverse);
        }
      };

      Array.from(div.childNodes).forEach(traverse);
      return div.innerHTML;
    };

    useEffect(() => {
      if (contentRef.current) {
        setMaxHeight(expanded ? contentRef.current.scrollHeight : 0);
      }
    }, [expanded, blog.description]);

    const plainText = blog.description.replace(/<[^>]+>/g, "");
    const words = plainText.split(" ");
    const isLong = words.length > 40;

    return (
      <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition duration-500">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/3 bg-gray-100 flex flex-col items-center p-4">
            {blog.image && (
              <div className="w-full h-48 lg:h-64 overflow-hidden rounded-lg">
                <img
                  src={blog.image.startsWith("http") ? blog.image : `${BACKEND_BASE_URL}${blog.image}`}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="lg:w-2/3 p-6 flex flex-col justify-between">
            <h3 className="text-2xl font-semibold mb-2">{blog.title}</h3>
            <p className="flex items-center gap-2 text-gray-500 text-sm mb-3">
              <CalendarTodayIcon fontSize="small" />
              {new Date(blog.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
              <span>By {blog.author}</span>
            </p>

            {isLong ? (
              <>
                <div
                  className="text-gray-700 text-sm leading-relaxed mb-2"
                  dangerouslySetInnerHTML={{ __html: truncateHTML(blog.description, 40) }}
                />
                <button
                  type="button"
                  onClick={toggleExpand}
                  className="text-blue-700 hover:text-blue-900 font-medium mt-2 flex items-center gap-1"
                >
                  {expanded ? "Hide Description" : "Read More"} {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </button>
              </>
            ) : (
              <div
                className="text-gray-700 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.description }}
              />
            )}
            <div className="mt-4 flex gap-3 flex-wrap justify-center">
              <button
                onClick={() => handleEdit(blog)}
                className="flex items-center justify-center gap-1 px-3 py-1 rounded-full text-white font-medium bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 transition-all duration-300"
              >
                <FiEdit fontSize="small" /> Edit
              </button>
              <button
                onClick={() => handleSuspend(blog)}
                className={`flex items-center justify-center gap-1 px-3 py-1 rounded-full text-white font-medium bg-gradient-to-r transition-all duration-300 ${blog.suspended
                  ? "from-teal-500 to-teal-700 hover:from-teal-700 hover:to-teal-500"
                  : "from-orange-400 to-orange-600 hover:from-orange-600 hover:to-orange-400"
                  }`}
              >
                {blog.suspended ? "Unsuspend" : "Suspend"}
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                className="flex items-center justify-center gap-1 px-3 py-1 rounded-full text-white font-medium bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 transition-all duration-300"
              >
                <FiTrash2 fontSize="small" /> Delete
              </button>
            </div>

          </div>
        </div>

        <div
          style={{
            maxHeight: `${maxHeight}px`,
            overflow: "hidden",
            transition: "max-height 0.5s ease",
          }}
        >
          <div
            ref={contentRef}
            className="p-6 bg-gray-50 border-t border-gray-200 text-gray-700 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-[40px]">
      <div className="container mx-auto">
        <div className="max-w-8xl mx-auto p-0 rounded-lg">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-600 hover:to-orange-400 transition-all duration-300 text-white font-medium rounded-[6px] px-2 py-1"
          >
            <ArrowBackIcon className="w-2 h-2" />
            Back
          </button>
          <div className="relative flex justify-center mb-8 bg-gray-200 rounded-full p-1 max-w-md mx-auto shadow-inner">
            <div
              className={`absolute top-1 left-1 w-1/2 h-10 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-600 hover:to-orange-400 rounded-full transform transition-transform duration-300 ${viewMode === "form" ? "translate-x-full" : ""}`}
            ></div>

            <button
              className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${viewMode === "list" ? "text-white" : "text-gray-700 hover:text-gray-900 hover:scale-105"}`}
              onClick={() => setViewMode("list")}
            >
              <LibraryBooksIcon fontSize="medium" /> View Blogs
            </button>

            <button
              className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${viewMode === "form" ? "text-white" : "text-gray-700 hover:text-gray-900 hover:scale-105"}`}
              onClick={() => {
                setViewMode("form");
                reset();
                setEditingId(null);
                setDescription("");
              }}
            >
              <FiEdit fontSize="medium" /> Add Blog
            </button>
          </div>

          {viewMode === "form" && (
            <div className="mt-[50px]">
              <div className="bg-white shadow-xl rounded-2xl p-8 mb-10 border border-gray-500 transition-all duration-500">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                  {editingId ? "Edit Blog" : "Add New Blog"}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-5">
                  <div>
                    <label className="block font-semibold mb-1 text-gray-800">Title</label>
                    <input
                      type="text"
                      placeholder="Enter blog title"
                      {...register("title", { required: "Title is required" })}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-gray-800">Author</label>
                    <input
                      type="text"
                      placeholder="Enter author name"
                      {...register("author", { required: "Author is required" })}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                    {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-gray-800">Description</label>
                    <ReactQuill
                      theme="snow"
                      value={description}
                      onChange={setDescription}
                      placeholder="Write your blog content here..."
                      className="bg-white rounded"
                    />
                    {!description && <p className="text-red-500 text-sm mt-1">Description is required</p>}
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-gray-800">
                      Blog Cover Image (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full border rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md 
               file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 
               hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended size: <span className="font-semibold">1000 × 500 px</span>
                    </p>
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Blog preview"
                        className="w-[300px] h-[200px] mt-2 object-contain border rounded"
                      />
                    ) : (
                      <p className="mt-2 text-gray-500 italic text-center w-[165px]">
                        No image selected
                      </p>
                    )}
                  </div>


                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`py-2 mt-4 bg-blue-700 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-600 hover:to-orange-400 transition text-white font-bold px-6 rounded-full flex items-center justify-center gap-2 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        {editingId ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      editingId ? "Update Blog" : "Add Blog"
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {viewMode === "list" && (
            <div className="mt-[50px]">
              <div className="flex flex-col gap-8">
                {blogs.length > 0 ? blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
                  : <p className="text-gray-500 text-center py-6">No blogs found.</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBlogs;
