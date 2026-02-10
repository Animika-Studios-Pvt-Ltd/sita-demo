import "./SingleBook.css";
import { useState, useEffect } from "react";

import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, clearCart } from "../../redux/features/cart/cartSlice";
import {
  useFetchBookBySlugQuery,
  useFetchBookByIdQuery,
  useFetchAllBooksQuery,
} from "../../redux/features/books/booksApi";
import { useAuth } from "../../context/AuthContext";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import BlockIcon from "@mui/icons-material/Block";
import Swal from "sweetalert2";
import nlp from "compromise";
import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import getBaseUrl from "../../utils/baseURL";
import "../../assets/herosection.css";

const SingleBook = () => {
  const { slug, id } = useParams();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [showMore, setShowMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(2);

  const {
    data: bookBySlug,
    isLoading: slugLoading,
    error: slugError,
  } = useFetchBookBySlugQuery(slug ?? "", { skip: !slug });

  const { data: booksData } = useFetchAllBooksQuery();

  const latestBooks =
    booksData?.books?.length > 0
      ? [...booksData.books]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4)
      : booksData?.length > 0
        ? [...booksData]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 4)
        : [];
  const {
    data: bookById,
    isLoading: idLoading,
    error: idError,
  } = useFetchBookByIdQuery(id ?? "", { skip: !!slug });

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

  const book = bookBySlug || bookById;
  const isLoading = slugLoading || idLoading;
  const isError = slugError || idError;

  const WORD_LIMIT = 100;
  const words = book?.description?.split(" ") || [];
  const shortText = words.slice(0, WORD_LIMIT).join(" ");
  const longText = words.slice(WORD_LIMIT).join(" ");
  const isSuspended = book?.suspended === true;
  const isOutOfStock = book?.stock <= 0;

  // Determine discount presence (safe numeric compare)
  const hasDiscount =
    typeof book?.oldPrice !== "undefined" &&
    typeof book?.newPrice !== "undefined" &&
    Number(book.oldPrice) > Number(book.newPrice);

  useEffect(() => {
    if (book?._id) {
      let viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
      viewed = viewed.filter((b) => b._id !== book._id);
      viewed.unshift(book);
      viewed = viewed.slice(0, 5);
      localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
    }
  }, [book]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    const filtered = stored.filter((b) => b._id !== book?._id);
    setRecentlyViewed(filtered.slice(0, 4));
  }, [book]);

  useEffect(() => {
    if (book?.coverImage) {
      setSelectedImage(book.coverImage);
    }
  }, [book]);

  useEffect(() => {
    if (book?.reviews && currentUser) {
      const userReview = book.reviews.find(
        (rev) =>
          rev.userId === currentUser.uid || rev.userId === currentUser.sub,
      );
      if (userReview) {
        setRating(userReview.rating);
        setComment(userReview.comment);
      } else {
        setRating(0);
        setComment("");
      }
    }
  }, [book, currentUser]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading book data</p>;
  if (!book) return <p>Book not found</p>;

  const validateReview = (text) => {
    if (!text || text.trim().length < 10) return "Your review is too short.";
    const reviewWords = text.trim().split(/\s+/);
    const wordCount = reviewWords.length;
    if (wordCount < 5) return "Your review must have at least 5 words.";
    if (wordCount > 100) return "Your review cannot exceed 100 words.";
    const uniqueWords = new Set(reviewWords.map((w) => w.toLowerCase()));
    if (uniqueWords.size / wordCount < 0.5)
      return "Your review is too repetitive.";
    const alphabeticRatio =
      (text.replace(/[^a-zA-Z\s]/g, "").length / text.length) * 100;
    if (alphabeticRatio < 70)
      return "Your review must contain mostly real words.";
    const doc = nlp(text);
    const nouns = doc.nouns().out("array").length;
    const verbs = doc.verbs().out("array").length;
    if (nouns === 0) return "Your review must include at least one noun.";
    if (verbs === 0) return "Your review must include at least one verb.";
    return true;
  };

  const handleAddToCart = (product) => {
    if (product.suspended) {
      Swal.fire({
        icon: "warning",
        title: "Currently Out of Stock",
        text: "This book is currently out of stock for purchase.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (product.stock <= 0) {
      alert("Out of Stock");
      return;
    }
    const exists = cartItems.find((item) => item._id === product._id);
    if (exists) {
      navigate("/cart");
      return;
    }
    dispatch(addToCart(product));
  };

  const handleBuyNow = (product) => {
    if (product.suspended) {
      Swal.fire({
        icon: "warning",
        title: "Currently Out of Stock",
        text: "This book is currently out of stock for purchase.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (product.stock <= 0) {
      alert("Out of Stock");
      return;
    }
    const exists = cartItems.find((item) => item._id === product._id);
    if (exists) {
      navigate("/cart");
      return;
    }
    dispatch(clearCart());
    dispatch(addToCart(product));
    navigate("/checkout");
  };

  const BASE_URL = getBaseUrl();

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete!",
        text: "Please provide both rating and comment.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    const reviewCheck = validateReview(comment);
    if (reviewCheck !== true) {
      Swal.fire({
        icon: "error",
        title: "Invalid Review",
        text: reviewCheck,
        timer: 2500,
        showConfirmButton: false,
      });
      return;
    }
    if (!currentUser) {
      Swal.fire({
        icon: "error",
        title: "Not logged in",
        text: "You must be logged in to submit a review.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/reviews/${book._id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book._id,
          userId: currentUser?.uid || currentUser?.sub,
          userName:
            currentUser?.displayName ||
            currentUser?.name ||
            currentUser?.email ||
            "Anonymous User",
          userEmail: currentUser?.email,
          rating,
          comment,
          approved: false,
        }),
      });

      if (res.ok) {
        setIsEditingReview(false);
        setRating(0);
        setComment("");
        Swal.fire({
          icon: "success",
          title: "Thank you!",
          text: "Your review has been submitted and is pending admin approval.",
          timer: 2500,
          showConfirmButton: false,
        });
      } else {
        const err = await res.json();
        console.error("Failed to submit review:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to submit your review. Try again later.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Try again later.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const avgRating =
    book?.reviews?.length > 0
      ? book.reviews.reduce((acc, r) => acc + r.rating, 0) / book.reviews.length
      : 0;

  const safeReviews = Array.isArray(book?.reviews) ? book.reviews : [];
  const approvedReviews = safeReviews.filter((rev) => rev.approved === true);
  const currentUserReview = safeReviews.find(
    (rev) =>
      rev.userId === currentUser?.uid ||
      rev.userId === currentUser?.sub ||
      rev.userEmail === currentUser?.email,
  );

  const otherReviews = approvedReviews
    .filter((rev) => rev.userId !== currentUser?.uid)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const inCart = cartItems.find((item) => item._id === book._id);

  return (
    <>
      <section className="sita-inner-hero blogs-hero">
        <div className="sita-hero-inner-bg"></div>
        <div className="sita-inner-hero-image">
          <img
            src="/about-banner.webp"
            alt="Blogs Banner"
            className="sita-inner-hero-img"
          />
        </div>
      </section>
      <SitaBreadcrumb
        items={[{ label: "Home", path: "/" }, { label: "Publications" }]}
      />
      <div className="container" data-aos="fade-up" data-aos-duration="1000">
        {isSuspended && (
          <div
            className="alert alert-warning d-flex align-items-center mb-4"
            role="alert"
            data-aos="fade-down"
            data-aos-duration="1000"
            style={{
              backgroundColor: "#fff3cd",
              borderLeft: "4px solid #dc3545",
              padding: "1rem",
              borderRadius: "8px",
            }}>
            <BlockIcon style={{ marginRight: "10px", color: "#dc3545" }} />
            <div>
              <strong>Currently Out of Stock</strong>
              <p className="mb-0">
                This book is temporarily out of stock for purchase. Please check
                back later.
              </p>
            </div>
          </div>
        )}

        <div
          className="row book-section"
          data-aos="fade-up"
          data-aos-duration="1800">
          <div
            className="col-lg-4 col-md-12 col-sm-12 col-12"
            data-aos="flip-left"
            data-aos-duration="3000">
            <div className="col-lg-12 col-md-8 col-sm-8 col-10 book-images">
              <div className="book-image">
                <div className="book-preview-images">
                  {book.coverImage && (
                    <div>
                      <img
                        src={book.coverImage || "/placeholder-book.jpg"}
                        alt="Front View"
                        className={`thumb-img ${
                          isSuspended ? "opacity-60 grayscale" : ""
                        }`}
                        onClick={() => setSelectedImage(book.coverImage)}
                      />
                    </div>
                  )}
                  {book.backImage && (
                    <div>
                      <img
                        src={book.backImage || "/placeholder-book.jpg"}
                        alt="Back View"
                        className={`thumb-img ${
                          isSuspended ? "opacity-60 grayscale" : ""
                        }`}
                        onClick={() => setSelectedImage(book.backImage)}
                      />
                    </div>
                  )}
                </div>
                <div
                  className="book-main-image"
                  data-aos="zoom-in-up"
                  data-aos-duration="1500"
                  style={{ position: "relative" }}>
                  {selectedImage && (
                    <img
                      src={selectedImage}
                      alt={book.title}
                      className={isSuspended ? "opacity-60 grayscale" : ""}
                    />
                  )}
                  {isSuspended && (
                    <div
                      style={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        backgroundColor: "#993333",
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        fontWeight: "600",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        zIndex: 10,
                      }}>
                      <BlockIcon fontSize="small" />
                      Out of Stock
                    </div>
                  )}
                </div>
                {/* <div
                className="book-buttons"
                data-aos="fade-up"
                data-aos-duration="1500"
                data-aos-delay="300">
                <button
                  className="preview-book"
                  onClick={() => navigate(`/books/preview/${book.slug}`)}>
                  <MenuBookOutlinedIcon fontSize="small" /> Preview Book
                </button>
              </div> */}
              </div>

              <div
                className="book-buttons"
                data-aos="fade-up"
                data-aos-duration="1500"
                data-aos-delay="300">
                {isSuspended ? (
                  <button
                    className="out-of-stock"
                    style={{
                      backgroundColor: "#993333",
                      cursor: "not-allowed",
                    }}
                    disabled>
                    <BlockIcon fontSize="small" />
                    Currently Out of Stock
                  </button>
                ) : isOutOfStock ? (
                  <button className="out-of-stock" disabled>
                    <RemoveShoppingCartOutlinedIcon fontSize="small" />
                    Out of Stock
                  </button>
                ) : inCart ? (
                  <>
                    <button
                      className="add-to-cart"
                      onClick={() => navigate("/cart")}>
                      <StorefrontOutlinedIcon fontSize="small" /> Go to Cart
                    </button>
                    <button
                      className="buy-now"
                      onClick={() => handleBuyNow(book)}>
                      <ShoppingBagOutlinedIcon fontSize="small" /> Buy Now
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="add-to-cart"
                      onClick={() => handleAddToCart(book)}>
                      <ShoppingCartOutlinedIcon fontSize="small" /> Add to Cart
                    </button>
                    <button
                      className="buy-now"
                      onClick={() => handleBuyNow(book)}>
                      <ShoppingBagOutlinedIcon fontSize="small" /> Buy Now
                    </button>
                  </>
                )}
              </div>
            </div>

            {book.aboutBook && (
              <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                <div
                  className="about-book"
                  data-aos="fade-right"
                  data-aos-duration="1500"
                  data-aos-delay="200">
                  <h4>About The Book</h4>
                  <p>{book.aboutBook}</p>
                  <p className="author-sign">
                    Thank you for being,
                    <br />
                    {book.author}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div
            className="col-lg-8 col-md-12 col-sm-12 col-12 book-details"
            data-aos="fade-left"
            data-aos-duration="1800"
            data-aos-delay="100">
            <h2 data-aos="fade-up" data-aos-duration="1500">
              {book.title}
            </h2>

            <div
              className="rating-share-row"
              data-aos="zoom-in"
              data-aos-duration="1500"
              data-aos-delay="200">
              <div className="book-rating">
                {Array.from({ length: 5 }, (_, i) => {
                  if (i < Math.floor(avgRating))
                    return <StarIcon key={i} className="star filled" />;
                  else if (i < avgRating)
                    return <StarHalfIcon key={i} className="star half" />;
                  else return <StarBorderIcon key={i} className="star empty" />;
                })}
                <span className="rating-text">
                  ({avgRating.toFixed(1)} / 5 from {book?.reviews?.length || 0}{" "}
                  reviews)
                </span>
              </div>
              <div
                className="share"
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="250">
                <button
                  className="share-btn"
                  onClick={() => {
                    const currentPageUrl = window.location.href;
                    if (navigator.share) {
                      navigator
                        .share({
                          title: book.title,
                          text: `Check out this book: ${book.title}`,
                          url: currentPageUrl,
                        })
                        .catch((error) =>
                          console.error("Error sharing content:", error),
                        );
                    } else {
                      navigator.clipboard.writeText(currentPageUrl);
                      Swal.fire({
                        icon: "info",
                        title: "Link copied!",
                        text: "Share this link with your friends.",
                        timer: 2000,
                        showConfirmButton: false,
                      });
                    }
                  }}>
                  <ShareOutlinedIcon className="share-icon" />
                  Share
                </button>
              </div>
            </div>

            {/* ---------- PRICE DISPLAY (updated) ---------- */}
            {!isSuspended && (
              <div
                className="price"
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="300">
                {hasDiscount && (
                  <span className="old-price">₹ {book.oldPrice}</span>
                )}

                <span className="current-price">₹ {book.newPrice}</span>

                {hasDiscount && (
                  <span className="discount">
                    {Math.round(
                      ((book.oldPrice - book.newPrice) / book.oldPrice) * 100,
                    )}
                    % off
                  </span>
                )}
              </div>
            )}

            {isSuspended && (
              <div
                className="price"
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="300"
                style={{
                  color: "#993333",
                  fontWeight: "600",
                  fontSize: "1.2rem",
                }}>
                Currently Out of Stock
              </div>
            )}
            {/* ---------- END PRICE DISPLAY ---------- */}

            <p
              className="book-desc"
              data-aos="fade-up"
              data-aos-duration="1200"
              data-aos-delay="350">
              {shortText}
              {showMore && <span className="extra-text"> {longText}</span>}
              <br />
              {words.length > WORD_LIMIT && (
                <span
                  className="read-more"
                  onClick={() => setShowMore(!showMore)}>
                  {showMore ? (
                    <>
                      <KeyboardArrowUpIcon /> Read less
                    </>
                  ) : (
                    <>
                      <KeyboardArrowDownIcon /> Read more
                    </>
                  )}
                </span>
              )}
            </p>

            <div
              className="book-meta"
              data-aos="flip-up"
              data-aos-duration="3000"
              data-aos-delay="400">
              <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-4 col-4 label">
                  Author
                </div>
                <div className="col-lg-9 col-md-8 col-sm-8 col-8 value">
                  {book.author}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-4 col-4 label">
                  Specifications
                </div>
                <div className="col-lg-9 col-md-8 col-sm-8 col-8 value">
                  <p>Language: {book.language}</p>
                  <p>Binding: {book.binding}</p>
                  <p>Publisher: {book.publisher}</p>
                  <p>ISBN: {book.isbn}</p>
                  <p>
                    Publishing Date:{" "}
                    {new Date(book.publishingDate).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p>Pages: {book.pages}</p>
                </div>
              </div>
            </div>

            <div
              className="review-section"
              data-aos="fade-up"
              data-aos-duration="1500"
              data-aos-delay="450">
              <h3>Leave a Review</h3>

              {currentUserReview && !isEditingReview && (
                <div className="review user-review" data-aos="fade-up">
                  <div className="review-rating">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={
                          i < currentUserReview.rating ? "star filled" : "star"
                        }>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="review-comment">{currentUserReview.comment}</p>
                  <button
                    onClick={() => {
                      setIsEditingReview(true);
                      setRating(currentUserReview.rating);
                      setComment(currentUserReview.comment);
                    }}>
                    Edit Review
                  </button>
                  <div style={{ marginTop: "8px" }}>
                    {!currentUserReview.approved && (
                      <small style={{ color: "orange" }}>
                        (Your review is awaiting approval)
                      </small>
                    )}
                  </div>
                </div>
              )}

              {(isEditingReview || !currentUserReview) && currentUser && (
                <form onSubmit={handleReviewSubmit} data-aos="fade-up">
                  <div className="rating-input">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        onClick={() => setRating(i + 1)}
                        className={i < rating ? "star selected" : "star"}>
                        ★
                      </span>
                    ))}
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review..."></textarea>
                  <div className="review-buttons">
                    <button type="submit" className="me-3">
                      {currentUserReview ? "Update Review" : "Submit Review"}
                    </button>
                    {isEditingReview && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingReview(false);
                          if (currentUserReview) {
                            setRating(currentUserReview.rating);
                            setComment(currentUserReview.comment);
                          } else {
                            setRating(0);
                            setComment("");
                          }
                        }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}

              <div
                className="recent-reviews"
                data-aos="zoom-in-up"
                data-aos-duration="1500"
                data-aos-delay="500">
                <h4>Recent Reviews</h4>
                {otherReviews && otherReviews.length > 0 ? (
                  <>
                    {otherReviews.slice(0, visibleReviews).map((rev, idx) => (
                      <div
                        key={idx}
                        className="review"
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay={idx * 150}>
                        <div className="review-rating">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span
                              key={i}
                              className={
                                i < rev.rating ? "star filled" : "star"
                              }>
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="review-comment">{rev.comment}</p>
                        <small>- {rev.userName}</small>
                      </div>
                    ))}
                    {visibleReviews < otherReviews.length && (
                      <div style={{ textAlign: "left", marginTop: "8px" }}>
                        <button
                          className="read-more-btn"
                          onClick={() => setVisibleReviews((prev) => prev + 5)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#993333",
                            fontSize: "18px",
                            fontFamily: "Figtree-Regular",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            cursor: "pointer",
                            padding: 0,
                          }}>
                          Show More Reviews{" "}
                          <KeyboardArrowRightIcon
                            fontSize="medium"
                            style={{ verticalAlign: "middle" }}
                          />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p>No reviews yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className="recently-viewed"
          data-aos="fade-up"
          data-aos-duration="1500"
          data-aos-delay="200">
          <h3>Latest Books</h3>
          <div className="row">
            {latestBooks.length > 0 ? (
              latestBooks.map((book, idx) => {
                const bookHasDiscount =
                  typeof book?.oldPrice !== "undefined" &&
                  typeof book?.newPrice !== "undefined" &&
                  Number(book.oldPrice) > Number(book.newPrice);

                return (
                  <div
                    className="col-lg-3 col-md-6 col-sm-6 col-12"
                    key={book._id}
                    data-aos="zoom-in"
                    data-aos-duration="1200"
                    data-aos-delay={idx * 150}>
                    <div className="rv-card">
                      <Link to={`/books/${book.slug || book._id}`}>
                        <div style={{ position: "relative" }}>
                          <img
                            src={book.coverImage || "/placeholder-book.jpg"}
                            alt={book.title}
                            className={book.suspended ? "" : ""}
                          />
                        </div>
                        <h4>{book.title}</h4>
                        {!book.suspended ? (
                          <p>
                            {bookHasDiscount && (
                              <span className="old-price">
                                ₹ {book.oldPrice}
                              </span>
                            )}{" "}
                            <span className="current-price">
                              ₹ {book.newPrice}
                            </span>{" "}
                            {bookHasDiscount && (
                              <span className="discount">
                                {Math.round(
                                  ((book.oldPrice - book.newPrice) /
                                    book.oldPrice) *
                                    100,
                                )}
                                % off
                              </span>
                            )}
                          </p>
                        ) : (
                          <p style={{ color: "#993333", fontWeight: "600" }}>
                            Currently Out of Stock
                          </p>
                        )}
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No latest books found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleBook;
