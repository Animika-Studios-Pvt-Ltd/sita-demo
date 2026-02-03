import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSubdomain, getAppUrl } from "../../utils/subdomain";
import { CalendarDays, ArrowRight, ArrowLeft } from "lucide-react";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import "../../assets/herosection.css";

const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const sanitizeDescription = (html) => {
  return html
    .replace(/class="ql-align-[^"]*"/g, "")
    .replace(/style="[^"]*"/g, "");
};

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const { data: books = [] } = useFetchAllBooksQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 3;
  const activeBooks = books.filter((book) => !book.suspended);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  useEffect(() => {
    if (books.length === 0) return;
    const interval = setInterval(() => handleNext(), 4000);
    return () => clearInterval(interval);
  }, [books]);

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === 0 ? activeBooks.length - 1 : prev - 1
      );
      setFade(true);
    }, 300);
  };

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBooks.length);
      setFade(true);
    }, 300);
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_BASE_URL}/api/blogs/${id}`);
        const data = await res.json();
        if (data.suspended) {
          setBlog(null);
        } else {
          setBlog(data);
        }
      } catch (err) {
        console.error("Failed to fetch blog", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchLatestBlogs = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/blogs`);
        const data = await res.json();
        const sorted = data
          .filter((b) => b._id !== id && !b.suspended)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLatestBlogs(sorted);
      } catch (err) {
        console.error("Failed to fetch latest blogs", err);
      }
    };

    fetchBlog();
    fetchLatestBlogs();
  }, [id]);

  if (loading)
    return (
      <p className="text-center mt-10 animate-pulse text-gray-500">
        Loading blog details...
      </p>
    );

  if (!blog)
    return (
      <p className="text-center mt-10 text-gray-600">
        Blog not found.
      </p>
    );

  const totalPages = Math.ceil(latestBlogs.length / blogsPerPage);
  const indexOfLast = currentPage * blogsPerPage;
  const indexOfFirst = indexOfLast - blogsPerPage;
  const currentBlogs = latestBlogs.slice(indexOfFirst, indexOfLast);

  return (
    <>


      <section className="blog-details-inner-hero">
        <div className="blog-details-inner-hero-bg"></div>
        <div className="blog-details-inner-hero-image">
          <img
            src={
              blog.image?.startsWith("http")
                ? blog.image
                : `${BACKEND_BASE_URL}${blog.image}`
            }
            alt={blog.title}
            className="blog-details-inner-hero-image"
          />
        </div>
      </section>

      <SitaBreadcrumb
        items={[
          { label: "Home", path: "https://sitashakti.com" },
          {
            label: "Blogs",
            path: getSubdomain() === "blog" ? "/" : getAppUrl("blog", "/"),
          },
          { label: blog.title },
        ]}
      />

      <div className="container" data-aos="fade-up" data-aos-duration="1000">
        <div className="max-w-8xl mx-auto py-0 text-center flex flex-col justify-center items-center px-4">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1
              className="font-serifSita text-[#8b171b] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-tight text-center"
              data-aos="zoom-in"
              data-aos-duration="1300">
              {blog.title}
            </h1>
            <img
              src="/sita-motif.webp"
              alt="Sita Motif"
              className="mx-auto mt-1 w-40 sm:w-48 mb-8"
            />
          </div>

          <div
            className="max-w-8xl mx-auto px-0 py-6 grid gap-10 lg:grid-cols-1 xl:grid-cols-4"
            data-aos="fade-up"
            data-aos-duration="1200">
            <div className="col-span-1 xl:col-span-3">
              <p className="flex items-center gap-2 text-gray-400 text-md font-regular mt-0 mb-2">
                <CalendarDays className="w-5 h-5" />
                {new Date(blog.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div
                className="text-left max-w-none text-gray-800 text-[15px] sm:text-[17px] md:text-[17px] lg:text-[18px] xl:text-[18px] font-Figtree leading-snug whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: sanitizeDescription(blog.description),
                }}
              />
            </div>

            {window.innerWidth >= 1280 && (
              <aside
                className="col-span-1"
                data-aos="fade-left"
                data-aos-duration="1300">
                <div className="bg-[#f3e7db] border-1 border-gray-500 rounded-[6px] p-4 max-h-[700px] min-h-[540px] flex flex-col">
                  <h3 className="text-[20px] sm:text-[24px] md:text-[28px] font-Figtree font-medium text-gray-900 font-[400] mb-4">
                    Featured Books
                  </h3>
                  {activeBooks.length > 0 && (
                    <div className="flex flex-col items-center text-center rounded-lg overflow-hidden relative flex-grow">
                      <div className={`flex flex-col items-center absolute transition-all duration-700 ease-in-out transform will-change-transform ${fade ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
                        {getSubdomain() === 'store' ? (
                          <>
                            <Link to={`/books/${activeBooks[currentIndex]?.slug || activeBooks[currentIndex]?._id}`} className="no-underline">
                              <img
                                src={activeBooks[currentIndex]?.coverImage || "/placeholder-book.jpg"}
                                alt={activeBooks[currentIndex]?.title}
                                className="w-40 h-58 object-cover mb-4 cursor-pointer hover:scale-105 transition-transform duration-500"
                              />
                            </Link>
                            <Link to={`/books/${activeBooks[currentIndex]?.slug || activeBooks[currentIndex]?._id}`} className="no-underline">
                              <h4 className="text-[16px] sm:text-[18px] md:text-[20px] text-black font-Figtree mb-3 hover:text-[#993333] transition-colors duration-300 cursor-pointer">
                                {activeBooks[currentIndex]?.title}
                              </h4>
                            </Link>
                          </>
                        ) : (
                          <>
                            <a href={getAppUrl('store', `/books/${activeBooks[currentIndex]?.slug || activeBooks[currentIndex]?._id}`)} className="no-underline">
                              <img
                                src={activeBooks[currentIndex]?.coverImage || "/placeholder-book.jpg"}
                                alt={activeBooks[currentIndex]?.title}
                                className="w-40 h-58 object-cover mb-4 cursor-pointer hover:scale-105 transition-transform duration-500"
                              />
                            </a>
                            <a href={getAppUrl('store', `/books/${activeBooks[currentIndex]?.slug || activeBooks[currentIndex]?._id}`)} className="no-underline">
                              <h4 className="text-[16px] sm:text-[18px] md:text-[20px] text-black font-Figtree mb-3 hover:text-[#993333] transition-colors duration-300 cursor-pointer">
                                {activeBooks[currentIndex]?.title}
                              </h4>
                            </a>
                          </>
                        )}
                      </div>

                      <div className="flex items-center justify-center gap-6 mt-auto relative z-10">
                        <button
                          onClick={handlePrev}
                          className="w-8 h-8 flex items-center justify-center border border-black rounded-full group hover:bg-gray-100">
                          <ArrowLeft
                            size={20}
                            strokeWidth={2}
                            className="text-black transition-colors duration-300 group-hover:text-red-500"
                          />
                        </button>
                        <button
                          onClick={handleNext}
                          className="w-8 h-8 flex items-center justify-center border border-black rounded-full group hover:bg-gray-100">
                          <ArrowRight
                            size={20}
                            strokeWidth={2}
                            className="text-black transition-colors duration-300 group-hover:text-red-500"
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </aside>
            )}
          </div>
          <div
            className="max-w-8xl mx-auto py-0"
            data-aos="fade-up"
            data-aos-duration="1200">

            {/* HEADER */}
            <div className="" data-aos="fade-up"
              data-aos-duration="1200">
              <h2
                className="font-serifSita text-[#8b171b] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-tight text-center">
                Latest Blogs
              </h2>
              <img
                src="/sita-motif.webp"
                alt="Sita Motif"
                className="mx-auto mt-1 w-40 sm:w-48 mb-8"
              />
            </div>

            {/* BLOG GRID */}
            <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentBlogs.map((blog, index) => {
                const btnColors = [
                  "bg-[#d86c87]",
                  "bg-[#e29a7a]",
                  "bg-[#c36c6c]",
                ];

                return (
                  <div
                    key={blog._id}
                    data-aos="fade-up"
                    data-aos-delay={(index + 1) * 100}
                    className="
                            flex flex-col
                            text-center
                            aspect-[2/1]
                            border-b
                            border-[#8b171b]
                          "
                  >
                    {/* IMAGE */}
                    <div className="relative w-full aspect-[1.25/1] overflow-hidden mb-3">
                      <img
                        src={
                          blog.image?.startsWith("http")
                            ? blog.image
                            : `${BACKEND_BASE_URL}${blog.image}`
                        }
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />

                      {/* DATE */}
                      <p
                        className="
                                absolute
                                -bottom-4
                                left-1/2
                                -translate-x-1/2
                                bg-white
                                px-3
                                py-1
                                text-[16px]
                                rounded-t-md
                                shadow
                                font-montserratLight
                              "
                      >
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    {/* CONTENT */}
                    <div className="flex flex-col flex-grow px-1">
                      <h4
                        className="
                                font-montserratLight
                                text-[20px]
                                mb-1
                                text-black
                                leading-snug
                              "
                      >
                        {blog.title}
                      </h4>

                      <p
                        className="
                                font-montserratLight
                                text-[16px]
                                text-black
                                leading-snug
                                h-[70px]
                                overflow-hidden
                              "
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: sanitizeDescription(
                              blog.description.length > 200
                                ? blog.description.slice(0, 200) + "..."
                                : blog.description
                            ),
                          }}
                        />
                      </p>
                    </div>

                    {/* AUTHOR */}
                    <span
                      className="
                              font-montserratLight
                              text-[14px]
                              italic
                              mt-2
                              mb-2
                            "
                    >
                      – {blog.author || "Sita Severson"}
                    </span>

                    {/* CTA */}
                    <Link
                      to={`/blogs/${blog.slug || blog._id}`}
                      className={`
                              font-montserratLight
                              ${btnColors[index % btnColors.length]}
                              text-white
                              px-4
                              py-2
                              text-[16px]
                              mx-auto
                              [clip-path:polygon(10%_0%,90%_0%,100%_50%,90%_100%,10%_100%,0%_50%)]
                              transition
                              hover:opacity-90
                              no-underline
                              mb-3
                            `}
                    >
                      {blog.readMoreText || "Get insights"}
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center items-center gap-2 sm:gap-3 mt-10 mb-20 flex-wrap"
              data-aos="fade-up"
              data-aos-duration="1200"
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center border border-black rounded-full disabled:opacity-30 hover:bg-gray-100 transition"
              >
                <ArrowLeft size={20} strokeWidth={2} />
              </button>

              {currentPage > 3 && (
                <span className="text-gray-400 select-none">...</span>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((num) => {
                  if (currentPage <= 2) {
                    return num <= 3;
                  } else if (currentPage >= totalPages - 1) {
                    return num >= totalPages - 2;
                  } else {
                    return (
                      num === currentPage - 1 ||
                      num === currentPage ||
                      num === currentPage + 1
                    );
                  }
                })
                .map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm sm:text-base transition
          ${currentPage === num
                        ? "bg-[#993333] text-white"
                        : "border border-transparent text-black hover:border-black hover:bg-gray-100"
                      }`}
                  >
                    {num}
                  </button>
                ))}

              {currentPage < totalPages - 2 && (
                <span className="text-gray-400 select-none">...</span>
              )}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center border border-black rounded-full disabled:opacity-30 hover:bg-gray-100 transition"
              >
                <ArrowRight size={20} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetailPage;
