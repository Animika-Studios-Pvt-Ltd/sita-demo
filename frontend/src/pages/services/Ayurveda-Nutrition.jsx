import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import WorkShopCalendar from "../workshop calendar/WorkShopCalendar";
import Testimonials from "../testimonials/Testimonials";

const AyurvedaNutrition = () => {
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
              src="ayurveda-nutrition-banner.webp"
              alt="Yoga Therapy Banner"
            />
          </div>
        </div>

        <img
          src="/ayurveda-nutrition-image.webp"
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
          { label: "Ayurveda Nutrition & Integration" },
        ]}
      />

      {/* --------------------- INNER PAGE CONTENT ---------------------- */}
      <section className="sita-inner-section ayurveda-nutrition-bg-image">
        <div className="container position-relative">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <div className="sita-inner-content" data-aos="fade-up">
                <h2 data-aos="fade-up" data-aos-delay="100">
                  Ayurveda - Nutrition & Lifestyle Integration
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
                    Ayurveda integration brings the timeless wisdom of Ayurveda
                    into modern life in a practical, personalized, and
                    sustainable way. Ayurveda integration focuses on identifying
                    the root causes of imbalance—whether physical, digestive,
                    hormonal, emotional, or energetic.
                  </p>
                </div>
              </div>

              <div className="sita-inner-full-content">
                <p data-aos="fade-up" data-aos-delay="100">
                  This integrative approach may include guidance on daily
                  routines (dinacharya), nutrition aligned with digestive
                  strength, seasonal rhythms (ritucharya), sleep hygiene, stress
                  management, and mindful living. Herbal support, detoxification
                  principles, and rejuvenation practices are introduced
                  thoughtfully and conservatively, always respecting modern
                  medical boundaries.
                </p>

                <p data-aos="fade-up" data-aos-delay="200">
                  Ayurveda integration works particularly well alongside Yoga
                  Therapy, lifestyle coaching, and preventive health care,
                  offering a holistic framework that supports long-term
                  well-being rather than short-term relief. It is especially
                  effective for chronic stress, digestive disturbances, fatigue,
                  hormonal imbalance, inflammatory conditions, and recurring
                  lifestyle-related concerns.
                </p>

                <p data-aos="fade-up" data-aos-delay="300">
                  Ayurveda – Nutrition & Lifestyle Integration is a
                  personalized, holistic approach to health that aligns daily
                  food choices and lifestyle practices with an individual’s
                  unique constitution and current state of balance. Rooted in
                  the classical principles of Ayurveda, this approach recognizes
                  that what we eat, how we live, and when we do things are as
                  important as treatment itself.
                </p>

                <p className="mb-0" data-aos="fade-up" data-aos-delay="400">
                  SITA guides the seeker in this seamless integration to enable
                  the necessary transformation.
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

export default AyurvedaNutrition;
