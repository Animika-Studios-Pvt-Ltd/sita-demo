import { Link } from "react-router-dom";
import { useFetchAllBooksQuery } from "../redux/features/books/booksApi";

import "./Footer.css";
import { useEffect, useState, useRef } from "react";
import { getSubdomain, getAppUrl } from "../utils/subdomain";

const BACKEND_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const Footer = () => {
  const currentSubdomain = getSubdomain();
  const isStore = currentSubdomain === "store";
  const isBlog = currentSubdomain === "blog";

  const { data: books = [] } = useFetchAllBooksQuery();
  const activeBooks = books.filter((book) => !book.suspended);
  const sortedBooks = activeBooks.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  const recentBooks = sortedBooks.slice(0, 5);

  const [blogs, setBlogs] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/blogs`);
        const data = await res.json();
        const activeBlogs = data.filter(
          (blog) => !blog.suspended && blog.type === "blogs",
        );
        const sortedBlogs = activeBlogs.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        const recent = sortedBlogs.slice(0, 2);
        setBlogs(recent);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      }
    };
    fetchBlogs();
  }, []);

  // Carousel Auto-Play Logic
  useEffect(() => {
    if (recentBooks.length <= 1) return;

    const interval = setInterval(() => {
      if (!isHovered) {
        setActiveSlide((prev) => (prev + 1) % recentBooks.length);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [recentBooks.length, isHovered]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const prevSlide = () => {
    setActiveSlide(
      (prev) => (prev - 1 + recentBooks.length) % recentBooks.length,
    );
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % recentBooks.length);
  };

  return (
    <footer className="sita-site-footer">
      <div className="container">
        {/* FOOTER TOP */}
        <div className="footer-top-flex">
          <div className="footer-col footer-col-factor footer-links">
            <h6 className="footer-title">THE SITA FACTOR</h6>
            <a href="https://sitashakti.com/yoga-therapy.html">
              Yoga Therapy
            </a>
            <a href="https://sitashakti.com/ayurveda-nutrition.html">
              Ayurveda – Nutrition & Integration
            </a>
            <a href="https://sitashakti.com/kosha-counseling.html">
              Kosha Counseling
            </a>
            <a href="https://sitashakti.com/soul-curriculum.html">
              Soul Curriculum
            </a>
            <a href="https://sitashakti.com/release-karmic-patterns.html">
              Release Karmic Patterns
            </a>
          </div>
          <div className="footer-col footer-col-workshops footer-links">
            <h6 className="footer-title">WORKSHOPS</h6>
            <a href="https://sitashakti.com/teacher-training.html">
              Teacher Training
            </a>
            <a href="https://sitashakti.com/corporate-training.html">
              Corporate Training
            </a>
            <a href="https://sitashakti.com/shakthi-leadership.html">
              Shakthi Leadership
            </a>
            <a href="https://sitashakti.com/group-sessions.html">
              Group Sessions
            </a>
            <a href="https://sitashakti.com/private-sessions.html">
              Private Sessions
            </a>
          </div>
          <div className="footer-col footer-col-resources footer-links">
            <h6 className="footer-title">RESOURCES</h6>
            {isBlog ? (
              <Link to="/blogs">Blogs</Link>
            ) : (
              <a href={getAppUrl("blog", "/blogs")}>Blogs</a>
            )}
            <a href="https://sitashakti.com/articles.html">Articles</a>
            <a href="https://sitashakti.com/podcasts.html">Podcasts</a>
          </div>
          <div className="footer-col footer-col-publications footer-publication">
            <h6 className="footer-title">PUBLICATIONS</h6>
            <div
              className="publication-carousel"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
              <div className="publication-slides">
                {recentBooks.length > 0 ? (
                  recentBooks.map((book, index) => {
                    const linkPath = `/books/${book.slug || book._id}`;
                    const destination = isStore
                      ? linkPath
                      : getAppUrl("store", linkPath);

                    return (
                      <div
                        key={book._id || index}
                        className={`publication-slide ${index === activeSlide ? "active" : ""}`}>
                        {isStore ? (
                          <Link to={linkPath}>
                            <img
                              src={book.coverImage || "/images/anaya-book.webp"}
                              alt={book.title}
                            />
                          </Link>
                        ) : (
                          <a href={destination}>
                            <img
                              src={book.coverImage || "/images/anaya-book.webp"}
                              alt={book.title}
                            />
                          </a>
                        )}

                        <p>
                          <strong>{book.title}</strong>
                          <br />
                          <span>{book.subtitle || "Book"}</span>
                          <br />${book.newPrice}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="publication-slide active">
                    <p>No publications available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="footer-col footer-col-blogs footer-blogs">
            <h6 className="footer-title">RECENT BLOGS</h6>
            {blogs.length > 0 ? (
              blogs.map((blog, index) => {
                const linkPath = `/blogs/${blog.slug || blog._id}`;
                const destination = isBlog
                  ? linkPath
                  : getAppUrl("blog", linkPath);

                return isBlog ? (
                  <Link
                    to={linkPath}
                    key={blog._id || index}
                    className="blog-item"
                    style={{ textDecoration: "none" }}>
                    <img
                      src={
                        blog.image?.startsWith("http")
                          ? blog.image
                          : `${BACKEND_BASE_URL}${blog.image}`
                      }
                      alt={blog.title}
                    />
                    <div className="blog-overlay">
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                      <p>{blog.title.substring(0, 15)}...</p>
                    </div>
                  </Link>
                ) : (
                  <a
                    href={destination}
                    key={blog._id || index}
                    className="blog-item"
                    style={{ textDecoration: "none" }}>
                    <img
                      src={
                        blog.image?.startsWith("http")
                          ? blog.image
                          : `${BACKEND_BASE_URL}${blog.image}`
                      }
                      alt={blog.title}
                    />
                    <div className="blog-overlay">
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                      <p>{blog.title.substring(0, 15)}...</p>
                    </div>
                  </a>
                );
              })
            ) : (
              <p>No recent blogs</p>
            )}
          </div>
        </div>
        {/* FOOTER MIDDLE */}
        <div className="footer-middle-flex">
          <div className="footer-middle-left">
            <a href="https://sitashakti.com">
              <img
                src="/sita-logo.webp"
                className="footer-logo"
                alt="Sita Logo"
              />
            </a>
          </div>
          <div className="footer-middle-center">
            <a href="https://sitashakti.com/privacy-policy.html">Privacy Policy</a>
            <span>|</span>
            <a href="https://sitashakti.com/disclaimer.html">Disclaimer</a>
          </div>
          <div className="footer-middle-right footer-socials">
            <a href="#">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>
      {/* FOOTER BOTTOM */}
      <div className="footer-bottom">
        <div className="container footer-bottom-flex">
          <p>Copyright © 2026 Sita. All Rights Reserved.</p>
          <p>
            Powered By:
            <a href="https://lumos.in/" target="_blank" rel="noreferrer">
              LUMOS.in
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
