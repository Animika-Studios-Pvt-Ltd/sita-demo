import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAppUrl } from "../../utils/subdomain";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const BACKEND_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const sanitizeDescription = (html) => {
  return html
    .replace(/class="ql-align-[^"]*"/g, "")
    .replace(/style="[^"]*"/g, "");
};

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/blogs`);
      const data = await res.json();
      setBlogs(
        data
          .filter((blog) => !blog.suspended)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  return (
    <div className="container" data-aos="fade-up">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* BREADCRUMB */}
        <div
          className="breadcrumb-container w-full text-left font-figtree font-light">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mt-0 mb-2 p-0">
              <li className="breadcrumb-item">
                <a href={getAppUrl(null, '/')} className="text-gray-500 text-[16px] hover:underline">
                  Home
                </a>
              </li>
              <li className="breadcrumb-item">
                <a
                  href="/"
                  className="!text-gray-700 hover:underline breadcrumb-item text-[16px] truncate max-w-[120px] sm:max-w-[200px] md:max-w-full">
                  Events
                </a>
              </li>
            </ol>
          </nav>
        </div>
        {/* HEADER */}
        <h2
          className="font-serifSita text-[#8b171b] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-tight text-center">
          BLOGS BY SITA
        </h2>
        <img
          src="/sita-motif.webp"
          alt="Sita Motif"
          className="mx-auto mt-1 w-40 sm:w-48 mb-8"
        />

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

        {/* PAGINATION */}
        <div
          className="flex justify-center items-center gap-2 sm:gap-2 lg:gap-3 mt-10 mb-20 flex-wrap"
          data-aos="fade-up"
          data-aos-duration="1500">
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center border border-black rounded-full disabled:opacity-30 hover:bg-gray-100 transition">
            <ArrowLeft size={18} strokeWidth={2} />
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
                  }`}>
                {num}
              </button>
            ))}

          {currentPage < totalPages - 2 && (
            <span className="text-gray-400 select-none">...</span>
          )}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center border border-black rounded-full disabled:opacity-30 hover:bg-gray-100 transition">
            <ArrowRight size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
