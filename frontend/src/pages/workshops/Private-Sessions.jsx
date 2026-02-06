import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import "../about/About.css";
import "./Workshops.css";

const PrivateSessions = () => {
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
          <img src="/group-sessions-image.webp" alt="Private Sessions Image" />
        </div>
      </section>

      {/* -------------------- BREADCRUMB SECTION -------------------- */}
      <SitaBreadcrumb
        items={[
          { label: "Home", path: "/" },
          { label: "Workshops", path: "" },
          { label: "Private Sessions" },
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
                  Private Sessions
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
                <h4>Individuals & Couples</h4>

                <p>
                  Private sessions are for those who are ready to understand
                  themselves at the level of soul, not symptom.
                  <br />
                  Through the lens of Ayurveda, Kundalini Yoga, Yoga Therapy,
                  and Jyotish, Sita works with individuals and couples to
                  uncover the deeper patterns shaping health, relationships,
                  purpose, and emotional life.
                </p>
              </div>

              <div className="sita-inner-full-content">
                <p data-aos="fade-up" data-aos-delay="450">
                  Sita’s approach is multidimensional. She reads your Soul’s
                  Curriculum through intuition and Jyotish, then supports you
                  through practical and spiritual pathways that fit your
                  constitution, nervous system and stage of life. This may
                  include Ayurvedic protocols, breathwork, mantra, somatic
                  practices, meditation, sadhana design, lifestyle guidance, and
                  karmic insight.
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

      {/* --------------------- INDIVIDUAL SESSIONS MAY SUPPORT SECTION ---------------------- */}
      <section className="group-sessions-core-elements individual-sessions-may-support">
        <div className="container">
          <h4 data-aos="fade-up">Individual Sessions May Support</h4>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <ul className="group-sessions-core-elements-list">
                <li data-aos="fade-up" data-aos-delay="400">
                  <img src="/sita-points1.webp" alt="bullet" />
                  <span>Understanding your Soul’s Curriculum</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="450">
                  <img src="/sita-points1.webp" alt="bullet" />
                  <span>
                    Releasing karmic patterns that create repeating challenges
                  </span>
                </li>
                <li data-aos="fade-up" data-aos-delay="500">
                  <img src="/sita-points1.webp" alt="bullet" />
                  <span>
                    Rekindling health through Ayurvedic protocols and rhythm
                  </span>
                </li>
                <li data-aos="fade-up" data-aos-delay="550">
                  <img src="/sita-points1.webp" alt="bullet" />
                  <span>
                    Nervous system regulation through yogic and somatic tools
                  </span>
                </li>
                <li data-aos="fade-up" data-aos-delay="400">
                  <img src="/sita-points1.webp" alt="bullet" />
                  <span>Aligning with career and dharma without force</span>
                </li>
              </ul>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <ul className="group-sessions-core-elements-list">
                <li data-aos="fade-up" data-aos-delay="450">
                  <img src="/sita-points1.webp" alt="bullet" />
                  <span>Emotional healing and relational clarity</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="500">
                  <img src="/sita-points1.webp" alt="bullet" />
                  <span>Spiritual practice and sadhana development</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="550">
                  <img src="/sita-points1.webp" alt="bullet" />
                  <span>Trauma-informed integration and embodiment</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="550">
                  <img src="/sita-points1.webp" alt="bullet" />
                  <span>Reconnecting to meaning, dignity, and direction</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="mb-0" data-aos="fade-up" data-aos-delay="600">
            You are met where you are. Nothing is rushed. Nothing is forced. The
            intention is clarity, freedom, and alignment with your deepest
            purpose.
          </p>
        </div>
      </section>
      {/* --------------------- COUPLE SESSIONS SECTION ---------------------- */}
      <section className="what-makes-this-work-unique couple-sessions-section">
        <div className="container">
          <h4 data-aos="fade-up">Couples Sessions</h4>
          <p className="paragraph" data-aos="fade-up" data-aos-delay="100">
            Sita also works with couples seeking clarity, healing or expansion
            in their relationship. These sessions are not conflict management or
            surface communication coaching. They go deeper into the energetic
            architecture of the relationship.
          </p>
          <p className="heading" data-aos="fade-up" data-aos-delay="200">
            Through Jyotish synastry, Ayurvedic psychology and yogic frameworks,
            Sita supports couples in understanding:
          </p>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <ul className="what-makes-this-work-unique-list">
                <li data-aos="fade-up" data-aos-delay="400">
                  <img src="/sita-points.webp" alt="bullet" />
                  <span>Shared soul themes and karmic agreements</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="400">
                  <img src="/sita-points.webp" alt="bullet" />
                  <span>Emotional and attachment patterns</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="450">
                  <img src="/sita-points.webp" alt="bullet" />
                  <span>
                    Intimacy, communication, and nervous system compatibility
                  </span>
                </li>
              </ul>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <ul className="what-makes-this-work-unique-list">
                <li data-aos="fade-up" data-aos-delay="550">
                  <img src="/sita-points.webp" alt="bullet" />
                  <span>Dharma of the partnership and where it is growing</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="400">
                  <img src="/sita-points.webp" alt="bullet" />
                  <span>
                    How to strengthen the relationship through aligned practice
                    and truth
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <p className="mb-0" data-aos="fade-up" data-aos-delay="600">
            These sessions bring compassion, insight, and a shared language that
            allows the relationship to make sense at the soul level.
          </p>
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

export default PrivateSessions;
