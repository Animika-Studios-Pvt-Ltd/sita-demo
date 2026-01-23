import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useGetOrderByUserIdQuery } from "../../redux/features/orders/ordersApi";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import AOS from "aos";
import "aos/dist/aos.css";
import { useUpdateOrderMutation } from "../../redux/features/orders/ordersApi";
import Swal from "sweetalert2";
import MenuBookIcon from "@mui/icons-material/MenuBook";


const OrderPage = () => {
  const { currentUser } = useAuth();
  const { data: orders = [], isLoading } = useGetOrderByUserIdQuery(
    currentUser?.sub,
    { skip: !currentUser?.sub }
  );
  const navigate = useNavigate();

  const { data: books = [] } = useFetchAllBooksQuery();
  const [ordersWithImages, setOrdersWithImages] = useState([]);
  const [loadingCancel, setLoadingCancel] = useState(null);
  const [loadingReturn, setLoadingReturn] = useState(null);
  const [updateOrder] = useUpdateOrderMutation();
  const [cancellingOrders, setCancellingOrders] = useState({});
  const [preloadedBooks, setPreloadedBooks] = useState(new Set());

  const handlePreloadEbook = async (bookId) => {
    if (preloadedBooks.has(bookId)) return;

    try {
      const tokenClaims = await getIdTokenClaims();
      const token = tokenClaims?.__raw;

      await axios.get(`${getBaseUrl()}/api/books/${bookId}/ebook`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPreloadedBooks(prev => new Set([...prev, bookId]));
    } catch (error) {
    }
  };
  useEffect(() => {
    AOS.init({
      duration: 1500,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);

  useEffect(() => {
    if (orders.length > 0 && books.length > 0) {
      const updatedOrders = orders.map((order) => {
        const productsWithImages = order.products.map((prod) => {
          const book = books.find((b) => {
            return (
              b._id === prod.bookId ||
              b._id === prod._id ||
              b.title.toLowerCase() === prod.title?.toLowerCase() ||
              b.slug === prod.slug
            );
          });

          if (book) {
          } else {
          }

          return {
            ...prod,
            coverImage: book?.coverImage || prod.coverImage || "",
            ebookType: book?.ebookType || "none",
            bookId: book?._id || prod.bookId || prod._id,
          };
        });
        return { ...order, products: productsWithImages };
      });
      setOrdersWithImages(updatedOrders);
    }
  }, [orders, books]);

  const isReturnWindowOpen = (order) => {
    if (order.status !== "Delivered") return false;

    const deliveredTime = new Date(order.deliveredAt || order.updatedAt).getTime();
    const now = Date.now();
    const diffInHours = (now - deliveredTime) / (1000 * 60 * 60);

    return diffInHours <= 24;
  };

  const handleCancelOrder = async (orderId) => {
    const { value: reason } = await Swal.fire({
      title: "Cancel Order?",
      text: "Please provide a reason for cancellation:",
      input: "text",
      inputPlaceholder: "Enter reason...",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#C76F3B",
      width: '400px',
      padding: '2rem',
      customClass: {
        input: 'swal-input-custom',
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage("Cancellation reason is required");
        }
        return value;
      },
    });

    if (reason) {
      try {
        setLoadingCancel(orderId);
        await updateOrder({
          id: orderId,
          status: "Cancelled",
          cancellationReason: reason,
        }).unwrap();

        Swal.fire("Cancelled!", "Your order has been cancelled.", "success");
      } catch (err) {
        console.error("❌ Cancel failed:", err);
        Swal.fire("Error!", "Failed to cancel the order.", "error");
      } finally {
        setLoadingCancel(null);
      }
    }
  };


  const handleReturnOrder = async (orderId) => {
    const { value: formValues } = await Swal.fire({
      title: "Return / Replace Request",
      html: `
      <input type="text" id="reason" class="swal2-input" placeholder="Reason for return">
      <input type="file" id="returnImage" class="swal2-file mt-1" accept="image/*">
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Submit Request",
      confirmButtonColor: "#C76F3B",
      width: '400px',
      padding: '0rem',
      Paddingbotttom: '2rem',
      customClass: {
        popup: 'swal-popup-custom',
        input: 'swal-input-custom',
        file: 'swal-file-custom',
      },
      preConfirm: async () => {
        const reason = document.getElementById("reason").value;
        const fileInput = document.getElementById("returnImage");
        const file = fileInput.files[0];
        if (!reason) {
          Swal.showValidationMessage("Please provide a reason.");
          return false;
        }
        if (!file) {
          Swal.showValidationMessage("Please upload an image.");
          return false;
        }

        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
        });

        return { reason, image: base64 };
      },
    });

    if (formValues) {
      try {
        setLoadingReturn(orderId);
        await updateOrder({
          id: orderId,
          status: "Return Requested",
          returnReason: formValues.reason,
          returnImage: formValues.image,
        }).unwrap();

        Swal.fire(
          "Request Submitted!",
          "Your return/replace request has been sent.",
          "success"
        );
      } catch (err) {
        console.error("❌ Return request failed:", err);
        Swal.fire("Error!", "Failed to submit request.", "error");
      } finally {
        setLoadingReturn(null);
      }
    }
  };

  if (!currentUser)
    return (
      <div className="min-h-screen flex justify-center items-center text-center px-4">
        <p className="text-lg sm:text-xl text-gray-600">
          You need to be logged in to view your orders.
        </p>
      </div>
    );

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center text-lg sm:text-xl font-medium text-gray-600">
        Loading your orders...
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="container" data-aos="fade-up" data-aos-duration="1500">
        <div className="max-w-8xl mx-auto flex flex-col items-center px-2">
          <div
            className="relative inline-block text-center mt-5 mb-6 w-full"
            data-aos="fade-down"
            data-aos-duration="1600">
            <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black font-display leading-snug">
              Your Orders
            </h1>
          </div>

          <div
            className="bg-white p-6 mt-20 text-center w-full md:w-2/3 lg:w-1/2"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="1800">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
              You have no orders yet!
            </h2>
            <p className="text-base sm:text-lg mb-4 text-gray-700">
              Once you place an order, it will appear here. Start exploring and
              shop your favorite books!
            </p>
            <Link
              to="/publications"
              className="inline-flex items-center gap-2 bg-[#C76F3B] hover:bg-[#A35427] no-underline text-white px-5 py-2 rounded-md text-center font-medium transition-colors duration-300 text-base sm:text-lg"
              data-aos="zoom-in"
              data-aos-delay="400">
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="container" data-aos="fade-up" data-aos-duration="1500">
      <div className="max-w-8xl mx-auto flex flex-col items-center px-2">
        <div
          className="relative inline-block text-center mt-5 mb-6 w-full"
          data-aos="fade-down"
          data-aos-duration="1600">
          <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black font-display leading-snug">
            Your Orders
          </h1>
        </div>

        {ordersWithImages.map((order, index) => (
          <div
            key={order._id}
            className="bg-white rounded-xl border-1 mt-4 border-[#C76F3B] transition-all duration-300 p-4 w-full flex flex-col lg:flex-row gap-4 mb-6"
            data-aos="fade-up"
            data-aos-delay={`${index * 150}`}
            data-aos-duration="1800">
            <div className="flex-1 lg:border-r pt-1 lg:pt-0 lg:pr-4 flex flex-col gap-2">
              <p className="bg-[#C76F3B] text-white text-base sm:text-lg w-fit px-3 py-1 rounded-full font-semibold shadow-sm">
                Order # {ordersWithImages.length - index}
              </p>

              <h4
                className="flex items-center gap-2 font-semibold text-gray-800 text-base sm:text-lg md:text-xl mb-2"
                data-aos="fade-right"
                data-aos-delay="200">
                <ShoppingBagOutlinedIcon fontSize="small" /> Products
              </h4>

              <ul className="text-base sm:text-lg text-gray-700 font-Figtree space-y-2 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-stable">
                {order.products?.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex flex-col gap-2 hover:text-[#C76F3B] transition-colors break-words">
                    <div className="flex items-center gap-2">
                      <span className="w-6 text-right font-semibold text-[#C76F3B]">
                        {idx + 1}.
                      </span>
                      {item.coverImage && (
                        <img
                          src={item.coverImage || "/placeholder-book.jpg"}
                          alt={item.title}
                          className="w-12 h-16 object-cover rounded-sm"
                        />
                      )}
                      <span className="flex-1">
                        {item.title} -{" "}
                        <span className="font-semibold">
                          ₹{item.price} × {item.quantity}
                        </span>
                      </span>
                    </div>

                    {item.ebookType && item.ebookType !== 'none' && (
                      <Link
                        to={`/read/${item.bookId}`}
                        className="inline-flex items-center gap-2 ml-8 w-fit bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors shadow-sm"
                      >
                        <MenuBookIcon style={{ fontSize: '1rem' }} />
                        Read eBook
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {order.status && (
                <p
                  className={`flex items-center gap-2 text-base sm:text-lg font-semibold mt-1 ${order.status.toLowerCase() === "delivered"
                    ? "text-green-600"
                    : order.status.toLowerCase() === "cancelled"
                      ? "text-red-600"
                      : "text-[#C76F3B]"
                    }`}
                >
                  <AssignmentTurnedInOutlinedIcon fontSize="small" />
                  Status: {order.status}
                </p>
              )}

              {order.trackingId && (
                <p
                  className="text-base sm:text-lg text-gray-700 mt-0.5 break-words"
                  data-aos="fade-left"
                  data-aos-delay="350">
                  Tracking ID:{" "}
                  <span className="font-medium">{order.trackingId}</span>
                </p>
              )}

              <p
                className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-900 mt-0"
                data-aos="fade-up"
                data-aos-delay="400">
                <PaymentOutlinedIcon fontSize="small" /> Total Price : ₹
                {order.totalPrice}
              </p>

              <div className="flex gap-3 mt-3">
                {order.products?.some(product =>
                  product.title?.toLowerCase().includes('ebook')
                ) ? (
                  <button
                    onMouseEnter={() => {
                      const bookId = order.products[0]?._id || order.productIds?.[0];
                      handlePreloadEbook(bookId);
                    }}
                    onClick={() => {
                      const bookId = order.products[0]?._id || order.productIds?.[0];
                      navigate(`/ebook/${bookId}`);
                    }}
                    className="text-white px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 font-medium shadow-lg hover:opacity-90"
                    style={{ backgroundColor: '#C76F3B', width: '140px', fontSize: '14px' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Read eBook
                  </button>
                ) : (
                  order.status === 'Pending' && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancellingOrders[order._id]}
                      className="text-white px-4 py-2 rounded-full transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                      style={{
                        backgroundColor: '#C76F3B',
                        width: '140px',
                        fontSize: '14px'
                      }}
                    >
                      {cancellingOrders[order._id] ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )
                )}

                {isReturnWindowOpen(order) && (
                  <button
                    onClick={() => handleReturnOrder(order._id)}
                    disabled={loadingReturn === order._id}
                    className={`py-2 px-4 rounded-full flex items-center justify-center gap-2 text-white font-medium transition ${loadingReturn === order._id
                      ? "opacity-50 cursor-not-allowed bg-[#993333]"
                      : "bg-[#993333] hover:bg-[#662222]"
                      }`}
                  >
                    {loadingReturn === order._id ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Return / Replace"
                    )}
                  </button>
                )}

              </div>
            </div>

            <div
              className="flex-1 flex flex-col gap-2 sm:gap-2"
              data-aos="fade-left"
              data-aos-delay="500">
              <h3 className="text-lg sm:text-xl md:text-2xl font-medium mb-3 text-gray-800 break-all w-full">
                Order ID:{" "}
                <span className="text-[#C76F3B] font-semibold">
                  {order.orderCode}
                </span>
              </h3>
              <div className="flex-1 flex flex-col gap-1 bg-gray-50 rounded-lg p-3 shadow-sm border border-gray-200">
                <h4 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 border-b border-gray-300 pb-1">
                  Delivery Details:
                </h4>
                <p className="flex items-center gap-2 text-sm sm:text-base text-gray-700">
                  <PersonOutlineOutlinedIcon
                    fontSize="small"
                    className="text-gray-500"
                  />{" "}
                  {order.name}
                </p>
                <p className="flex flex-wrap items-start gap-2 text-sm sm:text-base text-gray-700 w-full">
                  <EmailOutlinedIcon
                    fontSize="small"
                    className="text-gray-500 mt-0.5 flex-shrink-0"
                  />
                  <span className="break-all w-full sm:w-auto">
                    {order.email}
                  </span>
                </p>
                <p className="flex items-center gap-2 text-sm sm:text-base text-gray-700">
                  <PhoneOutlinedIcon
                    fontSize="small"
                    className="text-gray-500"
                  />{" "}
                  {order.phone}
                </p>
                <p className="flex flex-wrap items-start gap-2 text-sm sm:text-base text-gray-700 break-words">
                  <LocationOnOutlinedIcon
                    fontSize="small"
                    className="text-gray-500 mt-0.5"
                  />
                  <span>
                    {order.address.street}, {order.address.city},{" "}
                    {order.address.state}, {order.address.country} -{" "}
                    {order.address.zipcode}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPage;
