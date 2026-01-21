import React, { useEffect, useState, useRef } from "react";
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

const Authorpage = () => {
  const [form, setForm] = useState(null);
  const [rightFile, setRightFile] = useState(null);
  const [rightPreview, setRightPreview] = useState(null);
  const [leftFile, setLeftFile] = useState(null);
  const [leftPreview, setLeftPreview] = useState(null);
  const [middleFile, setMiddleFile] = useState(null);
  const [middlePreview, setMiddlePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Working Creed Images State (added)
  const [workingCreedImages, setWorkingCreedImages] = useState([]);
  const [selectedCreedFile, setSelectedCreedFile] = useState(null);
  const [selectedCreedPreview, setSelectedCreedPreview] = useState(null);
  const [uploadingCreed, setUploadingCreed] = useState(false);
  const [deletingCreedId, setDeletingCreedId] = useState(null);

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const creedFileInputRef = useRef(null);

  // cleanup object URLs on unmount / preview change
  useEffect(() => {
    return () => {
      if (rightPreview) URL.revokeObjectURL(rightPreview);
      if (leftPreview) URL.revokeObjectURL(leftPreview);
      if (middlePreview) URL.revokeObjectURL(middlePreview);
      if (selectedCreedPreview) URL.revokeObjectURL(selectedCreedPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchAuthorData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAuthorData = () => {
    fetch(`${baseUrl}/api/author`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setForm(data);

        if (data.aboutAuthor?.rightImage?.src) setRightPreview(data.aboutAuthor.rightImage.src);
        if (data.aboutAuthor?.middleImage?.src) setMiddlePreview(data.aboutAuthor.middleImage.src);
        if (data.workingCreed?.leftImage?.src) setLeftPreview(data.workingCreed.leftImage.src);

        // Load working creed images (array expected as data.workingCreed.images)
        if (data.workingCreed?.images) {
          setWorkingCreedImages(data.workingCreed.images);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load author data");
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => setNestedValue({ ...prevForm }, name, value));
  };

  const handleAddParagraph = () => {
    setForm((prevForm) => (prevForm ? {
      ...prevForm,
      aboutAuthor: {
        ...prevForm.aboutAuthor,
        leftText: {
          ...prevForm.aboutAuthor.leftText,
          paragraphs: [...(prevForm.aboutAuthor.leftText.paragraphs || []), { text: "" }]
        }
      }
    } : prevForm));
  };

  const handleRemoveParagraph = (index) => {
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
        setForm((prevForm) => ({
          ...prevForm,
          aboutAuthor: {
            ...prevForm.aboutAuthor,
            leftText: {
              ...prevForm.aboutAuthor.leftText,
              paragraphs: prevForm.aboutAuthor.leftText.paragraphs.filter((_, i) => i !== index)
            }
          }
        }));

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The paragraph has been removed successfully.",
          confirmButtonColor: "#3085d6",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // Middle image change (portrait) - existing behaviour
  const handleMiddleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const requiredWidth = 500;
      const requiredHeight = 400;

      const withinRange =
        Math.abs(img.width - requiredWidth) <= 25 &&
        Math.abs(img.height - requiredHeight) <= 25;

      const setPreviewAndFile = () => {
        setMiddleFile(file);
        const objUrl = URL.createObjectURL(file);
        setMiddlePreview(objUrl);
      };

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
          if (result.isConfirmed) setPreviewAndFile();
        });
      } else {
        setPreviewAndFile();
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(form));
      if (middleFile) formData.append("middleImage", middleFile);

      const res = await fetch(`${baseUrl}/api/author`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update author content");

      Swal.fire("Success", "Author content updated successfully!", "success");
      fetchAuthorData();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update author content", "error");
    } finally {
      setLoading(false);
    }
  };

  //
  // --- WORKING CREED: File handling + upload + delete (ADDED)
  //

  // Validate creed file dimensions and set preview + file
  const handleCreedFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      const recommendedWidth = 1000;
      const recommendedHeight = 500;
      const tolerance = 50; // px

      const withinRange =
        Math.abs(img.width - recommendedWidth) <= tolerance &&
        Math.abs(img.height - recommendedHeight) <= tolerance;

      const setPreview = () => {
        setSelectedCreedFile(file);
        setSelectedCreedPreview(objectUrl);
      };

      if (!withinRange) {
        Swal.fire({
          icon: "warning",
          title: "Image Size Warning",
          html: `
            <p>Recommended: <b>${recommendedWidth} × ${recommendedHeight}px</b></p>
            <p>You uploaded: <b>${img.width} × ${img.height}px</b></p>
            <p>Do you want to use this image anyway?</p>
          `,
          showCancelButton: true,
          confirmButtonText: "Yes, use it",
          cancelButtonText: "No, re-upload",
        }).then((result) => {
          if (result.isConfirmed) {
            setPreview();
          } else {
            // revoke and clear preview if user cancels
            URL.revokeObjectURL(objectUrl);
            if (creedFileInputRef.current) creedFileInputRef.current.value = "";
            setSelectedCreedFile(null);
            setSelectedCreedPreview(null);
          }
        });
      } else {
        setPreview();
      }
    };

    img.onerror = () => {
      // invalid image - revoke and clear
      URL.revokeObjectURL(objectUrl);
      Swal.fire("Error", "Selected file is not a valid image", "error");
      if (creedFileInputRef.current) creedFileInputRef.current.value = "";
      setSelectedCreedFile(null);
      setSelectedCreedPreview(null);
    };
  };

  // Upload selected creed image
  const handleCreedImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedCreedFile) {
      Swal.fire("Error", "Please select an image", "error");
      return;
    }

    setUploadingCreed(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedCreedFile);

      const response = await fetch(`${baseUrl}/api/author/working-creed/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text().catch(() => null);
        throw new Error(text || "Upload failed");
      }

      const result = await response.json();

      // append the returned image object (expecting result.image with src/alt etc)
      setWorkingCreedImages((prev) => [...prev, result.image]);

      Swal.fire("Success", "Working creed image uploaded successfully!", "success");

      // reset selection + preview + input
      setSelectedCreedFile(null);
      if (selectedCreedPreview) {
        URL.revokeObjectURL(selectedCreedPreview);
        setSelectedCreedPreview(null);
      }
      if (creedFileInputRef.current) creedFileInputRef.current.value = "";
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to upload image", "error");
    } finally {
      setUploadingCreed(false);
    }
  };

  const handleDeleteCreedImage = async (imageSrc) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the image",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!result.isConfirmed) return;

    setDeletingCreedId(imageSrc);
    try {
      const response = await fetch(`${baseUrl}/api/author/working-creed/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: imageSrc }),
      });

      if (!response.ok) {
        const txt = await response.text().catch(() => null);
        throw new Error(txt || "Delete failed");
      }

      setWorkingCreedImages((prev) => prev.filter((img) => img.src !== imageSrc));
      Swal.fire("Deleted", "Image deleted successfully", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to delete image", "error");
    } finally {
      setDeletingCreedId(null);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="container mt-[100px] mb-12">
      <div className="max-w-8xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 transition-all duration-300 text-white font-medium rounded-[6px] px-2 py-1"
          >
            <ArrowBackIcon className="w-4 h-4 mr-1" />
            Back
          </button>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10 text-center">
            Update Author Bio
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Section Heading</label>
            <input
              type="text"
              name="sectionHeading.text"
              value={form?.sectionHeading?.text || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Author Bio</label>
            {(form?.aboutAuthor?.leftText?.paragraphs || []).map((para, index) => (
              <div key={index} className="relative mb-4">
                <textarea
                  name={`aboutAuthor.leftText.paragraphs.${index}.text`}
                  value={para.text}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  rows={4}
                />
                {index === (form?.aboutAuthor?.leftText?.paragraphs?.length || 0) - 1 &&
                  (form?.aboutAuthor?.leftText?.paragraphs?.length || 0) > 1 && (
                    <div className="flex justify-start mt-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveParagraph(index)}
                        className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 rounded-full text-white w-24 py-1 text-sm hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
              </div>
            ))}

            <div className="mt-3">
              <button
                type="button"
                onClick={handleAddParagraph}
                className="rounded-full bg-gradient-to-r font-light from-purple-600 to-purple-800 hover:from-purple-800 hover:to-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700 transition-transform transform text-sm"
              >
                + Add Another Paragraph
              </button>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <div className="flex flex-col items-left mt-6">
              <label className="mb-2 font-medium text-left">Author Portrait</label>

              <input
                type="file"
                accept="image/*"
                onChange={handleMiddleFileChange}
                className="mb-2"
              />

              <p className="text-xs text-gray-500">
                Recommended size: <span className="font-semibold">500 × 400 px</span>
              </p>

              {middlePreview ? (
                <img
                  src={middlePreview}
                  alt="Middle Image Preview"
                  className="w-[180px] h-[120px] mt-2 object-contain border rounded"
                />
              ) : (
                <p className="mt-2 text-gray-500 italic text-center w-[180px]">
                  No image selected
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-start mt-6">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 text-white font-regular px-6 py-2 shadow disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Content"}
            </button>
          </div>
        </form>

        {/* Working Creed Images Section */}
        <div className="bg-white shadow-md mt-[50px] rounded-lg p-5 mb-6 border">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10 text-center">
            Working Creed Images – Upload Multiple Images
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {workingCreedImages.length === 0 && (
              <p className="text-gray-500 col-span-3 text-center py-8">
                No working creed images found.
              </p>
            )}

            {workingCreedImages.map((image, index) => (
              <div
                key={index}
                className="border rounded-lg p-2 overflow-hidden relative group"
              >
                <img
                  src={image.src}
                  alt={image.alt || "Working Creed"}
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  onClick={() => handleDeleteCreedImage(image.src)}
                  disabled={deletingCreedId === image.src}
                  className={`bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 rounded-full text-white w-auto py-1 px-3 mt-2 text-sm flex items-center justify-center gap-2 ${
                    deletingCreedId === image.src
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-red-600 transition-colors"
                  } mx-auto`}
                >
                  {deletingCreedId === image.src ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
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
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="mb-6 mt-6 max-w-xs mx-auto">
            <form onSubmit={handleCreedImageUpload} className="space-y-4">
              <input
                id="creed-file-input"
                ref={creedFileInputRef}
                type="file"
                name="image"
                accept="image/*"
                onChange={handleCreedFileChange}
                className="border px-3 py-2 rounded w-full"
                disabled={uploadingCreed}
              />

              {/* Preview of selected creed file */}
              {selectedCreedPreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1 text-center">Preview</p>
                  <img
                    src={selectedCreedPreview}
                    alt="Selected creed preview"
                    className="w-full h-36 object-cover rounded"
                  />
                </div>
              )}

              <p className="text-xs text-gray-500 mt-1 text-center">
                Recommended size: <span className="font-semibold">1000 × 500px</span>
              </p>
              <button
                type="submit"
                disabled={uploadingCreed || !selectedCreedFile}
                className={`rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 text-white px-4 py-2 w-full font-semibold flex items-center justify-center gap-2 ${
                  uploadingCreed || !selectedCreedFile ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploadingCreed ? (
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
                  "Upload Image"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authorpage;
