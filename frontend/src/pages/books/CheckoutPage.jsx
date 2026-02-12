import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Lottie from "lottie-react";
import getBaseUrl from "../../utils/baseURL";
import { useCreateOrderMutation } from "../../redux/features/orders/ordersApi";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import {
  updateCartProductDetails,
  clearCart,
  clearGiftDetails,
} from "../../redux/features/cart/cartSlice";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
import { useAuth } from "../../context/AuthContext";
import {
  FaMapMarkerAlt,
  FaUser,
  FaPlus,
  FaGift,
  FaShoppingCart,
  FaCheck,
} from "react-icons/fa";
import { MdPhone } from "react-icons/md";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const giftDetails = useSelector((state) => state.cart.giftDetails);
  const [isGift, setIsGift] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationData, setAnimationData] = useState(null);
  const { data: allBooks } = useFetchAllBooksQuery();
  const [createOrder] = useCreateOrderMutation();
  const { currentUser, isAuthenticated } = useAuth();

  const [userProfile, setUserProfile] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useManualAddress, setUseManualAddress] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [cashfree, setCashfree] = useState(null);

  const [giftToName, setGiftToName] = useState("");
  const [giftFromName, setGiftFromName] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [sameAsDeliveryAddress, setSameAsDeliveryAddress] = useState(true);
  const [selectedGiftAddressId, setSelectedGiftAddressId] = useState(null);
  const [useManualGiftAddress, setUseManualGiftAddress] = useState(false);

  const [shippingCharge, setShippingCharge] = useState(0);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [giftWrapCharge, setGiftWrapCharge] = useState(0);

  const [pincode, setPincode] = useState("");
  const [giftPincode, setGiftPincode] = useState("");
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [loadingGiftPincode, setLoadingGiftPincode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    getValues,
    watch,
  } = useForm({
    mode: "onChange",
  });

  // CALCULATE TOTALS FIRST (BEFORE FUNCTIONS)
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.newPrice * item.qty,
    0,
  );
  const originalTotal = cartItems.reduce(
    (acc, item) => acc + (item.oldPrice || item.newPrice) * item.qty,
    0,
  );
  const discount = originalTotal - subtotal;
  const giftCharge = isGift ? giftWrapCharge || 0 : 0;
  const finalAmount = (subtotal || 0) + (shippingCharge || 0) + giftCharge;

  const renderLoadingOverlay = () => (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md">
      {animationData && (
        <Lottie
          animationData={animationData}
          loop
          className="w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 mb-6"
        />
      )}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-playfair text-[#C76F3B] mb-2 animate-pulse">
        Processing Payment
      </h2>
      <p className="text-xs sm:text-sm md:text-base text-gray-600 text-center px-4">
        Please wait while we confirm your order...
      </p>
    </div>
  );

  // DEFINE FUNCTIONS (AFTER SUBTOTAL)
  const calculateShipping = useCallback(
    async (pincode) => {
      if (!pincode || pincode.length !== 6) {
        setShippingCharge(0);
        setEstimatedDelivery("");
        setSelectedCourier(null);
        return;
      }

      if (!/^\d{6}$/.test(pincode)) {
        return;
      }

      setLoadingShipping(true);
      try {
        const totalWeightInGrams = cartItems.reduce((acc, item) => {
          let bookWeight = item.weight || item.packageWeight || 0;
          if (bookWeight < 50) {
            bookWeight = 250;
          }
          const qty = item.qty || item.quantity || 1;
          const itemTotalWeight = bookWeight * qty;
          return acc + itemTotalWeight;
        }, 0);
        const response = await axios.post(
          `${getBaseUrl()}/api/shipping/calculate-shipping`,
          {
            origin_pincode: "560008",
            destination_pincode: pincode,
            weight: totalWeightInGrams,
            declared_value: subtotal,
            length: 20,
            breadth: 15,
            height: 10,
          },
        );

        if (response.data.success) {
          setShippingCharge(response.data.shippingCharge);
          setEstimatedDelivery(response.data.estimatedDays);
          setSelectedCourier(response.data.recommendedCourier);
        } else {
          setShippingCharge(50);
          setEstimatedDelivery("7-10 days");
          setSelectedCourier(null);
        }
      } catch (error) {
        console.error("❌ Shipping calculation failed:", error);
        setShippingCharge(50);
        setEstimatedDelivery("7-10 days");
        setSelectedCourier(null);
      } finally {
        setLoadingShipping(false);
      }
    },
    [cartItems, subtotal],
  );

  const fetchPincodeData = useCallback(
    async (code, isGiftAddress = false) => {
      const prefix = isGiftAddress ? "gift_" : "";
      const setLoading = isGiftAddress
        ? setLoadingGiftPincode
        : setLoadingPincode;

      if (code.length === 6 && /^\d{6}$/.test(code)) {
        setLoading(true);
        try {
          const res = await axios.get(
            `https://api.postalpincode.in/pincode/${code}`,
          );
          if (res.data[0].Status === "Success") {
            const postOffice = res.data[0].PostOffice[0];
            setValue(`${prefix}city`, postOffice.District);
            setValue(`${prefix}state`, postOffice.State);
            setValue(`${prefix}country`, postOffice.Country);
            trigger();
          }
        } catch (err) {
          console.error("Failed to fetch pincode info", err);
        } finally {
          setLoading(false);
        }
      }
    },
    [setValue, trigger],
  );

  const populateAddressFields = (address, isGiftAddress = false) => {
    const prefix = isGiftAddress ? "gift_" : "";
    setValue(
      `${prefix}street`,
      address.addressLine1 +
      (address.addressLine2 ? `, ${address.addressLine2}` : ""),
    );
    setValue(`${prefix}city`, address.city);
    setValue(`${prefix}state`, address.state);
    setValue(`${prefix}zipcode`, address.postalCode);
    setValue(`${prefix}country`, address.country);
    trigger();

    if (!isGiftAddress && address.postalCode) {
      setPincode(address.postalCode);
    }
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    const selectedAddress = userProfile.addresses.find(
      (addr) => addr._id === addressId,
    );
    if (selectedAddress) {
      populateAddressFields(selectedAddress, false);
      setUseManualAddress(false);
    }
  };

  const handleGiftAddressSelect = (addressId) => {
    setSelectedGiftAddressId(addressId);
    const selectedAddress = userProfile.addresses.find(
      (addr) => addr._id === addressId,
    );
    if (selectedAddress) {
      populateAddressFields(selectedAddress, true);
      setUseManualGiftAddress(false);
      setSameAsDeliveryAddress(false);
    }
  };

  const handleSameAsDeliveryToggle = () => {
    const newValue = !sameAsDeliveryAddress;
    setSameAsDeliveryAddress(newValue);
    if (newValue) {
      const deliveryAddress = getValues();
      setValue("gift_street", deliveryAddress.street);
      setValue("gift_city", deliveryAddress.city);
      setValue("gift_state", deliveryAddress.state);
      setValue("gift_zipcode", deliveryAddress.zipcode);
      setValue("gift_country", deliveryAddress.country);
      setSelectedGiftAddressId(null);
      trigger();
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return phone;
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("91") && cleaned.length === 12) return "+" + cleaned;
    if (cleaned.length === 10) return "+91" + cleaned;
    if (phone.startsWith("+")) return phone;
    return "+" + cleaned;
  };

  const onSubmit = async (data) => {
    if (cartItems.length === 0 || finalAmount <= 0) {
      Swal.fire({
        title: "Cart is Empty",
        text: "Please add some products to your cart before placing an order.",
        icon: "warning",
        confirmButtonColor: "#C76F3B",
      });
      return;
    }

    if (!isChecked) {
      Swal.fire({
        title: "Terms Not Agreed",
        text: "You must agree to the Terms & Conditions before placing an order.",
        icon: "warning",
        confirmButtonColor: "#C76F3B",
      });
      return;
    }

    if (isGift) {
      if (!giftToName || !giftFromName) {
        Swal.fire({
          title: "Gift Details Missing",
          text: "Please fill in gift recipient and sender names.",
          icon: "warning",
          confirmButtonColor: "#C76F3B",
        });
        return;
      }

      if (
        !sameAsDeliveryAddress &&
        (!data.gift_street ||
          !data.gift_city ||
          !data.gift_state ||
          !data.gift_zipcode ||
          !data.gift_country)
      ) {
        Swal.fire({
          title: "Gift Address Incomplete",
          text: "Please provide complete gift delivery address.",
          icon: "warning",
          confirmButtonColor: "#C76F3B",
        });
        return;
      }
    }

    handlePayment(data);
  };

  // Check if Razorpay is loaded
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (formData) => {
    if (!formData) return;

    setLoading(true);

    try {
      const res = await loadRazorpay();
      if (!res) {
        Swal.fire(
          "Error",
          "Razorpay SDK failed to load. Are you online?",
          "error",
        );
        setLoading(false);
        return;
      }

      const formattedPhone = formatPhoneNumber(formData.phone);
      const { data } = await axios.post(
        `${getBaseUrl()}/api/payment/create-order`,
        {
          amount: finalAmount,
          receipt: `order${Date.now()}`,
          notes: {
            userId: currentUser?.sub || "guest",
            itemCount: cartItems.length,
          },
          name: formData.name,
          email: formData.email,
          phone: formattedPhone,
        },
      );

      if (!data.success) {
        throw new Error("Failed to create payment order");
      }

      const options = {
        key: data.key,
        amount: data.amount * 100, // in paise
        currency: data.currency,
        name: "Sita Store",
        description: "Book Purchase",
        image: "/sita-logo.webp", // Ensure you have a logo path
        order_id: data.orderId,
        handler: async function (response) {
          try {
            setLoading(true);

            await processPaymentSuccess(
              data.orderId,
              formData,
              response.razorpay_payment_id,
              response.razorpay_signature,
            );

            setLoading(false);
          } catch (error) {
            setLoading(false);

            await Swal.fire({
              title: "Payment Failed",
              text: "Payment verification failed. Amount will be refunded if deducted.",
              icon: "error",
              confirmButtonColor: "#C76F3B",
            });
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formattedPhone,
        },
        theme: {
          color: "#C76F3B",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      setLoading(false);
    } catch (error) {
      console.error("Payment Error:", error);
      Swal.fire({
        title: "Payment Failed",
        text:
          error.response?.data?.message ||
          error.message ||
          "Failed to process payment",
        icon: "error",
        confirmButtonColor: "#C76F3B",
      });
      setLoading(false);
    }
  };

  const createOrderAfterPayment = async (
    formData,
    razorpayOrderId,
    paymentId,
  ) => {
    try {
      const formattedPhone = formatPhoneNumber(formData.phone);
      const orderPayload = {
        userId: currentUser?.sub || "guest",
        name: formData.name,
        email: formData.email,
        phone: formattedPhone,
        address: {
          street: formData.street,
          city: formData.city,
          country: formData.country || "India",
          state: formData.state,
          zipcode: formData.zipcode,
        },
        productIds: cartItems.map((item) => item._id),
        products: cartItems.map((item) => ({
          bookId: item._id,
          title: item.title,
          price: item.newPrice,
          quantity: item.qty,
          weight: item.weight < 50 ? 250 : item.weight,
        })),
        totalPrice: finalAmount,
        shippingCharge: shippingCharge,
        giftWrapCharge: isGift ? giftWrapCharge : 0,
        estimatedDelivery: estimatedDelivery,
        courierId: selectedCourier?.id,
        courierName: selectedCourier?.name,
        giftTo: isGift ? giftToName : null,
        giftFrom: isGift ? giftFromName : null,
        giftMessage: isGift ? giftMessage : null,
        giftAddress:
          isGift && !sameAsDeliveryAddress
            ? {
              street: formData.gift_street,
              city: formData.gift_city,
              country: formData.gift_country || "India",
              state: formData.gift_state,
              zipcode: formData.gift_zipcode,
            }
            : null,
        paymentId: paymentId,
        cashfreeOrderId: razorpayOrderId, // Reusing field
      };

      const response = await axios.post(
        `${getBaseUrl()}/api/orders`,
        orderPayload,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Order creation failed");
      }

      dispatch(clearCart());
      dispatch(clearGiftDetails());
      setLoading(false);
      setShowConfetti(true);

      await Swal.fire({
        title: "Order Confirmed!",
        html: `
          <div class="text-center">
            <p class="mb-2">Your order has been placed successfully!</p>
            <p class="text-sm text-gray-600 mt-3">Confirmation sent to your email and SMS.</p>
          </div>
        `,
        icon: "success",
        confirmButtonColor: "#C76F3B",
        timer: 8000,
      });

      setShowConfetti(false);
      navigate("/orders");
    } catch (error) {
      console.error("❌ Order creation error:", error);
      setLoading(false);
      Swal.fire({
        title: "Order Creation Failed",
        html: `
          <p>${error.response?.data?.message ||
          error.message ||
          "Failed to create order"
          }</p>
          <p class="text-sm text-gray-600 mt-2">Payment ID: ${paymentId}</p>
          <p class="text-sm text-gray-600">Order ID: ${razorpayOrderId}</p>
          <p class="text-sm text-gray-600 mt-2">Please contact support with these IDs.</p>
        `,
        icon: "error",
        confirmButtonColor: "#C76F3B",
      });
    }
  };

  const processPaymentSuccess = async (
    razorpayOrderId,
    formData,
    paymentId,
    signature,
  ) => {
    try {
      const verifyResponse = await axios.post(
        `${getBaseUrl()}/api/payment/verify-payment`,
        {
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
        },
      );

      if (!verifyResponse.data.success) {
        throw new Error("Payment verification failed");
      }

      await createOrderAfterPayment(formData, razorpayOrderId, paymentId);
    } catch (error) {
      throw error; // VERY IMPORTANT
    }
  };

  useEffect(() => {
    const fetchGiftWrapCharge = async () => {
      try {
        const response = await axios.get(
          `${getBaseUrl()}/api/shipping/gift-wrap-charge`,
        );
        if (response.data.success) {
          setGiftWrapCharge(response.data.charge);
        }
      } catch (error) {
        console.error("Failed to fetch gift wrap charge:", error);
        setGiftWrapCharge(15);
      }
    };
    fetchGiftWrapCharge();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated && currentUser?.sub) {
        setLoadingProfile(true);
        try {
          const encodedUID = encodeURIComponent(currentUser.sub);
          const response = await axios.get(
            `${getBaseUrl()}/api/users/${encodedUID}`,
          );
          setUserProfile(response.data);

          const defaultAddress = response.data.addresses?.find(
            (addr) => addr.isDefault,
          );
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress._id);
            populateAddressFields(defaultAddress, false);
          } else if (response.data.addresses?.length > 0) {
            setSelectedAddressId(response.data.addresses[0]._id);
            populateAddressFields(response.data.addresses[0], false);
          } else {
            setUseManualAddress(true);
          }

          setValue(
            "name",
            `${response.data.name?.firstName || ""} ${response.data.name?.lastName || ""
              }`.trim() ||
            response.data.username ||
            "",
          );
          setValue("email", response.data.email || "");
          setValue("phone", response.data.phone?.primary || "");
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUseManualAddress(true);
        } finally {
          setLoadingProfile(false);
        }
      }
    };
    fetchUserProfile();
  }, [isAuthenticated, currentUser, setValue]);

  useEffect(() => {
    if (giftDetails) {
      if (giftDetails.to || giftDetails.from || giftDetails.message) {
        setIsGift(true);
        setGiftToName(giftDetails.to || "");
        setGiftFromName(giftDetails.from || "");
        setGiftMessage(giftDetails.message || "");
      }
    }
  }, [giftDetails]);

  useEffect(() => {
    if (allBooks && cartItems.length > 0) {
      cartItems.forEach((cartItem) => {
        const book = allBooks.find((b) => b._id === cartItem._id);
        if (book) {
          dispatch(
            updateCartProductDetails({
              _id: book._id,
              stock: book.stock,
              newPrice: book.newPrice,
              oldPrice: book.oldPrice,
            }),
          );
        }
      });
    }
  }, [allBooks, cartItems, dispatch]);

  useEffect(() => {
    if (pincode) {
      fetchPincodeData(pincode, false);
    }
  }, [pincode, fetchPincodeData]);

  useEffect(() => {
    if (isGift && !sameAsDeliveryAddress && giftPincode) {
      fetchPincodeData(giftPincode, true);
    }
  }, [giftPincode, isGift, sameAsDeliveryAddress, fetchPincodeData]);

  // Real-time shipping calculation when pincode changes
  useEffect(() => {
    if (pincode && pincode.length === 6 && /^\d{6}$/.test(pincode)) {
      calculateShipping(pincode);
    } else if (pincode.length === 0) {
      setShippingCharge(0);
      setEstimatedDelivery("");
      setSelectedCourier(null);
    }
  }, [pincode, calculateShipping]);

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C76F3B]"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {loading && renderLoadingOverlay()}
      <div className="container">
        <div className="max-w-9xl mx-auto py-0 flex flex-col justify-center items-center px-0 mb-20">
          <div className="mt-10" data-aos="zoom-in" data-aos-duration="1000">
            <h2 className="sita-main-heading text-center">
              Checkout
            </h2>
            <img
              src="/sita-motif.webp"
              alt="Sita Motif"
              className="mx-auto mb-8 motif"
            />
          </div>

          <div
            className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-6 mt-2 lg:gap-8 border-1 rounded-lg p-4 md:p-6 w-full"
            style={{ borderColor: "#C76F3B" }}>
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border-1 border-gray-200 hover:border-[#C76F3B] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <FaGift className="text-xl text-[#C76F3B]" />
                      </div>
                      <div>
                        <h3 className="font-montserrat font-semibold text-gray-800">
                          Send as Gift
                        </h3>
                        <p className="text-sm text-gray-600">
                          Add a personal touch with gift wrapping & message
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isGift}
                        onChange={(e) => setIsGift(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#C76F3B]"></div>
                    </label>
                  </div>
                </div>

                {isGift && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border-1 border-orange-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <CardGiftcardOutlinedIcon className="text-[#C76F3B]" />
                      Gift Details
                    </h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block sita-label-text text-gray-700 mb-2">
                            Recipient Name{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={giftToName}
                            onChange={(e) => setGiftToName(e.target.value)}
                            placeholder="e.g., John Doe"
                            className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C76F3B] focus:border-transparent transition-all sita-body-text"
                            required={isGift}
                          />
                        </div>
                        <div>
                          <label className="block sita-label-text text-gray-700 mb-2">
                            Your Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={giftFromName}
                            onChange={(e) => setGiftFromName(e.target.value)}
                            placeholder="e.g., Jane Smith"
                            className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C76F3B] focus:border-transparent transition-all sita-body-text"
                            required={isGift}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block sita-label-text text-gray-700 mb-2">
                          Gift Message{" "}
                          <span className="text-gray-500 text-xs">
                            (Optional)
                          </span>
                        </label>
                        <textarea
                          value={giftMessage}
                          onChange={(e) => setGiftMessage(e.target.value)}
                          placeholder="Write a heartfelt message for your gift recipient..."
                          rows="3"
                          maxLength="200"
                          className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C76F3B] focus:border-transparent transition-all resize-none sita-body-text"
                        />
                        <p className="text-xs text-gray-500 mt-1 text-right">
                          {giftMessage.length}/200 characters
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h4 className="sita-sub-heading flex items-center gap-2 mb-4">
                    <FaUser className="text-[#C76F3B]" />
                    Personal Details
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-montserrat ">
                    <div>
                      <label className="block sita-label-text text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("name", { required: "Name is required" })}
                        type="text"
                        placeholder="Enter your full name"
                        className="font-montserrat w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C76F3B] focus:border-transparent transition-all sita-body-text"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block sita-label-text text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Invalid email address",
                          },
                        })}
                        type="email"
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C76F3B] focus:border-transparent transition-all sita-body-text"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block sita-label-text text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Enter valid 10-digit phone number",
                          },
                        })}
                        type="tel"
                        placeholder="9876543210"
                        maxLength="10"
                        className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C76F3B] focus:border-transparent transition-all sita-body-text"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {isAuthenticated &&
                  userProfile &&
                  userProfile.addresses?.length > 0 &&
                  !useManualAddress ? (
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="sita-sub-heading flex items-center gap-2">
                        <FaMapMarkerAlt className="text-[#C76F3B]" />
                        Delivery Address
                      </h4>
                      <button
                        type="button"
                        onClick={() => setUseManualAddress(true)}
                        className="text-sm text-[#C76F3B] hover:text-[#A35427] font-medium transition-colors">
                        + Add New Address
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-montserrat">
                      {userProfile.addresses.map((address) => (
                        <div
                          key={address._id}
                          onClick={() => handleAddressSelect(address._id)}
                          className={`border-1 rounded-xl p-4 cursor-pointer transition-all ${selectedAddressId === address._id
                            ? "border-[#C76F3B] bg-orange-50 shadow-md"
                            : "border-gray-200 hover:border-[#C76F3B] hover:shadow-sm"
                            }`}>
                          <div className="flex items-start gap-3 font-montserrat">
                            <div className="mt-1">
                              <input
                                type="radio"
                                checked={selectedAddressId === address._id}
                                onChange={() =>
                                  handleAddressSelect(address._id)
                                }
                                className="w-4 h-4 text-[#C76F3B] focus:ring-[#C76F3B]"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h3 className="font-semibold text-gray-900 truncate">
                                  {address.fullName}
                                </h3>
                                {address.isDefault && (
                                  <span className="bg-[#C76F3B] text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                                    <FaCheck className="inline mr-1" />
                                    Default
                                  </span>
                                )}
                              </div>

                              <div className="space-y-1 text-sm">
                                <p className="text-gray-700 line-clamp-2">
                                  {address.addressLine1}
                                </p>
                                {address.addressLine2 && (
                                  <p className="text-gray-700 line-clamp-1">
                                    {address.addressLine2}
                                  </p>
                                )}

                                <div className="grid grid-cols-2 gap-2 pt-2">
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      City
                                    </p>
                                    <p className="text-gray-800 font-medium truncate">
                                      {address.city}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      State
                                    </p>
                                    <p className="text-gray-800 font-medium truncate">
                                      {address.state}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      PIN Code
                                    </p>
                                    <p className="text-gray-800 font-medium">
                                      {address.postalCode}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Country
                                    </p>
                                    <p className="text-gray-800 font-medium truncate">
                                      {address.country}
                                    </p>
                                  </div>
                                </div>

                                {address.phone && (
                                  <p className="text-gray-600 flex items-center gap-1 pt-2">
                                    <MdPhone className="text-[#C76F3B] flex-shrink-0" />
                                    <span className="truncate">
                                      {address.phone}
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    {useManualAddress && (
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="sita-sub-heading flex items-center gap-2">
                          <FaMapMarkerAlt className="text-[#C76F3B]" />
                          Delivery Address
                        </h4>
                        {isAuthenticated &&
                          userProfile?.addresses?.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setUseManualAddress(false)}
                              className="text-sm text-[#C76F3B] hover:text-[#A35427] font-medium transition-colors">
                              Use Saved Address
                            </button>
                          )}
                      </div>
                    )}

                    {!useManualAddress && (
                      <h4 className="sita-sub-heading flex items-center gap-2 mb-4">
                        <FaMapMarkerAlt className="text-[#C76F3B]" />
                        Delivery Address
                      </h4>
                    )}

                    <div className="space-y-4 font-montserrat">
                      <div>
                        <label className="block sita-label-text text-gray-700 mb-2">
                          Street Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register("street", {
                            required: "Street address is required",
                          })}
                          type="text"
                          placeholder="House No., Building Name, Street"
                          className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C76F3B] focus:border-transparent transition-all sita-body-text"
                        />
                        {errors.street && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.street.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block sita-label-text text-gray-700 mb-2">
                            PIN Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="zipcode"
                            {...register("zipcode", {
                              required: "Pincode is required",
                              pattern: {
                                value: /^\d{6}$/,
                                message: "Pincode must be 6 digits",
                              },
                            })}
                            placeholder="6-digit PIN code"
                            maxLength={6}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              setValue("zipcode", value);
                              setPincode(value);
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C76F3B] transition sita-body-text"
                          />

                          {loadingPincode && (
                            <p className="text-sm text-blue-600 mt-1">
                              📍 Fetching location details...
                            </p>
                          )}
                          {errors.zipcode && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.zipcode.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block sita-label-text text-gray-700 mb-2">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...register("city", {
                              required: "City is required",
                            })}
                            type="text"
                            placeholder="Bangalore"
                            className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C76F3B] focus:border-transparent transition-all sita-body-text"
                          />
                          {errors.city && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.city.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block sita-label-text text-gray-700 mb-2">
                            State <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...register("state", {
                              required: "State is required",
                            })}
                            type="text"
                            placeholder="Karnataka"
                            className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C76F3B] focus:border-transparent transition-all sita-body-text"
                          />
                          {errors.state && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.state.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block sita-label-text text-gray-700 mb-2">
                            Country <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...register("country", {
                              required: "Country is required",
                            })}
                            type="text"
                            placeholder="India"
                            className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C76F3B] focus:border-transparent transition-all sita-body-text"
                          />
                          {errors.country && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.country.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isGift && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border-1 border-orange-200">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FaGift className="text-[#C76F3B]" />
                        Gift Delivery Address
                      </h2>
                      <button
                        type="button"
                        onClick={handleSameAsDeliveryToggle}
                        className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${sameAsDeliveryAddress
                          ? "bg-[#C76F3B] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}>
                        {sameAsDeliveryAddress
                          ? "Different Address"
                          : "✓ Same as Above"}
                      </button>
                    </div>

                    {sameAsDeliveryAddress ? (
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <p className="text-sm text-gray-700 flex items-center gap-2">
                          <FaCheck className="text-[#C76F3B]" />
                          Gift will be delivered to the same address as billing
                          address
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {isAuthenticated &&
                          userProfile &&
                          userProfile.addresses?.length > 0 &&
                          !useManualGiftAddress && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {userProfile.addresses.map((address) => (
                                <div
                                  key={address._id}
                                  onClick={() =>
                                    handleGiftAddressSelect(address._id)
                                  }
                                  className={`border-1 rounded-xl p-4 cursor-pointer transition-all ${selectedGiftAddressId === address._id
                                    ? "border-[#C76F3B] bg-orange-50 shadow-md"
                                    : "border-gray-200 hover:border-[#C76F3B]"
                                    }`}>
                                  <div className="flex items-start gap-3">
                                    <input
                                      type="radio"
                                      checked={
                                        selectedGiftAddressId === address._id
                                      }
                                      onChange={() =>
                                        handleGiftAddressSelect(address._id)
                                      }
                                      className="mt-1 w-4 h-4 text-[#C76F3B] focus:ring-[#C76F3B]"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                        {address.fullName}
                                      </h3>
                                      <p className="text-sm text-gray-700 line-clamp-2">
                                        {address.addressLine1}
                                      </p>
                                      <p className="text-sm text-gray-600 mt-1 truncate">
                                        {address.city}, {address.state} -{" "}
                                        {address.postalCode}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                        {(!isAuthenticated ||
                          useManualGiftAddress ||
                          !userProfile?.addresses?.length) && (
                            <div className="space-y-4">
                              <div>
                                <label className="block sita-label-text text-gray-700 mb-2">
                                  Street Address{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  {...register("gift_street", {
                                    required:
                                      isGift && !sameAsDeliveryAddress
                                        ? "Gift street address is required"
                                        : false,
                                  })}
                                  type="text"
                                  placeholder="House No., Building Name, Street"
                                  className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C76F3B] focus:border-transparent transition-all sita-body-text"
                                />
                                {errors.gift_street && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {errors.gift_street.message}
                                  </p>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block sita-label-text text-gray-700 mb-2">
                                    PIN Code{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    {...register("gift_zipcode", {
                                      required:
                                        isGift && !sameAsDeliveryAddress
                                          ? "PIN code is required"
                                          : false,
                                      pattern: {
                                        value: /^[0-9]{6}$/,
                                        message: "Enter valid 6-digit PIN code",
                                      },
                                    })}
                                    type="text"
                                    placeholder="560001"
                                    maxLength="6"
                                    value={giftPincode}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(
                                        /\D/g,
                                        "",
                                      );
                                      setGiftPincode(value);
                                      setValue("gift_zipcode", value);
                                    }}
                                    className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C76F3B] focus:border-transparent transition-all sita-body-text"
                                  />
                                  {loadingGiftPincode && (
                                    <p className="text-sm text-blue-600 mt-1">
                                      📍 Fetching location...
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label className="block sita-label-text text-gray-700 mb-2">
                                    City <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    {...register("gift_city", {
                                      required:
                                        isGift && !sameAsDeliveryAddress
                                          ? "City is required"
                                          : false,
                                    })}
                                    type="text"
                                    placeholder="Bangalore"
                                    className="w-full px-4 py-3 1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C76F3B] focus:border-transparent transition-all sita-body-text"
                                  />
                                </div>

                                <div>
                                  <label className="block sita-label-text text-gray-700 mb-2">
                                    State <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    {...register("gift_state", {
                                      required:
                                        isGift && !sameAsDeliveryAddress
                                          ? "State is required"
                                          : false,
                                    })}
                                    type="text"
                                    placeholder="Karnataka"
                                    className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C76F3B] focus:border-transparent transition-all sita-body-text"
                                  />
                                </div>

                                <div>
                                  <label className="block sita-label-text text-gray-700 mb-2">
                                    Country{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    {...register("gift_country", {
                                      required:
                                        isGift && !sameAsDeliveryAddress
                                          ? "Country is required"
                                          : false,
                                    })}
                                    type="text"
                                    placeholder="India"
                                    className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C76F3B] focus:border-transparent transition-all sita-body-text"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                        {isAuthenticated &&
                          !useManualGiftAddress &&
                          userProfile?.addresses?.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setUseManualGiftAddress(true)}
                              className="text-sm text-[#C76F3B] hover:text-[#A35427] font-medium">
                              + Enter different address manually
                            </button>
                          )}
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-start gap-3 font-montserrat">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                      className="mt-1 w-5 h-5 text-[#C76F3B] focus:ring-[#C76F3B] rounded cursor-pointer"
                    />
                    <label
                      className="text-sm text-gray-700 cursor-pointer"
                      onClick={() => setIsChecked(!isChecked)}>
                      I agree to the{" "}
                      <Link
                        to="/terms-and-conditions"
                        className="text-[#C76F3B] no-underline font-medium">
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy-policy"
                        className="text-[#C76F3B] no-underline font-medium">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>

                <div className="flex justify-center mt-4 font-montserrat">
                  <button
                    type="submit"
                    disabled={loading || !isChecked}
                    className="w-auto bg-[#C76F3B] hover:bg-[#A35427] text-white font-semibold px-5 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transform">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-1 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing Payment...
                      </span>
                    ) : (
                      `Proceed to Payment • $${finalAmount.toFixed(2)}`
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 font-montserrat">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Secure payment powered by Razorpay
                </div>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-lg sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="sita-sub-heading">
                    Order Summary
                  </h4>
                  <div className="bg-[#C76F3B] text-white px-3 py-1 rounded-full text-sm font-montserrat font-semibold">
                    {cartItems.reduce((a, b) => a + b.qty, 0)}{" "}
                    {cartItems.length === 1 ? "items" : "items"}
                  </div>
                </div>

                <div className="space-y-3 mb-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems
                    .filter((item) => item.stock !== 0)
                    .map((item) => (
                      <div
                        key={item._id}
                        className="flex gap-3 pb-3 border-b border-gray-200 last:border-0 font-montserrat">
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.coverImage}
                            alt={item.title}
                            className="w-16 h-20 object-cover rounded-lg shadow-sm"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 text-sm line-clamp-2 mb-1">
                            {item.title}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Qty: {item.qty}
                            </span>
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-800">
                                ${(item.newPrice * item.qty).toFixed(2)}
                              </p>
                              {item.oldPrice &&
                                item.oldPrice > item.newPrice && (
                                  <p className="text-xs text-gray-500 line-through">
                                    ${(item.oldPrice * item.qty).toFixed(2)}
                                  </p>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="space-y-3 pt-4 border-t-2 border-gray-200 font-montserrat">
                  <div className="flex justify-between text-gray-600 font-montserrat">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      ${originalTotal.toFixed(2)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Discount
                      </span>
                      <span className="font-semibold">
                        -${discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center">
                      Shipping
                      {loadingShipping && (
                        <span className="ml-2 text-xs text-blue-500">
                          (calculating...)
                        </span>
                      )}
                    </span>
                    <span className="font-semibold text-green-600">
                      {shippingCharge === 0
                        ? "Enter pincode"
                        : `$${(shippingCharge || 0).toFixed(2)}`}
                    </span>
                  </div>

                  {estimatedDelivery && (
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>Estimated delivery:</span>
                      <span className="font-semibold">{estimatedDelivery}</span>
                    </div>
                  )}

                  {isGift && giftWrapCharge > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span className="flex items-center">
                        <FaGift className="mr-2 text-[#C76F3B]" />
                        Gift Wrapping
                      </span>
                      <span className="font-semibold text-orange-600">
                        ${(giftWrapCharge || 0).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t-2 border-gray-300">
                    <span>Total</span>
                    <span className="text-[#C76F3B]">
                      ${(finalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {isGift && (
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 text-sm text-orange-800">
                      <FaGift className="text-[#C76F3B] flex-shrink-0" />
                      <span className="font-medium">
                        Gift wrapping included!
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #C76F3B;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #A35427;
        }
      `}</style>
      </div>
    </>
  );
};

export default CheckoutPage;
