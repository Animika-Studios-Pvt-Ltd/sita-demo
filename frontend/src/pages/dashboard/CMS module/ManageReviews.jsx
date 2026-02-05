import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventIcon from "@mui/icons-material/Event";
import BookIcon from "@mui/icons-material/Book";
import getBaseUrl from "../../../utils/baseURL";

const BACKEND_BASE_URL = getBaseUrl();

axios.defaults.baseURL = BACKEND_BASE_URL;

const socket = io(BACKEND_BASE_URL, {
  transports: ["websocket"],
});

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [activeCategory, setActiveCategory] = useState("pending");
  const [activeTab, setActiveTab] = useState("books"); // 'books' or 'events'
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("connect", () => {
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    // Listen for real-time updates (Books only for now, can extend for Events)
    socket.on("newReview", (review) => {
      if (activeTab === "books") {
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
      }
    });

    socket.on("reviewUpdated", (review) => {
      if (activeTab === "books") {
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
      }
    });

    return () => {
      socket.off("newReview");
      socket.off("reviewUpdated");
    };
  }, [activeTab]);

  // Fetch Reviews/Ratings when tab or category changes
  useEffect(() => {
    const fetchReviews = async () => {
      setReviews([]); // Clear while loading
      try {
        let res;
        if (activeTab === "books") {
          res = await axios.get("/api/reviews/admin");
        } else {
          res = await axios.get("/api/events/admin/ratings");
        }

        // Normalize data
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.reviews || res.data.ratings || [];

        console.log(`📊 fetched ${activeTab} raw res:`, res.data);
        console.log(`📊 fetched ${activeTab} normalized data:`, data);

        setReviews(data);
      } catch (err) {
        console.error(`❌ Failed to fetch ${activeTab}:`, err);
        setReviews([]);
      }
    };

    fetchReviews();
  }, [activeTab]);

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
      const endpoint = activeTab === "books"
        ? `/api/reviews/${id}/approve`
        : `/api/events/admin/ratings/${id}/approve`;

      const res = await axios.patch(endpoint, {
        approved: true,
      });

      // Backend response format might differ slightly
      const updatedItem = res.data.review || res.data.rating;

      setReviews((prev) =>
        (prev || []).map((r) => (r._id === id ? updatedItem : r))
      );

      Swal.fire("Approved!", "Review approved successfully.", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to approve review", "error");
    }
  };

  const disapproveReview = async (id, userName) => {
    // For Books, we ask for a reason. For Events, we just delete for now (simpler logic backend)
    // But let's keep the reason UI for consistency, even if we don't fully use it in Event backend yet.

    // Actually, event deleteRating doesn't take a body reason, but passing it won't hurt.
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
      const endpoint = activeTab === "books"
        ? `/api/reviews/${id}/disapprove`
        : `/api/events/admin/ratings/${id}/disapprove`;

      // DELETE requests with body need 'data' key in axios
      await axios.delete(endpoint, {
        data: { reason },
      });

      setReviews((prev) => (prev || []).filter((r) => r._id !== id));

      Swal.fire({
        title: "Disapproved!",
        text: "Review has been disapproved.",
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
    <div className="container mt-[40px] font-montserrat text-slate-700">
      <div className="container mx-auto">
        <div className="max-w-8xl mx-auto p-0 rounded-lg">
          <div className="mb-6 mt-5">
            <button
              onClick={() => navigate("/dashboard/cms")}
              className="flex items-center gap-2 justify-center rounded-full bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 text-slate-700 hover:bg-white/90 transition-colors duration-200 px-3 py-1.5 text-sm font-medium"
            >
              <ArrowBackIcon className="w-4 h-4" />
              Back
            </button>

            <div className="relative flex justify-center mb-4 mt-6 bg-white/60 backdrop-blur-xl border border-[#7A1F2B] ring-1 ring-white/70 rounded-full p-1.5 max-w-md mx-auto shadow-sm overflow-hidden">
              <div
                className={`absolute top-1.5 left-1.5 w-[calc(50%-0.375rem)] h-10 bg-gradient-to-br from-[#7A1F2B]/10 via-white/90 to-white/80 rounded-full border border-[#7A1F2B] ring-1 ring-black/5 shadow-[0_8px_18px_-12px_rgba(122,31,43,0.45)] transform transition-transform duration-300 ${activeTab === "events" ? "translate-x-full" : ""}`}
              ></div>
              <button
                onClick={() => setActiveTab("books")}
                className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-sm md:text-base transition-colors duration-200 ${activeTab === "books" ? "text-[#7A1F2B]" : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                <BookIcon className="w-5 h-5" />
                Book Reviews
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-sm md:text-base transition-colors duration-200 ${activeTab === "events" ? "text-[#7A1F2B]" : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                <EventIcon className="w-5 h-5" />
                Event Ratings
              </button>
            </div>

          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] border border-white/70 ring-1 ring-black/5 overflow-hidden">
            <div className="px-6 pt-4 pb-3">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="hidden md:block" />
                <div className="text-center">
                  <h3 className="text-2xl md:text-3xl font-semibold text-[#7A1F2B] mb-1 font-montserrat">
                    {activeCategory === "pending"
                      ? `Pending ${activeTab === "books" ? "Book Reviews" : "Event Ratings"}`
                      : `Approved ${activeTab === "books" ? "Book Reviews" : "Event Ratings"}`}
                  </h3>
                  <p className="text-sm md:text-base text-slate-500">
                    {activeCategory === "pending"
                      ? "Review and approve feedback"
                      : "View all approved feedback"}
                  </p>
                </div>

                <div className="flex justify-center md:justify-end md:mt-[-2px]">
                  <div className="relative flex bg-white/60 backdrop-blur-xl border border-[#7A1F2B] ring-1 ring-white/70 rounded-full p-1 shadow-sm overflow-hidden w-full sm:w-auto max-w-none min-w-[260px] sm:min-w-[300px] md:min-w-[320px]">
                    <div
                      className={`absolute inset-y-1 left-0.5 w-[calc(50%-0.25rem)] bg-gradient-to-br from-[#7A1F2B]/10 via-white/90 to-white/80 rounded-full border border-[#7A1F2B] ring-1 ring-black/5 shadow-[0_6px_14px_-12px_rgba(122,31,43,0.35)] transform transition-transform duration-300 ${activeCategory === "approved" ? "translate-x-full" : ""}`}
                    ></div>
                    <button
                      className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-medium text-xs sm:text-sm leading-none tracking-tight whitespace-nowrap transition-colors duration-200 ${activeCategory === "pending"
                        ? "text-[#7A1F2B]"
                        : "text-slate-500 hover:text-slate-800"
                        }`}
                      onClick={() => setActiveCategory("pending")}
                    >
                      <PendingIcon className="w-3.5 h-3.5" />
                      Pending ({pendingReviews.length})
                    </button>
                    <button
                      className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-medium text-xs sm:text-sm leading-none tracking-tight whitespace-nowrap transition-colors duration-200 ${activeCategory === "approved"
                        ? "text-[#7A1F2B]"
                        : "text-slate-500 hover:text-slate-800"
                        }`}
                      onClick={() => setActiveCategory("approved")}
                    >
                      <CheckCircleIcon className="w-3.5 h-3.5" />
                      Approved ({approvedReviews.length})
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {currentReviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  {activeCategory === "pending" ? (
                    <>
                      <PendingIcon className="w-12 h-12 mb-2 text-slate-400" />
                      <p className="text-sm font-medium">No pending {activeTab === "books" ? "reviews" : "ratings"}</p>
                      <p className="text-xs">All processed!</p>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-12 h-12 mb-2 text-slate-400" />
                      <p className="text-sm font-medium">No approved {activeTab === "books" ? "reviews" : "ratings"}</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {currentReviews.map((review) => (
                    <div
                      key={review._id}
                      className={`bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-xl p-4 transition-colors duration-200 shadow-sm hover:bg-white/90 ${review.isNew
                        ? "border-[#7A1F2B]/50 bg-[#7A1F2B]/5"
                        : ""
                        }`}
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-slate-800">
                              {review.userName}
                            </h3>
                            <span className="text-xs text-slate-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                            {/* Identify context if needed */}
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#7A1F2B]/10 text-[#7A1F2B] border border-[#7A1F2B]/20">
                              {activeTab === "books" ? "Book" : "Event"}
                            </span>
                          </div>

                          {/* 1. Name */}
                          <p className="text-sm text-slate-500 mb-2">
                            {activeTab === "books" ? "Book: " : "Event: "}
                            <strong className="text-slate-800 text-base">{review.bookName || review.event?.title || "Unknown"}</strong>
                          </p>

                          {/* 2. Stars */}
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <span key={i} className="text-amber-500 text-lg">
                                ★
                              </span>
                            ))}
                            {Array.from({ length: 5 - review.rating }).map(
                              (_, i) => (
                                <span key={i} className="text-slate-300 text-lg">
                                  ★
                                </span>
                              )
                            )}
                          </div>

                          {/* 3. Comment */}
                          <p className="text-slate-600 italic mb-2">
                            "{review.comment}"
                          </p>
                        </div>

                        <div className="flex gap-2">
                          {activeCategory === "pending" ? (
                            <>
                              <button
                                onClick={() => approveReview(review._id)}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-full text-emerald-700 text-sm font-medium bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 shadow-sm hover:bg-white/90 transition-colors duration-200"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  disapproveReview(review._id, review.userName)
                                }
                                className="inline-flex items-center justify-center px-4 py-2 rounded-full text-red-600 text-sm font-medium bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 shadow-sm hover:bg-white/90 transition-colors duration-200"
                              >
                                Disapprove
                              </button>
                            </>
                          ) : (
                            <span className="inline-flex items-center px-4 py-2 bg-white/70 text-emerald-700 text-sm font-medium rounded-full border border-white/70 ring-1 ring-black/5">
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
      </div>
    </div>
  );
};

export default ManageReviews;
