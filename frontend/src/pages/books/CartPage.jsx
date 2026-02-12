import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  removeFromCart,
  updateCartQty,
  removeSoldOut,
  saveGiftDetails,
  clearGiftDetails,
  updateCartProductDetails,
} from "../../redux/features/cart/cartSlice";
import IconButton from "@mui/material/IconButton";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
import AOS from "aos";
import "aos/dist/aos.css";
import { getSecureImageUrl } from "../../utils/imageUtils";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const giftDetails = useSelector((state) => state.cart.giftDetails);
  const dispatch = useDispatch();
  const [isGift, setIsGift] = useState(
    Boolean(giftDetails?.to || giftDetails?.from || giftDetails?.message),
  );
  const { data: allBooks } = useFetchAllBooksQuery();

  useEffect(() => {
    AOS.init({
      duration: 1500,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);

  useEffect(() => {
    setIsGift(
      Boolean(giftDetails?.to || giftDetails?.from || giftDetails?.message),
    );
  }, [giftDetails]);

  useEffect(() => {
    dispatch(removeSoldOut());
  }, [dispatch]);

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

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.newPrice * item.qty,
    0,
  );
  const originalTotal = cartItems.reduce(
    (acc, item) => acc + (item.oldPrice || item.newPrice) * item.qty,
    0,
  );
  const discount = originalTotal - subtotal;
  const finalAmount = subtotal;

  const PriceTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(() => ({
    [`& .MuiTooltip-tooltip`]: {
      backgroundColor: "#fff",
      color: "#333",
      fontSize: 12,
      padding: "8px 14px",
      borderRadius: 8,
      border: "1px solid #ddd",
      maxWidth: 320,
      whiteSpace: "normal",
      lineHeight: 2,
      textAlign: "left",
    },
  }));

  const handleQtyChange = (product, type) => {
    if (type === "increase" && product.qty >= product.stock) return;
    dispatch(updateCartQty({ _id: product._id, type }));
  };

  const handleShare = async (product) => {
    const shareData = {
      title: product.title,
      text: `Check out this book: ${product.title}`,
      url: `${window.location.origin}/books/${product.slug || product._id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const safeGift = (overrides = {}) => ({
    to: giftDetails?.to || "",
    from: giftDetails?.from || "",
    message: giftDetails?.message || "",
    ...overrides,
  });

  return (
    <div className="container" data-aos="fade-up" data-aos-duration="1600">
      <div className="max-w-9xl mx-auto py-0 text-center flex flex-col justify-center items-center px-0 mb-20">
        <div className="mt-10" data-aos="zoom-in" data-aos-duration="1000">
          <h2 className="font-serifSita text-[#8b171b] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-tight text-center">
            Shopping Cart
          </h2>
          <img
            src="/sita-motif.webp"
            alt="Sita Motif"
            className="mx-auto mb-8 motif"
          />
        </div>

        {cartItems.length > 0 ? (
          <div
            className="max-w-8xl border-1 border-[#C76F3B] rounded-md p-4 mx-auto grid grid-cols-1 mt-2 lg:grid-cols-3 gap-4"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="1800">
            <div
              className="lg:col-span-2 bg-white rounded-lg transition-all duration-300"
              data-aos="fade-right"
              data-aos-duration="1800">
              <ul className="space-y-6">
                {cartItems.map((product, index) => (
                  <li
                    key={product._id}
                    className="flex flex-col sm:flex-row gap-6 border-b pb-6 transition hover:border p-2 rounded-lg w-full"
                    data-aos="fade-up"
                    data-aos-delay={index * 100 + 200}
                    data-aos-duration="1600">
                    <img
                      src={getSecureImageUrl(product?.coverImage) || "/placeholder-book.jpg"}
                      alt={product.title}
                      data-aos="zoom-in"
                      data-aos-duration="1600"
                      className="w-34 sm:w-34 md:w-34 lg:w-34 h-44 object-cover rounded-md border shadow-sm transition-transform duration-300 hover:scale-105 mx-auto sm:mx-0"
                    />
                    <div
                      className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left"
                      data-aos="fade-left"
                      data-aos-duration="1700">
                      <h3 className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[21px] xl:text-[21px] font-playfair font-regular leading-snug text-gray-800">
                        {product.title}
                      </h3>
                      <p className="text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px] text-gray-800 font-Figtree font-regular leading-tight mt-0">
                        by {product.author || "Unknown Author"}
                      </p>
                      <div className="mt-1 flex flex-col items-center sm:items-start">
                        <div className="inline-flex justify-center sm:justify-start items-center gap-2 w-full flex-wrap md:flex-nowrap">
                          {Number(product?.oldPrice) >
                            Number(product?.newPrice) && (
                              <span className="text-gray-500 line-through text-[12px] sm:text-[14px] md:text-[14px] lg:text-[16px] xl:text-[16px] font-Figtree font-regular">
                                ${product?.oldPrice}
                              </span>
                            )}
                          <span className="text-black font-Figtree font-bold text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px] flex items-center">
                            ${product?.newPrice}
                          </span>
                          {Number(product?.oldPrice) >
                            Number(product?.newPrice) && (
                              <span className="text-[12px] sm:text-[14px] md:text-[14px] lg:text-[16px] xl:text-[16px] text-green-600 font-Figtree font-bold">
                                {Math.round(
                                  ((product.oldPrice - product.newPrice) /
                                    product.oldPrice) *
                                  100,
                                )}
                                % off
                              </span>
                            )}
                        </div>
                      </div>
                      <p
                        className={`mt-1 text-[12px] sm:text-[14px] md:text-[14px] lg:text-[16px] xl:text-[16px] font-Figtree font-regular ${product.stock <= 10
                            ? "text-[#993333]"
                            : "text-green-600"
                          }`}>
                        {product.stock <= 10
                          ? `In Stock - Only ${product.stock} left`
                          : "In Stock"}
                      </p>

                      <div
                        className="flex flex-row items-center justify-center sm:justify-start gap-3 mt-0"
                        data-aos="zoom-in"
                        data-aos-duration="1600">
                        <div className="flex items-center border rounded-md">
                          {product.qty > 1 ? (
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleQtyChange(product, "decrease")
                              }
                              className="text-gray-700 hover:bg-gray-200 transition p-1">
                              <RemoveOutlinedIcon fontSize="small" />
                            </IconButton>
                          ) : (
                            <IconButton
                              size="small"
                              onClick={() => dispatch(removeFromCart(product))}
                              className="text-gray-700 hover:bg-gray-200 transition p-1">
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </IconButton>
                          )}
                          <span className="px-2 w-8 text-center text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px]">
                            {product.qty}
                          </span>
                          <IconButton
                            size="small"
                            onClick={() => handleQtyChange(product, "increase")}
                            disabled={product.qty >= product.stock}
                            className={`text-gray-700 transition p-1 ${product.qty >= product.stock
                                ? "opacity-50"
                                : "hover:bg-gray-200"
                              }`}>
                            <AddOutlinedIcon fontSize="small" />
                          </IconButton>
                        </div>
                        <IconButton
                          size="small"
                          onClick={() => handleShare(product)}
                          className="text-gray-600 hover:text-indigo-600 p-0">
                          <ShareOutlinedIcon fontSize="smaller" />
                        </IconButton>
                      </div>
                    </div>
                  </li>
                ))}

                <div
                  className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mb-6 gap-2 sm:gap-0"
                  data-aos="fade-up"
                  data-aos-duration="1600">
                  <Link
                    to="/publications"
                    className="mt-0 flex font-montserrat font-medium items-center gap-2 bg-[#C76F3B] hover:bg-[#A35427] text-white px-6 py-2 no-underline rounded-md transition-colors duration-300 text-[12px] sm:text-[14px] md:text-[14px] lg:text-[16px] xl:text-[16px]">
                    <ArrowBackOutlinedIcon fontSize="small" />
                    CONTINUE SHOPPING
                  </Link>

                  <p className="text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px] font-Figtree font-regular text-center sm:text-left">
                    Subtotal (
                    <span className="font-bold">
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)} item
                      {cartItems.reduce((acc, item) => acc + item.qty, 0) > 1
                        ? "s"
                        : ""}
                    </span>
                    ): $<span className="font-bold">{subtotal.toFixed(2)}</span>
                  </p>
                </div>
              </ul>
            </div>

            <div
              className="flex flex-col gap-3"
              data-aos="fade-left"
              data-aos-duration="1800">
              <div
                className="bg-white rounded-lg border p-6 flex flex-col gap-3"
                data-aos="zoom-in"
                data-aos-duration="1800">
                <div className="flex justify-center">
                  <label className="flex font-montserrat font-regular items-center gap-2 text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px] font-Figtree font-regular">
                    <input
                      type="checkbox"
                      checked={isGift}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setIsGift(checked);
                        if (!checked) {
                          dispatch(clearGiftDetails());
                        } else {
                          if (!giftDetails) {
                            dispatch(
                              saveGiftDetails({
                                to: "",
                                from: "",
                                message: "",
                              }),
                            );
                          }
                        }
                      }}
                      className="accent-[#C76F3B] w-4 h-4"
                    />
                    This will be a gift{" "}
                    <CardGiftcardOutlinedIcon className="text-gray-600" />
                  </label>
                </div>

                {isGift && (
                  <div
                    className="flex flex-col gap-3 mt-2"
                    data-aos="fade-up"
                    data-aos-duration="1600">
                    <TextField
                      label="Gift To"
                      variant="outlined"
                      size="small"
                      value={giftDetails?.to || ""}
                      onChange={(e) =>
                        dispatch(
                          saveGiftDetails(safeGift({ to: e.target.value })),
                        )
                      }
                      fullWidth
                    />
                    <TextField
                      label="Gift From"
                      variant="outlined"
                      size="small"
                      value={giftDetails?.from || ""}
                      onChange={(e) =>
                        dispatch(
                          saveGiftDetails(safeGift({ from: e.target.value })),
                        )
                      }
                      fullWidth
                    />
                    <TextField
                      label="Message"
                      variant="outlined"
                      size="small"
                      multiline
                      rows={3}
                      value={giftDetails?.message || ""}
                      onChange={(e) =>
                        dispatch(
                          saveGiftDetails(
                            safeGift({ message: e.target.value }),
                          ),
                        )
                      }
                      fullWidth
                    />
                  </div>
                )}
              </div>

              <div
                className="bg-white rounded-lg border p-4 flex flex-col gap-2"
                data-aos="fade-up"
                data-aos-duration="1800">
                <h3 className="text-[16px] sm:text-[20px] md:text-[22px] lg:text-[23px] xl:text-[23px] font-playfair font-regular mb-3 mt-0">
                  Price Details
                </h3>
                <div className="flex font-montserrat font-medium justify-between text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px] text-gray-700">
                  <span>
                    Price ({cartItems.reduce((a, b) => a + b.qty, 0)} items)
                  </span>
                  <span>$ {originalTotal.toFixed(2)}</span>
                </div>
                <div className="flex font-montserrat justify-between text-green-600 text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px]">
                  <span>Discount</span>
                  <span>- $ {discount.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex font-montserrat font-medium justify-between font-semibold text-gray-900 text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px]">
                  <span>Total Amount</span>
                  <span>$ {finalAmount.toFixed(2)}</span>
                </div>
                <p className="text-green-600 text-[14px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px]">
                  You will save $ {discount.toFixed(2)} on this order
                </p>
                <Link
                  to="/checkout"
                  className="mt-0 block font-montserrat font-medium w-full bg-[#C76F3B] hover:bg-[#A35427] text-white px-6 py-2 no-underline rounded-md text-center transition-colors duration-300 text-[12px] sm:text-[14px] md:text-[14px] lg:text-[16px] xl:text-[16px]">
                  PROCEED TO CHECKOUT
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="bg-white p-6 mt-10 text-center w-full md:w-2/3 lg:w-1/2"
            data-aos="fade-up"
            data-aos-duration="1800">
            <h2
              className="text-lg sm:text-xl md:text-2xl font-semibold mb-2"
              data-aos="fade-down"
              data-aos-duration="1600">
              Your cart is empty!
            </h2>
            <p
              className="text-base sm:text-lg mb-4 text-gray-700"
              data-aos="fade-up"
              data-aos-duration="1600">
              Looks like you have not added anything yet. Start exploring and
              add your favorite books to the cart!
            </p>
            <Link
              to="/publications"
              className="inline-flex items-center gap-2 bg-[#C76F3B] hover:bg-[#A35427] no-underline text-white px-5 py-2 rounded-md text-center font-medium transition-colors duration-300 text-base sm:text-lg">
              CONTINUE SHOPPING
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
