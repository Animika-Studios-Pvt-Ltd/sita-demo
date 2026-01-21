import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiUpload } from "react-icons/fi";
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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">Trust Certificates</h2>
          <p className="text-sm text-gray-600 mt-1 text-center">
            Upload payment gateway and service provider logos
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-5 overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload New Certificates</h2>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
              />
              <p className="text-xs text-gray-500 mb-4">
                Maximum 10 images at once.  Recommended size: <span className="font-semibold">200 × 200 px</span>
              </p>
              {previews.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-md font-semibold text-gray-700 mb-3">Preview ({previews.length})</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {previews.map((url, index) => (
                      <div key={index} className="relative border-2 border-gray-200 rounded-lg overflow-hidden bg-white p-2">
                        <img src={url} alt={`Preview ${index + 1}`} className="w-full h-20 object-contain" />
                        <button
                          onClick={() => {
                            setImages((prev) => prev.filter((_, i) => i !== index));
                            setPreviews((prev) => prev.filter((_, i) => i !== index));
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
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
                className={`w-auto py-2 px-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-2 ${loading || images.length === 0 ? "opacity-50 cursor-not-allowed" : ""
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
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Current Certificates ({certificates.length})
              </h2>
              {fetchingCerts ? (
                <div className="flex justify-center py-12">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-600"
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
                      className={`relative bg-white border-2 rounded-lg overflow-hidden transition-all shadow-sm hover:shadow-md ${cert.suspended ? "border-red-300 opacity-60" : "border-gray-200"}`}
                    >
                      {cert.suspended && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs sm:text-sm px-2 py-1 rounded-full font-semibold z-10">
                          Suspended
                        </div>
                      )}
                      <div className="p-3 sm:p-4 flex flex-col items-center">
                        <img
                          src={cert.imageUrl}
                          alt={cert.name}
                          className="w-full sm:h-24 h-20 object-contain mb-2 sm:mb-3"
                        />
                        <p className="text-xs sm:text-sm text-gray-600 text-center truncate mb-2 sm:mb-3">
                          {cert.name}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                          <button
                            onClick={() => handleSuspend(cert)}
                            className={`w-full sm:flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-full text-white font-light bg-gradient-to-r text-sm transition-all duration-300 ${cert.suspended
                              ? "from-teal-500 to-teal-700 hover:from-teal-700 hover:to-teal-500"
                              : "from-orange-400 to-orange-600 hover:from-orange-600 hover:to-orange-400"
                              }`}
                          >
                            {cert.suspended ? "Unsuspend" : "Suspend"}
                          </button>
                          <button
                            onClick={() => handleDelete(cert._id)}
                            className="w-full sm:flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 rounded-full text-white text-sm font-light transition-colors flex items-center justify-center gap-1"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <VerifiedIcon className="w-12 h-12 mb-2 text-gray-400" />
                  <p className="text-sm font-medium">No certificates uploaded</p>
                  <p className="text-xs mb-4">Upload your first trust certificate to get started</p>
                  <button
                    onClick={() => document.getElementById("uploadInput").click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
  );
};

export default TrustCertificate;
