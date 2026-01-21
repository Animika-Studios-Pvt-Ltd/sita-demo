import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
import { addToCart, clearCart } from "../../redux/features/cart/cartSlice";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import AOS from "aos";
import "aos/dist/aos.css";
import BlockIcon from "@mui/icons-material/Block";

const FeaturedBooks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: books = [] } = useFetchAllBooksQuery();
  const activeBooks = books;
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const scrollContainerRef = useRef(null);
  const infiniteBooks = activeBooks;

  const handleBuyNow = (book) => {
    dispatch(clearCart());
    dispatch(addToCart(book));
    navigate("/checkout");
  };

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 1200,
      easing: "ease-in-out",
    });
    AOS.refresh();
  }, []);

  useEffect(() => {
    const updateView = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      if (width >= 1440) {
        setItemsPerView(4);
      } else if (width >= 1024) {
        setItemsPerView(3);
      } else if (width >= 768) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };
    updateView();
    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, []);

  useEffect(() => {
    if (windowWidth > 1024 && activeBooks.length > 0) {
      setStartIndex(0);
    }
  }, [activeBooks.length, windowWidth]);

  const getScrollAmount = () => {
    if (!scrollContainerRef.current) return 0;
    const container = scrollContainerRef.current;
    const firstBook = container.querySelector("div > div");
    if (!firstBook) return 0;
    return firstBook.offsetWidth;
  };

  const handleNext = () => {
    if (windowWidth > 1024) {
      setStartIndex((prev) => {
        const next = prev + 1;
        if (next > activeBooks.length - itemsPerView) return prev;
        return next;
      });
    } else if (scrollContainerRef.current) {
      const scrollAmount = getScrollAmount();
      const container = scrollContainerRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft < maxScroll - 10) {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const handlePrev = () => {
    if (windowWidth > 1024) {
      setStartIndex((prev) => {
        const next = prev - 1;
        if (next < 0) return prev;
        return next;
      });
    } else if (scrollContainerRef.current) {
      const scrollAmount = getScrollAmount();
      const container = scrollContainerRef.current;
      if (container.scrollLeft > 10) {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="max-w-8xl mx-auto py-2 text-center flex flex-col justify-center items-center px-4">
      <div
        className="relative inline-block"
        data-aos="fade-up"
        data-aos-duration="1200"
        data-aos-delay="1500">
        <h1 className="text-[30px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-snug mb-7 mt-8">
          Featured Books
        </h1>
        <img
          src="/motif.webp"
          alt="feather"
          className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto opacity-15 mb-2"
        />
      </div>

      <div
        className="relative w-full flex items-center mt-8 flex overflow-x-auto scrollbar-hide"
        data-aos="fade-up"
        data-aos-duration="1500">
        <button
          onClick={handlePrev}
          className="absolute left-0 z-10 text-gray-900 opacity-70 hover:opacity-100 transition -translate-y-1/2 translate-x-[-20%] sm:translate-x-[-40%] 2xl:translate-x-[-40%]"
          style={{
            top: windowWidth > 1024 ? "220px" : "40%",
            touchAction: "manipulation",
            transform: windowWidth <= 1024 ? "translateY(-50%)" : undefined,
          }}
          aria-label="Previous books">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={windowWidth > 1024 ? 80 : 40}
            height={windowWidth > 1024 ? 80 : 40}
            viewBox="0 0 22 22"
            stroke="#999999"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div
          ref={scrollContainerRef}
          className={`w-full ${
            windowWidth > 1024
              ? "overflow-hidden"
              : "overflow-x-auto scrollbar-hide"
          } px-0 sm:px-4`}>
          <div
            className={`flex ${
              windowWidth > 1024
                ? "transition-transform duration-500 ease-in-out"
                : ""
            }`}
            style={{
              transform:
                windowWidth > 1024
                  ? `translateX(-${(startIndex * 100) / itemsPerView}%)`
                  : "none",
            }}>
            {infiniteBooks.map((book, index) => {
              const isSuspended = book.suspended;
              const isOutOfStock = book.stock <= 0;

              return (
                <div
                  key={`${book._id}-${index}`}
                  className={`px-2 flex-shrink-0 ${
                    itemsPerView === 4
                      ? "w-1/4"
                      : itemsPerView === 3
                      ? "w-1/3"
                      : itemsPerView === 2
                      ? "w-1/2"
                      : "w-full"
                  }`}
                  data-aos="fade-up"
                  data-aos-duration="800">
                  <div className="group relative bg-white overflow-hidden transition-all duration-500">
                    <Link to={`/books/${book.slug || book._id}`}>
                      <div className="relative w-full aspect-[2/3] max-w-[290px] max-[425px]:max-w-[265px] mx-auto overflow-hidden group">
                        {isSuspended && (
                          <div
                            className="absolute top-3 right-3 bg-[#993333] text-white px-3 py-1 rounded-md text-xs font-semibold z-30 flex items-center gap-1"
                            data-aos="fade-down"
                            data-aos-duration="800"
                            data-aos-delay="300">
                            <BlockIcon fontSize="small" />
                            Out of Stock
                          </div>
                        )}
                        <img
                          src={book?.coverImage || "/placeholder-book.jpg"}
                          className={`object-cover w-full h-full z-0 ${
                            isSuspended ? "opacity-60 grayscale" : ""
                          }`}
                          alt={book?.title}
                          data-aos="zoom-in"
                          data-aos-duration="1500"
                        />
                        {windowWidth > 1024 && (
                          <div
                            className="absolute inset-0 flex items-center justify-center transition-all duration-500 z-10"
                            style={{ backgroundColor: "rgba(0,0,0,0)" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "rgba(0,0,0,0.5)";
                              e.currentTarget.firstChild.style.opacity = "1";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "rgba(0,0,0,0)";
                              e.currentTarget.firstChild.style.opacity = "0";
                            }}>
                            <span
                              className="!text-white !text-lg !font-semibold hover:!text-[#cc6633] !cursor-pointer "
                              style={{
                                opacity: 0,
                                transition: "opacity 0.5s ease",
                              }}>
                              VIEW BOOK
                            </span>
                          </div>
                        )}
                        <div
                          className="book-border absolute inset-5 z-20 pointer-events-none"
                          data-aos="fade-in"
                          data-aos-duration="2200">
                          <span className="top"></span>
                          <span className="right"></span>
                          <span className="bottom"></span>
                          <span className="left"></span>
                        </div>
                      </div>
                    </Link>

                    <div
                      className="text-center mt-1 px-4"
                      data-aos="fade-up"
                      data-aos-duration="400">
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
                      <div
                        className="inline-flex justify-center items-center gap-2 w-full"
                        data-aos="fade-up"
                        data-aos-duration="400">
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
                                  ((book.oldPrice - book.newPrice) /
                                    book.oldPrice) *
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

                      <div className="mt-2 flex justify-center gap-3">
                        {isSuspended ? (
                          <button
                            disabled
                            className="flex-1 flex items-center justify-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-[#993333] text-white rounded cursor-not-allowed min-w-[100px] max-w-[260px] mx-auto">
                            <BlockIcon fontSize="small" />
                            Currently Out of Stock
                          </button>
                        ) : isOutOfStock ? (
                          <button
                            disabled
                            className="flex-1 flex items-center justify-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-gray-400 text-white rounded cursor-not-allowed min-w-[100px] max-w-[260px] mx-auto">
                            <RemoveShoppingCartOutlinedIcon fontSize="small" />
                            Out of Stock
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBuyNow(book)}
                            className="flex-1 flex items-center justify-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-[#993333] text-white rounded hover:bg-[#662222] transition-colors min-w-[100px] max-w-[260px] mx-auto">
                            <ShoppingBagOutlinedIcon fontSize="small" />
                            Order Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="absolute right-0 z-10 text-gray-900 opacity-70 hover:opacity-100 transition -translate-y-1/2 translate-x-[20%] sm:translate-x-[30%] 2xl:translate-x-[30%]"
          style={{
            top: windowWidth > 1024 ? "220px" : "40%",
            touchAction: "manipulation",
            transform: windowWidth <= 1024 ? "translateY(-50%)" : undefined,
          }}
          aria-label="Next books">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={windowWidth > 1024 ? 80 : 40}
            height={windowWidth > 1024 ? 80 : 40}
            viewBox="0 0 22 22"
            stroke="#999999"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FeaturedBooks;
