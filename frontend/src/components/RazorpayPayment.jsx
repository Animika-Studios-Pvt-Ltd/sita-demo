import React, { useState } from 'react';
import axios from 'axios';

const RazorpayPayment = ({ amount, bookDetails, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const { data } = await axios.post(
        'https://bookstore-backend-hshq.onrender.com/api/payment/create-order',
        {
          amount: amount,
          receipt: `book_${Date.now()}`,
          notes: {
            book: bookDetails?.title || 'Book Purchase',
          },
        }
      );

      if (!data.success) {
        alert('Failed to create order');
        setLoading(false);
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'Sita',
        description: bookDetails?.title || 'Book Purchase',
        image: 'https://res.cloudinary.com/duq4lad3e/image/upload/v1758535613/banner/nghvs5xkhliotx6ljd2h.webp',
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              'https://bookstore-backend-hshq.onrender.com/api/payment/verify-payment',
              {
                orderId: data.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }
            );

            if (verifyRes.data.success) {
              alert('Payment Successful!');
              if (onSuccess) {
                onSuccess(response.razorpay_payment_id);
              }
            } else {
              alert('Payment verification failed');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#1a202c',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);
    } catch (error) {
      console.error('Payment Error:', error);
      alert('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Processing...' : `Pay ₹${amount}`}
    </button>
  );
};

export default RazorpayPayment;
