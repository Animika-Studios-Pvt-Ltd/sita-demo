import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Testimonials from "../testimonials/Testimonials";
import WorkShopCalendar from "../workshop calendar/WorkShopCalendar";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import "../about/About.css";

const KoshaCounseling = () => {
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
            <img src="kosha-counseling-banner.webp" alt="Yoga Therapy Banner" />
          </div>
        </div>

        <img
          src="/kosha-counseling-image.webp"
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
          { label: "Kosha Counseling" },
        ]}
      />

      {/* --------------------- INNER PAGE CONTENT ---------------------- */}
      <section className="sita-inner-section kosha-counseling-bg-image">
        <div className="container position-relative">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <div className="sita-inner-content" data-aos="fade-up">
                <h2 data-aos="fade-up" data-aos-delay="100">
                  Kosha Counseling
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
                data-aos-delay="300">
                <p>
                  The koshas, a concept from ancient Vedantic philosophy,
                  represent the five layers or sheaths that envelop the true
                  self, known as the Atman. These layers help us understand
                  different aspects of our being, from the physical to the
                  spiritual. Here’s a brief overview of each kosha:
                </p>

                <ul className="kosha-list">
                  <li data-aos="fade-up" data-aos-delay="400">
                    <img src="/sita-points.webp" alt="bullet" />
                    <span>The Physical sheath</span>
                  </li>

                  <li data-aos="fade-up" data-aos-delay="450">
                    <img src="/sita-points.webp" alt="bullet" />
                    <span>The Wisdom sheath</span>
                  </li>

                  <li data-aos="fade-up" data-aos-delay="500">
                    <img src="/sita-points.webp" alt="bullet" />
                    <span>The Energy sheath</span>
                  </li>

                  <li data-aos="fade-up" data-aos-delay="550">
                    <img src="/sita-points.webp" alt="bullet" />
                    <span>The Bliss sheath</span>
                  </li>

                  <li data-aos="fade-up" data-aos-delay="600">
                    <img src="/sita-points.webp" alt="bullet" />
                    <span>The Mental sheath</span>
                  </li>
                </ul>
              </div>

              <div className="sita-inner-full-content">
                <p data-aos="fade-up" data-aos-delay="100">
                  Focus of the Kosha counselling is on the energy, mental,
                  wisdom and bliss layers. By understanding and working through
                  these five koshas, we can journey towards self-realization and
                  uncover the true essence of our being.
                </p>

                <p data-aos="fade-up" data-aos-delay="200">
                  Explore each layer to achieve a harmonious balance between
                  body, mind, and spirit.
                </p>

                <h2
                  className="kosha-benefits"
                  data-aos="fade-up"
                  data-aos-delay="300">
                  Benefits of Kosha Counselling
                </h2>

                <p data-aos="fade-up" data-aos-delay="350">
                  Koshas offer a comprehensive framework for understanding the
                  multifaceted nature of human existence. This holistic
                  perspective helps you recognize that you are more than just
                  your physical body. By exploring and working with each layer,
                  you can address imbalances and cultivate harmony within
                  yourself. This can lead to profound personal growth and
                  transformation.
                </p>

                <p data-aos="fade-up" data-aos-delay="400">
                  Understanding the koshas encourages practices that promote
                  physical health, emotional stability, mental clarity, and
                  spiritual fulfilment. This integrative approach enhances
                  overall well-being. The koshas emphasize the
                  interconnectedness of the body, energy, mind, wisdom, and
                  spirit.
                </p>

                <p data-aos="fade-up" data-aos-delay="450">
                  Working with the koshas, particularly through practices like
                  meditation, pranayama, and mindfulness, can reduce stress and
                  anxiety by calming the mind and balancing the energy body.
                  They provide a pathway for spiritual exploration and growth
                  and guide you towards experiencing your true nature and inner
                  bliss.
                </p>

                <p data-aos="fade-up" data-aos-delay="500">
                  Knowledge of the koshas empowers you to take charge of your
                  own well-being and encourages proactive self-care practices
                  that nurture all aspects of your being.
                </p>

                <p data-aos="fade-up" data-aos-delay="550">
                  As you become more balanced and centered, you can relate to
                  others from a place of greater empathy, understanding, and
                  compassion, improving interpersonal relationships.
                </p>

                <p className="mb-0" data-aos="fade-up" data-aos-delay="600">
                  Exploring the deeper layers of the koshas can lead to a
                  greater sense of purpose and fulfilment. You may discover your
                  true passions and align your life with your inner values and
                  wisdom.
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

export default KoshaCounseling;
