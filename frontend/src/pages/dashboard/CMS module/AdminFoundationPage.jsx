import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const AdminFoundationPage = () => {
  const [foundationData, setFoundationData] = useState({});
  const [form, setForm] = useState({
    title: "",
    description: "",
    paragraphs: [{ text: "" }],
    quote: "",
    starsCount: 5,
  });
  const [logoFile, setLogoFile] = useState(null);
  const [authorImageFile, setAuthorImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchFoundation = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/foundation`);
        if (res.status === 404) {
          setIsDataLoaded(true);
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch foundation data");
        const data = await res.json();
        setFoundationData(data);
        setForm({
          title: data.title || "",
          description: data.description || "",
          paragraphs: data.paragraphs?.length ? data.paragraphs : [{ text: "" }],
          quote: data.quote || "",
          starsCount: data.starsCount || 5,
        });
        setIsDataLoaded(true);
      } catch (err) {
        console.error(err);
        setIsDataLoaded(true);
        Swal.fire("Error", "Failed to fetch foundation data", "error");
      }
    };
    fetchFoundation();
  }, [baseUrl]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleParagraphChange = (index, value) => {
    const updated = [...form.paragraphs];
    updated[index].text = value;
    setForm({ ...form, paragraphs: updated });
  };

  const addParagraph = () => setForm({ ...form, paragraphs: [...form.paragraphs, { text: "" }] });

  const removeParagraph = (index) => {
    if (form.paragraphs.length === 1) {
      Swal.fire("Warning", "At least one paragraph is required", "warning");
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the paragraph.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = form.paragraphs.filter((_, i) => i !== index);
        setForm({ ...form, paragraphs: updated });
        Swal.fire({ icon: "success", title: "Deleted!", timer: 1500, showConfirmButton: false });
      }
    });
  };

  const saveFile = (file, type) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "logo") {
        setLogoFile(file);
        setFoundationData((prev) => ({ ...prev, logoUrl: reader.result }));
      } else if (type === "authorImage") {
        setAuthorImageFile(file);
        setFoundationData((prev) => ({ ...prev, imageUrl: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      let requiredWidth = type === "logo" ? 210 : 740;
      let requiredHeight = type === "logo" ? 130 : 710;

      const withinRange =
        Math.abs(img.width - requiredWidth) <= 25 &&
        Math.abs(img.height - requiredHeight) <= 25;

      if (withinRange) {
        saveFile(file, type);
        return;
      }

      Swal.fire({
        icon: "warning",
        title: `${type === "logo" ? "Logo" : "Author Image"} Size Warning`,
        html: `
          <p>Recommended: <b>${requiredWidth} × ${requiredHeight}px</b></p>
          <p>You uploaded: <b>${img.width} × ${img.height}px</b></p>
          <p>Do you want to use this image anyway?</p>
        `,
        showCancelButton: true,
        confirmButtonText: "Yes, use it",
        cancelButtonText: "No, re-upload",
      }).then((result) => {
        if (result.isConfirmed) saveFile(file, type);
        else e.target.value = "";
      });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("paragraphs", JSON.stringify(form.paragraphs));
      formData.append("quote", form.quote);
      formData.append("starsCount", form.starsCount);
      if (logoFile) formData.append("logo", logoFile);
      if (authorImageFile) formData.append("image", authorImageFile);

      const res = await fetch(`${baseUrl}/api/foundation/${foundationData?._id || ""}`, {
        method: "PUT",
        body: formData,
      });
      const text = await res.text();
      const result = text.length ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(result.message || "Update failed");

      setFoundationData(result.foundation);
      Swal.fire("Success", "Foundation updated successfully!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Failed to update foundation", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isDataLoaded) return <div className="text-center mt-10">Loading foundation...</div>;

  return (
    <div className="container mt-[100px]">
      <div className="max-w-8xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 transition-all duration-300 text-white font-medium px-2 py-1"
          >
            <ArrowBackIcon className="w-4 h-4 mr-1" /> Back
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center flex-1">
            Foundation — Where Compassion Meets Action
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              rows={5}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Quote</label>
            <input
              type="text"
              name="quote"
              value={form.quote}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Content Paragraphs</label>
            {form.paragraphs.map((para, index) => (
              <div key={index} className="mb-4">
                <textarea
                  value={para.text}
                  onChange={(e) => handleParagraphChange(index, e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  rows={3}
                  placeholder="Enter paragraph text..."
                />
                {form.paragraphs.length > 1 && (
                  <div className="flex justify-start mt-2">
                    <button
                      type="button"
                      onClick={() => removeParagraph(index)}
                      className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addParagraph}
              className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-800 hover:to-purple-600 text-white px-3 py-1 rounded-full text-sm"
            >
              <AddIcon className="w-4 h-4" /> Add Paragraph
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-6 justify-items-center items-center">
            <div>
              <label className="block mb-1 font-medium">Website Logo</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "logo")} />
              <p className="text-xs text-gray-500 mt-1">Recommended: 210 × 130 px</p>
              {foundationData.logoUrl && (
                <img
                  src={foundationData.logoUrl}
                  alt="Logo"
                  className="mt-2 w-[150px] h-[100px] object-contain border rounded"
                />
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Author Portrait</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "authorImage")} />
              <p className="text-xs text-gray-500 mt-1">Recommended: 740 × 710 px</p>
              {foundationData.imageUrl && (
                <img
                  src={foundationData.imageUrl}
                  alt="Author"
                  className="mt-2 w-[150px] h-[150px] object-contain border rounded"
                />
              )}
            </div>
          </div>
          <div className="flex justify-start mt-6">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 text-white font-regular px-6 py-2 shadow disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? "Updating..." : "Update Foundation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminFoundationPage;
