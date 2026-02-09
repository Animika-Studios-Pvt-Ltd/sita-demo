import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const RateEvent = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userEmail = searchParams.get("email");

    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Dynamic colors and text based on rating
    const getRatingConfig = (r) => {
        switch (r) {
            case 1: return { color: "#EF4444", text: "Terrible 😫", gradient: "from-red-500 to-red-700", bg: "bg-red-50", ring: "focus:ring-red-500", border: "focus:border-red-500" };
            case 2: return { color: "#F97316", text: "Disappointed 😞", gradient: "from-orange-500 to-orange-700", bg: "bg-orange-50", ring: "focus:ring-orange-500", border: "focus:border-orange-500" };
            case 3: return { color: "#EAB308", text: "It was okay 😐", gradient: "from-yellow-400 to-yellow-600", bg: "bg-yellow-50", ring: "focus:ring-yellow-500", border: "focus:border-yellow-500" };
            case 4: return { color: "#84CC16", text: "Good! 🙂", gradient: "from-lime-500 to-lime-700", bg: "bg-lime-50", ring: "focus:ring-lime-500", border: "focus:border-lime-500" };
            case 5: return { color: "#22C55E", text: "Amazing! 🤩", gradient: "from-green-500 to-green-700", bg: "bg-green-50", ring: "focus:ring-green-500", border: "focus:border-green-500" };
            default: return { color: "#E4E5E9", text: "", gradient: "from-pink-500 via-red-500 to-yellow-500", bg: "bg-gray-50", ring: "focus:ring-red-500", border: "focus:border-red-500" };
        }
    };

    const currentConfig = getRatingConfig(rating || hover);
    // Determine active background class
    const containerClass = rating > 0 ? getRatingConfig(rating).bg : "bg-gray-50";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            Swal.fire("Oops", "Please select a star rating!", "warning");
            return;
        }

        setSubmitting(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/events/rate`, {
                bookingId,
                rating,
                comment,
                userEmail
            });

            setSubmitting(false);
            setSubmitted(true);

            // Success Alert is handled by the UI transition, but we can keep a toast or just let the UI take over
        } catch (error) {
            setSubmitting(false);
            const errorMessage = error.response?.data?.message || "Something went wrong";

            if (errorMessage.includes("already rated")) {
                Swal.fire("Already Rated! ✨", "You've already shared your feedback for this event.", "info");
            } else {
                Swal.fire("Error ⚠️", errorMessage, "error");
            }
        }
    };

    if (submitted) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${containerClass}`}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center p-10 bg-white rounded-2xl shadow-xl max-w-md"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="text-6xl mb-4"
                    >
                        {rating === 5 ? "🌟" : "✅"}
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Thanks for Rating!</h2>
                    <p className="text-gray-600">We appreciate your time.</p>
                    <button
                        onClick={() => navigate("/")}
                        className={`mt-8 px-6 py-2 bg-gradient-to-r ${getRatingConfig(rating).gradient} text-white rounded-full hover:shadow-lg transition-all`}
                    >
                        Back to Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors duration-700 ${containerClass}`}>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl overflow-hidden relative"
            >
                {/* Dynamic Top Bar */}
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${currentConfig.gradient} transition-all duration-500`}></div>

                <div className="text-center">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-2 text-3xl font-extrabold text-gray-900"
                    >
                        How was your experience?
                    </motion.h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Rate the event and let us know what you thought!
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="flex items-center space-x-2">
                            {[...Array(5)].map((_, index) => {
                                const ratingValue = index + 1;
                                // Color logic:
                                // If hovering, color up to hover value.
                                // If not hovering, color up to rating value.
                                // The color used is based on the *current highest active value* (hover or rating).
                                const isActive = ratingValue <= (hover || rating);
                                const starColor = isActive ? getRatingConfig(hover || rating).color : "#E4E5E9";

                                return (
                                    <motion.label
                                        key={index}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="rating"
                                            className="hidden"
                                            value={ratingValue}
                                            onClick={() => setRating(ratingValue)}
                                        />
                                        <FaStar
                                            size={50}
                                            className="transition-colors duration-200"
                                            color={starColor}
                                            onMouseEnter={() => setHover(ratingValue)}
                                            onMouseLeave={() => setHover(0)}
                                        />
                                    </motion.label>
                                );
                            })}
                        </div>
                        <AnimatePresence mode="wait">
                            {(hover > 0 || rating > 0) && (
                                <motion.div
                                    key={hover || rating}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-xl font-bold transition-colors duration-300"
                                    style={{ color: getRatingConfig(hover || rating).color }}
                                >
                                    {getRatingConfig(hover || rating).text}
                                </motion.div>
                            )}
                            {/* Placeholder to prevent layout shift */}
                            {hover === 0 && rating === 0 && <div className="h-7"></div>}
                        </AnimatePresence>
                    </div>

                    <div className="rounded-md shadow-sm -space-y-px">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label htmlFor="comment" className="sr-only">
                                Comment
                            </label>
                            <textarea
                                id="comment"
                                name="comment"
                                rows="4"
                                maxLength={300}
                                className={`appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:z-10 sm:text-sm shadow-inner transition-all duration-300 ${rating > 0 ? getRatingConfig(rating).ring + " " + getRatingConfig(rating).border : "focus:ring-red-500 focus:border-red-500"}`}
                                placeholder="Tell us what you liked or what we can improve..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <div className="flex justify-end mt-1">
                                <span className={`text-xs ${comment.length >= 90 ? "text-red-500 font-bold" : "text-gray-400"}`}>
                                    {comment.length}/300 characters
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    <div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={submitting}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-gradient-to-r ${rating > 0 ? getRatingConfig(rating).gradient : 'from-gray-400 to-gray-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-500 shadow-lg`}
                        >
                            {submitting ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : "Submit Rating"}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div >
    );
};

export default RateEvent;
