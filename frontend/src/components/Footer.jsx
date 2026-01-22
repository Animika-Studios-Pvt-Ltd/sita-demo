import { Link } from "react-router-dom";
import { useFetchAllBooksQuery } from "../redux/features/books/booksApi";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import PinterestIcon from "@mui/icons-material/Pinterest";
import "./Footer.css";
import { useEffect, useState } from "react";

const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Footer = () => {
  const { data: books = [] } = useFetchAllBooksQuery();
  const activeBooks = books.filter((book) => !book.suspended);
  const sortedBooks = activeBooks.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const recentBooks = sortedBooks.slice(0, 2);

  const [blogs, setBlogs] = useState([]);
  const [footerPages, setFooterPages] = useState([]);
  const [trustCertificates, setTrustCertificates] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/blogs`);
        const data = await res.json();
        const activeBlogs = data.filter(
          (blog) => !blog.suspended && blog.type === "blogs"
        );
        const sortedBlogs = activeBlogs.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const recent = sortedBlogs.slice(0, 2);
        setBlogs(recent);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      }
    };
    fetchBlogs();
  }, []);
  useEffect(() => {
    const fetchFooterPages = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/pages`);
        const data = await res.json();
        const footer = data.filter((p) =>
          p.displayLocations?.includes("footer")
        );
        setFooterPages(footer);
      } catch (err) {
        console.error("Failed to fetch footer pages", err);
      }
    };
    fetchFooterPages();
  }, []);

  useEffect(() => {
    const fetchTrustCertificates = async () => {
      try {
        const res = await fetch(
          `${BACKEND_BASE_URL}/api/trust-certificates/active`
        );
        const data = await res.json();
        setTrustCertificates(data);
      } catch (err) {
        console.error("Failed to fetch trust certificates", err);
      }
    };
    fetchTrustCertificates();
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-6 col-12 footer-section">
            <span className="address">Address</span>
            <p className="company-name">LUMOS</p>
            <p className="mb-3">A Division of Animika Studios</p>
            <p>353, 7th Main Rd,</p>
            <p>HAL 2nd Stage, Indiranagar,</p>
            <p>Bengaluru - 560008</p>
            <p className="mb-3">Karnataka, India.</p>
            <p>Contact: +91-9980806803</p>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6 col-12 footer-section1">
            <ul className="footer-links">
              <span>Links</span>
              <li>
                <Link to="/contact">Contact Me</Link>
              </li>
              <li>
                <Link to="/Anilkumar">About</Link>
              </li>
              <li>
                <Link to="/publications">Publications</Link>
              </li>
              <li>
                <Link to="/foundation">The Foundation</Link>
              </li>
              <li>
                <Link to="/blogs">Blogs</Link>
              </li>
              <li>
                <Link to="/letters">Letters From Langshott</Link>
              </li>
              {footerPages.length > 0 &&
                footerPages
                  .filter((page) => !page.suspended)
                  .map((page) => (
                    <li key={page._id}>
                      <Link to={`/${page.slug}`}>
                        {page.title.toUpperCase()}
                      </Link>
                    </li>
                  ))}
            </ul>

            <div className="privacy-links">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <span> | </span>
              <Link to="/terms-and-conditions">Terms & Conditions</Link>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 col-sm-6 col-12 footer-section2">
            <h4 className="footer-heading">Featured Books</h4>
            {recentBooks.length > 0 ? (
              recentBooks.map((book, index) => (
                <Link
                  to={`/books/${book.slug || book._id}`}
                  key={index}
                  className="featured-book">
                  <img
                    src={book?.coverImage || "/placeholder-book.jpg"}
                    alt={book?.title}
                  />
                  <div>
                    <p>{book?.title}</p>
                    <span>
                      <span style={{ color: "#983120" }}>₹ </span>
                      {book?.newPrice}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p>No featured books available</p>
            )}
          </div>

          <div className="col-lg-3 col-md-6 col-sm-6 col-12 footer-section3">
            <div className="newsletter">
              <p>Subscribe to Newsletter</p>
              <form
                className="newsletter-form"
                onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email" aria-label="Email" />
                <button type="submit">Subscribe</button>
              </form>
            </div>

            <h4 className="footer-heading footer-posts">Recent Blogs</h4>
            <div className="popular-posts">
              {blogs.length > 0 ? (
                blogs.map((blog, index) => (
                  <Link
                    to={`/blogs/${blog.slug || blog._id}`}
                    key={index}
                    className="post">
                    <img
                      src={
                        blog.image?.startsWith("http")
                          ? blog.image
                          : `${BACKEND_BASE_URL}${blog.image}`
                      }
                      alt={blog.title}
                    />
                    <div className="overlay">
                      <p>{blog.title}</p>
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p>No recent blogs available</p>
              )}
            </div>
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-12 footer-social-media-section">
            <div className="social-icons justify-content-center">
              <a
                href="https://x.com/LangshottLF"
                target="_blank"
                rel="noreferrer">
                <TwitterIcon />
              </a>
              <a
                href="https://www.linkedin.com/company/langshott-leadership-foundation/"
                target="_blank"
                rel="noreferrer">
                <LinkedInIcon />
              </a>
              <a
                href="https://www.instagram.com/langshottleadershipfoundation/"
                target="_blank"
                rel="noreferrer">
                <InstagramIcon />
              </a>
              <a
                href="https://www.facebook.com/langshottleadershipfoundation1"
                target="_blank"
                rel="noreferrer">
                <FacebookIcon />
              </a>
              <a
                href="https://in.pinterest.com/langshottleadershipfoundation/"
                target="_blank"
                rel="noreferrer">
                <PinterestIcon />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>
            © 2026 Sita. All Rights
            Reserved.
          </p>

          {trustCertificates.length > 0 && (
            <div className="trust-certificates">
              {trustCertificates.map((cert) => (
                <img
                  key={cert._id}
                  src={cert.imageUrl}
                  alt={cert.name}
                  title={cert.name}
                  className="trust-badge"
                />
              ))}
            </div>
          )}

          <p>
            Powered By:{" "}
            <a
              href="https://lumos.in"
              target="_blank"
              rel="noopener noreferrer">
              LUMOS.in
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
