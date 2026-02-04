import { useEffect } from "react";
import { Carousel } from "bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Homepage.css";

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

  /* Workshop Calendar */
  useEffect(() => {
    const getCategoryFromURL = () => {
      const path = window.location.pathname.toLowerCase();

      if (path.includes("yoga")) return "Yoga Therapy";
      if (path.includes("ayurveda"))
        return "Ayurveda – Nutrition & Integration";
      if (path.includes("kosha")) return "Kosha Counseling";
      if (path.includes("soul")) return "Soul Curriculum";
      if (path.includes("karmic")) return "Release Karmic Patterns";

      return null;
    };

    const tbody = document.getElementById("workshopTableBody");
    if (!tbody) return;

    const BOOKING_BASE_URL = "https://booking.sitashakti.com";

    const toMinutes = (time) => {
      if (!time) return 0;
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    const isUpcomingEvent = (e) => {
      const now = new Date();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const eventDate = new Date(e.date);
      eventDate.setHours(0, 0, 0, 0);

      if (eventDate > today) return true;
      if (eventDate < today) return false;

      const endMinutes = toMinutes(e.endTime);
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      return endMinutes > nowMinutes;
    };

    fetch("https://sita-demo-production.up.railway.app/api/events")
      .then((res) => res.json())
      .then((events) => {
        tbody.innerHTML = "";

        const pageCategory = getCategoryFromURL();

        const upcomingEvents = events.filter((event) => {
          const upcoming = isUpcomingEvent(event);
          if (!pageCategory) return upcoming;
          return upcoming && event.category === pageCategory;
        });

        if (!upcomingEvents.length) {
          tbody.innerHTML = `
          <tr>
            <td colspan="10" class="text-center">
              No upcoming workshops available
            </td>
          </tr>
        `;
          return;
        }

        upcomingEvents.forEach((e) => {
          tbody.innerHTML += `
          <tr>
            <td>${e.code || "-"}</td>
            <td>${e.title}</td>
            <td>${e.date}</td>
            <td>${e.location || "-"}</td>
            <td>${e.mode || "-"}</td>
            <td>${e.fees || "-"}</td>
            <td>${e.capacity || "-"}</td>
            <td>${e.availability ?? "-"}</td>
            <td>${e.ageGroup || "-"}</td>
            <td>
              ${
                Number(e.availability) === 0
                  ? `<span class="sita-booking-closed">Booking Closed</span>`
                  : e.bookingUrl
                    ? `<a
                        href="${BOOKING_BASE_URL}/${e.bookingUrl}"
                        class="sita-book-now"
                        target="_blank"
                      >
                        Book Now
                      </a>`
                    : `<button disabled class="sita-book-now disabled">
                        Coming Soon
                      </button>`
              }
            </td>
          </tr>
        `;
        });
      })
      .catch((err) => {
        console.error("Failed to load workshops:", err);
        tbody.innerHTML = `
        <tr>
          <td colspan="10" class="text-center">
            Failed to load workshops
          </td>
        </tr>
      `;
      });
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

  /* Testimonials */
  useEffect(() => {
    const carousel = document.getElementById("testimonialCarousel");
    const nameEl = document.querySelector(".sita-testimonial-name");
    const quoteImg = document.querySelector(".sita-testimonial-quote");

    if (!carousel || !nameEl || !quoteImg) return;

    const updateMeta = () => {
      const active = carousel.querySelector(".carousel-item.active");
      if (!active) return;

      nameEl.textContent = active.dataset.name || "";
      quoteImg.src = active.dataset.quote || "";
    };

    // Initial sync
    setTimeout(updateMeta, 100);

    carousel.addEventListener("slid.bs.carousel", updateMeta);

    return () => {
      carousel.removeEventListener("slid.bs.carousel", updateMeta);
    };
  }, []);

  return (
    <>
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="sita-hero">
        <div className="sita-hero-bg"></div>

        <div className="sita-hero-image">
          <div className="sita-hero-image-inner" data-aos="fade-right">
            <img src="public/sita-banner.webp" alt="Sita Hero" />
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
              <img
                src="public/sita-motif.webp"
                alt="Sita Motif"
                className="motif"
              />
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
          src="public/lotus.webp"
          alt=""
          className="sita-decor decor-lotus"
          aria-hidden="true"
        />

        <img
          src="public/s.webp"
          alt=""
          className="sita-decor decor-s"
          aria-hidden="true"
        />

        <div
          className="container text-center sita-factor-content"
          data-aos="fade-up">
          <h2>The Sita Factor</h2>

          <img
            src="public/sita-motif.webp"
            alt="Sita Motif"
            className="motif"
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
              data-aos-delay="100">
              <a href="/study-with-sita" className="sita-service-card study">
                <img
                  src="public/study-with-sita.webp"
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
                  src="public/consult-sita.webp"
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
                  src="public/engage-sita.webp"
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

          <img
            src="public/sita-motif.webp"
            alt="Sita Motif"
            className="motif"
          />

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
                  src="public/masterclass-1.webp"
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
                  src="public/masterclass-2.webp"
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
                  src="public/masterclass-3.webp"
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
      <section className="sita-workshop-calendar">
        <div className="container">
          <h2 className="text-center" data-aos="fade-up">
            WORKSHOP CALENDAR
          </h2>

          <img
            src="public/sita-motif.webp"
            alt="Sita Motif"
            className="motif"
          />

          <div
            className="table-responsive"
            data-aos="fade-up"
            data-aos-delay="150">
            <table className="table sita-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Workshop Title</th>
                  <th>Workshop Date</th>
                  <th>Workshop Location</th>
                  <th>Workshop Mode</th>
                  <th>Fees</th>
                  <th>Capacity</th>
                  <th>Availability</th>
                  <th>Age Group</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="workshopTableBody"></tbody>
            </table>
          </div>
        </div>
      </section>
      {/* ---------------- SITA VERSES SECTION ---------------- */}
      <section className="sita-verses">
        <div className="sita-verses-overlay">
          <div className="container text-center" data-aos="fade-up">
            <h2>Sita Verses</h2>

            <img
              src="public/sita-motif.webp"
              alt="Sita Motif"
              className="motif"
            />

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
          src="public/flower.webp"
          alt=""
          className="sita-publications-decor sita-decor"
          aria-hidden="true"
        />

        <div className="container text-center" data-aos="zoom-in">
          <h2>Enduring Lights of Transformation</h2>

          <img
            src="public/sita-motif.webp"
            alt="Sita Motif"
            className="motif"
          />

          <img
            src="public/sita-publication.webp"
            className="img-fluid sita-publications-img"
            alt="Author"
          />
        </div>
      </section>
      {/* ---------------- RECENT BLOGS SECTION ---------------- */}
      <section className="sita-recent-blogs">
        <div className="container text-center">
          <h2>Recent Blogs</h2>

          <img
            src="public/sita-motif.webp"
            alt="Sita Motif"
            className="motif"
          />

          <div className="row">
            <div
              className="col-lg-4 col-md-4 col-sm-12 col-12"
              data-aos="fade-up"
              data-aos-delay="100">
              <div className="sita-blog-card">
                <div className="sita-blog-image">
                  <img src="public/blog-1.webp" className="img-fluid" alt="" />
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
                  <img src="public/blog-2.webp" className="img-fluid" alt="" />
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
                  <img src="public/blog-3.webp" className="img-fluid" alt="" />
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
      <section className="sita-testimonials">
        <img
          src="public/lotus-1.webp"
          alt=""
          className="sita-testimonial-decor sita-decor"
          aria-hidden="true"
        />

        <div className="container">
          <h2 data-aos="fade-up">Testimonials</h2>

          <img
            src="public/sita-motif.webp"
            alt="Sita Motif"
            className="motif"
          />

          <div className="sita-testimonial-wrapper">
            <div className="row">
              <div className="col-lg-2 col-md-12 col-sm-12 col-12 text-center">
                <img
                  src="public/testimonial-quote.webp"
                  className="sita-testimonial-quote"
                  alt="Quote"
                />
                <span className="sita-testimonial-name"></span>
              </div>

              <div className="col-lg-8 col-md-12 col-sm-12 col-12">
                <div
                  id="testimonialCarousel"
                  className="carousel slide"
                  data-bs-ride="carousel"
                  data-bs-interval="3000"
                  data-bs-pause="false">
                  <div className="carousel-inner sita-testimonials-carousel-inner text-center">
                    <div
                      className="carousel-item active"
                      data-name="Ananya Sharma"
                      data-quote="public/testimonial-quote.webp">
                      <p>
                        Working with Sita has been a deeply transformative
                        experience. Her guidance helped me reconnect with my
                        inner self, find emotional balance, and move forward
                        with clarity and confidence.
                      </p>
                    </div>

                    <div
                      className="carousel-item"
                      data-name="Rahul Mehta"
                      data-quote="public/testimonial-quote.webp">
                      <p>
                        Sita’s sessions brought immense peace into my life. Her
                        compassionate approach and spiritual insight allowed me
                        to release long-held fears and rediscover my purpose.
                      </p>
                    </div>

                    <div
                      className="carousel-item"
                      data-name="Priya Nair"
                      data-quote="public/testimonial-quote.webp">
                      <p>
                        Every interaction with Sita feels grounding and
                        uplifting. Her wisdom, presence, and gentle guidance
                        helped me realign my life with intention and
                        mindfulness.
                      </p>
                    </div>
                  </div>

                  <div className="sita-testimonial-arrows">
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#testimonialCarousel"
                      data-bs-slide="prev">
                      <i className="fas fa-arrow-left"></i>
                    </button>

                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target="#testimonialCarousel"
                      data-bs-slide="next">
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-3 d-none d-md-block"></div>
            </div>
          </div>
        </div>
      </section>
      {/* ---------------- CTA STRIP SECTION ---------------- */}
      <div className="sita-cta-wrapper" data-aos="zoom-in">
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
