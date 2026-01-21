import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { clearCart, clearGiftDetails } from '../../redux/features/cart/cartSlice';
import { useCreateOrderMutation } from '../../redux/features/orders/ordersApi';
import getBaseURL from '../../utils/baseURL';

const CashfreePayment = ({ amount, orderData, checkoutData }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createOrder] = useCreateOrderMutation();

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      Swal.fire({
        title: 'Invalid Amount',
        text: 'Please check your cart and try again.',
        icon: 'error',
        confirmButtonColor: '#C76F3B',
      });
      return;
    }

    if (!checkoutData || !checkoutData.name || !checkoutData.email || !checkoutData.phone) {
      Swal.fire({
        title: 'Missing Details',
        text: 'Please fill in all required customer details.',
        icon: 'warning',
        confirmButtonColor: '#C76F3B',
      });
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${getBaseURL()}/api/payment/create-order`,
        {
          amount: amount,
          receipt: `order_${Date.now()}`,
          notes: {
            name: checkoutData.name,
            email: checkoutData.email,
            phone: checkoutData.phone,
            userId: checkoutData.userId || 'guest',
            book: checkoutData.book || 'Book Purchase',
          },
        }
      );

      if (!data.success) {
        throw new Error(data.message || 'Failed to create payment order');
      }

      if (!window.Cashfree) {
        throw new Error('Payment gateway is not loaded. Please refresh the page.');
      }

      const cashfree = window.Cashfree({
        mode: 'sandbox',
      });

      const checkoutOptions = {
        paymentSessionId: data.paymentSessionId,
        redirectTarget: '_modal',
      };
      const result = await cashfree.checkout(checkoutOptions);

      if (result.error) {
        console.error('❌ Payment error:', result.error);
        throw new Error(result.error.message || 'Payment failed');
      }

      if (result.paymentDetails || result.order) {

        const verifyResponse = await axios.post(
          `${getBaseURL()}/api/payment/verify-payment`,
          { orderId: data.orderId }
        );

        if (!verifyResponse.data.success) {
          throw new Error('Payment verification failed');
        }

        const orderResult = await createOrder(orderData).unwrap();

        dispatch(clearCart());
        dispatch(clearGiftDetails());

        sessionStorage.removeItem('checkoutFormData');
        sessionStorage.removeItem('cartItems');
        sessionStorage.removeItem('finalAmount');
        sessionStorage.removeItem('isGift');
        sessionStorage.removeItem('giftToName');
        sessionStorage.removeItem('giftFromName');
        sessionStorage.removeItem('giftMessage');
        sessionStorage.removeItem('sameAsDeliveryAddress');

        Swal.fire({
          title: 'Payment Successful!',
          text: 'Your order has been placed successfully.',
          icon: 'success',
          confirmButtonColor: '#C76F3B',
        }).then(() => {
          navigate('/orders');
        });

      } else {
        throw new Error('Payment was not completed');
      }

    } catch (error) {
      console.error('❌ Payment process error:', error);
      Swal.fire({
        title: 'Payment Failed',
        text: error.response?.data?.message || error.message || 'Unable to process payment. Please try again.',
        icon: 'error',
        confirmButtonColor: '#C76F3B',
      });

      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading || !amount}
      style={{
        padding: '12px 30px',
        fontSize: '16px',
        fontWeight: '600',
        color: 'white',
        backgroundColor: loading || !amount ? '#ccc' : '#C76F3B',
        border: 'none',
        borderRadius: '8px',
        cursor: loading || !amount ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.3s ease',
      }}
      onMouseEnter={(e) => {
        if (!loading && amount) e.target.style.backgroundColor = '#B05E2A';
      }}
      onMouseLeave={(e) => {
        if (!loading && amount) e.target.style.backgroundColor = '#C76F3B';
      }}
    >
      {loading ? '⏳ Processing Payment...' : `💳 Pay ₹${amount || '0'}`}
    </button>
  );
};

export default CashfreePayment;
