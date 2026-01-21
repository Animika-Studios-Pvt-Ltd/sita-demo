import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, ArrowRight } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
    <div className="container" data-aos="fade-up" data-aos-duration="1000">
      <div className="max-w-8xl mx-auto py-0 text-center flex flex-col justify-center items-center px-4">
        <div
          className="breadcrumb-container w-full text-left mb-0 font-figtree font-light"
          data-aos="fade-right"
          data-aos-duration="1200">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb m-0 p-0 flex gap-0 text-sm">
              <li className="breadcrumb-item">
                <a href="/" className="text-gray-500 hover:underline">
                  Home
                </a>
              </li>
              {/* <li className="breadcrumb-item">
                <a href="/blogs" className="text-gray-500 hover:underline">
                  Blogs
                </a>
              </li> */}
              <li className="breadcrumb-item">
                <a
                  href="/blogs"
                  className="!text-gray-700 hover:underline breadcrumb-item truncate max-w-[120px] sm:max-w-[200px] md:max-w-full">
                  Blogs
                </a>
              </li>
            </ol>
          </nav>
        </div>

        <div
          className="relative inline-block w-full text-center mb-4"
          data-aos="zoom-in"
          data-aos-duration="1300">
          <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black font-display leading-snug mb-1 mt-5 relative">
            <span className="relative inline-block">
              Blogs By Anil Kumar
              <img
                src="/motif.webp"
                alt="feather"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 sm:w-24 md:w-32 lg:w-32 h-auto opacity-15 pointer-events-none z-0"
              />
            </span>
          </h1>
        </div>

        <div
          className="max-w-8xl mx-auto min-h-screen mt-0"
          data-aos="fade-up"
          data-aos-duration="1200">
          {blogs.length === 0 ? (
            <p className="text-center text-gray-500">No blogs found.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-6">
                {currentBlogs.map((blog, index) => (
                  <div
                    key={blog._id}
                    data-aos="fade-up"
                    data-aos-delay={index * 120}
                    data-aos-duration="1300"
                    className="group bg-white rounded-[10px] border-[2px] hover:shadow-[0_2px_5px_rgba(0,0,0,0.12)] transition duration-500 overflow-hidden hover:-translate-y-2 flex flex-col">
                    {blog.image && (
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={
                            blog.image.startsWith("http")
                              ? blog.image
                              : `${BACKEND_BASE_URL}${blog.image}`
                          }
                          alt={blog.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    )}

                    <div className="p-4 text-left flex flex-col flex-grow">
                      <p className="text-[18px] sm:text-[20px] md:text-[20px] lg:text-[22px] xl:text-[22px] font-Figtree font-medium leading-snug">
                        {blog.title}
                      </p>

                      <p className="flex items-center gap-2 text-gray-400 text-lg mt-1 mb-2">
                        <CalendarDays className="w-5 h-5" />
                        {new Date(blog.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>

                      <div
                        className="text-[15px] sm:text-[17px] md:text-[17px] lg:text-[18px] xl:text-[18px] text-black-800 font-Figtree font-regular leading-snug mt-0 mb-2 px-1 sm:px-1"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeDescription(
                            blog.description.length > 160
                              ? blog.description.slice(0, 160) + "..."
                              : blog.description
                          ),
                        }}
                      />

                      <div className="mt-auto">
                        <Link
                          to={`/blogs/${blog.slug || blog._id}`}
                          className="flex items-center gap-2 mx-auto font-figtree text-[16px] sm:text-[18px] transition group no-underline">
                          <span className="inline-flex font-regular items-center gap-1 text-[#993333] text-[16px] sm:text-[18px] no-underline">
                            Read More
                          </span>
                          <span className="text-[#993333] transform transition-transform duration-200 group-hover:translate-x-[5px]">
                            <ArrowRight size={20} strokeWidth={2} />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
