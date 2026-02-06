import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import "../about/About.css";
import "./Workshops.css";

const CorporateTraining = () => {
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
            <img src="group-sessions-banner.webp" alt="Group Sessions Banner" />
          </div>
        </div>
        <div
          className="sita-inner-side-img"
          data-aos="fade-left"
          data-aos-duration="2000">
          <img
            src="/group-sessions-image.webp"
            alt="Corporate Training Image"
          />
        </div>
      </section>

      {/* -------------------- BREADCRUMB SECTION -------------------- */}
      <SitaBreadcrumb
        items={[
          { label: "Home", path: "/" },
          { label: "Workshops", path: "" },
          { label: "Corporate Training" },
        ]}
      />

      {/* --------------------- INNER PAGE CONTENT ---------------------- */}
      <section className="sita-inner-section">
        <div className="container position-relative">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <div
                className="sita-inner-content sita-workshops-section"
                data-aos="fade-up">
                <h2 data-aos="fade-up" data-aos-delay="100">
                  Corporate Training
                </h2>

                <img
                  src="/sita-motif.webp"
                  className="motif"
                  alt="Decorative Motif"
                  data-aos="zoom-in"
                  data-aos-delay="200"
                />
              </div>
              <div
                className="sita-inner-content-intro sita-workshops-content"
                data-aos="fade-up"
                data-aos-delay="300">
                <h4>Corporate Training and Organizational Development</h4>

                <p>
                  Sita provides evidence-informed corporate trainings that
                  support healthier workplaces, stronger teams, and more
                  resilient leadership. Drawing from over two decades of
                  experience in Yoga Therapy, mindfulness-based stress
                  reduction, nervous system education, and human development,
                  she offers practical frameworks that help organizations thrive
                  in demanding environments.
                </p>
              </div>

              <div className="sita-inner-full-content">
                <p data-aos="fade-up" data-aos-delay="450">
                  Her work treats teams and organizations as living ecosystems.
                  Every system has its own culture, communication patterns,
                  strengths, and blind spots. By understanding those dynamics,
                  organizations are better equipped to lower stress, improve
                  cohesion, and increase performance with clarity and
                  compassion.
                </p>
              </div>
            </div>
          </div>
          <a
            href="/booking"
            className="sita-workshops-btn"
            data-aos="zoom-in"
            data-aos-delay="500">
            Enquiry Now
          </a>
        </div>
      </section>

      {/* --------------------- FOCUS AREAS INCLUDE SECTION ---------------------- */}
      <section className="group-formats-core-elements sita-specializes-in-teachings">
        <div className="container">
          <h4 data-aos="fade-up">Focus Areas Include</h4>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <ul className="group-formats-core-elements-list">
                <li data-aos="fade-up" data-aos-delay="400">
                  <span className="point-num">01</span>
                  <span>Team building and interpersonal attunement</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="400">
                  <span className="point-num">02</span>
                  <span>
                    Leadership development and human-centered management
                  </span>
                </li>
                <li data-aos="fade-up" data-aos-delay="450">
                  <span className="point-num">03</span>
                  <span>Stress reduction and nervous system resilience</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="500">
                  <span className="point-num">04</span>
                  <span>
                    Psychological safety and compassionate communication
                  </span>
                </li>
              </ul>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <ul className="group-formats-core-elements-list">
                <li data-aos="fade-up" data-aos-delay="550">
                  <span className="point-num">05</span>
                  <span>Conflict navigation and repair</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="400">
                  <span className="point-num">06</span>
                  <span>Organizational insight and cultural alignment</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="450">
                  <span className="point-num">07</span>
                  <span>Burnout prevention and sustainable productivity</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="450">
                  <span className="point-num">08</span>
                  <span>
                    Wellness and mindfulness integration in real-world settings
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- SESSIONS SECTION ---------------- */}
      <section className="sita-masterclass sessions-section">
        <div className="container text-center">
          <h2 data-aos="fade-up">Sessions</h2>
          <img src="sita-motif.webp" alt="Sita Motif" className="motif" />
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

export default CorporateTraining;
