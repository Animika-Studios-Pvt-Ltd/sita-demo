import { useEffect } from "react";
import { Carousel } from "bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Homepage.css";
import WorkShopCalendar from "../workshop calendar/WorkShopCalendar";
import Testimonials from "../testimonials/Testimonials";

const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-in-out",
      once: true,
      offset: 80,
    });
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

    // ✅ Cleanup (VERY IMPORTANT)
    return () => {
      window.removeEventListener("scroll", updateTargets);
      window.removeEventListener("resize", updateTargets);
      cancelAnimationFrame(rafId);
    };
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

  return (
    <>
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="sita-hero">
        <div className="sita-hero-bg"></div>

        <div className="sita-hero-image">
          <div className="sita-hero-image-inner" data-aos="fade-right">
            <img src="sita-banner.webp" alt="Sita Hero" />
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div
              className="col-lg-6 col-md-6 col-sm-6 col-6 offset-6 sita-hero-content"
              data-aos="fade-left">
              <h1>SITA GUIDES</h1>
              <p>Spiritual Mentor, Author, Healer.</p>
              <a href="/about" className="sita-btn">
                Discover
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- ABOUT SECTION ---------------- */}
      <section className="sita-about">
        <div className="container">
          <div className="row">
            <div
              className="col-lg-3 col-md-12 col-sm-12 col-12 text-center"
              data-aos="fade-up">
              <h2>Sita</h2>
              <img src="sita-motif.webp" alt="Sita Motif" className="motif" />
            </div>

            <div
              className="col-lg-9 col-md-12 col-sm-12 col-12"
              data-aos="fade-up"
              data-aos-delay="150">
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
                Read More
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
          data-aos="fade-up">
          <h2>The Sita Factor</h2>

          <img src="sita-motif.webp" alt="Sita Motif" className="motif" />

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
              data-aos-delay="100">
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
              data-aos-delay="200">
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
              data-aos-delay="300">
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
          <h2 data-aos="fade-up">Masterclass</h2>

          <img src="sita-motif.webp" alt="Sita Motif" className="motif" />

          <p className="sita-masterclass-text">
            Sita Severson is devoted to empowering individuals on the path of
            self-development—supporting lives of balance, vitality, and
            well-being, and guiding them toward the fulfilment of their life’s
            true purpose. Her work is grounded in deep expertise across the many
            dimensions of personal and spiritual transformation.
          </p>

          <div className="row">
            <div
              className="col-lg-4 col-md-4 col-sm-12 col-12"
              data-aos="fade-up"
              data-aos-delay="100">
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
              data-aos-delay="200">
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
              data-aos-delay="300">
              <div className="masterclass-card">
                <img
                  src="masterclass-3.webp"
                  className="img-fluid"
                  alt="Ayurveda"
                />
                <div className="masterclass-content">
                  <h4>Kosha Counselling</h4>
                  <a
                    href="/kosha-counseling"
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
          <div className="container text-center" data-aos="fade-up">
            <h2>Sita Verses</h2>

            <img src="sita-motif.webp" alt="Sita Motif" className="motif" />

            <div
              id="sitaVersesCarousel"
              className="carousel slide"
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

        <div className="container text-center" data-aos="zoom-in">
          <h2>Enduring Lights of Transformation</h2>

          <img src="sita-motif.webp" alt="Sita Motif" className="motif" />

          <img
            src="sita-publication.webp"
            className="img-fluid sita-publications-img"
            alt="Author"
          />
        </div>
      </section>
      {/* ---------------- RECENT BLOGS SECTION ---------------- */}
      <section className="sita-recent-blogs">
        <div className="container text-center">
          <h2>Recent Blogs</h2>

          <img src="sita-motif.webp" alt="Sita Motif" className="motif" />

          <div className="row">
            <div
              className="col-lg-4 col-md-4 col-sm-12 col-12"
              data-aos="fade-up"
              data-aos-delay="100">
              <div className="sita-blog-card">
                <div className="sita-blog-image">
                  <img src="blog-1.webp" className="img-fluid" alt="" />
                  <p className="blog-date">Dec 27, 2025</p>
                </div>

                <h4>Collective Karma &amp; Responsibility</h4>

                <p>
                  “The causal body is where personal patterns and collective
                  patterns meet, and this is why inner practice always affects
                  more than one life.”
                </p>

                <span className="blog-author">- Sita Severson</span>

                <a href="#" className="sita-blog-btn pink">
                  Get insights
                </a>
              </div>
            </div>

            <div
              className="col-lg-4 col-md-4 col-sm-12 col-12"
              data-aos="fade-up"
              data-aos-delay="200">
              <div className="sita-blog-card">
                <div className="sita-blog-image">
                  <img src="blog-2.webp" className="img-fluid" alt="" />
                  <p className="blog-date">Jan 02, 2026</p>
                </div>

                <h4>How Self-Aware Are You?</h4>

                <p>
                  “Self-awareness is less a trait and more a training in
                  perception.”
                </p>

                <span className="blog-author">- Sita Severson</span>

                <a href="#" className="sita-blog-btn peach">
                  Find purpose
                </a>
              </div>
            </div>

            <div
              className="col-lg-4 col-md-4 col-sm-12 col-12"
              data-aos="fade-up"
              data-aos-delay="300">
              <div className="sita-blog-card">
                <div className="sita-blog-image">
                  <img src="blog-3.webp" className="img-fluid" alt="" />
                  <p className="blog-date">Jan 05, 2026</p>
                </div>

                <h4>Dearest sweet soul named Sita, a love letter.</h4>

                <p>
                  “Love fully and deeply, invite your big feelings to your
                  table, and let your life be shaped by honesty rather than
                  fear.”
                </p>

                <span className="blog-author">- Sita Severson</span>

                <a href="#" className="sita-blog-btn rose">
                  Dive deeper
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ---------------- TESTIMONIALS SECTION ---------------- */}
      <Testimonials />
      {/* ---------------- CTA STRIP SECTION ---------------- */}
      <div className="sita-cta-wrapper" data-aos="zoom-in">
        <span className="cta-border">
          <a href="/booking" className="sita-cta-btn">
            Book a Meeting with Sita
          </a>
        </span>
      </div>
    </>
  );
};

export default HomePage;
