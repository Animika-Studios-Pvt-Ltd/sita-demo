import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const BACKEND_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://bookstore-backend-hshq.onrender.com";

axios.defaults.baseURL = BACKEND_BASE_URL;

const socket = io(BACKEND_BASE_URL, {
  transports: ["websocket"],
});

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [activeCategory, setActiveCategory] = useState("pending");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("connect", () => {
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    const fetchReviews = async () => {
      try {
        const res = await axios.get("/api/reviews/admin");

        const data = Array.isArray(res.data)
          ? res.data
          : res.data.reviews || [];

        setReviews(data);
      } catch (err) {
        console.error("❌ Failed to fetch reviews:", err);
        setReviews([]);
      }
    };

    fetchReviews();

    socket.on("newReview", (review) => {
      Swal.fire({
        title: "New Review Submitted!",
        html: `<b>${review.userName}</b> rated ${review.rating} stars<br>${review.comment}<br>Book: ${review.bookName || "Unknown"}`,
        icon: "info",
      });

      setReviews((prev) => [{ ...review, isNew: true }, ...(prev || [])]);

      setTimeout(() => {
        setReviews((prev) =>
          (prev || []).map((r) =>
            r._id === review._id ? { ...r, isNew: false } : r
          )
        );
      }, 5000);
    });

    socket.on("reviewUpdated", (review) => {
      Swal.fire({
        title: "Review Updated!",
        html: `<b>${review.userName}</b> updated their review<br>${review.comment}<br>Book: ${review.bookName || "Unknown"}`,
        icon: "warning",
      });

      setReviews((prev) =>
        (prev || []).map((r) =>
          r._id === review._id ? { ...review, isNew: true } : r
        )
      );

      setTimeout(() => {
        setReviews((prev) =>
          (prev || []).map((r) =>
            r._id === review._id ? { ...r, isNew: false } : r
          )
        );
      }, 5000);
    });

    return () => {
      socket.off("newReview");
      socket.off("reviewUpdated");
    };
  }, []);

  const approveReview = async (id) => {
    const confirm = await Swal.fire({
      title: "Approve Review?",
      text: "This review will be visible to all users.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve",
      confirmButtonColor: "#10b981",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await axios.patch(`/api/reviews/${id}/approve`, {
        approved: true,
      });

      setReviews((prev) =>
        (prev || []).map((r) => (r._id === id ? res.data.review : r))
      );

      Swal.fire("Approved!", "Review approved successfully.", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to approve review", "error");
    }
  };
  const disapproveReview = async (id, userName, userEmail) => {
    const { value: reason, isConfirmed } = await Swal.fire({
      title: "Disapprove Review?",
      html: `
      <p>Please provide a reason for disapproval. An email will be sent to <strong>${userName}</strong>.</p>
    `,
      input: "textarea",
      inputPlaceholder: "Enter reason for disapproval...",
      inputAttributes: {
        "aria-label": "Reason for disapproval",
        required: true,
      },
      showCancelButton: true,
      confirmButtonText: "Yes, disapprove",
      confirmButtonColor: "#ef4444",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "You must provide a reason!";
        }
      },
    });

    if (!isConfirmed || !reason) return;

    try {
      const res = await axios.delete(`/api/reviews/${id}/disapprove`, {
        data: { reason },
      });

      setReviews((prev) => (prev || []).filter((r) => r._id !== id));

      Swal.fire({
        title: "Disapproved!",
        text: "Review has been disapproved and user notified.",
        icon: "success",
      });
    } catch (err) {
      console.error("❌ Error disapproving review:", err);
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Failed to disapprove review",
        icon: "error",
      });
    }
  };

  const pendingReviews = Array.isArray(reviews)
    ? reviews.filter((r) => !r.approved)
    : [];
  const approvedReviews = Array.isArray(reviews)
    ? reviews.filter((r) => r.approved)
    : [];

  const currentReviews =
    activeCategory === "pending" ? pendingReviews : approvedReviews;

  return (
    <div className="container mx-auto px-4 py-8 font-figtree font-normal leading-snug">
      <div className="mb-6 mt-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 transition-all duration-300 text-white font-medium rounded-[6px] px-2 py-1"
        >
          <ArrowBackIcon className="w-4 h-4 mr-1" />
          Back
        </button>
        <div className="relative flex justify-center mb-8 mt-8 bg-gray-200 rounded-full p-1 max-w-md mx-auto shadow-inner">
          <div
            className={`absolute top-1 left-1 w-1/2 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 transform transition-transform duration-300 ${activeCategory === "approved" ? "translate-x-full" : ""
              }`}
          ></div>
          <button
            className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${activeCategory === "pending"
              ? "text-white"
              : "text-gray-700 hover:text-gray-900 hover:scale-105"
              }`}
            onClick={() => setActiveCategory("pending")}
          >
            <PendingIcon className="w-5 h-5" />
            Pending ({pendingReviews.length})
          </button>
          <button
            className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${activeCategory === "approved"
              ? "text-white"
              : "text-gray-700 hover:text-gray-900 hover:scale-105"
              }`}
            onClick={() => setActiveCategory("approved")}
          >
            <CheckCircleIcon className="w-5 h-5" />
            Approved ({approvedReviews.length})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="text-center font-figtree mb-10">
          <h3 className="text-2xl md:text-3xl font-playfair text-gray-800 mb-2 mt-6 text-center">
            {activeCategory === "pending"
              ? "Pending Reviews"
              : "Approved Reviews"}
          </h3>
          <p className="text-lg text-gray-600 mt-1">
            {activeCategory === "pending"
              ? "Review and approve customer feedback"
              : "View all approved customer reviews"}
          </p>
        </div>

        <div className="p-6">
          {currentReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              {activeCategory === "pending" ? (
                <>
                  <PendingIcon className="w-12 h-12 mb-2 text-gray-400" />
                  <p className="text-sm font-medium">No pending reviews</p>
                  <p className="text-xs">All reviews have been processed</p>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-12 h-12 mb-2 text-gray-400" />
                  <p className="text-sm font-medium">No approved reviews</p>
                  <p className="text-xs">Approved reviews will appear here</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {currentReviews.map((review) => (
                <div
                  key={review._id}
                  className={`bg-white border rounded-lg p-4 transition-all hover:shadow-md ${review.isNew
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-gray-200"
                    }`}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {review.userName}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 italic mb-2">
                        {review.comment}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        Book: <strong>{review.bookName || "Unknown"}</strong>
                      </p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i} className="text-yellow-500 text-lg">
                            ★
                          </span>
                        ))}
                        {Array.from({ length: 5 - review.rating }).map(
                          (_, i) => (
                            <span key={i} className="text-gray-300 text-lg">
                              ★
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {activeCategory === "pending" ? (
                        <>
                          <button
                            onClick={() => approveReview(review._id)}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-800 hover:to-green-600 text-white text-sm font-medium transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              disapproveReview(review._id, review.userName)
                            }
                            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-800 hover:to-red-600 text-white text-sm font-medium transition-colors"
                          >
                            Disapprove
                          </button>
                        </>
                      ) : (
                        <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          Approved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .swal2-popup { width: 95% !important; padding: 15px !important; }
          #disapproval-reason { font-size: 14px !important; min-height: 100px !important; }
        }
      `}</style>
    </div>
  );
};

export default ManageReviews;
