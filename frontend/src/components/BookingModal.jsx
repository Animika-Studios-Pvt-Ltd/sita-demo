import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import RazorpayPayment from "./RazorpayPayment";
import CloseIcon from "@mui/icons-material/Close";

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

const BookingModal = ({ isOpen, onClose, eventId }) => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bookingStep, setBookingStep] = useState("details"); // details | payment | success
    const [orderData, setOrderData] = useState(null);

    const [form, setForm] = useState({
        userName: "",
        userEmail: "",
        userPhone: "",
        seats: 1,
        participants: [{ name: "", email: "", phone: "" }]
    });

    const updateSeats = (val) => {
        if (val < 1) return;
        setForm((prev) => {
            const newParticipants = [...prev.participants];
            if (val > newParticipants.length) {
                for (let i = newParticipants.length; i < val; i++) {
                    newParticipants.push({ name: "", email: "", phone: "" });
                }
            } else {
                newParticipants.length = val;
            }
            return { ...prev, seats: val, participants: newParticipants };
        });
    };

    const updateParticipant = (index, field, value) => {
        setForm((prev) => {
            const newParticipants = [...prev.participants];
            newParticipants[index] = { ...newParticipants[index], [field]: value };

            // Sync primary contact (first participant) with top-level fields
            if (index === 0) {
                return {
                    ...prev,
                    participants: newParticipants,
                    userName: field === 'name' ? value : prev.userName,
                    userEmail: field === 'email' ? value : prev.userEmail,
                    userPhone: field === 'phone' ? value : prev.userPhone,
                };
            }

            return { ...prev, participants: newParticipants };
        });
    };

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

        // Validate participants
        for (let i = 0; i < form.participants.length; i++) {
            const p = form.participants[i];
            if (!p.name || !p.email || !p.phone) {
                return Swal.fire("Missing Details", `Please fill Name, Email and Phone for Participant ${i + 1}`, "warning");
            }
        }

        try {
            const res = await axios.post(`${API}/bookings/initiate`, {
                eventId: event._id,
                seats: form.seats,
                userName: form.participants[0].name,
                userEmail: form.participants[0].email,
                userPhone: form.participants[0].phone,
                participants: form.participants,
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
                setBookingStep("success");
                setForm({ userName: "", userEmail: "", userPhone: "", seats: 1, participants: [{ name: "", email: "", phone: "" }] });
            } else {
                Swal.fire("Failed", "Payment verification failed", "error");
            }
        } catch (err) {
            Swal.fire("Error", "Server error during verification", "error");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg md:max-w-xl max-h-[90vh] flex flex-col relative animate-in fade-in zoom-in duration-200 overflow-hidden">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 transition bg-gray-100 rounded-full z-20"
                >
                    <CloseIcon fontSize="small" />
                </button>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center p-12">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : !event ? (
                    <div className="p-10 text-center text-red-500">Event Not Found</div>
                ) : (
                    <>
                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative">

                            <h2 className="text-2xl font-bold text-indigo-700 mb-1 leading-tight pr-6">{event.title}</h2>
                            <p className="text-gray-500 text-sm mb-6 font-medium">
                                {new Date(event.date).toLocaleDateString()} • {event.startTime}
                            </p>

                            {bookingStep === "details" ? (
                                <form id="booking-form" onSubmit={handleInitiate} className="space-y-6">

                                    {/* Seat Selection */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-bold text-gray-700">
                                            How many seats?
                                        </label>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-600">Total Participants</span>
                                                <span className="text-xs text-gray-400">{event.availability} seats remaining</span>
                                            </div>
                                            <div className="flex items-center gap-3 bg-white shadow-sm rounded-lg p-1 border">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newSeats = Math.max(1, form.seats - 1);
                                                        updateSeats(newSeats);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 font-bold text-gray-600 transition"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center font-bold text-lg">{form.seats}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const max = parseInt(event.availability || "0", 10);
                                                        if (form.seats < max) {
                                                            updateSeats(form.seats + 1);
                                                        }
                                                    }}
                                                    disabled={form.seats >= parseInt(event.availability || "0", 10)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 font-bold text-indigo-600 transition disabled:opacity-50"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Participants List */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-sm font-bold text-gray-700">Guest Details</label>
                                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                                {form.participants.length} Person{form.participants.length > 1 ? 's' : ''}
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            {form.participants.map((participant, index) => (
                                                <div key={index} className="group border border-gray-200 rounded-xl p-4 bg-white hover:border-indigo-300 hover:shadow-sm transition-all relative">

                                                    {/* Badge */}
                                                    <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-gray-800 text-white text-[10px] uppercase font-bold tracking-wider rounded">
                                                        {index === 0 ? "Primary Contact" : `Guest ${index + 1}`}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                                                        <div className="md:col-span-2">
                                                            <input
                                                                placeholder="Full Name *"
                                                                required
                                                                className="w-full border-b border-gray-200 focus:border-indigo-500 py-2 bg-transparent outline-none text-sm transition-colors text-gray-800 placeholder:text-gray-400"
                                                                value={participant.name}
                                                                onChange={(e) => updateParticipant(index, "name", e.target.value)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <input
                                                                placeholder="Email *"
                                                                type="email"
                                                                required
                                                                className="w-full border-b border-gray-200 focus:border-indigo-500 py-2 bg-transparent outline-none text-sm transition-colors text-gray-800 placeholder:text-gray-400"
                                                                value={participant.email}
                                                                onChange={(e) => updateParticipant(index, "email", e.target.value)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <input
                                                                placeholder="Phone *"
                                                                required
                                                                className="w-full border-b border-gray-200 focus:border-indigo-500 py-2 bg-transparent outline-none text-sm transition-colors text-gray-800 placeholder:text-gray-400"
                                                                value={participant.phone}
                                                                onChange={(e) => updateParticipant(index, "phone", e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </form>
                            ) : bookingStep === "payment" ? (
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
                            ) : (
                                <div className="text-center py-10 animate-in fade-in zoom-in duration-300">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Booking Confirmed!</h3>
                                    <p className="text-gray-600 max-w-xs mx-auto mb-8">
                                        Thank you for booking. Your payment was successful and a confirmation email has been sent to all participants.
                                    </p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold transition shadow-lg"
                                    >
                                        OK
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer - Only show in Details step */}
                        {bookingStep === "details" && (
                            <div className="p-5 border-t bg-gray-50/50 backdrop-blur sticky bottom-0 z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-600">Total Amount</span>
                                    <span className="text-xl font-black text-indigo-700">
                                        ₹{event.price * form.seats}
                                    </span>
                                </div>
                                <button
                                    form="booking-form"
                                    type="submit"
                                    className="w-full bg-[#8b171b] hover:bg-[#721215] text-white font-bold py-3.5 rounded-xl transition shadow-lg hover:shadow-xl active:scale-[0.98]"
                                >
                                    Proceed to Pay
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingModal;
