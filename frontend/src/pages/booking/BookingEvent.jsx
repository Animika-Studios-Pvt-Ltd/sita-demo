import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const format12Hour = (time) => {
  if (!time) return "";
  const [h, m] = time.split(":");
  const d = new Date();
  d.setHours(h, m);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const BookingEvent = () => {
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  /* ================= FETCH EVENT ================= */
  useEffect(() => {
    fetch(`${API}/api/events`)
      .then((res) => res.json())
      .then((data) => {
        const ev = data.find((e) => e._id === eventId);
        setEvent(ev);
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  /* ================= BOOK ================= */
  const bookSession = async () => {
    if (!user.name || !user.email) {
      return Swal.fire(
        "Missing info",
        "Name and Email are required",
        "warning"
      );
    }

    try {
      // 1. Load Razorpay SDK
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        return Swal.fire("Error", "Razorpay SDK failed to load. Are you online?", "error");
      }

      // 2. Initiate Booking (Create Order)
      const initiateRes = await fetch(`${API}/api/bookings/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          date: event.date, // Sending date for validation if needed
          seats: 1, // Defaulting to 1 seat for now
          userName: user.name,
          userEmail: user.email,
          userPhone: user.phone,
        }),
      });

      const data = await initiateRes.json();

      if (!initiateRes.ok) {
        throw new Error(data.message || "Failed to initiate booking");
      }

      // 3. Handle Free Event
      if (data.amount === 0) {
        Swal.fire("Success", "Your free booking has been confirmed!", "success");
        setUser({ name: "", email: "", phone: "" });
        return;
      }

      // 4. Handle Paid Event (Razorpay Checkout)
      const options = {
        key: data.key, // Enter the Key ID generated from the Dashboard
        amount: data.amount * 100, // Amount is in currency subunits. Default currency is INR.
        currency: data.currency,
        name: "Sita Foundation",
        description: `Booking for ${event.title}`,
        image: "/sita-logo.webp", // Ensure you have a logo at this path or use a remote URL
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            // 5. Verify Payment
            const verifyRes = await fetch(`${API}/api/bookings/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: data.bookingId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              Swal.fire("Success", "Payment successful! Booking confirmed.", "success");
              setUser({ name: "", email: "", phone: "" });
            } else {
              Swal.fire("Error", "Payment verification failed. Please contact support.", "error");
            }
          } catch (error) {
            console.error("Verification error:", error);
            Swal.fire("Error", "Payment verification error", "error");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        notes: {
          address: "Sita Foundation Event",
        },
        theme: {
          color: "#c86836", // Sita Bronze
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error("Booking error:", err);
      Swal.fire("Error", err.message || "Booking failed", "error");
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading event...
      </p>
    );
  }

  if (!event) {
    return (
      <p className="text-center mt-10 text-red-600">
        Event not found
      </p>
    );
  }

  if (Number(event.availability) === 0) {
    return (
      <p className="text-center text-red-600 text-xl mt-10">
        Booking Closed
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* EVENT INFO */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          {event.title}
        </h2>

        <p className="text-gray-600 mb-1">
          📍 {event.location || "Online"}
        </p>

        <p className="text-gray-600 mb-1">
          🗓 {event.date}
        </p>

        <p className="text-gray-600 mb-1">
          ⏰ {format12Hour(event.startTime)} –{" "}
          {format12Hour(event.endTime)}
        </p>

        <p className="text-gray-600 mb-1">
          🎟 Mode: {event.mode}
        </p>

        <p className="text-gray-600 mb-1">
          💰 Fees: {event.fees || "-"}
        </p>

        <p className="text-gray-600">
          👥 Available Slots:{" "}
          <span className="font-semibold">
            {event.availability}
          </span>
        </p>
      </div>

      {/* USER FORM */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">
          Your Details
        </h3>

        <div className="space-y-4">
          <input
            placeholder="Full Name"
            className="border p-3 w-full rounded"
            value={user.name}
            onChange={(e) =>
              setUser({ ...user, name: e.target.value })
            }
          />

          <input
            placeholder="Email"
            className="border p-3 w-full rounded"
            value={user.email}
            onChange={(e) =>
              setUser({ ...user, email: e.target.value })
            }
          />

          <input
            placeholder="Phone (optional)"
            className="border p-3 w-full rounded"
            value={user.phone}
            onChange={(e) =>
              setUser({ ...user, phone: e.target.value })
            }
          />

          <button
            onClick={bookSession}
            className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingEvent;
