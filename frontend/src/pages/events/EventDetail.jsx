import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import RazorpayPayment from "../../components/RazorpayPayment";
import Swal from "sweetalert2";
import CmsPage from "../Add pages/pages/CmsPage";

const API = "http://localhost:5000/api";

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    // Booking Form State
    const [bookingForm, setBookingForm] = useState({
        userName: "",
        userEmail: "",
        userPhone: "",
        seats: 1,
    });

    const [bookingStep, setBookingStep] = useState("details"); // details | payment | success
    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`${API}/events`);
                // Since getEvents returns all, we find the one we need. 
                // Ideally backend should have getEventById
                const found = res.data.find(e =>
                    e._id === id ||
                    e.bookingUrl?.toLowerCase() === id?.toLowerCase() ||
                    e.slug?.toLowerCase() === id?.toLowerCase() ||
                    e.code === id
                );
                setEvent(found);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching event:", err);
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleInitiateBooking = async (e) => {
        e.preventDefault();

        if (event.availability < bookingForm.seats) {
            Swal.fire("Sold Out", "Not enough seats available", "error");
            return;
        }

        try {
            const res = await axios.post(`${API}/bookings/initiate`, {
                eventId: event._id,
                ...bookingForm,
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

    const handleVerifyPayment = async (response) => {
        try {
            const res = await axios.post(`${API}/bookings/verify`, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: orderData.bookingId,
            });

            if (res.data.success) {
                Swal.fire("Success", "Booking Confirmed!", "success").then(() => {
                    navigate("/events"); // Redirect to list or a 'my bookings' page
                });
            } else {
                Swal.fire("Failed", "Payment verification failed", "error");
            }
        } catch (err) {
            Swal.fire("Error", "Server error during verification", "error");
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    // Fallback to CMS Page if no standard event found
    if (!event) {
        return <CmsPage slug={id} />;
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="h-64 bg-indigo-600 flex items-center justify-center text-white">
                    <h1 className="text-4xl font-bold px-4 text-center">{event.title}</h1>
                </div>

                <div className="p-8">
                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-1">Date & Time</h3>
                            <p className="text-lg font-medium text-gray-900">
                                {new Date(event.date).toLocaleDateString()} <br />
                                {event.startTime} - {event.endTime}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-1">Location</h3>
                            <p className="text-lg font-medium text-gray-900">
                                {event.location || "Online"}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-1">Price</h3>
                            <p className="text-2xl font-bold text-indigo-600">
                                {event.price > 0 ? `₹${event.price}` : "Free"}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-1">Availability</h3>
                            <p className={`text-lg font-medium ${event.availability < 5 ? 'text-red-600' : 'text-green-600'}`}>
                                {event.availability} Seats Left
                            </p>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-2">Description</h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {event.description}
                        </p>
                    </div>

                    {/* Booking Section */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Ticket</h2>

                        {bookingStep === 'details' && (
                            <form onSubmit={handleInitiateBooking} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        required
                                        className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
                                        value={bookingForm.userName}
                                        onChange={e => setBookingForm({ ...bookingForm, userName: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
                                        value={bookingForm.userEmail}
                                        onChange={e => setBookingForm({ ...bookingForm, userEmail: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        required
                                        className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
                                        value={bookingForm.userPhone}
                                        onChange={e => setBookingForm({ ...bookingForm, userPhone: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Seats</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={event.availability}
                                        required
                                        className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
                                        value={bookingForm.seats}
                                        onChange={e => setBookingForm({ ...bookingForm, seats: Number(e.target.value) })}
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2 mt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition"
                                    >
                                        Proceed to Payment (₹{event.price * bookingForm.seats})
                                    </button>
                                </div>
                            </form>
                        )}

                        {bookingStep === 'payment' && orderData && (
                            <div className="text-center py-6">
                                <p className="mb-6 text-gray-600">
                                    Please complete your payment of
                                    <span className="font-bold text-gray-900 mx-1">₹{orderData.amount}</span>
                                    to confirm your booking.
                                </p>
                                <RazorpayPayment
                                    amount={orderData.amount}
                                    orderId={orderData.razorpayOrderId}
                                    name="Event Booking"
                                    description={`Booking for ${event.title}`}
                                    onVerify={handleVerifyPayment}
                                    onClose={() => setBookingStep('details')}
                                />
                                <button
                                    onClick={() => setBookingStep('details')}
                                    className="block mx-auto mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
                                >
                                    Cancel Payment
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
