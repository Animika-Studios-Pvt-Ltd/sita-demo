import { Link } from "react-router-dom";
import { useFetchAllBooksQuery } from "../redux/features/books/booksApi";

import "./Footer.css";
import { useEffect, useState } from "react";

const BACKEND_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const Footer = () => {
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

  return (
    <footer className="sita-site-footer">
      <div className="container">
        {/* FOOTER TOP */}
        <div className="footer-top-flex">
          <div className="footer-col footer-col-factor footer-links">
            <h6 className="footer-title">THE SITA FACTOR</h6>
            <a href="/yoga-therapy">Yoga Therapy</a>
            <a href="/ayurveda-nutrition">Ayurveda – Nutrition & Integration</a>
            <a href="/kosha-counseling">Kosha Counseling</a>
            <a href="/soul-curriculum">Soul Curriculum</a>
            <a href="/release-karmic-patterns">Release Karmic Patterns</a>
          </div>
          <div className="footer-col footer-col-workshops footer-links">
            <h6 className="footer-title">WORKSHOPS</h6>
            <a href="/teacher-training">Teacher Training</a>
            <a href="/corporate-training">Corporate Training</a>
            <a href="/shakthi-leadership">Shakthi Leadership</a>
            <a href="/group-sessions">Group Sessions</a>
            <a href="/private-sessions">Private Sessions</a>
          </div>
          <div className="footer-col footer-col-resources footer-links">
            <h6 className="footer-title">RESOURCES</h6>
            <Link to="/blogs">Blogs</Link>
            <a href="/articles">Articles</a>
            <a href="/podcasts">Podcasts</a>
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
                    return (
                      <div
                        key={book._id || index}
                        className={`publication-slide ${index === activeSlide ? "active" : ""}`}>
                        <Link to={linkPath}>
                          <img
                            src={book.coverImage || "/images/anaya-book.webp"}
                            alt={book.title}
                          />
                        </Link>

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

                return (
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
            <a href="/">
              <img
                src="/sita-logo.webp"
                className="footer-logo"
                alt="Sita Logo"
              />
            </a>
          </div>
          <div className="footer-middle-center">
            <a href="/privacy-policy">Privacy Policy</a>
            <span>|</span>
            <a href="/disclaimer">Disclaimer</a>
          </div>
          <div className="footer-middle-right footer-socials">
            <a href="#">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a
              href="https://sitaseverson.substack.com/"
              target="_blank"
              rel="noopener noreferrer">
              <img src="/substack.png" alt="Substack Icon" />
            </a>
            <a href="https://www.instagram.com/sitapk_1/">
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
