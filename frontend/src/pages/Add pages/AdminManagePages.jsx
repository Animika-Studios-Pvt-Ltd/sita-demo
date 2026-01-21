import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminManagePages = () => {
  const [pages, setPages] = useState([]);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    bannerPosition: "top",
    displayLocations: [],
    headerType: "",
    parentHeader: "",
    sections: [],
  });

  const [description, setDescription] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [deleteBanner, setDeleteBanner] = useState(false);
  const [sectionImages, setSectionImages] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [viewMode, setViewMode] = useState("list");
  useEffect(() => {
    fetchPages();
  }, []);

  const [mainHeaders, setMainHeaders] = useState([]);

  const fetchPages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/pages`);
      const data = await res.json();
      setPages(data);
      const main = data.filter(p => p.headerType === "heading");
      setMainHeaders(main);
    } catch (err) {
      console.error(err);
    }
  };
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const addSection = () => {
    const newSection = {
      title: "",
      subtitle: "",
      backgroundColor: "#ffffff",
      layout: "text-only",
      contentBlocks: [{ text: "", alignment: "left" }],
      images: [],
      links: [],
    };
    setFormData((prev) => ({ ...prev, sections: [...prev.sections, newSection] }));
  };

  const updateSection = (index, key, value) => {
    const updated = [...formData.sections];
    updated[index][key] = value;
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const updateContentBlock = (secIndex, blockIndex, text) => {
    const updated = [...formData.sections];
    updated[secIndex].contentBlocks[blockIndex].text = text;
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const updateContentBlockAlignment = (secIndex, blockIndex, alignment) => {
    const updated = [...formData.sections];
    updated[secIndex].contentBlocks[blockIndex].alignment = alignment;
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const addContentBlock = (secIndex) => {
    const updated = [...formData.sections];
    updated[secIndex].contentBlocks.push({ text: "", alignment: "left" });
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const removeSection = async (index) => {
    const confirmed = await confirmDelete("This will permanently remove this section and its contents!");
    if (!confirmed) return;

    const updated = formData.sections.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, sections: updated }));
    const copy = { ...sectionImages };
    delete copy[index];
    setSectionImages(copy);

    Swal.fire("Removed!", "Section has been deleted successfully.", "success");
  };
  const deleteBannerImage = async () => {
    const confirmed = await confirmDelete("This will remove the banner image from this page.");
    if (!confirmed) return;

    setBannerImage(null);
    if (editingPage) setEditingPage({ ...editingPage, bannerImage: null });
    setDeleteBanner(true);

    Swal.fire("Deleted!", "Banner image has been removed.", "success");
  };


  const deleteSectionImages = async (secIndex) => {
    const confirmed = await confirmDelete("This will remove all images in this section.");
    if (!confirmed) return;

    const copy = { ...sectionImages };
    delete copy[secIndex];
    setSectionImages(copy);

    if (editingPage) {
      const updatedSections = [...editingPage.sections];
      updatedSections[secIndex].images = [];
      setEditingPage({ ...editingPage, sections: updatedSections });
    }

    Swal.fire("Deleted!", "Section images have been removed.", "success");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description) {
      Swal.fire("Error", "Page description is required", "error");
      return;
    }

    if (
      formData.displayLocations.includes("header") &&
      (!formData.headerType || formData.headerType.trim() === "")
    ) {
      Swal.fire("Error", "Please select a Header Type since 'Header' is selected.", "warning");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      const pageData = {
        ...formData,
        content: description,
        headerType: formData.headerType || null,
        displayLocations: formData.createAnywhere ? [] : formData.displayLocations,
      };

      if (!formData.displayLocations.includes("header")) {
        pageData.headerType = null;
      }

      if (deleteBanner) pageData.deleteBanner = true;

      payload.append("data", JSON.stringify(pageData));

      if (bannerImage) payload.append("bannerImage", bannerImage);

      Object.entries(sectionImages).forEach(([secIdx, files]) => {
        files.forEach((file) => {
          payload.append("sectionImages", file, `section-${secIdx}-${file.name}`);
        });
      });

      const url = editingPage
        ? `${API_URL}/api/pages/${editingPage._id}`
        : `${API_URL}/api/pages`;
      const method = editingPage ? "PUT" : "POST";

      const res = await fetch(url, { method, body: payload });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save page");

      Swal.fire({
        icon: "success",
        title: editingPage ? "Page Updated!" : "Page Created!",
        timer: 1500,
        showConfirmButton: false,
      });

      setFormData({
        title: "",
        slug: "",
        metaTitle: "",
        metaDescription: "",
        bannerPosition: "top",
        displayLocations: [],
        headerType: "",
        sections: [],
      });
      setDescription("");
      setBannerImage(null);
      setSectionImages({});
      setEditingPage(null);
      setDeleteBanner(false);
      fetchPages();
      setViewMode("list");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      metaTitle: page.metaTitle || "",
      metaDescription: page.metaDescription || "",
      bannerPosition: page.bannerPosition || "top",
      displayLocations: page.displayLocations || [],
      headerType: page.headerType || "",
      parentHeader: page.parentHeader || "",
      sections: page.sections || [],
    });
    setDescription(page.content || "");
    setViewMode("form");
  };

  const confirmDelete = async (text = "This action cannot be undone!") => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    return result.isConfirmed;
  };



  const handleDelete = async (id) => {
    const confirmed = await confirmDelete("This will permanently delete the page!");
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/api/pages/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      Swal.fire("Deleted!", "Page has been removed.", "success");
      fetchPages();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleSuspend = async (page) => {
    const action = page.suspended ? "activate" : "suspend";
    const confirm = await Swal.fire({
      title: `Are you sure you want to ${action} this page?`,
      text: page.suspended
        ? "This page will become visible again."
        : "This will hide the page from all users, but keep it saved.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: page.suspended ? "#3085d6" : "#f59e0b",
      cancelButtonColor: "#555",
      confirmButtonText: `Yes, ${action} it!`,
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/api/pages/${page._id}/suspend`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suspended: !page.suspended }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      Swal.fire({
        icon: "success",
        title: page.suspended ? "Page Activated" : "Page Suspended",
        timer: 1200,
        showConfirmButton: false,
      });

      fetchPages();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };
  const validateImageSize = (file, recommendedWidth, recommendedHeight, onValid) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const withinRange =
        Math.abs(img.width - recommendedWidth) <= 50 &&
        Math.abs(img.height - recommendedHeight) <= 50;

      if (!withinRange) {
        Swal.fire({
          icon: "warning",
          title: "Image Size Warning",
          html: `
          <p>Recommended size: <b>${recommendedWidth} × ${recommendedHeight}px</b></p>
          <p>You uploaded: <b>${img.width} × ${img.height}px</b></p>
          <p>Do you still want to use this image?</p>
        `,
          showCancelButton: true,
          confirmButtonText: "Yes, use it",
          cancelButtonText: "Re-upload",
        }).then((result) => {
          if (result.isConfirmed) onValid();
        });
      } else {
        onValid();
      }
    };
  };


  return (
    <div className="container mt-[100px]">
      <div className="max-w-8xl mx-auto p-6 md:p-8 rounded-lg">
        <div className="mb-16">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 transition-all duration-300 text-white font-medium rounded-[6px] px-2 py-1"
          >
            <ArrowBackIcon className="w-4 h-4 mr-1" />
            Back
          </button>

          <div className="relative flex justify-center mb-8 bg-gray-200 rounded-full p-1 max-w-md mx-auto shadow-inner">
            <div
              className={`absolute top-1 left-1 w-1/2 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 transform transition-transform duration-300 ${viewMode === "form" ? "translate-x-full" : ""}`}
            ></div>
            <button
              className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${viewMode === "list" ? "text-white" : "text-gray-700 hover:text-gray-900 hover:scale-105"}`}
              onClick={() => setViewMode("list")}
            >
              <ListAltIcon className="w-5 h-5" />
              View Pages
            </button>
            <button
              className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${viewMode === "form" ? "text-white" : "text-gray-700 hover:text-gray-900 hover:scale-105"}`}
              onClick={() => {
                setViewMode("form");
                setEditingPage(null);
                setFormData({
                  title: "",
                  slug: "",
                  metaTitle: "",
                  metaDescription: "",
                  bannerPosition: "top",
                  displayLocations: [],
                  headerType: "",
                  sections: [],
                });
                setDescription("");
              }}
            >
              <AddCircleIcon className="w-5 h-5" />
              Add Page
            </button>
          </div>
        </div>

        {viewMode === "form" && (
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10 text-center">
              {editingPage ? `Edit Page : ${editingPage.title}` : "Add New Page"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Page Title"
                value={formData.title}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="text"
                name="slug"
                placeholder="Page Link (e.g. about-us)"
                value={formData.slug}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div className="mt-6">

              <label className="block font-semibold mb-2">
                Show Page In (optional - if not selected, the page will be hidden everywhere):
              </label>

              <div className="flex flex-wrap gap-4">
                {["home", "header", "footer"].map((loc) => (
                  <label key={loc} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.displayLocations.includes(loc)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev) => {
                          const current = new Set(prev.displayLocations);
                          if (checked) current.add(loc);
                          else current.delete(loc);
                          return { ...prev, displayLocations: Array.from(current) };
                        });
                      }}
                    />
                    <span className="capitalize">{loc}</span>
                  </label>
                ))}
              </div>
            </div>
            {formData.displayLocations.includes("header") && (
              <div className="mt-4">
                <label className="block font-semibold mb-1">Header Type</label>
                <select
                  name="headerType"
                  value={formData.headerType}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select header type</option>
                  <option value="beside-profile">Beside Profile (Header)</option>
                  <option value="heading">Heading (beside Letter from Langshott)</option>
                  <option value="subheading">Blogs Subheading (Under Blogs)</option>
                  <option value="author-subheading">Author Subheading (Under About)</option>
                  <option value="publication-subheading">Publication Subheading (Under Publications)</option>
                  <option value="Foundation-subheading">Foundation Subheading (Under Foundation)</option>
                  <option value="letter-subheading">Letterfrom Langshott Subheading (Under Letterfrom Langshott)</option>
                </select>
              </div>
            )}
            <div className="mt-4">
              <label className="block font-semibold mb-1">Page Description</label>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                placeholder="Write your page content here..."
                style={{ height: "200px" }}
              />
            </div>

            <div className="mt-14 flex flex-row items-start gap-6">
              <div className="w-[40%] relative">
                <label className="block font-semibold mb-1">Banner Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    validateImageSize(file, 800, 600, () => setBannerImage(file));
                  }}
                  className="border p-1 rounded w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended size: <span className="font-semibold">800 × 600 px</span>
                </p>

                {formData.bannerPosition !== "hide" &&
                  !bannerImage &&
                  editingPage?.bannerImage && (
                    <div className="flex flex-col items-start mt-2">
                      <img
                        src={editingPage.bannerImage.src}
                        alt={editingPage.bannerImage.alt}
                        className="w-48 h-28 object-cover rounded"
                      />
                      <div className="w-full flex justify-left items-start mt-3">
                        <button
                          type="button"
                          onClick={deleteBannerImage}
                          className="w-24 bg-gradient-to-r from-red-500 to-red-700 ml-10 hover:from-red-700 hover:to-red-500 rounded-full px-4 py-1 text-white text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
              </div>

              <div className="w-[25%] flex-shrink-0">
                <label className="block font-semibold mb-1">Banner Position</label>
                <select
                  value={formData.bannerPosition}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bannerPosition: e.target.value }))
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="bottom">Bottom</option>
                  <option value="hide">Hide</option>
                </select>
              </div>
            </div>

            <h3 className="font-semibold text-lg mt-6 mb-2">Page Sections</h3>
            <div className="space-y-4">
              {formData.sections.map((section, idx) => (
                <div key={idx} className="border p-4 rounded relative bg-gray-50">
                  <input
                    type="text"
                    placeholder="Section Title"
                    value={section.title}
                    onChange={(e) => updateSection(idx, "title", e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Section Subtitle"
                    value={section.subtitle}
                    onChange={(e) => updateSection(idx, "subtitle", e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                  />
                  <div className="flex flex-row items-start gap-6 mb-2 mt-2">
                    <div className="w-[30%] relative">
                      <label className="block font-semibold mb-1">Section Images</label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          if (files.length === 0) return;

                          const validFiles = [];
                          const processNext = (index = 0) => {
                            if (index >= files.length) {
                              setSectionImages((prev) => ({ ...prev, [idx]: validFiles }));
                              return;
                            }
                            const file = files[index];
                            validateImageSize(file, 500, 500, () => {
                              validFiles.push(file);
                              processNext(index + 1);
                            });
                          };
                          processNext();
                        }}
                        className="border p-1 rounded w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended size: <span className="font-semibold">500 × 500 px</span>
                      </p>

                      {editingPage?.sections[idx]?.images?.length > 0 && !sectionImages[idx] && (
                        <div className="flex gap-2 flex-wrap mt-2">
                          {editingPage.sections[idx].images.map((img, i) => (
                            <div key={i} className="relative inline-block">
                              <img
                                src={img.src}
                                alt={img.alt}
                                className="w-48 h-28 object-cover rounded border "
                              />
                              <button
                                type="button"
                                onClick={() => deleteSectionImages(idx)}
                                className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 rounded-full transition-colors text-white px-2 py-1 text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col w-[20%]">
                      <label className="block font-semibold mb-1">Layout</label>
                      <select
                        value={section.layout}
                        onChange={(e) => updateSection(idx, "layout", e.target.value)}
                        className="border p-2 rounded w-full"
                      >
                        <option value="image-left">Image Left</option>
                        <option value="image-right">Image Right</option>
                      </select>
                    </div>

                    <div className="flex flex-col w-[10%]">
                      <label className="block font-semibold mb-1">Bg Color</label>
                      <input
                        type="color"
                        value={section.backgroundColor}
                        onChange={(e) => updateSection(idx, "backgroundColor", e.target.value)}
                        className="border rounded w-full h-10 cursor-pointer"
                      />
                    </div>
                  </div>

                  {section.contentBlocks.map((block, bIdx) => (
                    <div key={bIdx} className="mb-3">
                      <ReactQuill
                        value={block.text}
                        onChange={(v) => updateContentBlock(idx, bIdx, v)}
                        placeholder="Text block..."
                        style={{ height: "150px" }}
                      />

                      <div className="mt-14 flex items-center gap-2">
                        <label className="text-sm">Alignment:</label>
                        <select
                          value={block.alignment || "left"}
                          onChange={(e) =>
                            updateContentBlockAlignment(idx, bIdx, e.target.value)
                          }
                          className="border rounded p-1"
                        >
                          <option value="left">Text Block Alignment Left</option>
                          <option value="center">Text Block Alignment Center</option>
                          <option value="right">Text Block Alignment Right</option>
                          <option value="justify">Text Block Alignment Justify</option>
                        </select>
                        <button
                          type="button"
                          onClick={async () => {
                            const confirmed = await confirmDelete("This will permanently remove this text block!");
                            if (!confirmed) return;

                            const updated = [...formData.sections];
                            updated[idx].contentBlocks = updated[idx].contentBlocks.filter((_, i) => i !== bIdx);
                            setFormData((prev) => ({ ...prev, sections: updated }));

                            Swal.fire("Removed!", "Text block has been deleted successfully.", "success");
                          }}
                          className="ml-auto bg-gradient-to-r from-red-600 to-red-800 hover:from-red-800 hover:to-red-600 text-white px-3 py-1 rounded-full text-sm"
                        >
                          Remove text block
                        </button>

                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addContentBlock(idx)}
                    className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 text-white px-3 py-1 justify-start rounded-full mb-1 mt-2"
                  >
                    + Text Block
                  </button>

                  <div className="mt-4 mb-0 flex justify-start">
                    <button
                      type="button"
                      onClick={() => removeSection(idx)}
                      className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-800 hover:to-red-600 text-white px-3 py-1 rounded-full font-semibold transition-colors"
                    >
                      Remove Section
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2">
              <button
                type="button"
                onClick={addSection}
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-800 hover:to-purple-600 text-white px-4 py-1 rounded-full w-full md:w-auto"
              >
                + Add Section
              </button>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                disabled={loading}
                className={`py-2 mt-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 transition text-white font-medium px-6 flex items-center justify-center gap-2 w-full md:w-auto ${loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {loading ? (
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
                    {editingPage ? "Updating Page..." : "Creating Page..."}
                  </>
                ) : editingPage ? (
                  "Update Page"
                ) : (
                  "Create Page"
                )}
              </button>

            </div>
          </form>
        )}

        {viewMode === "list" && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10 text-center">
              Existing Pages
            </h2>
            <div className="space-y-4">
              {pages.map((p) => (
                <div
                  key={p._id}
                  className="flex flex-col md:flex-row justify-between items-center border p-3 rounded"
                >
                  <span className="text-gray-800 font-medium mb-2 md:mb-0">{p.title}</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => window.open(`/${p.slug}`, "_blank")}
                      className="flex items-center justify-center px-4 py-1 h-7 rounded-full text-white font-medium bg-gradient-to-r from-green-500 to-green-700 hover:from-green-700 hover:to-green-500 transition-all duration-300"
                    >
                      Preview
                    </button>

                    <button
                      onClick={() => handleEdit(p)}
                      className="flex items-center justify-center px-4 py-1 h-7 rounded-full text-white font-medium bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 transition-all duration-300"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleSuspend(p)}
                      className={`flex items-center justify-center px-4 py-1 h-7 rounded-full text-white font-medium bg-gradient-to-r ${p.suspended
                        ? "from-teal-500 to-teal-700 hover:from-teal-700 hover:to-teal-500"
                        : "from-orange-400 to-orange-600 hover:from-orange-600 hover:to-orange-400"
                        } transition-all duration-300`}
                    >
                      {p.suspended ? "Activate" : "Suspend"}
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                      className="flex items-center justify-center px-4 py-1 h-7 rounded-full text-white font-medium bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-700 hover:to-rose-500 transition-all duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagePages;
