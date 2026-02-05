import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import WorkShopCalendar from "../workshop calendar/WorkShopCalendar";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import "../about/About.css";
import Testimonials from "../testimonials/Testimonials";

const YogaTherapy = () => {
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
            <img src="/yoga-therapy-banner.webp" alt="Yoga Therapy Banner" />
          </div>
        </div>

        <img
          src="/yoga-therapy-image.webp"
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
          { label: "Yoga Therapy" },
        ]}
      />

      {/* -------------------- INNER PAGE CONTENT -------------------- */}
      <section className="sita-inner-section yoga-therapy-bg-image">
        <div className="container position-relative">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <div className="sita-inner-content" data-aos="fade-up">
                <h2 data-aos="fade-up" data-aos-delay="100">
                  Yoga Therapy
                </h2>

                <img
                  src="/sita-motif.webp"
                  className="motif mb-4"
                  alt="Decorative Motif"
                  data-aos="zoom-in"
                  data-aos-delay="200"
                />

                <div
                  className="sita-inner-content-intro yoga-therapy-section"
                  data-aos="fade-up"
                  data-aos-delay="300">
                  <p
                    className="sita-quote"
                    data-aos="fade-right"
                    data-aos-delay="400">
                    “The true measure of Yoga is not how far the body moves but
                    how quietly the mind sits.”
                  </p>

                  <img
                    src="/sita.webp"
                    alt="Sita"
                    className="sita"
                    data-aos="fade-left"
                    data-aos-delay="500"
                  />
                </div>
              </div>

              <div className="sita-inner-full-content">
                <p data-aos="fade-up" data-aos-delay="100">
                  Yoga Therapy is a holistic, personalized approach to health
                  and well-being that works with the body, breath, mind, and
                  nervous system to restore balance and support healing. Rooted
                  in the classical wisdom of yoga and adapted to modern
                  lifestyles, it recognizes that each individual is unique and
                  therefore requires a tailored therapeutic approach.
                </p>

                <p data-aos="fade-up" data-aos-delay="200">
                  A key strength of Yoga Therapy lies in its effectiveness for
                  stress-related conditions, chronic pain, hormonal imbalances,
                  digestive issues, fatigue, anxiety, and sleep disturbances.
                  Yoga Therapy addresses the root causes of physical discomfort,
                  emotional stress, and mental imbalance. With carefully
                  designed practices, including asana (therapeutic movement),
                  pranayama (breath regulation), relaxation techniques,
                  meditation, and lifestyle guidance—it supports the body’s
                  innate ability to heal and self-regulate.
                </p>

                <p className="mb-0" data-aos="fade-up" data-aos-delay="300">
                  Your Yoga Therapy program is one of the best ways to start
                  integrating new life practices into your daily life. Sita will
                  carefully craft a Yoga Therapy plan that will include many of
                  the yogic tools available based on your goals and also your
                  comfort level. If you are seeking mind/body balance, recovery
                  from chronic and acute health issues, support with recovering
                  from surgery or wanting to feel more strong, flexible and
                  balanced, Sita’s Yoga Therapy program can meet you where you
                  are and guide you up.
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

export default YogaTherapy;
