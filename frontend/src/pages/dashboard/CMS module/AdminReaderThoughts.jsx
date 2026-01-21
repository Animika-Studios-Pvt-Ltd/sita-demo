import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";

const AdminReaderThoughts = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [thoughts, setThoughts] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosClient.get("/api/reader-thoughts");
        const data = res.data;

        if (data) {
          setTitle(data.title || "");

          if (data.image?.url) {
            setImagePreview({ url: data.image.url, mimeType: data.image.mimeType });
          }

          if (Array.isArray(data.thoughts) && data.thoughts.length > 0) {
            setThoughts(
              data.thoughts.map((t) => ({
                title: t.title || "",
                text: t.text || "",
                author: t.author || "",
                _id: t._id || null,
              }))
            );
          } else {
            setThoughts([]);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load existing data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview.url);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const requiredWidth = 650;
      const requiredHeight = 655;

      const withinRange =
        Math.abs(img.width - requiredWidth) <= 25 &&
        Math.abs(img.height - requiredHeight) <= 25;

      if (withinRange) {
        saveFile(file);
        return;
      }

      Swal.fire({
        icon: "warning",
        title: `Image Size Warning`,
        html: `
          <p>Recommended: <b>${requiredWidth} × ${requiredHeight}px</b></p>
          <p>You uploaded: <b>${img.width} × ${img.height}px</b></p>
          <p>Do you want to use this image anyway?</p>
        `,
        showCancelButton: true,
        confirmButtonText: "Yes, use it",
        cancelButtonText: "No, re-upload",
      }).then((result) => {
        if (result.isConfirmed) saveFile(file);
        else e.target.value = "";
      });
    };
  };

  const saveFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview({ url: reader.result, mimeType: file.type });
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handleThoughtChange = (index, field, value) => {
    const updated = [...thoughts];
    updated[index][field] = value;
    setThoughts(updated);
  };

  const addThought = () =>
    setThoughts([...thoughts, { title: "", text: "", author: "", _id: null }]);

  const removeThought = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the thought.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        setThoughts(thoughts.filter((_, i) => i !== index));

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The thought has been removed successfully.",
          confirmButtonColor: "#3085d6",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const getImageSrc = (url) => {
    if (!url) return "";
    if (url.startsWith("blob:")) return url;
    if (url.includes("drive.google.com")) {
      const match = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/);
      return match ? `/image/${match[1]}` : url;
    }
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    for (const t of thoughts) {
      if (!t.title.trim() || !t.text.trim() || !t.author.trim()) {
        setError("Please fill all fields in each thought (title, text, author).");
        return;
      }
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("title", title);
      if (imageFile) formData.append("file", imageFile);
      formData.append("thoughts", JSON.stringify(thoughts));

      const res = await axiosClient.post("/api/reader-thoughts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });

      const data = res.data;
      setTitle(data.title || "");
      setImagePreview(
        data.image?.url
          ? { url: data.image.url, mimeType: data.image.mimeType }
          : null
      );
      setThoughts(
        Array.isArray(data.thoughts)
          ? data.thoughts.map((t) => ({
            title: t.title || "",
            text: t.text || "",
            author: t.author || "",
            _id: t._id || null,
          }))
          : []
      );

      Swal.fire("Success", "Reader Thoughts updated successfully!", "success");
      setSuccess(true);
    } catch (err) {
      console.error("Submit error:", err);

      let errorMessage = "Submission failed. Please try again.";

      if (err.response) {
        errorMessage = err.response.data?.error || err.response.data?.message || errorMessage;
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = "Upload timeout. Please try with a smaller image or check your connection.";
      }

      setError(errorMessage);
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-[100px]">
        <div className="max-w-8xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
          <p className="text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-[100px]">
      <div className="max-w-8xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 transition-all duration-300 text-white font-medium rounded-[6px] px-2 py-1"
          >
            <ArrowBackIcon className="w-4 h-4 mr-1" />
            Back
          </button>

          <div className="text-center mb-10 mt-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Reader Voices — Thoughts That Inspire Us
            </h2>
            <p className="text-gray-500 italic mt-2">
              "Every word shared by a reader becomes part of our story."
            </p>
          </div>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="md:w-1/4 flex justify-center items-center border border-gray-300 rounded-md p-2">
            {imagePreview?.url ? (
              <img
                src={getImageSrc(imagePreview.url)}
                alt="Preview"
                className="w-[180px] h-[180px] object-cover rounded-md"
              />
            ) : (
              <p className="text-gray-400">No image selected</p>
            )}
          </div>

          <div className="md:w-1/2 flex flex-col gap-3">
            <label className="block mb-1 font-medium">Reader Thoughts Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="block"
              disabled={uploading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended size: <span className="font-semibold">650 × 655 px</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              disabled={uploading}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Share Your Thoughts</label>
            {Array.isArray(thoughts) && thoughts.map((thought, index) => (
              <div
                key={thought._id || index}
                className="mb-6 p-4 border border-gray-300 rounded-md flex flex-col"
              >
                <input
                  type="text"
                  placeholder="Thought Title"
                  value={thought.title}
                  onChange={(e) =>
                    handleThoughtChange(index, "title", e.target.value)
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded-md mb-2"
                  disabled={uploading}
                />
                <textarea
                  placeholder="Thought Text"
                  value={thought.text}
                  onChange={(e) =>
                    handleThoughtChange(index, "text", e.target.value)
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded-md mb-2"
                  rows={4}
                  disabled={uploading}
                />
                <input
                  type="text"
                  placeholder="Author Name"
                  value={thought.author}
                  onChange={(e) =>
                    handleThoughtChange(index, "author", e.target.value)
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded-md mb-2"
                  disabled={uploading}
                />
                {thoughts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeThought(index)}
                    className="text-white w-20 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500"
                    disabled={uploading}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addThought}
              className="bg-gradient-to-r font-light from-purple-600 to-purple-800 hover:from-purple-800 hover:to-purple-600 text-white px-4 py-2 rounded-full transition-transform"
              disabled={uploading}
            >
              + Add Another Thought
            </button>
          </div>

          <button
            type="submit"
            className="text-white px-8 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>Save All Changes</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminReaderThoughts;
