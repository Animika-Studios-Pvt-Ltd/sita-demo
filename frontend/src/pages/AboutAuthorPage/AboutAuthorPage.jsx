import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import AOS from "aos";
import "aos/dist/aos.css";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import html2canvas from "html2canvas";

const AboutAuthorPage = () => {
  const BACKEND_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://bookstore-backend-hshq.onrender.com";
  const { data: books = [] } = useFetchAllBooksQuery();
  const activeBooks = books;
  const [blogs, setBlogs] = useState([]);

  // Working Creed Images State
  const [workingCreedImages, setWorkingCreedImages] = useState([]);
  const [creedIndex, setCreedIndex] = useState(0);
  const [creedPerView, setCreedPerView] = useState(2);
  const creedContainerRef = useRef(null);
  const cardRefs = useRef([]); // array of DOM nodes to capture

  useEffect(() => {
    AOS.init({
      duration: 1200,
      delay: 100,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setIsMobile(w < 1024);

      if (w < 1024) {
        setCreedPerView(1);
      } else {
        setCreedPerView(2);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/api/blogs`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data
          .filter((b) => !b.suspended && b.type === "blogs")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBlogs(filtered);
      })
      .catch(console.error);
  }, [BACKEND_BASE_URL]);

  const [authorContent, setAuthorContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${BACKEND_BASE_URL}/api/author`)
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(
            `Error fetching author data: ${res.status} ${errorText}`
          );
        }
        return res.json();
      })
      .then((data) => {
        setAuthorContent(data);

        // Load working creed images
        if (data.workingCreed?.images && data.workingCreed.images.length > 0) {
          setWorkingCreedImages(data.workingCreed.images);
        }
      })
      .catch((err) => {
        console.error("Fetch author error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [BACKEND_BASE_URL]);

  // Share handler: expects a DOM node (wrapper) as second arg
  const handleShare = async (key, node) => {
    if (!node) {
      console.error("handleShare: capture node is null");
      alert("Unable to share (internal error).");
      return;
    }

    // hide share button(s) inside node before capture
    const shareBtns = node.querySelectorAll?.(".share-btn");
    shareBtns?.forEach((b) => (b.style.display = "none"));

    try {
      const canvas = await html2canvas(node, {
        useCORS: true,
        backgroundColor: null,
        scale: 2,
      });

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("Canvas toBlob returned null");

      const file = new File([blob], `${key}.png`, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Working Creed",
          text: "Sharing an image from Working Creed.",
        });
      } else {
        // fallback: download
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${key}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        alert("Image downloaded (sharing not supported on this device).");
      }
    } catch (err) {
      console.error("Error while sharing:", err);
      alert("Something went wrong while capturing/sharing the image.");
    } finally {
      // restore share button visibility
      shareBtns?.forEach((b) => (b.style.display = ""));
    }
  };

  if (loading)
    return <p className="mt-4 text-gray-600">Loading author info...</p>;
  if (error)
    return (
      <p className="mt-4 text-red-600 font-semibold">
        Failed to load author info: {error}
      </p>
    );
  if (!authorContent) return null;

  const authorName = authorContent.sectionHeading?.text || "Author";
  const middleImageSrc = authorContent.aboutAuthor?.middleImage?.src;
  const middleImageAlt =
    authorContent.aboutAuthor?.middleImage?.alt || "Author Image";
  const paragraphs =
    authorContent.aboutAuthor?.leftText?.paragraphs?.map((p) => p.text) || [];

  const firstThreeParagraphs = paragraphs.slice(0, 3);
  const remainingParagraphs = paragraphs.slice(3);

  // Create infinite scroll effect for working creed images
  const infiniteCreedImages =
    workingCreedImages.length > 0
      ? [...workingCreedImages, ...workingCreedImages, ...workingCreedImages]
      : [];

  return (
    <div className="container mx-auto px-4 max-w-7xl" data-aos="fade-up">
      <div className="max-w-8xl mx-auto py-0 text-center flex flex-col justify-center items-center px-4 mb-20">
        {/* breadcrumb + author header same as before */}
        <div
          className="breadcrumb-container w-full text-left mb-0 font-figtree font-lite"
          data-aos="fade-right">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb m-0 p-0">
              <li className="breadcrumb-item">
                <a href="/" className="text-gray">
                  Home
                </a>
              </li>
              <li className="breadcrumb-item">
                <a href="/aboutauthorpage" className="!text-gray-600">
                  About Author
                </a>
              </li>
            </ol>
          </nav>
        </div>

        <section
          className="flex flex-col lg:flex-row gap-0 lg:gap-5 items-center w-full"
          data-aos="fade-up">
          <div
            className="flex justify-center lg:justify-start flex-shrink-0 w-full lg:w-1/2 mt-5"
            data-aos="zoom-in">
            <img
              src={middleImageSrc || "/ak-i.webp"}
              onError={(e) => (e.currentTarget.src = "/ak-i.webp")}
              alt={middleImageAlt}
              className="w-full max-w-[420px] sm:max-w-[500px] rounded-lg select-none transition duration-300 md:px-2"
            />
          </div>

          <div
            className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2 md:px-5"
            data-aos="fade-left">
            <div className="relative inline-block" data-aos="fade-up">
              <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black font-display leading-snug mb-4 mt-4">
                {authorName}
              </h1>
              <img
                src="/motif.webp"
                alt="feather"
                className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15] mb-2"
              />
            </div>

            <div className="text-left mt-4 max-w-8x1">
              {firstThreeParagraphs.map((para, idx) => (
                <p
                  key={idx}
                  className={`mb-4 ${idx === 0
                    ? "text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] font-figtree font-regular leading-snug text-gray-800"
                    : "text-[16px] sm:text-[18px] lg:text-[20px] font-Figtree leading-relaxed"
                    } ${idx === 1
                      ? "text-[#c86836] italic font-semibold"
                      : "text-gray-800"
                    }`}
                  data-aos="fade-up"
                  data-aos-delay={100 * idx}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>

        {remainingParagraphs.length > 0 && (
          <section
            className="mt-8 w-full px-0 md:px-0 text-left"
            data-aos="fade-up">
            {remainingParagraphs.map((para, idx) => (
              <p
                key={idx}
                className="text-[16px] sm:text-[18px] lg:text-[20px] text-gray-800 font-Figtree leading-relaxed mb-4"
                data-aos="fade-up"
                data-aos-delay={100 * idx}>
                {para}
              </p>
            ))}
          </section>
        )}

        {/* Working Creed Images Section */}
        {workingCreedImages.length > 0 && (
          <section className="mt-5 sm:mt-4 w-full" data-aos="fade-up">
            <div className="relative inline-block mb-2">
              <h2
                className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-tight mb-4"
                data-aos="zoom-in"
                data-aos-duration="1300">
                Working Creed
              </h2>
              <img
                src="/motif.webp"
                alt="feather"
                className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15] mb-2 pointer-events-none"
              />
            </div>
            <p
              className="text-[18px] sm:text-[20px] md:text-[24px] font-Figtree text-center font-playfair font-regular mb-10 leading-relaxed max-w-[800px] mx-auto"
              data-aos="fade-up"
              data-aos-duration="1300">
              The following words are my statement of beliefs that I seek to
              hold as my constant companion.
            </p>

            <div className="relative w-full overflow-hidden" data-aos="fade-up">
              <div className="relative w-full overflow-hidden px-0 max-[425px]:px-4">
                <div
                  ref={creedContainerRef}
                  className="flex flex-nowrap transition-transform duration-500 ease-in-out"
                  style={{
                    maxWidth: "1600px",
                    margin: "0 auto",
                    transform: `translateX(-${(creedIndex * 100) / creedPerView}%)`,
                    willChange: "transform",
                  }}>
                  {infiniteCreedImages.map((item, i) => {
                    const itemClass = creedPerView === 1 ? "w-full px-1" : "w-1/2 px-4";
                    return (
                      <div
                        key={i}
                        data-aos="fade-up"
                        data-aos-delay={(i % 2) * 150}
                        className={`flex-shrink-0 box-border ${itemClass}`}>
                        {/* IMPORTANT: wrapper node used for html2canvas */}
                        <div
                          ref={(el) => (cardRefs.current[i] = el)}
                          className="creed-card-root relative rounded-xl overflow-hidden bg-white">
                          <img
                            src={item.src}
                            alt={item.alt || "Working Creed"}
                            crossOrigin="anonymous"
                            className="w-full h-[180px] sm:h-[250px] md:h-[340px] object-cover rounded-xl hover:scale-[1.01] transition-all duration-300 mx-auto"
                          />
                          <button
                            onClick={() => handleShare(`creed-${i}`, cardRefs.current[i])}
                            className="share-btn text-[12px] xs:text-[13px] sm:text-[14px] md:text-[15px] px-1 py-1 xs:px-1 xs:py-2 sm:px-1 sm:py-1.5 md:px-1 md:py-2 absolute bottom-3 right-9 !bg-black/50 hover:bg-black/70 text-white px-3 py-1.5 rounded-md flex items-center gap-2 transition">
                            <ShareOutlinedIcon sx={{ fontSize: 18 }} />
                            <span className="text-sm">Share</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                className="mt-6 flex items-center justify-center sm:justify-start gap-4 ms-3 text-black text-base sm:text-lg"
                data-aos="fade-up">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-[#8c2f24] hover:text-white transition"
                  onClick={() => {
                    const total = workingCreedImages.length;
                    setCreedIndex((p) => (p - 1 + total) % total);
                  }}>
                  <FiArrowLeft size={18} />
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-[#8c2f24] hover:text-white transition"
                  onClick={() => {
                    const total = workingCreedImages.length;
                    setCreedIndex((p) => (p + 1) % total);
                  }}>
                  <FiArrowRight size={18} />
                </button>
                <span className="inspiration-board-slide-counter">
                  {String((creedIndex % workingCreedImages.length) + 1).padStart(2, "0")}{" "}
                  / {String(workingCreedImages.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </section>
        )}

        <section className="mt-4" data-aos="fade-up">
          <div className="relative inline-block mb-6" data-aos="zoom-in">
            <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black font-display leading-snug mb-4 mt-4">
              Recent Blogs
            </h1>
            <img
              src="/motif.webp"
              alt="feather"
              className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15] mb-2"
            />
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            data-aos="fade-up">
            {blogs.slice(0, 4).map((blog, idx) => (
              <Link
                key={blog._id}
                to={`/blogs/${blog.slug || blog._id}`}
                className="relative w-full h-full overflow-hidden rounded-xl cursor-pointer group"
                data-aos="zoom-in"
                data-aos-delay={100 * idx}>
                {blog.image && (
                  <img
                    src={
                      blog.image.startsWith("http")
                        ? blog.image
                        : `${BACKEND_BASE_URL}${blog.image}`
                    }
                    alt={blog.title}
                    className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}

                {!isMobile && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 z-10"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.6)";
                      Array.from(e.currentTarget.children).forEach(
                        (child) => (child.style.opacity = "1")
                      );
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(0,0,0,0)";
                      Array.from(e.currentTarget.children).forEach(
                        (child) => (child.style.opacity = "0")
                      );
                    }}>
                    <span
                      className="!text-white !text-lg !font-semibold hover:!text-[#cc6633] !cursor-pointer mb-2 text-center px-2"
                      style={{ opacity: 0, transition: "opacity 0.5s ease" }}>
                      {blog.title}
                    </span>
                    <span className="text-gray-300 text-sm opacity-0 transition-opacity duration-500">
                      {new Date(blog.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}

                {isMobile && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 transition-all duration-500 z-10">
                    <span
                      className="text-white text-lg font-semibold mb-2 text-center px-2"
                      style={{ opacity: 1, transition: "opacity 0.5s ease" }}>
                      {blog.title}
                    </span>
                    <span
                      className="text-gray-300 text-sm text-center"
                      style={{ opacity: 1, transition: "opacity 0.5s ease" }}>
                      {new Date(blog.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>

          <div className="mt-14 flex justify-center" data-aos="fade-up">
            <Link
              to="/blogs"
              className="px-3 py-2 rounded-full bg-[#983120] no-underline text-white font-medium text-base hover:bg-[#7a241b] transition-all duration-300">
              Explore more Blogs
            </Link>
          </div>
        </section>

        <section className="mt-5 sm:mt-4" data-aos="fade-up">
          <div className="relative inline-block" data-aos="zoom-in">
            <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black font-display leading-snug mb-4 mt-4">
              Recent Books
            </h1>
            <img
              src="/motif.webp"
              alt="feather"
              className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto [opacity:0.15] mb-2"
            />
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-3 max-w-8xl mx-auto"
            data-aos="fade-up">
            {activeBooks.slice(0, 4).map((book, idx) => (
              <div
                key={book._id}
                className="rv-card relative group w-full cursor-pointer rounded-xl duration-500"
                data-aos="zoom-in"
                data-aos-delay={100 * idx}>
                <Link
                  to={`/books/${book.slug || book._id}`}
                  className="flex flex-col items-center">
                  <div className="w-full">
                    <img
                      src={book?.coverImage || "/placeholder-book.jpg"}
                      alt={book.title}
                      className="w-[70%] mx-auto mt-6 object-cover transition-transform duration-500"
                    />
                  </div>
                  <h4 className="mt-0 font-Figtree-Regular text-[20px] text-center">
                    {book.title}
                  </h4>
                  {!book.suspended ? (
                    <p>
                      {Number(book.oldPrice) > Number(book.newPrice) && (
                        <span className="old-price">₹ {book.oldPrice}</span>
                      )}{" "}
                      <span className="current-price">₹ {book.newPrice}</span>{" "}
                      {Number(book.oldPrice) > Number(book.newPrice) && (
                        <span className="discount">
                          {Math.round(
                            ((book.oldPrice - book.newPrice) / book.oldPrice) *
                            100
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
            ))}
          </div>

          <div className="mt-10 xl:mb-4 flex justify-center" data-aos="fade-up">
            <Link
              to="/publications"
              className="px-3 py-2 no-underline rounded-full bg-[#983120] text-white font-medium text-base hover:bg-[#7a241b] hover:shadow-lg transition-all duration-300">
              Explore more Books
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutAuthorPage;
