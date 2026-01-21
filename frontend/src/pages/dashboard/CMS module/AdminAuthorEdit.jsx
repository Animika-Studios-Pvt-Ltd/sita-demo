import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const setNestedValue = (obj, path, value) => {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const nested = keys.reduce((acc, key) => acc[key], obj);
  nested[lastKey] = value;
  return { ...obj };
};

const AdminAuthorEdit = () => {
  const [form, setForm] = useState(null);
  const [rightFile, setRightFile] = useState(null);
  const [rightPreview, setRightPreview] = useState(null);
  const [leftFile, setLeftFile] = useState(null);
  const [leftPreview, setLeftPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    fetch(`${baseUrl}/api/author`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setForm(data);

        if (data.aboutAuthor?.rightImage?.src) setRightPreview(data.aboutAuthor.rightImage.src);
        if (data.workingCreed?.leftImage?.src) setLeftPreview(data.workingCreed.leftImage.src);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load author data");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => setNestedValue({ ...prevForm }, name, value));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      let requiredWidth, requiredHeight;

      if (type === "right") {
        requiredWidth = 495;
        requiredHeight = 345;
      } else if (type === "left") {
        requiredWidth = 640;
        requiredHeight = 275;
      }

      const withinRange =
        Math.abs(img.width - requiredWidth) <= 25 &&
        Math.abs(img.height - requiredHeight) <= 25;

      if (!withinRange) {
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
          if (!result.isConfirmed) return;
        });
      }

      if (type === "right") {
        setRightFile(file);
        setRightPreview(URL.createObjectURL(file));
      } else if (type === "left") {
        setLeftFile(file);
        setLeftPreview(URL.createObjectURL(file));
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(form));
      if (rightFile) formData.append("rightImage", rightFile);
      if (leftFile) formData.append("leftImage", leftFile);

      const res = await fetch(`${baseUrl}/api/author`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update author content");

      Swal.fire("Success", "Author content updated successfully!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update author content", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="container mt-[100px]">
      <div className="max-w-8xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 transition-all duration-300 text-white font-medium rounded-[6px] px-2 py-1"
          >
            <ArrowBackIcon className="w-3 h-3 mr-1" />
            Back
          </button>

          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              About the Author — The Pen Behind the Passion
            </h2>
            <p className="text-gray-500 italic mt-2">
              “Every story begins with a dream and a heart that dares to share it.”
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Homepage Section Title</label>
            <input
              type="text"
              name="sectionHeading.text"
              value={form.sectionHeading.text}
              onChange={handleChange}
              placeholder="E.g., About the Author"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Author Story Title</label>
            <input
              type="text"
              name="aboutAuthor.leftText.heading"
              value={form.aboutAuthor.leftText.heading}
              onChange={handleChange}
              placeholder="E.g., My Journey & Inspirations"
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Author Story</label>
            {form.aboutAuthor.leftText.paragraphs.slice(0, 3).map((para, index) => (
              <textarea
                key={index}
                name={`aboutAuthor.leftText.paragraphs.${index}.text`}
                value={para.text}
                onChange={handleChange}
                placeholder="Share something inspiring about the author..."
                className="w-full border px-3 py-2 rounded mb-2"
              />
            ))}
          </div>

          <div>
            <label className="block mb-1 font-medium">Author’s Creed Title</label>
            <input
              type="text"
              name="workingCreed.rightText.heading"
              value={form.workingCreed.rightText.heading}
              onChange={handleChange}
              placeholder="E.g., My Working Principles"
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Author’s Creed Details</label>
            {form.workingCreed.rightText.paragraphs.map((para, index) => (
              <textarea
                key={index}
                name={`workingCreed.rightText.paragraphs.${index}.text`}
                value={para.text}
                onChange={handleChange}
                placeholder="Describe the author’s values, creed or principles..."
                className="w-full border px-3 py-2 rounded mb-2"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-6 justify-items-center items-center">
            <div>
              <label className="block mb-1 font-medium">Author Portrait</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "right")}
                className="block"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: <span className="font-semibold">495 × 345 px</span>
              </p>
              {rightPreview ? (
                <img
                  src={rightPreview}
                  alt="Author Portrait Preview"
                  className="w-[165px] h-[115px] mt-2 object-contain border rounded"
                />
              ) : (
                <p className="mt-2 text-gray-500 italic text-center w-[165px]">No image selected</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Working Creed Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "left")}
                className="block"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: <span className="font-semibold">640 × 275 px</span>
              </p>
              {leftPreview ? (
                <img
                  src={leftPreview}
                  alt="Working Creed Preview"
                  className="w-[185px] h-[80px] mt-2 object-contain border rounded"
                />
              ) : (
                <p className="mt-2 text-gray-500 italic text-center w-[185px]">No image selected</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`py-2 mt-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 transition text-white font-regular px-6 flex items-center justify-center gap-2 ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Updating..." : "Update Author Content"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuthorEdit;
