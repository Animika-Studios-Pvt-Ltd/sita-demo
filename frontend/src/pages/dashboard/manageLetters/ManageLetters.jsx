import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash2, FiUpload } from "react-icons/fi";
import Swal from "sweetalert2";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from "@mui/icons-material/Download";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ManageLetters = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_BASE_URL}/api/letters`);
      setLetters(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load letters", err);
      Swal.fire("Error", "Failed to load letters", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      Swal.fire("Error", "Title and file are required.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("pdf", file);

    setUploading(true);
    try {
      await axios.post(`${BACKEND_BASE_URL}/api/letters/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire("Success", "Letter uploaded successfully!", "success");
      setTitle("");
      setFile(null);
      setViewMode("list");
      fetchLetters();
    } catch (err) {
      console.error("Upload failed", err);
      Swal.fire("Error", "Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This letter will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${BACKEND_BASE_URL}/api/letters/${id}`);
      Swal.fire("Deleted!", "Letter deleted successfully.", "success");
      fetchLetters();
    } catch (err) {
      console.error("Delete failed", err);
      Swal.fire("Error", "Failed to delete.", "error");
    }
  };

  const handleRename = async (id) => {
    if (!newTitle.trim()) return Swal.fire("Error", "New title cannot be empty.", "error");

    try {
      await axios.put(`${BACKEND_BASE_URL}/api/letters/${id}`, { title: newTitle.trim() });
      Swal.fire("Updated!", "Title updated.", "success");
      setEditingTitleId(null);
      setNewTitle("");
      fetchLetters();
    } catch (err) {
      console.error("Rename failed", err);
      Swal.fire("Error", "Failed to rename.", "error");
    }
  };

  const handleSuspend = async (id, suspended) => {
    const action = suspended ? "unsuspend" : "suspend";

    const result = await Swal.fire({
      title: `Are you sure you want to ${action} this letter?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: action === "suspend" ? "Yes, suspend!" : "Yes, unsuspend!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axios.patch(`${BACKEND_BASE_URL}/api/letters/${id}/suspend`);
      Swal.fire("Success", res.data.message || `Letter ${action}ed successfully`, "success");
      fetchLetters();
    } catch (err) {
      console.error("Suspend failed", err);
      Swal.fire("Error", `Failed to ${action} letter`, "error");
    }
  };

  return (
    <div className="container mt-[100px]">
      <div className="max-w-8xl mx-auto rounded-lg">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 transition-all duration-300 text-white font-medium rounded-[6px] px-2 py-1"
        >
          <ArrowBackIcon className="w-4 h-4 mr-1" />
          Back
        </button>
        <div className="relative flex justify-center mb-8 bg-gray-200 rounded-full p-1 max-w-md mx-auto shadow-inner">
          <div
            className={`absolute top-1 left-1 w-1/2 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full transform transition-transform duration-300 ${viewMode === "form" ? "translate-x-full" : ""
              }`}
          ></div>

          <button
            className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${viewMode === "list"
              ? "text-white"
              : "text-gray-700 hover:text-gray-900 hover:scale-105"
              }`}
            onClick={() => setViewMode("list")}
          >
            <MailOutlineIcon fontSize="medium" /> View Letters
          </button>

          <button
            className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${viewMode === "form"
              ? "text-white"
              : "text-gray-700 hover:text-gray-900 hover:scale-105"
              }`}
            onClick={() => setViewMode("form")}
          >
            <FiUpload /> Upload Letter
          </button>
        </div>

        {viewMode === "form" && (
          <div className="container mt-[50px]">
            <div className="max-w-8xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                Upload New Letter
              </h2>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Enter letter title"
                    required
                    disabled={uploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    PDF File
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full border rounded-md px-3 py-2"
                    required
                    disabled={uploading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className={`py-2 mt-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 transition text-white font-regular px-6 rounded-full flex items-center justify-center gap-2 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
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
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {viewMode === "list" && (
          <div className="container mt-[50px]">
            <div className="max-w-8xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                Letters List
              </h2>

              {loading ? (
                <p className="text-center py-6 text-gray-500">Loading...</p>
              ) : letters.length === 0 ? (
                <p className="text-center py-6 text-gray-500">No letters found</p>
              ) : (
                <>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                          <th className="px-6 py-3 text-left align-middle">#</th>
                          <th className="px-6 py-3 text-left align-middle ">Title</th>
                          <th className="px-6 py-3 text-left align-middle">Uploaded</th>
                          <th className="px-6 py-3 text-center align-middle">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {letters.map((letter, index) => (
                          <tr key={letter._id} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm">{index + 1}</td>
                            <td className="px-6 py-4 text-sm">
                              {editingTitleId === letter._id ? (
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="border rounded-md px-2 py-1 text-sm"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleRename(letter._id)}
                                    className="px-2 py-1 bg-green-500 text-white rounded-md"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingTitleId(null)}
                                    className="px-2 py-1 bg-gray-400 text-white rounded-md"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <span>{letter.title}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {new Date(letter.uploadedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm space-x-5 flex items-center">
                              <a
                                href={letter.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-700 hover:to-purple-500 text-white transition-all duration-300"
                              >
                                <VisibilityIcon fontSize="small" />
                              </a>
                              <a
                                href={letter.downloadUrl}
                                download={letter.fileName || "letter.pdf"}
                                className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-700 hover:to-indigo-500 text-white transition-all duration-300"
                              >
                                <DownloadIcon fontSize="small" />
                              </a>
                              <button
                                onClick={() => handleSuspend(letter._id, letter.suspended)}
                                className={`flex items-center justify-center w-20 h-7 rounded-full text-white font-medium bg-gradient-to-r ${letter.suspended
                                  ? "from-teal-500 to-teal-700 hover:from-teal-700 hover:to-teal-500"
                                  : "from-orange-400 to-orange-600 hover:from-orange-600 hover:to-orange-400"
                                  } transition-all duration-300`}
                              >
                                {letter.suspended ? "Unsuspend" : "Suspend"}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingTitleId(letter._id);
                                  setNewTitle(letter.title);
                                }}
                                className="flex items-center justify-center gap-1 w-24 h-7 rounded-full text-white font-medium bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 transition-all duration-300"
                              >
                                <FiEdit fontSize="small" /> Rename
                              </button>
                              <button
                                onClick={() => handleDelete(letter._id)}
                                className="flex items-center justify-center gap-1 w-24 h-7 rounded-full text-white font-medium bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 transition-all duration-300"
                              >
                                <FiTrash2 fontSize="small" /> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="md:hidden space-y-4">
                    {letters.map((letter, index) => (
                      <div
                        key={letter._id}
                        className="bg-gray-50 p-4 rounded-lg shadow flex flex-col space-y-2"
                      >
                        <div className="font-semibold text-sm">
                          {index + 1}. {letter.title}
                        </div>
                        <div className="text-xs text-gray-600">
                          Uploaded: {new Date(letter.uploadedAt).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-2">
                          <a
                            href={letter.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-indigo-600 text-white px-2 py-1 rounded-md text-sm"
                          >
                            View
                          </a>
                          <a
                            href={letter.downloadUrl}
                            download={letter.fileName || "letter.pdf"}
                            className="flex-1 bg-indigo-600 text-white px-2 py-1 rounded-md text-sm"
                          >
                            Download
                          </a>
                          <button
                            onClick={() => {
                              setEditingTitleId(letter._id);
                              setNewTitle(letter.title);
                            }}
                            className="flex-1 bg-indigo-600 text-white px-2 py-1 rounded-md text-sm"
                          >
                            Rename
                          </button>
                          <button
                            onClick={() => handleDelete(letter._id)}
                            className="flex-1 bg-red-600 text-white px-2 py-1 rounded-md text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageLetters;
