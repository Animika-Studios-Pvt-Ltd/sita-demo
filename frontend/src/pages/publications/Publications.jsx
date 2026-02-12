import { useEffect } from "react";
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
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import "../../assets/herosection.css";
import { getSecureImageUrl } from "../../utils/imageUtils";

const Publications = () => {
  const { data: books = [] } = useFetchAllBooksQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const allBooks = books;

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: false,
      mirror: true,
      offset: 120,
      debounceDelay: 50,
    });

    setTimeout(() => AOS.refreshHard(), 400);
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
    <>
      <section className="sita-inner-hero">
        <div className="sita-hero-inner-bg" data-aos="fade-in"></div>
        <div className="sita-inner-hero-image">
          <div
            className="sita-inner-hero-image-banner"
            data-aos="zoom-out"
            data-aos-duration="1500">
            <img src="/about-banner.webp" alt="About Banner" />
          </div>
        </div>
      </section>
      <SitaBreadcrumb
        items={[{ label: "Home", path: "/" }, { label: "Publications" }]}
      />
      <div className="container" data-aos="fade-up" data-aos-duration="1000">
        <div className="max-w-8xl mx-auto py-0 text-center flex flex-col justify-center items-center px-4 mb-20">
          <div className="" data-aos="zoom-in" data-aos-duration="1000">
            <h2 className="font-serifSita text-[#8b171b] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-tight text-center">
              Publications
            </h2>
            <img
              src="/sita-motif.webp"
              alt="Sita Motif"
              className="mx-auto mb-8 motif"
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
                  className="group relative bg-white mb-0 overflow-hidden transition-all duration-500"
                  data-aos="flip-left"
                  data-aos-duration="2000"
                  data-aos-delay={index * 150}>
                  <Link to={`/books/${book.slug || book._id}`}>
                    <div
                      className="relative w-full aspect-[2/3] max-w-[280px] mx-auto overflow-hidden group book-flip"
                      style={{ perspective: "1200px" }}>
                      <div className="book-flip-inner">
                        <div
                          className={`book-flip-front ${isSuspended ? "opacity-60 grayscale" : ""
                            }`}>
                          <img
                            src={getSecureImageUrl(book?.coverImage) || "/placeholder-book.jpg"}
                            alt={book?.title}
                            className="w-full h-full"
                          />
                        </div>
                        <div className="book-flip-back">
                          <img
                            src={
                              getSecureImageUrl(book?.backImage) ||
                              getSecureImageUrl(book?.coverImage) ||
                              "/default-back.webp"
                            }
                            alt={`${book?.title || "Book"} back cover`}
                            className="book-flip-back-image"
                          />
                          <span className="book-flip-label">VIEW BOOK</span>
                        </div>
                      </div>

                      {isSuspended && (
                        <div className="absolute top-3 right-3 bg-[#993333] text-white px-3 py-1 rounded-md text-xs font-semibold z-30 flex items-center gap-1">
                          <BlockIcon fontSize="small" />
                          Out of Stock
                        </div>
                      )}
                    </div>
                  </Link>
                  <div
                    className="text-center mt-0 px-0"
                    data-aos="fade-up"
                    data-aos-duration="1000">
                    <h3
                      className="text-lg md:text-lg font-medium text-gray-700 mb-2 font-montserrat break-words"
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
                          <span className="text-gray-500 line-through text-base sm:text-lg md:text-lg lg:text-xl font-montserrat font-light">
                            ${book?.oldPrice}
                          </span>
                        )}

                        <span className="text-[#993333] font-montserrat font-light text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold">
                          ${book?.newPrice}
                        </span>

                        {book?.oldPrice > book?.newPrice && (
                          <span className="text-sm sm:text-base md:text-lg lg:text-xl bg-[#993333] text-white px-1 py-0.5 font-montserrat font-light rounded-sm">
                            {Math.round(
                              ((book.oldPrice - book.newPrice) /
                                book.oldPrice) *
                              100,
                            )}
                            % off
                          </span>
                        )}
                      </div>
                    )}

                    {isSuspended && (
                      <div className="mb-3 py-1">
                        <span className="text-[#993333] font-montserrat font-medium text-base">
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
                            className="flex-1 flex font-montserrat font-medium items-center justify-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-[#C76F3B] text-white rounded hover:bg-[#A35427] transition-colors min-w-[100px]">
                            <StorefrontOutlinedIcon fontSize="small" />
                            Go to Cart
                          </button>
                          <button
                            onClick={() => handleBuyNow(book)}
                            className="flex-1 flex font-montserrat font-medium items-center justify-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-[#993333] text-white rounded hover:bg-[#662222] transition-colors min-w-[100px]">
                            <ShoppingBagOutlinedIcon fontSize="small" />
                            Buy Now
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleAddToCart(book)}
                            className="flex-1 flex font-montserrat font-medium items-center justify-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-[#C76F3B] text-white rounded hover:bg-[#A35427] transition-colors min-w-[100px]">
                            <ShoppingCartOutlinedIcon fontSize="small" />
                            Add to Cart
                          </button>
                          <button
                            onClick={() => handleBuyNow(book)}
                            className="flex-1 flex font-montserrat font-medium items-center justify-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-[#993333] text-white rounded hover:bg-[#662222] transition-colors min-w-[100px]">
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
    </>
  );
};

export default Publications;
