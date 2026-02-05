import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Testimonials from "../testimonials/Testimonials";
import WorkShopCalendar from "../workshop calendar/WorkShopCalendar";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";

const ReleaseKarmicPatterns = () => {
  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-in-out",
      once: true,
      offset: 80,
    });
  }, []);

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

        <img
          src="/release-karmic-patterns-image.webp"
          className="sita-inner-side-img"
          alt="Yoga Therapy Image"
          data-aos="fade-left"
          data-aos-duration="2000"
        />
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

                <div
                  className="sita-inner-content-intro"
                  data-aos="fade-up"
                  data-aos-delay="300">
                  <p>
                    Sita works and supports individuals in recognizing and
                    releasing deep-seated karmic patterns that shape their
                    experiences, choices, and emotional responses. These
                    patterns often manifest as recurring challenges—whether in
                    relationships, health, self-worth, or life direction—and can
                    feel difficult to shift through conscious effort alone.
                  </p>
                </div>
              </div>

              <div className="sita-inner-full-content">
                <p data-aos="fade-up" data-aos-delay="100">
                  In this journey, Sita enables a deep level of awareness to
                  unconscious imprints carried through personal history and
                  karmic memory. By gently uncovering these patterns, she helps
                  individuals understand their realities, marking the first step
                  toward meaningful and lasting change.
                </p>

                <p className="mb-0" data-aos="fade-up" data-aos-delay="200">
                  The release of karmic patterns often leads to greater clarity,
                  emotional freedom, improved well-being, and a renewed sense of
                  purpose.
                </p>
              </div>
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
          <a href="/contact" className="sita-cta-btn">
            Book a Meeting with Sita
          </a>
        </span>
      </div>
    </>
  );
};

export default ReleaseKarmicPatterns;
