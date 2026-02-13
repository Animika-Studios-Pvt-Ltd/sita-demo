import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import "../../assets/herosection.css";
import "../homepage/Homepage.css";

import { getSecureImageUrl } from "../../utils/imageUtils";

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
      duration: 1000,
      easing: "ease-out-cubic",
      once: false,
      mirror: true,
      offset: 120,
      debounceDelay: 50,
    });

    setTimeout(() => AOS.refreshHard(), 400);
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (blogs?.length) {
      setTimeout(() => AOS.refreshHard(), 200);
    }
  }, [blogs]);

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
        items={[{ label: "Home", path: "/" }, { label: "Blogs" }]}
      />
      {/* ---------------- BLOGS SECTION ---------------- */}
      <section className="sita-recent-blogs">
        <div className="container text-center">
          <h2 data-aos="fade-up">Blogs By Sita</h2>
          <img
            src="sita-motif.webp"
            alt="Sita Motif"
            className="motif"
            data-aos="fade-up"
            data-aos-delay="200"
          />
          <div className="row">
            {currentBlogs.length > 0 ? (
              currentBlogs.map((blog, index) => {
                const btnColors = ["pink", "peach", "rose"];
                const btnColor = btnColors[index % btnColors.length]; // Cycle colors
                return (
                  <div
                    key={blog._id}
                    className="col-lg-4 col-md-4 col-sm-12 col-12 pb-5"
                    data-aos="fade-up"
                    data-aos-delay={(index + 1) * 100}>
                    <div className="sita-blog-card">
                      <div className="sita-blog-image">
                        <img
                          src={getSecureImageUrl(blog.image)}
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
                        style={{
                          minWidth: "150px",
                          display: "inline-flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
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
        </div>
      </section>
    </>
  );
};

export default BlogsPage;
