import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import VerifiedIcon from "@mui/icons-material/Verified";
import axios from "axios";
import getBaseUrl from "../../../../utils/baseURL";

const TrustCertificate = () => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [fetchingCerts, setFetchingCerts] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const fetchCertificates = async () => {
    try {
      setFetchingCerts(true);
      const response = await axios.get(`${getBaseUrl()}/api/trust-certificates`);
      setCertificates(response.data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      Swal.fire("Error", "Failed to fetch certificates", "error");
    } finally {
      setFetchingCerts(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      Swal.fire("Error", "Maximum 10 images allowed at once", "error");
      return;
    }

    const validFiles = [];
    const previews = [];

    files.forEach((file) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const requiredWidth = 200;
        const requiredHeight = 200;
        const withinRange =
          Math.abs(img.width - requiredWidth) <= 25 &&
          Math.abs(img.height - requiredHeight) <= 25;

        if (!withinRange) {
          Swal.fire({
            icon: "warning",
            title: "Image Size Warning",
            html: `
            <p>Recommended size: <b>${requiredWidth}×${requiredHeight}px</b></p>
            <p>Your image: <b>${img.width}×${img.height}px</b></p>
            <p>Do you want to continue with this image?</p>
          `,
            showCancelButton: true,
            confirmButtonText: "Yes, use it",
            cancelButtonText: "Re-upload",
          }).then((result) => {
            if (result.isConfirmed) {
              validFiles.push(file);
              previews.push(URL.createObjectURL(file));
              setImages((prev) => [...prev, ...validFiles]);
              setPreviews((prev) => [...prev, ...previews]);
            }
          });
        } else {
          validFiles.push(file);
          previews.push(URL.createObjectURL(file));
          setImages((prev) => [...prev, ...validFiles]);
          setPreviews((prev) => [...prev, ...previews]);
        }
      };
    });
  };


  const handleSave = async () => {
    if (images.length === 0) {
      Swal.fire("Error", "Please select at least one image", "error");
      return;
    }

    const confirm = await Swal.fire({
      title: "Confirm Upload",
      html: `Are you sure you want to upload <b>${images.length}</b> certificate(s)?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, upload",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      const formData = new FormData();
      images.forEach((image) => formData.append("certificates", image));

      await axios.post(`${getBaseUrl()}/api/trust-certificates/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire("Success!", "Certificates uploaded successfully", "success");
      setImages([]);
      setPreviews([]);
      fetchCertificates();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to upload certificates", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This certificate will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${getBaseUrl()}/api/trust-certificates/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      Swal.fire("Deleted!", "Certificate deleted successfully.", "success");
      fetchCertificates();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to delete certificate", "error");
    }
  };

  const handleSuspend = async (cert) => {
    const action = cert.suspended ? "unsuspend" : "suspend";
    const result = await Swal.fire({
      title: `Are you sure you want to ${action} this certificate?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: action === "suspend" ? "Yes, suspend!" : "Yes, unsuspend!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.put(
        `${getBaseUrl()}/api/trust-certificates/${action}/${cert._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      Swal.fire("Success", `Certificate ${action}ed successfully`, "success");
      fetchCertificates();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", `Failed to ${action} certificate`, "error");
    }
  };



  return (
    <div className="container mt-[40px] font-montserrat text-slate-700">
      <div className="container mx-auto">
        <div className="max-w-8xl mx-auto p-0 rounded-lg">
          <div className="mb-6">
            <button
              onClick={() => navigate("/dashboard/cms")}
              className="flex items-center gap-2 justify-center rounded-full bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 text-slate-700 hover:bg-white/90 transition-colors duration-200 px-3 py-1.5 text-sm font-medium"
            >
              <ArrowBackIcon className="w-4 h-4" />
              Back
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-[#7A1F2B] mb-2 text-center">
              Trust Certificates
            </h2>
            <p className="text-sm text-slate-500 mt-1 text-center">
              Upload payment gateway and service provider logos
            </p>
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] border border-white/70 ring-1 ring-black/5 mt-5 overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/70 ring-1 ring-black/5">
                <h2 className="text-lg font-semibold text-[#7A1F2B] mb-4">Upload New Certificates</h2>
                <input
                  id="uploadInput"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="block w-full bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-lg px-4 py-2 text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white/80 file:text-slate-700 hover:file:bg-white mb-4"
                />
                <p className="text-xs text-slate-500 mb-4">
                  Maximum 10 images at once.  Recommended size: <span className="font-semibold">200 × 200 px</span>
                </p>
                {previews.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-md font-semibold text-slate-700 mb-3">Preview ({previews.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {previews.map((url, index) => (
                        <div key={index} className="relative border border-white/70 ring-1 ring-black/5 rounded-xl overflow-hidden bg-white/80 p-2">
                          <img src={url} alt={`Preview ${index + 1}`} className="w-full h-20 object-contain" />
                          <button
                            onClick={() => {
                              setImages((prev) => prev.filter((_, i) => i !== index));
                              setPreviews((prev) => prev.filter((_, i) => i !== index));
                            }}
                            className="absolute top-1 right-1 bg-[#7A1F2B] text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSave}
                  disabled={loading || images.length === 0}
                  className={`w-auto py-2 px-4 rounded-full bg-gradient-to-br from-white/95 to-slate-50/80 backdrop-blur-xl border-1 border-[#7A1F2B] ring-1 ring-black/5 text-[#7A1F2B] font-semibold transition-colors duration-200 flex items-center justify-center gap-2 shadow-[0_12px_20px_-16px_rgba(15,23,42,0.45)] hover:shadow-[0_14px_22px_-16px_rgba(15,23,42,0.5)] ${loading || images.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-[#7A1F2B]"
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
                    <>
                      <FiUpload className="w-5 h-5" />
                      Upload Certificates
                    </>
                  )}
                </button>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#7A1F2B] mb-4">
                  Current Certificates ({certificates.length})
                </h2>
                {fetchingCerts ? (
                  <div className="flex justify-center py-12">
                    <svg
                      className="animate-spin h-8 w-8 text-[#7A1F2B]"
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
                  </div>
                ) : certificates.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {certificates.map((cert) => (
                      <div
                        key={cert._id}
                        className={`relative bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-xl overflow-hidden transition-colors duration-200 shadow-sm hover:bg-white/90 ${cert.suspended ? "border-[#7A1F2B]/40 opacity-60" : ""}`}
                      >
                        {cert.suspended && (
                          <div className="absolute top-2 right-2 bg-[#7A1F2B] text-white text-xs sm:text-sm px-2 py-1 rounded-full font-semibold z-10">
                            Suspended
                          </div>
                        )}
                        <div className="p-3 sm:p-4 flex flex-col items-center">
                          <img
                            src={cert.imageUrl}
                            alt={cert.name}
                            className="w-full sm:h-24 h-20 object-contain mb-2 sm:mb-3"
                          />
                          <p className="text-xs sm:text-sm text-slate-600 text-center truncate mb-2 sm:mb-3">
                            {cert.name}
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <button
                              onClick={() => handleSuspend(cert)}
                              className={`w-full sm:flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-full text-sm font-medium bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 shadow-sm hover:bg-white/90 transition-colors duration-200 ${cert.suspended
                                ? "text-teal-700"
                                : "text-amber-700"
                                }`}
                            >
                              {cert.suspended ? "Unsuspend" : "Suspend"}
                            </button>
                            <button
                              onClick={() => handleDelete(cert._id)}
                              className="w-full sm:flex-1 px-3 py-2 rounded-full text-red-600 text-sm font-medium bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 shadow-sm hover:bg-white/90 transition-colors duration-200 flex items-center justify-center gap-1"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                    <VerifiedIcon className="w-12 h-12 mb-2 text-slate-400" />
                    <p className="text-sm font-medium">No certificates uploaded</p>
                    <p className="text-xs mb-4">Upload your first trust certificate to get started</p>
                    <button
                      onClick={() => document.getElementById("uploadInput").click()}
                      className="px-4 py-2 rounded-full bg-gradient-to-br from-white/95 to-slate-50/80 backdrop-blur-xl border-1 border-[#7A1F2B] ring-1 ring-black/5 text-[#7A1F2B] font-semibold shadow-[0_12px_20px_-16px_rgba(15,23,42,0.45)] hover:shadow-[0_14px_22px_-16px_rgba(15,23,42,0.5)] transition-colors duration-200"
                    >
                      Upload Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustCertificate;
