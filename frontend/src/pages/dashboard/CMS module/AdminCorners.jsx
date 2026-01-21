import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const AdminCorners = () => {
  const navigate = useNavigate();
  const [corners, setCorners] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchCorners = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/home/corners`);

        const text = await res.text();
        const data = text.length ? JSON.parse(text) : [];

        if (!res.ok) throw new Error(data.message || "Failed to fetch corners");

        setCorners(data);
        if (data.length > 0) setActiveTab(data[0].id);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch corners:", err);
        setError("Could not load corners from the server.");
        setLoading(false);
        Swal.fire("Error", "Could not load corners from the server.", "error");
      }
    };

    fetchCorners();
  }, [baseUrl]);

  const updateCorner = (field, value) => {
    setCorners((prevCorners) => {
      const updated = [...prevCorners];
      const index = updated.findIndex((c) => c.id === activeTab);
      if (index !== -1) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const updateSlide = (slideIndex, field, value) => {
    setCorners((prevCorners) => {
      const updated = [...prevCorners];
      const cornerIndex = updated.findIndex((c) => c.id === activeTab);
      if (cornerIndex !== -1) {
        const slides = [...updated[cornerIndex].slides];
        slides[slideIndex] = { ...slides[slideIndex], [field]: value };
        updated[cornerIndex] = { ...updated[cornerIndex], slides };
      }
      return updated;
    });
  };

  const handleImageChange = (slideIndex, file) => {
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const requiredWidth = 540;
      const requiredHeight = 280;

      const withinRange =
        Math.abs(img.width - requiredWidth) <= 25 &&
        Math.abs(img.height - requiredHeight) <= 25;

      const saveFile = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCorners((prevCorners) => {
            const updated = [...prevCorners];
            const cornerIndex = updated.findIndex((c) => c.id === activeTab);
            if (cornerIndex !== -1) {
              const slides = [...updated[cornerIndex].slides];
              slides[slideIndex] = {
                ...slides[slideIndex],
                image: reader.result,
                imageFile: file,
              };
              updated[cornerIndex] = { ...updated[cornerIndex], slides };
            }
            return updated;
          });
        };
        reader.readAsDataURL(file);
      };

      if (withinRange) {
        saveFile();
      } else {
        Swal.fire({
          icon: "warning",
          title: "Image Size Warning",
          html: `
          <p>Recommended: <b>${requiredWidth} × ${requiredHeight}px</b></p>
          <p>You uploaded: <b>${img.width} × ${img.height}px</b></p>
          <p>Do you want to use this image anyway?</p>
        `,
          showCancelButton: true,
          confirmButtonText: "Yes, use it",
          cancelButtonText: "No, re-upload",
        }).then((result) => {
          if (result.isConfirmed) saveFile();
        });
      }

      URL.revokeObjectURL(img.src);
    };
  };

  const addSlide = () => {
    const newSlide = {
      id: uuidv4(),
      image: "",
      text: "",
      author: "",
      imageFile: null,
    };
    setCorners((prevCorners) => {
      const updated = [...prevCorners];
      const index = updated.findIndex((c) => c.id === activeTab);
      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          slides: [...updated[index].slides, newSlide],
        };
      }
      return updated;
    });
  };

  const removeSlide = (slideIndex) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the slide permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        setCorners((prevCorners) => {
          const updated = [...prevCorners];
          const index = updated.findIndex((c) => c.id === activeTab);
          if (index !== -1) {
            const slides = [...updated[index].slides];
            slides.splice(slideIndex, 1);
            updated[index] = { ...updated[index], slides };
          }
          return updated;
        });

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The slide has been removed successfully.",
          confirmButtonColor: "#3085d6",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleSubmit = async () => {
    setUploading(true);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("corners", JSON.stringify(corners));

      corners.forEach((corner) => {
        corner.slides.forEach((slide, slideIndex) => {
          if (slide.imageFile) {
            const key = `corner_${corner.id}_slide_${slideIndex}_image`;
            formData.append(key, slide.imageFile);
          }
        });
      });

      const res = await fetch(`${baseUrl}/api/home/corners`, {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      const result = text.length ? JSON.parse(text) : {};

      if (!res.ok) {
        throw new Error(result.error || result.message || "Failed to update corners");
      }

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Corners updated successfully!",
        confirmButtonColor: "#3085d6",
      });

      setCorners(result);
    } catch (err) {
      console.error("Submit error:", err);

      let errorMessage = "Failed to save changes";
      if (err.message) {
        errorMessage = err.message;
      }

      Swal.fire("Error", errorMessage, "error");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const currentCorner = corners.find((corner) => corner.id === activeTab);

  if (loading && corners.length === 0) {
    return (
      <div className="container mt-[100px]">
        <div className="max-w-8xl mx-auto rounded-lg p-8 text-center">
          <p>Loading corners...</p>
        </div>
      </div>
    );
  }

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
            className={`absolute top-1 left-1 w-1/2 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 transform transition-transform duration-300 ${activeTab === 2 ? "translate-x-full" : ""
              }`}
          ></div>

          {corners.map((corner) => (
            <button
              key={corner.id}
              onClick={() => setActiveTab(corner.id)}
              className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${activeTab === corner.id
                  ? "text-white"
                  : "text-gray-700 hover:text-gray-900 hover:scale-105"
                }`}
            >
              {corner.title}
            </button>
          ))}
        </div>

        {currentCorner ? (
          <div className="bg-white shadow-md mt-[50px] rounded-lg p-5 mb-12 border">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10 text-center">
                {currentCorner.title === "Positivity Corner"
                  ? "Positivity Corner — Uplift Your Mind and Spirit"
                  : "Sufi Corner — Whispers of Divine Love"}
              </h2>
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">Title</label>
              <input
                type="text"
                value={currentCorner.title}
                onChange={(e) => updateCorner("title", e.target.value)}
                className="border px-3 py-2 rounded w-full"
                disabled={uploading}
              />
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Slides</h3>
              <div className="space-y-8">
                {currentCorner.slides.map((slide, slideIndex) => (
                  <div
                    key={slide.id || slideIndex}
                    className="border rounded-lg p-4 relative"
                  >
                    <div className="mb-2">
                      <label className="block font-medium mb-1">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(slideIndex, e.target.files[0])}
                        disabled={uploading}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended size: <span className="font-semibold">540 × 280 px</span>
                      </p>
                      {slide.image && (
                        <img
                          src={slide.image}
                          alt="Slide"
                          className="w-[180px] h-[180px] mt-2 object-cover rounded-md border"
                        />
                      )}
                    </div>

                    <div className="mb-2">
                      <label className="block font-medium mb-1">Text</label>
                      <textarea
                        value={slide.text}
                        onChange={(e) =>
                          updateSlide(slideIndex, "text", e.target.value)
                        }
                        className="border px-3 py-2 rounded w-full"
                        disabled={uploading}
                        rows={3}
                      />
                    </div>

                    <div className="mb-2">
                      <label className="block font-medium mb-1">Author</label>
                      <input
                        type="text"
                        value={slide.author || ""}
                        onChange={(e) =>
                          updateSlide(slideIndex, "author", e.target.value)
                        }
                        className="border px-3 py-2 rounded w-full"
                        disabled={uploading}
                      />
                    </div>

                    <div className="mb-0 mt-3">
                      <button
                        type="button"
                        onClick={() => removeSlide(slideIndex)}
                        disabled={uploading}
                        className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 rounded-full text-white w-auto py-1 px-3 text-sm transition-colors disabled:opacity-50"
                      >
                        Remove Slide
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addSlide}
                disabled={uploading}
                className="mt-4 bg-gradient-to-r font-light from-purple-600 to-purple-800 hover:from-purple-800 hover:to-purple-600 text-white px-4 py-2 rounded-full transition-transform disabled:opacity-50"
              >
                + Add Another Slide
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={uploading || loading}
              className="text-white px-8 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
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
                  Saving...
                </>
              ) : (
                <>Save All Changes</>
              )}
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500">No corner selected</p>
        )}
      </div>
    </div>
  );
};

export default AdminCorners;
