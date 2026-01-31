import { useEffect } from "react";
import { getAppUrl } from "../../utils/subdomain";
import { Link, useNavigate } from "react-router-dom";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, clearCart } from "../../redux/features/cart/cartSlice";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import BlockIcon from "@mui/icons-material/Block";
import AOS from "aos";
import "aos/dist/aos.css";

const Publications = () => {
  const { data: books = [] } = useFetchAllBooksQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const allBooks = books;

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);

  const handleAddToCart = (book) => {
    if (book.suspended) {
      alert("This book is currently unavailable");
      return;
    }
    if (book.stock <= 0) {
      alert("Out of Stock");
      return;
    }
    const exists = cartItems.find((item) => item._id === book._id);
    if (exists) {
      navigate("/cart");
      return;
    }
    dispatch(addToCart(book));
  };

  const handleBuyNow = (book) => {
    if (book.suspended) {
      alert("This book is currently unavailable");
      return;
    }
    if (book.stock <= 0) {
      alert("Out of Stock");
      return;
    }
    const exists = cartItems.find((item) => item._id === book._id);
    if (exists) {
      navigate("/cart");
      return;
    }
    dispatch(clearCart());
    dispatch(addToCart(book));
    navigate("/checkout");
  };

  return (
    <div className="container" data-aos="fade-up" data-aos-duration="1000">
      <div className="max-w-8xl mx-auto py-0 text-center flex flex-col justify-center items-center px-4 mb-20">
         <div
          className="breadcrumb-container w-full text-left font-figtree font-light">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mt-0 mb-2 p-0">
              <li className="breadcrumb-item">
                <a href="https://sitashakti.com" className="text-gray-500 text-[16px] hover:underline">
                  Home
                </a>
              </li>
              <li className="breadcrumb-item">
                <a
                  href="/"
                  className="!text-gray-700 hover:underline breadcrumb-item text-[16px] truncate max-w-[120px] sm:max-w-[200px] md:max-w-full">
                  Publications
                </a>
              </li>
            </ol>
          </nav>
        </div>

        <div
          className=""
          data-aos="zoom-in"
          data-aos-duration="1000">
          <h2
            className="font-serifSita text-[#8b171b] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-tight text-center">
            Publications
          </h2>
          <img
            src="/sita-motif.webp"
            alt="Sita Motif"
            className="mx-auto mt-1 w-40 sm:w-48 mb-8"
          />
        </div>

        <div
          className="grid w-full mt-0 gap-5 sm:gap-6 md:gap-8 lg:gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4"
          data-aos="fade-up"
          data-aos-duration="1000">
          {allBooks.map((book, index) => {
            const inCart = cartItems.find((item) => item._id === book._id);
            const isSuspended = book.suspended;
            const isOutOfStock = book.stock <= 0;

            return (
              <div
                key={index}
                className="group relative bg-white mb-2 overflow-hidden transition-all duration-500"
                data-aos="flip-left"
                data-aos-duration="2000"
                data-aos-delay={index * 150}>
                <Link to={`/books/${book.slug || book._id}`}>
                  <div className="relative w-full aspect-[2/3] max-w-[280px] mx-auto overflow-hidden group">
                    <img
                      src={book?.coverImage || "/placeholder-book.jpg"}
                      alt={book?.title}
                      className={`object-cover w-full h-full z-0 ${isSuspended ? "opacity-60 grayscale" : ""
                        }`}
                    />

                    {isSuspended && (
                      <div className="absolute top-3 right-3 bg-[#993333] text-white px-3 py-1 rounded-md text-xs font-semibold z-30 flex items-center gap-1">
                        <BlockIcon fontSize="small" />
                        Out of Stock
                      </div>
                    )}

                    <div
                      className="absolute inset-0 flex items-center justify-center transition-all duration-500 z-10"
                      style={{
                        backgroundColor: "rgba(0,0,0,0)",
                        transition: "background-color 0.5s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(0,0,0,0.5)";
                        e.currentTarget.firstChild.style.opacity = "1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(0,0,0,0)";
                        e.currentTarget.firstChild.style.opacity = "0";
                      }}>
                      <span
                        className="!text-white !text-lg !font-semibold hover:!text-[#cc6633] !cursor-pointer"
                        style={{ opacity: 0, transition: "opacity 0.5s ease" }}>
                        VIEW BOOK
                      </span>
                    </div>

                    <div className="book-border absolute inset-5 z-20 pointer-events-none">
                      <span className="top"></span>
                      <span className="right"></span>
                      <span className="bottom"></span>
                      <span className="left"></span>
                    </div>
                  </div>
                </Link>
                <div
                  className="text-center mt-2 px-0"
                  data-aos="fade-up"
                  data-aos-duration="1000">
                  <h3
                    className="text-lg md:text-lg font-medium text-gray-700 mb-2 font-figtree break-words"
                    style={{
                      height: "3rem",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }}>
                    {book?.title}
                  </h3>

                  {!isSuspended && (
                    <div className="inline-flex justify-center items-center gap-2 w-full flex-wrap md:flex-nowrap mb-3">
                      {book?.oldPrice > book?.newPrice && (
                        <span className="text-gray-500 line-through text-base sm:text-lg md:text-lg lg:text-xl font-figtree font-light">
                          ₹{book?.oldPrice}
                        </span>
                      )}

                      <span className="text-[#993333] font-figtree font-light text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold">
                        ₹{book?.newPrice}
                      </span>

                      {book?.oldPrice > book?.newPrice && (
                        <span className="text-sm sm:text-base md:text-lg lg:text-xl bg-[#993333] text-white px-1 py-0.5 font-figtree font-light rounded-sm">
                          {Math.round(
                            ((book.oldPrice - book.newPrice) / book.oldPrice) *
                            100
                          )}
                          % off
                        </span>
                      )}
                    </div>
                  )}

                  {isSuspended && (
                    <div className="mb-3 py-1">
                      <span className="text-[#993333] font-figtree font-medium text-base">
                        Currently Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                <div
                  className="text-center mt-0 px-1"
                  data-aos="fade-up"
                  data-aos-duration="1000">
                  <div className="flex justify-center gap-2 mt-1 px-0 flex-nowrap">
                    {isSuspended ? (
                      <button
                        className="flex w-full items-center justify-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-[#993333] text-white rounded cursor-not-allowed"
                        disabled>
                        <BlockIcon fontSize="small" />
                        Currently Out of Stock
                      </button>
                    ) : isOutOfStock ? (
                      <button
                        className="flex w-full items-center justify-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-gray-400 text-white rounded"
                        disabled>
                        <RemoveShoppingCartOutlinedIcon fontSize="small" />
                        Out of Stock
                      </button>
                    ) : inCart ? (
                      <>
                        <button
                          onClick={() => navigate("/cart")}
                          className="flex-1 flex items-center justify-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-[#C76F3B] text-white rounded hover:bg-[#A35427] transition-colors min-w-[100px]">
                          <StorefrontOutlinedIcon fontSize="small" />
                          Go to Cart
                        </button>
                        <button
                          onClick={() => handleBuyNow(book)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-[#993333] text-white rounded hover:bg-[#662222] transition-colors min-w-[100px]">
                          <ShoppingBagOutlinedIcon fontSize="small" />
                          Buy Now
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAddToCart(book)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-[#C76F3B] text-white rounded hover:bg-[#A35427] transition-colors min-w-[100px]">
                          <ShoppingCartOutlinedIcon fontSize="small" />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleBuyNow(book)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-[#993333] text-white rounded hover:bg-[#662222] transition-colors min-w-[100px]">
                          <ShoppingBagOutlinedIcon fontSize="small" />
                          Buy Now
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Publications;
