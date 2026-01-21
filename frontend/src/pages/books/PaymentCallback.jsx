import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import { clearCart, clearGiftDetails } from '../../redux/features/cart/cartSlice';
import { useCreateOrderMutation } from '../../redux/features/orders/ordersApi';
import getBaseURL from '../../utils/baseURL';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createOrder] = useCreateOrderMutation();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const orderId = searchParams.get('order_id');

        if (!orderId) {
          throw new Error('Order ID not found');
        }

        const { data } = await axios.post(
          `${getBaseURL()}/api/payment/verify-payment`,
          { orderId }
        );

        if (data.success) {

          const formData = JSON.parse(sessionStorage.getItem('checkoutFormData'));
          const cartItems = JSON.parse(sessionStorage.getItem('cartItems'));
          const finalAmount = sessionStorage.getItem('finalAmount');
          const isGift = sessionStorage.getItem('isGift') === 'true';
          const giftToName = sessionStorage.getItem('giftToName');
          const giftFromName = sessionStorage.getItem('giftFromName');
          const giftMessage = sessionStorage.getItem('giftMessage');
          const sameAsDeliveryAddress = sessionStorage.getItem('sameAsDeliveryAddress') === 'true';
          const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

          const formatPhoneNumber = (phone) => {
            if (!phone) return phone;
            let cleaned = phone.replace(/\D/g, '');
            if (cleaned.startsWith('91') && cleaned.length === 12) return '+' + cleaned;
            if (cleaned.length === 10) return '+91' + cleaned;
            if (phone.startsWith('+')) return phone;
            return '+' + cleaned;
          };

          const giftDetails = isGift ? {
            to: giftToName,
            from: giftFromName,
            message: giftMessage,
            deliveryAddress: sameAsDeliveryAddress ? null : {
              street: formData.gift_street,
              city: formData.gift_city,
              state: formData.gift_state,
              zipcode: formData.gift_zipcode,
              country: formData.gift_country,
            }
          } : null;

          const orderData = {
            name: formData.name,
            email: formData.email,
            address: {
              street: formData.street,
              city: formData.city,
              state: formData.state,
              zipcode: formData.zipcode,
              country: formData.country,
            },
            phone: formatPhoneNumber(formData.phone),
            productIds: cartItems.map(item => item._id),
            quantities: cartItems.reduce((acc, item) => {
              acc[item._id] = item.qty;
              return acc;
            }, {}),
            totalPrice: parseFloat(finalAmount),
            userId: currentUser?.sub,
            paymentId: data.paymentId,
            paymentRecordId: data.paymentRecordId,
            giftDetails: giftDetails,
          };

          const result = await createOrder(orderData).unwrap();

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
          sessionStorage.removeItem('currentUser');

          Swal.fire({
            title: 'Payment Successful!',
            text: 'Your order has been placed successfully.',
            icon: 'success',
            confirmButtonColor: '#C76F3B',
          }).then(() => {
            navigate('/orders');
          });

        } else {
          throw new Error('Payment verification failed');
        }
      } catch (error) {
        console.error('❌ Payment verification error:', error);

        Swal.fire({
          title: 'Payment Failed',
          text: error.message || 'Unable to verify payment. Please contact support.',
          icon: 'error',
          confirmButtonColor: '#C76F3B',
        }).then(() => {
          navigate('/checkout');
        });
      } finally {
        setProcessing(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, dispatch, createOrder]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {processing ? (
          <>
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-[#C76F3B] mb-4"></div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Processing Payment...
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your payment
            </p>
          </>
        ) : (
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-[#C76F3B]"></div>
        )}
      </div>
    </div>
  );
};
export default PaymentCallback;
