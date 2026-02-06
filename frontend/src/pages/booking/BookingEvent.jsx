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

  // Multi-participant state
  const [seats, setSeats] = useState(1);
  const [participants, setParticipants] = useState([
    { name: "", email: "", phone: "" },
  ]);

  /* ================= FETCH EVENT ================= */
  // DEBUGGING logs
  console.log("Render: seats", seats, "participants", participants);

  const updateSeats = (val) => {
    console.log("updateSeats called with:", val);
    if (val < 1) return;

    const maxSeats = event ? parseInt(event.availability || "0", 10) : 0;
    console.log("Max seats available:", maxSeats);

    if (val > maxSeats) {
      console.warn("Cannot increase seats. Limit reached.");
      return;
    }

    setSeats(val);

    // Resize participants array
    setParticipants((prev) => {
      console.log("Updating participants. Prev length:", prev.length, "Target:", val);
      const newArr = [...prev];
      if (val > prev.length) {
        // Add needed slots
        for (let i = prev.length; i < val; i++) {
          newArr.push({ name: "", email: "", phone: "" });
        }
      } else {
        // Trim excess
        newArr.length = val;
      }
      console.log("New participants arr:", newArr);
      return newArr;
    });
  };

  const updateParticipant = (index, field, value) => {
    setParticipants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  /* ================= FETCH EVENT ================= */
  useEffect(() => {
    fetch(`${API}/api/events`)
      .then((res) => res.json())
      .then((data) => {

        // Try to match by ID or Slug or text-id-like match
        const ev = data.find((e) => e._id === eventId || e.slug === eventId || e.title === eventId);
        console.log("Found event:", ev);
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
    // Validate all participants
    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      if (!p.name || !p.email) {
        return Swal.fire(
          "Missing info",
          `Name and Email are required for Participant ${i + 1}`,
          "warning"
        );
      }
    }

    try {
      // 1. Load Razorpay SDK
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        return Swal.fire("Error", "Razorpay SDK failed to load. Are you online?", "error");
      }

      // Primary contact is the first participant
      const primaryUser = participants[0];

      // 2. Initiate Booking (Create Order)
      const initiateRes = await fetch(`${API}/api/bookings/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          date: event.date,
          seats: seats,
          userName: primaryUser.name,
          userEmail: primaryUser.email,
          userPhone: primaryUser.phone,
          participants: participants,
        }),
      });

      const data = await initiateRes.json();

      if (!initiateRes.ok) {
        throw new Error(data.message || "Failed to initiate booking");
      }

      // 3. Handle Free Event
      if (data.amount === 0) {
        Swal.fire("Success", "Your free booking has been confirmed!", "success");
        // Reset form
        setSeats(1);
        setParticipants([{ name: "", email: "", phone: "" }]);
        return;
      }

      // 4. Handle Paid Event (Razorpay Checkout)
      const options = {
        key: data.key,
        amount: data.amount * 100,
        currency: data.currency,
        name: "Sita Foundation",
        description: `Booking for ${event.title} (${seats} seats)`,
        image: "/sita-logo.webp",
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
              setSeats(1);
              setParticipants([{ name: "", email: "", phone: "" }]);
            } else {
              Swal.fire("Error", "Payment verification failed. Please contact support.", "error");
            }
          } catch (error) {
            console.error("Verification error:", error);
            Swal.fire("Error", "Payment verification error", "error");
          }
        },
        prefill: {
          name: primaryUser.name,
          email: primaryUser.email,
          contact: primaryUser.phone,
        },
        notes: {
          address: "Sita Foundation Event",
        },
        theme: {
          color: "#c86836",
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
          Booking Details
        </h3>

        {/* Seat Selection */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <span className="text-gray-700 font-medium">Number of Seats:</span>
          <div className="flex items-center border rounded bg-white overflow-hidden">
            <button
              onClick={() => updateSeats(seats - 1)}
              disabled={seats <= 1}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-xl font-bold transition"
            >
              -
            </button>
            <span className="px-6 py-2 font-semibold text-lg min-w-[3rem] text-center">{seats}</span>
            <button
              onClick={() => updateSeats(seats + 1)}
              disabled={event && seats >= parseInt(event.availability || "0", 10)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-xl font-bold transition"
            >
              +
            </button>
          </div>
          <span className="text-sm text-gray-500">
            ({(event.fees && event.fees !== "Free") ? `Est. Total: ₹${(parseInt(event.fees) || 0) * seats}` : "Free Event"})
            <br />
            <span className="text-xs text-orange-500">
              Max slots: {event.availability} | Current: {seats}
            </span>
          </span>
        </div>

        <div className="space-y-6">
          {participants.map((participant, index) => (
            <div key={index} className="border rounded-lg p-4 relative mb-4">
              <h4 className="text-sm font-bold text-indigo-600 mb-3 uppercase tracking-wide">
                Participant {index + 1} {index === 0 && "(Primary Contact)"}
              </h4>
              <div className="space-y-3">
                <input
                  placeholder="Full Name *"
                  className="border p-3 w-full rounded focus:ring-2 focus:ring-indigo-200 outline-none"
                  value={participant.name}
                  onChange={(e) => updateParticipant(index, "name", e.target.value)}
                />

                <input
                  placeholder="Email *"
                  className="border p-3 w-full rounded focus:ring-2 focus:ring-indigo-200 outline-none"
                  value={participant.email}
                  onChange={(e) => updateParticipant(index, "email", e.target.value)}
                />

                <input
                  placeholder="Phone (optional)"
                  className="border p-3 w-full rounded focus:ring-2 focus:ring-indigo-200 outline-none"
                  value={participant.phone}
                  onChange={(e) => updateParticipant(index, "phone", e.target.value)}
                />
              </div>
            </div>
          ))}

          <button
            onClick={bookSession}
            className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition shadow-lg mt-4"
          >
            Confirm Booking ({seats} seat{seats > 1 ? "s" : ""})
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingEvent;
