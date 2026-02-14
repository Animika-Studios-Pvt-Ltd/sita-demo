import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Homepage.css";
import WorkShopCalendar from "../workshop calendar/WorkShopCalendar";
import Testimonials from "../testimonials/Testimonials";

import { getSecureImageUrl } from "../../utils/imageUtils";

const BACKEND_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const sanitizeDescription = (html) => {
  return html
    .replace(/class="ql-align-[^"]*"/g, "")
    .replace(/style="[^"]*"/g, "");
};

const heroSlides = [
  {
    image: "sita-banner.webp",
    title: "SITA GUIDES",
    subtitle: "Spiritual Mentor, Author, Healer.",
    buttonText: "Explore Sita",
    link: "/about",
  },
];

const HomePage = () => {
  const [currentBlogs, setCurrentBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/blogs`);
      const data = await res.json();
      const sorted = data
        .filter((blog) => !blog.suspended)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3); // Get only the latest 3
      setCurrentBlogs(sorted);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchBooks();
  }, []);

  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/books/user`);
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("Failed to fetch books", err);
    }
  };

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

  /* Animations and Transitions */
  useEffect(() => {
    const decorEls = document.querySelectorAll(".sita-decor");
    if (!decorEls.length) return;

    let current = [];
    let target = [];
    let time = 0;
    let rafId;

    decorEls.forEach((_, i) => {
      current[i] = 0;
      target[i] = 0;
    });

    const lerp = (a, b, n) => (1 - n) * a + n * b;

    const updateTargets = () => {
      const viewportCenter = window.innerHeight / 2;

      decorEls.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const distance = elCenter - viewportCenter;

        const strength = i === 0 ? 0.1 : 0.2;
        target[i] = -distance * strength;
      });
    };

    const animate = () => {
      time += 0.03;

      decorEls.forEach((el, i) => {
        current[i] = lerp(current[i], target[i], 0.08);
        const float = Math.sin(time + i) * 20;
        el.style.transform = `translateY(${current[i] + float}px)`;
      });

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", updateTargets, { passive: true });
    window.addEventListener("resize", updateTargets);

    updateTargets();
    animate();

    return () => {
      window.removeEventListener("scroll", updateTargets);
      window.removeEventListener("resize", updateTargets);
      cancelAnimationFrame(rafId);
    };
  }, []);

  /* Hero Section Carousel */
  useEffect(() => {
    const heroCarouselEl = document.getElementById("heroCarousel");
    if (!heroCarouselEl) return;

    // Initialize carousel only if more than one slide
    if (heroSlides.length > 1) {
      const heroCarousel = new Carousel(heroCarouselEl, {
        interval: 6000,
        ride: "carousel",
        pause: false,
        wrap: true,
        touch: true,
      });

      const refreshAOS = () => AOS.refresh();
      heroCarouselEl.addEventListener("slid.bs.carousel", refreshAOS);

      return () => {
        heroCarousel.dispose();
        heroCarouselEl.removeEventListener("slid.bs.carousel", refreshAOS);
      };
    }
  }, []);

  /* Sita Versus */
  useEffect(() => {
    const carouselEl = document.getElementById("sitaVersesCarousel");
    if (!carouselEl) return;

    const carousel = new Carousel(carouselEl, {
      interval: 9000,
      ride: "carousel",
      pause: false,
      wrap: true,
    });

    return () => {
      carousel.dispose();
    };
  }, []);

  /* Publications Carousel */
  useEffect(() => {
    const pubCarouselEl = document.getElementById("publicationsCarousel");
    if (!pubCarouselEl) return;

    const pubCarousel = new Carousel(pubCarouselEl, {
      interval: 5000,
      ride: "carousel",
      pause: false,
      wrap: true,
      touch: true,
    });

    return () => {
      pubCarousel.dispose();
    };
  }, []);

  return (
    <>
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="sita-hero">
        <div className="sita-hero-bg"></div>

        <div
          id="heroCarousel"
          className="carousel slide"
          data-bs-ride="carousel">
          <div className="carousel-inner">
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}>
                {/* Hero Image */}
                <div className="sita-hero-image">
                  <div
                    className="sita-hero-image-inner"
                    data-aos="fade-right"
                    data-aos-duration="1200"
                    data-aos-delay="200">
                    <img src={slide.image} alt={slide.title || "Hero banner"} />
                  </div>
                </div>

                {/* Hero Content */}
                <div className="container">
                  <div className="row">
                    <div
                      className="col-lg-6 col-md-6 col-sm-6 col-6 offset-6 sita-hero-content"
                      data-aos="fade-left"
                      data-aos-duration="1200"
                      data-aos-delay="400">
                      <h1>{slide.title}</h1>
                      <p>{slide.subtitle}</p>
                      <Link to={slide.link} className="sita-btn">
                        {slide.buttonText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ---------------- ABOUT SECTION ---------------- */}
      <section className="sita-about">
        <div className="container">
          <div className="row">
            <div
              className="col-lg-3 col-md-12 col-sm-12 col-12 text-center"
              data-aos="fade-right"
              data-aos-delay="150">
              <h2>Sita</h2>
              <img src="sita-motif.webp" alt="Sita Motif" className="motif" />
            </div>
            <div
              className="col-lg-9 col-md-12 col-sm-12 col-12"
              data-aos="fade-left"
              data-aos-delay="300"
              data-aos-duration="1000">
              <p>
                A guide for the modern spiritual seeker, Sita Severson blends
                ancient Vedic wisdom with contemporary insight. Rooted in
                timeless wisdom and refined practice, Sita Severson offers a
                seamless, evolved approach to spiritual mentorship. Her
                repertoire includes crafting bespoke pathways for spiritual
                evolution, conscious self-development, and inner mastery.
                Through teacher training programs, private mentorship, and
                intimate group journeys, she creates transformative frameworks
                that support conscious awakening and soul-aligned living.
              </p>
              <a href="/about" className="sita-btn">
                Her Journey
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* ---------------- THE SITA FACTOR SECTION ---------------- */}
      <section className="sita-factor-section">
        <img
          src="lotus.webp"
          alt=""
          className="sita-decor decor-lotus"
          aria-hidden="true"
        />
        {/* <img
          src="s.webp"
          alt=""
          className="sita-decor decor-s"
          aria-hidden="true"
        /> */}
        <div
          className="container text-center sita-factor-content"
          data-aos="fade-up"
          data-aos-duration="1100"
          data-aos-delay="150">
          <h2>The Sita Factor</h2>
          <img
            src="sita-motif.webp"
            alt="Sita Motif"
            className="motif"
            data-aos="fade-up"
            data-aos-delay="200"
          />
          <p className="sita-factor-heading">
            A Conscious Path to Spiritual Evolution
          </p>
          <p className="sita-factor-text">
            Sita engenders inner transformation with illuminating guidance for
            spiritual development, holistic healing, and inner alignment. Rooted
            in Vedic wisdom and refined through lived practice, Sita Severson
            offers deeply personalized mentorship, advanced teacher trainings,
            and curated group journeys for conscious awakening.
          </p>
          <p className="sita-factor-highlight">
            Spiritual Counselor · Vedic & Ayurvedic Practitioner · Healer ·
            Author
          </p>
        </div>
        <div className="container sita-factor-services">
          <div className="row g-0 justify-content-center">
            <div
              className="sita-service-col"
              data-aos="zoom-in"
              data-aos-delay="200">
              <a href="/study-with-sita" className="sita-service-card study">
                <img
                  src="study-with-sita.webp"
                  alt="Study with Sita"
                  className="sita-service-img"
                />
                <span>
                  Study with Sita
                  <i className="fas fa-chevron-right"></i>
                </span>
              </a>
            </div>
            <div
              className="sita-service-col"
              data-aos="zoom-in"
              data-aos-delay="350">
              <a
                href="/consult-sita"
                className="sita-service-card consult active">
                <img
                  src="consult-sita.webp"
                  alt="Consult with Sita"
                  className="sita-service-img"
                />
                <span>
                  Consult Sita
                  <i className="fas fa-chevron-right"></i>
                </span>
              </a>
            </div>
            <div
              className="sita-service-col"
              data-aos="zoom-in"
              data-aos-delay="500">
              <a href="/engage-sita" className="sita-service-card engage">
                <img
                  src="engage-sita.webp"
                  alt="Engage with Sita"
                  className="sita-service-img"
                />
                <span>
                  Engage Sita
                  <i className="fas fa-chevron-right"></i>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* ---------------- MASTERCLASS SECTION ---------------- */}
      <section className="sita-masterclass">
        <div className="container text-center">
          <h2 data-aos="fade-up" data-aos-duration="900" data-aos-delay="100">
            Masterclass
          </h2>
          <img
            src="sita-motif.webp"
            alt="Sita Motif"
            className="motif"
            data-aos="fade-up"
            data-aos-delay="200"
          />
          <p className="sita-masterclass-text">
            Sita Severson is devoted to empowering individuals on the path of
            self-development—supporting lives of balance, vitality, and
            well-being, and guiding them toward the fulfillment of their life’s
            true purpose. Her work is grounded in deep expertise across the many
            dimensions of personal and spiritual transformation.
          </p>
          <div className="row">
            <div
              className="col-lg-4 col-md-4 col-sm-12 col-12"
              data-aos="fade-up"
              data-aos-delay="250">
              <div className="masterclass-card">
                <img
                  src="masterclass-1.webp"
                  className="img-fluid"
                  alt="Yoga Therapy"
                />
                <div className="masterclass-content">
                  <h4>Yoga Therapy</h4>
                  <a href="/yoga-therapy" className="masterclass-card-btn pink">
                    Start Your Practice
                  </a>
                </div>
              </div>
            </div>
            <div
              className="col-lg-4 col-md-4 col-sm-12 col-12"
              data-aos="fade-up"
              data-aos-delay="400">
              <div className="masterclass-card">
                <img
                  src="masterclass-2.webp"
                  className="img-fluid"
                  alt="Soul Curriculum"
                />
                <div className="masterclass-content">
                  <h4>Soul Curriculum</h4>
                  <a
                    href="/soul-curriculum"
                    className="masterclass-card-btn peach">
                    Step Into Awareness
                  </a>
                </div>
              </div>
            </div>
            <div
              className="col-lg-4 col-md-4 col-sm-12 col-12"
              data-aos="fade-up"
              data-aos-delay="550">
              <div className="masterclass-card">
                <img
                  src="masterclass-3.webp"
                  className="img-fluid"
                  alt="Ayurveda"
                />
                <div className="masterclass-content">
                  <h4>Kosha Counselling</h4>
                  <a
                    href="/kosha-counselling"
                    className="masterclass-card-btn rose">
                    Explore Inner Layers
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ---------------- WORKSHOP CALENDAR SECTION ---------------- */}
      <WorkShopCalendar />
      {/* ---------------- SITA VERSES SECTION ---------------- */}
      <section className="sita-verses">
        <div className="sita-verses-overlay">
          <div
            className="container text-center"
            data-aos="fade-up"
            data-aos-duration="1100">
            <h2 data-aos="fade-up">Sita Verses</h2>
            <img
              src="sita-motif.webp"
              alt="Sita Motif"
              className="motif"
              data-aos="fade-up"
              data-aos-delay="200"
            />
            <div
              id="sitaVersesCarousel"
              className="carousel slide carousel-fade"
              data-bs-ride="carousel"
              data-bs-interval="3000">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <blockquote>
                    “When your root is strong, You will rise. Just like the
                    lotus, rooted in the mud, blossoming toward the sun.”
                  </blockquote>
                </div>
                <div className="carousel-item">
                  <blockquote>
                    “Stillness is not empty. It is full of answers.”
                  </blockquote>
                </div>
                <div className="carousel-item">
                  <blockquote>
                    “Your soul already knows the way. Trust it.”
                  </blockquote>
                </div>
              </div>
              <div className="sita-verses-arrows">
                <button
                  className="sita-verses-arrow"
                  data-bs-target="#sitaVersesCarousel"
                  data-bs-slide="prev"
                  aria-label="Previous">
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <button
                  className="sita-verses-arrow"
                  data-bs-target="#sitaVersesCarousel"
                  data-bs-slide="next"
                  aria-label="Next">
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ---------------- PUBLICATIONS SECTION ---------------- */}
      <section className="sita-publications">
        <img
          src="flower.webp"
          alt=""
          className="sita-publications-decor sita-decor"
          aria-hidden="true"
        />
        <div className="container">
          <h2 className="text-center" data-aos="fade-up">
            Publications
          </h2>
          <img
            src="sita-motif.webp"
            alt="Motif"
            className="motif"
            data-aos="fade-up"
            data-aos-delay="200"
          />
          <div className="sita-publications-wrapper">
            <div
              className="publications-left"
              data-aos="fade-right"
              data-aos-delay="300">
              <div
                id="publicationsCarousel"
                className="carousel slide carousel-fade"
                data-bs-ride="carousel"
                data-bs-interval="3000">
                <div className="carousel-inner">
                  {books.length > 0 ? (
                    books.map((book, index) => (
                      <div
                        key={book._id}
                        className={`carousel-item ${index === 0 ? "active" : ""}`}>
                        <div className="publication-flex">
                          <div
                            className="publication-book-wrap"
                            data-aos="zoom-in"
                            data-aos-delay="400">
                            <img
                              src={book.coverImage}
                              className="publication-book"
                              alt={book.title}
                            />
                          </div>
                          <div
                            className="publication-content"
                            data-aos="fade-up"
                            data-aos-delay="500">
                            <h3>{book.title}</h3>
                            <h5>{book.subtitle}</h5>
                            <p>{book.aboutBook}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="carousel-item active">
                      <div className="publication-flex">
                        <div className="publication-content text-center w-100">
                          <p>No publications available at the moment.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div
              className="publications-right"
              data-aos="fade-left"
              data-aos-delay="400">
              <img
                src="sita-author.webp"
                alt="Sita"
                className="sita-author-img"
              />
            </div>
          </div>
        </div>
      </section>
      {/* ---------------- RECENT BLOGS SECTION ---------------- */}
      <section className="sita-recent-blogs">
        <div className="container text-center">
          <h2 data-aos="fade-up">Recent Blogs</h2>
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
                    className="col-lg-4 col-md-4 col-sm-12 col-12"
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
      {/* ---------------- TESTIMONIALS SECTION ---------------- */}
      <Testimonials />
      {/* ---------------- CTA STRIP SECTION ---------------- */}
      <div
        className="sita-cta-wrapper"
        data-aos="zoom-in"
        data-aos-duration="1000"
        data-aos-delay="150">
        <span className="cta-border">
          <a href="/contact" className="sita-cta-btn">
            Book a Meeting with Sita
          </a>
        </span>
      </div>
    </>
  );
};

export default HomePage;
