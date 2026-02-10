import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Testimonials from "../testimonials/Testimonials";
import WorkShopCalendar from "../workshop calendar/WorkShopCalendar";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import "../about/About.css";
import "../workshops/Workshops.css";

const ReleaseKarmicPatterns = () => {
  const [activeIndex, setActiveIndex] = useState(0);

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

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);

    setTimeout(() => {
      AOS.refreshHard();
    }, 100);
  };

  return (
    <>
      {/* -------------------- HERO SECTION -------------------- */}
      <section className="sita-inner-hero">
        <div className="sita-hero-inner-bg" data-aos="fade-in"></div>
        <div className="sita-inner-hero-image">
          <div
            className="sita-inner-hero-image-banner"
            data-aos="zoom-out"
            data-aos-duration="1500">
            <img
              src="release-karmic-patterns-banner.webp"
              alt="Yoga Therapy Banner"
            />
          </div>
        </div>
        <div
          className="sita-inner-side-img"
          data-aos="fade-left"
          data-aos-duration="2000">
          <img
            src="/release-karmic-patterns-image.webp"
            alt="Release Karmic Patterns Image"
          />
        </div>
      </section>
      {/* -------------------- BREADCRUMB SECTION -------------------- */}
      <SitaBreadcrumb
        items={[
          { label: "Home", path: "/" },
          { label: "Sita Factor", path: "" },
          { label: "Release Karmic Patterns" },
        ]}
      />
      {/* --------------------- INNER PAGE CONTENT ---------------------- */}
      <section className="sita-inner-section release-karmic-patterns-bg-image">
        <div className="container position-relative">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <div className="sita-inner-content" data-aos="fade-up">
                <h2 data-aos="fade-up" data-aos-delay="100">
                  Release Karmic Patterns
                </h2>
                <img
                  src="/sita-motif.webp"
                  className="motif mb-4"
                  alt="Decorative Motif"
                  data-aos="zoom-in"
                  data-aos-delay="200"
                />
              </div>
              <div
                className="sita-inner-content-intro"
                data-aos="fade-up"
                data-aos-delay="250">
                <p data-aos="fade-up" data-aos-delay="100">
                  When we work with karma, we are not forcing change. We are
                  inviting release. Karma is unfinished energy, an imprint that
                  waits to be witnessed, integrated, or dissolved through
                  conscious, loving practice. It often appears as repeating
                  patterns, emotional loops, relational conflict, health
                  struggles, or the sense that you are living in a story you did
                  not consciously choose.
                </p>
              </div>
              <div className="sita-inner-full-content">
                <p data-aos="fade-left" data-aos-delay="100">
                  Sita works and supports individuals in recognizing and
                  releasing deep-seated karmic patterns that shape their
                  experiences, choices, and emotional responses. These patterns
                  often manifest as recurring challenges that can feel difficult
                  to shift through conscious effort alone, including:
                </p>
                <ul className="soul-curriculum-list">
                  <li data-aos="fade-left" data-aos-delay="350">
                    <img src="/sita-points.webp" alt="bullet" />
                    <span>
                      Relationship dynamics that repeat with different people
                    </span>
                  </li>
                  <li data-aos="fade-right" data-aos-delay="350">
                    <img src="/sita-points.webp" alt="bullet" />
                    <span>
                      Health challenges that mirror emotional or spiritual
                      tension
                    </span>
                  </li>
                  <li data-aos="fade-left" data-aos-delay="350">
                    <img src="/sita-points.webp" alt="bullet" />
                    <span>
                      Deep questions of worthiness, belonging, or visibility
                    </span>
                  </li>
                  <li data-aos="fade-right" data-aos-delay="350">
                    <img src="/sita-points.webp" alt="bullet" />
                    <span>
                      Ongoing confusion about direction, calling, or purpose
                    </span>
                  </li>
                </ul>
                <p data-aos="fade-left" data-aos-delay="400">
                  In this journey, Sita enables a deep level of awareness to
                  unconscious imprints carried through personal history and
                  karmic memory. By uncovering these patterns, she helps
                  individuals understand their realities, marking the first step
                  toward meaningful and lasting change.
                </p>
                <p data-aos="fade-right" data-aos-delay="450">
                  From there, she supports the release of karmic patterns by
                  helping you develop and implement specific spiritual sadhanas
                  and practices. These are not generic prescriptions. They are
                  living practices designed for you, in this season of your
                  life, with your capacity, your nervous system, and your soul
                  path in mind.
                </p>
              </div>
            </div>
          </div>
          <a
            href="/booking"
            className="sita-workshops-btn mt-2"
            data-aos="fade-up"
            data-aos-delay="350">
            Release Karma
          </a>
        </div>
      </section>
      {/* --------------------- RELEASE KARMIC PATTERNS ACCORDION SECTION ---------------------- */}
      <section className="accordion-section soul-curriculum-accordion">
        <div className="container">
          {/* Accordion Item 1 */}
          <div
            className={`accordion-item ${activeIndex === 0 ? "active" : ""}`}>
            <h4 onClick={() => toggleAccordion(0)} data-aos="fade-up">
              Your personal sadhana may draw from Vedic, Tantric, and Yogic
              tools, such as:
              <span className="accordion-icon">
                {activeIndex === 0 ? "−" : "+"}
              </span>
            </h4>
            {activeIndex === 0 && (
              <div className="accordion-content">
                <ul className="accordion-section-list">
                  <li data-aos="fade-up" data-aos-delay="100">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>Mantra and japa</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="150">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>Meditation and guided inner journeys</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="200">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>Mudra and subtle body practices</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="250">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>Pranayama and conscious breathwork</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="300">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>Planetary remedies and altar work</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="350">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>Simple puja and devotional practices</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="400">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>Ayurvedic lifestyle and ritual supports</span>
                  </li>
                </ul>
                <p data-aos="fade-left" data-aos-delay="450">
                  No matter the tool, you are met where you are and only given
                  what is best for you. In this work we honor the Divine plan.
                  We do not try to interfere with the soul’s own timing or
                  initiatory process. We also do not leave you alone with karmic
                  weight that can be held, softened, and moved. Together, we
                  support what can be released while bowing to what must unfold
                  in its own sacred rhythm.
                </p>
                <div
                  className="accordion-read-less"
                  data-aos="fade-up"
                  data-aos-delay="500"
                  onClick={() => toggleAccordion(0)}>
                  Read Less{" "}
                  <i className="fa-solid fa-angle-up accordion-read-less-icon"></i>
                </div>
              </div>
            )}
          </div>
          {/* Accordion Item 2 */}
          <div
            className={`accordion-item ${activeIndex === 1 ? "active" : ""}`}>
            <h4 onClick={() => toggleAccordion(1)} data-aos="fade-up">
              Your birth chart is an essential part of this process.
              <span className="accordion-icon">
                {activeIndex === 1 ? "−" : "+"}
              </span>
            </h4>
            {activeIndex === 1 && (
              <div className="accordion-content">
                <p data-aos="fade-left" data-aos-delay="100">
                  It is used to help Sita receive the information she needs to
                  support your karmic releasing. Through Jyotish she can see:
                </p>
                <ul className="accordion-section-list">
                  <li data-aos="fade-up" data-aos-delay="150">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      The karmic themes and soul lessons at the center of your
                      life
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="200">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      The planetary teachers that govern your growth and timing
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="250">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      The nakshatras that hold your deeper memories and
                      tendencies
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="300">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      The periods of life that are ripe for healing, clearing,
                      and initiation
                    </span>
                  </li>
                </ul>
                <p data-aos="fade-right" data-aos-delay="350">
                  The release of karmic patterns often leads to greater clarity,
                  emotional freedom, improved well-being, and a renewed sense of
                  purpose. You begin to feel less bound to old stories and more
                  rooted in your true self. The right practice meets the right
                  timing, the lesson integrates, and the knot begins to loosen.
                  Sita’s role is to guide that unfolding with devotion,
                  precision, and deep respect for the wisdom of your soul.
                </p>
                <div
                  className="accordion-read-less"
                  data-aos="fade-up"
                  data-aos-delay="400"
                  onClick={() => toggleAccordion(1)}>
                  Read Less{" "}
                  <i className="fa-solid fa-angle-up accordion-read-less-icon"></i>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* --------------------- RELEASE KARMIC PATTERNS HOW IT WORKS SECTION ---------------------- */}
      <section className="group-sessions-core-elements soul-curriculum-how-it-works">
        <div className="container">
          <h4 data-aos="fade-up">How it works: </h4>
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <p data-aos="fade-up" data-aos-delay="100">
                You will schedule your session and enter your birthdate, time
                and location. You will meet with Sita via Zoom at an agreed to
                time. Sita will do prework and will be ready for your session.
                Once you have had the opportunity to speak with Sita, she will
                put together your plan and send it to you generally within 48-72
                hours after your session.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ---------------- WORKSHOP CALENDAR SECTION ---------------- */}
      <WorkShopCalendar />
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

export default ReleaseKarmicPatterns;
