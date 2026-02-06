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

const Articles = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: { title: "", author: "", readMoreText: "", description: "", image: null },
  });

  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");

  const fetchArticles = async () => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/articles`);
      const data = await res.json();

      setArticles(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Failed to fetch articles", err);
    }
  };

  useEffect(() => {
    fetchArticles();
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
      formData.append("readMoreText", data.readMoreText);
      formData.append("description", description);
      formData.append("type", "article");

      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      const url = editingId
        ? `${BACKEND_BASE_URL}/api/articles/edit/${editingId}`
        : `${BACKEND_BASE_URL}/api/articles/create-article`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire(
          editingId ? "Article Updated" : "Article Added",
          editingId ? "Article updated successfully!" : "Article added successfully!",
          "success"
        );
        reset();
        setImagePreview(null);
        setDescription("");
        setEditingId(null);
        setViewMode("list");
        fetchArticles();
      } else {
        Swal.fire("Error", result.message || "Something went wrong", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to save article", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (article) => {
    setEditingId(article._id);
    setValue("title", article.title);
    setValue("author", article.author);
    setValue("readMoreText", article.readMoreText);
    setDescription(article.description);

    if (article.image) {
      const imageUrl = article.image.startsWith("http")
        ? article.image
        : `${BACKEND_BASE_URL}${article.image}`;
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
      text: "This will permanently delete the article!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b91c1c",
      cancelButtonColor: "#2563eb",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/articles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();

      if (res.ok) {
        Swal.fire("Deleted!", "Article has been deleted.", "success");
        fetchArticles();
      } else {
        Swal.fire("Error", result.message || "Failed to delete article", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete article", "error");
    }
  };

  const handleSuspend = async (article) => {
    const action = article.suspended ? "unsuspend" : "suspend";

    const result = await Swal.fire({
      title: `Are you sure you want to ${action} this article?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: action === "suspend" ? "Yes, suspend!" : "Yes, unsuspend!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/articles/suspend/${article._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Success", `Article ${action}ed successfully`, "success");
        fetchArticles();
      } else {
        Swal.fire("Error", data.message || `Failed to ${action} article`, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", `Failed to ${action} article`, "error");
    }
  };

  const ArticleCard = ({ article }) => {
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
    }, [expanded, article.description]);

    const plainText = article.description.replace(/<[^>]+>/g, "");
    const words = plainText.split(" ");
    const isLong = words.length > 40;

    return (
      <div className="flex flex-col bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_20px_45px_-30px_rgba(15,23,42,0.35)] overflow-hidden border border-white/70 ring-1 ring-black/5 transition-colors duration-300">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/3 bg-white/60 flex flex-col items-center p-4">
            {article.image && (
              <div className="w-full h-48 lg:h-64 overflow-hidden rounded-xl border border-white/70 ring-1 ring-black/5 bg-white/80">
                <img
                  src={article.image.startsWith("http") ? article.image : `${BACKEND_BASE_URL}${article.image}`}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="lg:w-2/3 p-6 flex flex-col justify-between">
            <h3 className="text-2xl font-semibold text-slate-800 mb-2">{article.title}</h3>
            <p className="flex items-center gap-2 text-slate-500 text-sm mb-3">
              <CalendarTodayIcon fontSize="small" />
              {new Date(article.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
              <span>By {article.author}</span>
            </p>

            {isLong ? (
              <>
                <div
                  className="text-slate-700 text-sm leading-relaxed mb-2 article-description"
                  dangerouslySetInnerHTML={{ __html: truncateHTML(article.description, 40) }}
                />
                <button
                  type="button"
                  onClick={toggleExpand}
                  className="text-[#7A1F2B] hover:text-[#5d1620] font-medium mt-2 flex items-center gap-1 transition-colors duration-200"
                >
                  {expanded ? "Hide Description" : (article.readMoreText || "Read More")} {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </button>
              </>
            ) : (
              <div
                className="text-slate-700 text-sm leading-relaxed article-description"
                dangerouslySetInnerHTML={{ __html: article.description }}
              />
            )}
            <div className="mt-4 flex gap-3 flex-wrap justify-center">
              <button
                onClick={() => handleEdit(article)}
                className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 text-blue-700 shadow-sm hover:bg-white/90 transition-colors duration-200"
              >
                <FiEdit fontSize="small" /> Edit
              </button>
              <button
                onClick={() => handleSuspend(article)}
                className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 shadow-sm hover:bg-white/90 transition-colors duration-200 ${article.suspended
                  ? "text-teal-700"
                  : "text-amber-700"
                  }`}
              >
                {article.suspended ? "Unsuspend" : "Suspend"}
              </button>
              <button
                onClick={() => handleDelete(article._id)}
                className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 text-red-600 shadow-sm hover:bg-white/90 transition-colors duration-200"
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
            className="p-6 bg-white/70 backdrop-blur-xl border-t border-white/70 text-slate-700 text-sm leading-relaxed article-description"
            dangerouslySetInnerHTML={{ __html: article.description }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-[40px] font-montserrat text-slate-700">
      <div className="container mx-auto">
        <div className="max-w-8xl mx-auto p-0 rounded-lg">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 justify-center rounded-full bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 text-slate-700 hover:bg-white/90 transition-colors duration-200 px-3 py-1.5 text-sm font-medium"
          >
            <ArrowBackIcon className="w-4 h-4" />
            Back
          </button>
          <div className="relative flex justify-center mb-8 bg-white/60 backdrop-blur-xl border border-[#7A1F2B] ring-1 ring-white/70 rounded-full p-1.5 max-w-md mx-auto shadow-sm overflow-hidden">
            <div
              className={`absolute top-1.5 left-1.5 w-[calc(50%-0.375rem)] h-10 bg-gradient-to-br from-[#7A1F2B]/10 via-white/90 to-white/80 rounded-full border border-[#7A1F2B] ring-1 ring-black/5 shadow-[0_8px_18px_-12px_rgba(122,31,43,0.45)] transform transition-transform duration-300 ${viewMode === "form" ? "translate-x-full" : ""}`}
            ></div>

            <button
              className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-colors duration-200 ${viewMode === "list" ? "text-[#7A1F2B]" : "text-slate-500 hover:text-slate-800"}`}
              onClick={() => setViewMode("list")}
            >
              <LibraryBooksIcon fontSize="medium" /> View Articles
            </button>

            <button
              className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-colors duration-200 ${viewMode === "form" ? "text-[#7A1F2B]" : "text-slate-500 hover:text-slate-800"}`}
              onClick={() => {
                setViewMode("form");
                reset();
                setEditingId(null);
                setDescription("");
              }}
            >
              <FiEdit fontSize="medium" /> Add Article
            </button>
          </div>

          {viewMode === "form" && (
            <div className="mt-[50px]">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 mb-10 border border-white/70 ring-1 ring-black/5 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)]">
                <h2 className="text-2xl md:text-3xl font-bold text-[#7A1F2B] mb-6 text-center font-montserrat">
                  {editingId ? "Edit Article" : "Add New Article"}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-5">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Title</label>
                    <input
                      type="text"
                      placeholder="Enter article title"
                      {...register("title", { required: "Title is required" })}
                      className="w-full bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-lg px-4 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Author</label>
                    <input
                      type="text"
                      placeholder="Enter author name"
                      {...register("author", { required: "Author is required" })}
                      className="w-full bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-lg px-4 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80"
                    />
                    {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Read More Button Text (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Continue Reading"
                      {...register("readMoreText")}
                      className="w-full bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-lg px-4 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Description</label>
                    <ReactQuill
                      theme="snow"
                      value={description}
                      onChange={setDescription}
                      placeholder="Write your article content here..."
                      className="bg-white/70 backdrop-blur-xl rounded-xl border border-white/70 ring-1 ring-black/5 overflow-hidden"
                    />
                    {!description && <p className="text-red-500 text-sm mt-1">Description is required</p>}
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">
                      Article Cover Image (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-lg px-4 py-2 text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-md 
               file:border-0 file:text-sm file:font-semibold file:bg-white/80 file:text-slate-700 hover:file:bg-white"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Recommended size: <span className="font-semibold">1000 × 500 px</span>
                    </p>
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Article preview"
                        className="w-[300px] h-[200px] mt-2 object-contain border border-white/70 ring-1 ring-black/5 rounded-xl bg-white/80"
                      />
                    ) : (
                      <p className="mt-2 text-slate-500 italic text-center w-[165px]">
                        No image selected
                      </p>
                    )}
                  </div>


                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`py-2 mt-4 bg-gradient-to-br from-white/95 to-slate-50/80 backdrop-blur-xl border-1 border-[#7A1F2B] ring-1 ring-black/5 text-[#7A1F2B] hover:from-white hover:to-slate-50/90 transition-colors duration-200 font-semibold px-6 rounded-full flex items-center justify-center gap-2 shadow-[0_12px_20px_-16px_rgba(15,23,42,0.45)] hover:shadow-[0_14px_22px_-16px_rgba(15,23,42,0.5)] ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-[#7A1F2B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        {editingId ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      editingId ? "Update Article" : "Add Article"
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {viewMode === "list" && (
            <div className="mt-[50px]">
              <div className="flex flex-col gap-8">
                {articles.length > 0 ? articles.map((article) => <ArticleCard key={article._id} article={article} />)
                  : <p className="text-slate-500 text-center py-6">No articles found.</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Articles;
