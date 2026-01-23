import React, { useEffect } from 'react';

const RazorpayPayment = ({
  amount,
  currency = "INR",
  orderId,
  name = "Sita",
  description,
  image = "https://res.cloudinary.com/duq4lad3e/image/upload/v1758535613/banner/nghvs5xkhliotx6ljd2h.webp",
  onVerify,
  onClose
}) => {

  useEffect(() => {
    // Load Razorpay SDK
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please check your internet connection.");
      return;
    }

    const options = {
      key: "rzp_test_YourKeyHere", // Replace with your actual key or env variable if possible in frontend build
      amount: amount * 100, // Amount is in paise, but if passed as orderId amount, this is ignored usually
      currency: currency,
      name: name,
      description: description,
      image: image,
      order_id: orderId, // This is the Order ID created from Backend
      handler: function (response) {
        // Send response to parent to verify
        if (onVerify) {
          onVerify(response);
        }
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#4f46e5",
      },
      modal: {
        ondismiss: function () {
          if (onClose) onClose();
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold shadow-md transition-transform transform hover:-translate-y-0.5"
    >
      Pay ₹{amount}
    </button>
  );
};

export default RazorpayPayment;
