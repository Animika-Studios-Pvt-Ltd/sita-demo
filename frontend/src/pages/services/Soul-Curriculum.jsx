import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import WorkShopCalendar from "../workshop calendar/WorkShopCalendar";
import Testimonials from "../testimonials/Testimonials";
import "../about/About.css";

const SoulCurriculum = () => {
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
            <img src="soul-curriculum-banner.webp" alt="Yoga Therapy Banner" />
          </div>
        </div>
        <div
          className="sita-inner-side-img"
          data-aos="fade-left"
          data-aos-duration="2000">
          <img src="/soul-curriculum-image.webp" alt="Soul Curriculum Image" />
        </div>
      </section>

      {/* -------------------- BREADCRUMB SECTION -------------------- */}
      <SitaBreadcrumb
        items={[
          { label: "Home", path: "/" },
          { label: "Sita Factor", path: "" },
          { label: "Soul Curriculum" },
        ]}
      />

      {/* --------------------- INNER PAGE CONTENT ---------------------- */}
      <section className="sita-inner-section soul-curriculum-bg-image">
        <div className="container position-relative">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <div className="sita-inner-content" data-aos="fade-up">
                <h2 data-aos="fade-up" data-aos-delay="100">
                  Soul Curriculum
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
                  Sita offers a ‘Soul Curriculum,’ which is an enablement and
                  empowerment into health and happiness. Sita makes people feel
                  understood, dives deep to the root of the problem, and is
                  solution-centric. She respects people’s realities and embarks
                  together with them for a steady transformation.
                </p>
              </div>

              <div className="sita-inner-full-content">
                <p data-aos="fade-up" data-aos-delay="100">
                  Sita navigates the various blocks and challenges faced by
                  those who reach out to her, and carefully builds a
                  solution-framework, that is unique to that person context.
                </p>

                <p data-aos="fade-up" data-aos-delay="200">
                  Some key liberating experiences include:
                </p>

                <ul className="soul-curriculum-list">
                  <li data-aos="fade-up" data-aos-delay="300">
                    <img src="/sita-points.webp" alt="bullet" />
                    <span>Release of karmic patterns.</span>
                  </li>

                  <li data-aos="fade-up" data-aos-delay="350">
                    <img src="/sita-points.webp" alt="bullet" />
                    <span>
                      Release of physical, mental &amp; emotional disease
                    </span>
                  </li>

                  <li data-aos="fade-up" data-aos-delay="400">
                    <img src="/sita-points.webp" alt="bullet" />
                    <span>Reclaim one’s whole self.</span>
                  </li>

                  <li data-aos="fade-up" data-aos-delay="450">
                    <img src="/sita-points.webp" alt="bullet" />
                    <span>
                      Establish one’s power by owning the intelligence of nature
                      that lives and breathes inside each one of us.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <a href="/booking" className="sita-workshops-btn mt-2">
            Explore Workshops
          </a>
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

export default SoulCurriculum;
