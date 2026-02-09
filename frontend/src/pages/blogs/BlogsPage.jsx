import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react"; // Restored for pagination

import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import "../../assets/herosection.css";
import "../homepage/Homepage.css";

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
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/blogs`);
      const data = await res.json();
      setBlogs(
        data
          .filter((blog) => !blog.suspended)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      );
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    }
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

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
        items={[{ label: "Home", path: "/" }, { label: "Blogs" }]}
      />

      <section className="sita-recent-blogs">
        <div className="container text-center">
          <h2>Blogs By Sita</h2>

          <img src="/sita-motif.webp" alt="Sita Motif" className="motif" />

          <div className="row">
            {currentBlogs.length > 0 ? (
              currentBlogs.map((blog, index) => {
                const btnColors = [
                  "pink",
                  "peach",
                  "rose",
                ];
                const btnColor = btnColors[index % btnColors.length]; // Cycle colors

                return (
                  <div
                    key={blog._id}
                    className="col-lg-4 col-md-4 col-sm-12 col-12 mb-8"
                    data-aos="fade-up"
                    data-aos-delay={(index + 1) * 100}>
                    <div className="sita-blog-card">
                      <div className="sita-blog-image">
                        <img
                          src={
                            blog.image?.startsWith("http")
                              ? blog.image
                              : `${BACKEND_BASE_URL}${blog.image}`
                          }
                          className="img-fluid w-100"
                          alt={blog.title}
                          style={{ height: "250px", objectFit: "cover" }}
                        />
                        <p className="blog-date">
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>

                      <h4>{blog.title}</h4>

                      <div className="blog-description-wrapper">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: sanitizeDescription(
                              blog.description.length > 150
                                ? blog.description.slice(0, 150) + "..."
                                : blog.description,
                            ),
                          }}
                        />
                      </div>

                      <span className="blog-author mb-3">
                        - {blog.author || "Sita Severson"}
                      </span>

                      <Link
                        to={`/blogs/${blog.slug || blog._id}`}
                        className={`sita-blog-btn ${btnColor}`}
                        style={{ minWidth: "150px", display: "inline-flex", justifyContent: "center", alignItems: "center" }}>
                        {blog.readMoreText || "Read More"}
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No blogs found.</p>
            )}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
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
          )}
        </div>
      </section>
    </>
  );
};

export default BlogsPage;

