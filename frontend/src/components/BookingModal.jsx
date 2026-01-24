import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import RazorpayPayment from "./RazorpayPayment";
import CloseIcon from "@mui/icons-material/Close";

const API = "http://localhost:5000/api";

const BookingModal = ({ isOpen, onClose, eventId }) => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bookingStep, setBookingStep] = useState("details"); // details | payment
    const [orderData, setOrderData] = useState(null);

    const [form, setForm] = useState({
        userName: "",
        userEmail: "",
        userPhone: "",
        seats: 1,
    });

    useEffect(() => {
        if (isOpen && eventId) {
            fetchEvent();
        }
    }, [isOpen, eventId]);

    const fetchEvent = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/events`);
            const found = res.data.find((e) => e._id === eventId);
            setEvent(found);
        } catch (err) {
            console.error("Error fetching event:", err);
            Swal.fire("Error", "Failed to load event details", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleInitiate = async (e) => {
        e.preventDefault();
        if (!event) return;

        if (event.availability < form.seats) {
            return Swal.fire("Sold Out", "Not enough seats available", "error");
        }

        try {
            const res = await axios.post(`${API}/bookings/initiate`, {
                eventId: event._id,
                ...form,
            });

            if (res.data.success) {
                setOrderData(res.data);
                setBookingStep("payment");
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to initiate booking", "error");
        }
    };

    const handleVerify = async (response) => {
        try {
            const res = await axios.post(`${API}/bookings/verify`, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: orderData.bookingId,
            });

            if (res.data.success) {
                Swal.fire("Success", "Booking Confirmed!", "success").then(() => {
                    onClose();
                    setBookingStep("details");
                    setForm({ userName: "", userEmail: "", userPhone: "", seats: 1 });
                });
            } else {
                Swal.fire("Failed", "Payment verification failed", "error");
            }
        } catch (err) {
            Swal.fire("Error", "Server error during verification", "error");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in fade-in zoom-in duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 transition bg-gray-100 rounded-full"
                >
                    <CloseIcon fontSize="small" />
                </button>

                {loading ? (
                    <div className="p-10 text-center text-gray-500">Loading Event...</div>
                ) : !event ? (
                    <div className="p-10 text-center text-red-500">Event Not Found</div>
                ) : (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-indigo-700 mb-1">{event.title}</h2>
                        <p className="text-gray-500 text-sm mb-6">
                            {new Date(event.date).toLocaleDateString()} • {event.startTime}
                        </p>

                        {bookingStep === "details" ? (
                            <form onSubmit={handleInitiate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        required
                                        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                                        value={form.userName}
                                        onChange={(e) => setForm({ ...form, userName: e.target.value })}
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            required
                                            type="email"
                                            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                                            value={form.userEmail}
                                            onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone
                                        </label>
                                        <input
                                            required
                                            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                                            value={form.userPhone}
                                            onChange={(e) => setForm({ ...form, userPhone: e.target.value })}
                                            placeholder="+91..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Number of Seats
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={event.availability}
                                        required
                                        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                                        value={form.seats}
                                        onChange={(e) =>
                                            setForm({ ...form, seats: Number(e.target.value) })
                                        }
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {event.availability} seats remaining
                                    </p>
                                </div>

                                <div className="bg-indigo-50 p-4 rounded-lg flex justify-between items-center mt-4">
                                    <span className="text-indigo-900 font-medium">Total Amount</span>
                                    <span className="text-2xl font-bold text-indigo-700">
                                        ₹{event.price * form.seats}
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-indigo-200"
                                >
                                    Proceed to Pay
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-6">
                                <div className="mb-6">
                                    <p className="text-gray-600 mb-2">Total Amount</p>
                                    <p className="text-4xl font-extrabold text-indigo-900">₹{orderData?.amount}</p>
                                </div>

                                <p className="mb-8 text-gray-600 text-sm px-6">
                                    Complete your payment securely with Razorpay to confirm your booking for <b>{event.title}</b>.
                                </p>

                                <div className="flex justify-center">
                                    <RazorpayPayment
                                        amount={orderData?.amount}
                                        orderId={orderData?.razorpayOrderId}
                                        name="Event Booking"
                                        description={`Booking for ${event.title}`}
                                        onVerify={handleVerify}
                                        onClose={() => setBookingStep("details")}
                                        rzpKey={orderData?.key}
                                    />
                                </div>

                                <button
                                    onClick={() => setBookingStep("details")}
                                    className="text-sm text-gray-400 hover:text-gray-600 mt-6 underline"
                                >
                                    Go Back
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingModal;
