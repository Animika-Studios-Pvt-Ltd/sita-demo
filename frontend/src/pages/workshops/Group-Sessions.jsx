import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import "../about/About.css";
import "./Workshops.css";

const GroupSessions = () => {
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
          <img src="group-sessions-image.webp" alt="Group Sessions Image" />
        </div>
      </section>
      {/* -------------------- BREADCRUMB SECTION -------------------- */}
      <SitaBreadcrumb
        items={[
          { label: "Home", path: "/" },
          { label: "Workshops", path: "" },
          { label: "Group Sessions" },
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
                  Group Sessions
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
                <h4 data-aos="fade-up" data-aos-delay="350">
                  Families, Teams, Friends, &amp; Organizations
                </h4>
                <p data-aos="fade-up" data-aos-delay="400">
                  Group sessions are designed for collective transformation.
                  <br />
                  Families, leadership teams, friend groups, spiritual
                  communities, and organizations invite Sita to speak,
                  facilitate, and create shared understanding around purpose,
                  communication and karmic dynamics.
                </p>
              </div>
              <div className="sita-inner-full-content">
                <p className="mb-2" data-aos="fade-up" data-aos-delay="450">
                  Sita brings her multidisciplinary background as an Ayurvedic
                  Practitioner, Kundalini Yoga Therapist, Jyotishi, educator,
                  and facilitator to support the group through insight and
                  embodied practice.
                </p>
              </div>
            </div>
          </div>
          <a
            href="/booking"
            className="sita-workshops-btn"
            data-aos="zoom-in-up"
            data-aos-delay="400">
            Enquiry Now
          </a>
        </div>
      </section>
      {/* --------------------- CORE ELEMENTS SECTION ---------------------- */}
      <section className="group-sessions-core-elements">
        <div className="container">
          <h4 data-aos="fade-down">Core Elements of Group Work</h4>
          <div className="row">
            <div
              className="col-lg-6 col-md-6 col-sm-12 col-12"
              data-aos="fade-right">
              <ul className="group-sessions-core-elements-list">
                <li data-aos="fade-up" data-aos-delay="150">
                  <img src="sita-points1.webp" alt="bullet" />
                  <span>Soul Curriculum mapping for the group or system</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="200">
                  <img src="sita-points1.webp" alt="bullet" />
                  <span>Relationship and compatibility dynamics</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="250">
                  <img src="sita-points1.webp" alt="bullet" />
                  <span>Karmic and dharmic agreements within the group</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="300">
                  <img src="sita-points1.webp" alt="bullet" />
                  <span>
                    Identifying shared lessons, strengths, and blind spots
                  </span>
                </li>
              </ul>
            </div>
            <div
              className="col-lg-6 col-md-6 col-sm-12 col-12"
              data-aos="fade-left">
              <ul className="group-sessions-core-elements-list">
                <li data-aos="fade-up" data-aos-delay="150">
                  <img src="sita-points1.webp" alt="bullet" />
                  <span>
                    Tools for communication, compassion, and attunement
                  </span>
                </li>
                <li data-aos="fade-up" data-aos-delay="200">
                  <img src="sita-points1.webp" alt="bullet" />
                  <span>
                    Eastern frameworks for understanding conflict and growth
                  </span>
                </li>
                <li data-aos="fade-up" data-aos-delay="250">
                  <img src="sita-points1.webp" alt="bullet" />
                  <span>
                    Somatic and yogic practices for nervous system cohesion
                  </span>
                </li>
                <li data-aos="fade-up" data-aos-delay="300">
                  <img src="sita-points1.webp" alt="bullet" />
                  <span>Facilitated dialogue and integration</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="mb-0" data-aos="fade-up" data-aos-delay="350">
            Group sessions are tailored to the needs of the system. Sita listens
            deeply and responds intuitively to the field of the group.
          </p>
        </div>
      </section>
      {/* --------------------- GROUP FORMATS SECTION ---------------------- */}
      <section className="group-formats-core-elements">
        <div className="container">
          <h4 data-aos="fade-down">Group Formats May Include</h4>
          <div className="row">
            <div
              className="col-lg-6 col-md-6 col-sm-12 col-12"
              data-aos="fade-right">
              <ul className="group-formats-core-elements-list">
                <li data-aos="fade-up" data-aos-delay="150">
                  <span className="point-num">01</span>
                  <span>
                    Facilitated relational work (any type of relationship)
                  </span>
                </li>
                <li data-aos="fade-up" data-aos-delay="200">
                  <span className="point-num">02</span>
                  <span>Family soul curriculum sessions</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="250">
                  <span className="point-num">03</span>
                  <span>Leadership and executive team alignment</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="300">
                  <span className="point-num">04</span>
                  <span>Organizational or community purpose alignment</span>
                </li>
              </ul>
            </div>
            <div
              className="col-lg-6 col-md-6 col-sm-12 col-12"
              data-aos="fade-left">
              <ul className="group-formats-core-elements-list">
                <li data-aos="fade-up" data-aos-delay="150">
                  <span className="point-num">05</span>
                  <span>Friend group spiritual intensives or retreats</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="200">
                  <span className="point-num">06</span>
                  <span>Speaking engagements on specific topics</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="250">
                  <span className="point-num">07</span>
                  <span>Ceremony, ritual, and guided practice</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="mb-0" data-aos="fade-up" data-aos-delay="300">
            Topics may include karma and dharma, nervous system literacy,
            Kundalini, Ayurveda, sacred relationships, planetary cycles, yoga
            therapy, and spiritual awakening.
          </p>
        </div>
      </section>
      {/* --------------------- WHAT MAKES THIS WORK UNIQUE SECTION ---------------------- */}
      <section className="what-makes-this-work-unique">
        <div className="container">
          <h4 data-aos="fade-up">What Makes This Work Unique</h4>
          <p data-aos="fade-up" data-aos-delay="100">
            Sita blends ancient knowledge with attuned facilitation. She uses
            Jyotish, Ayurveda, Yogic psychology, and intuition to reveal the
            deeper architecture of a system. Once the pattern is named, the
            group can shift from confusion to clarity and from resistance to
            collaboration.
          </p>
          <p className="heading" data-aos="fade-up" data-aos-delay="200">
            This work helps groups:
          </p>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <ul className="what-makes-this-work-unique-list">
                <li data-aos="fade-right" data-aos-delay="150">
                  <img src="sita-points.webp" alt="bullet" />
                  <span>Understand each person’s role in the system</span>
                </li>
                <li data-aos="fade-left" data-aos-delay="200">
                  <img src="sita-points.webp" alt="bullet" />
                  <span>
                    Recognize karmic agreements and relational patterns
                  </span>
                </li>
                <li data-aos="fade-right" data-aos-delay="250">
                  <img src="sita-points.webp" alt="bullet" />
                  <span>Strengthen communication and emotional attunement</span>
                </li>
              </ul>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <ul className="what-makes-this-work-unique-list">
                <li data-aos="fade-right" data-aos-delay="150">
                  <img src="sita-points.webp" alt="bullet" />
                  <span>Build intuitive trust and shared purpose</span>
                </li>
                <li data-aos="fade-left" data-aos-delay="200">
                  <img src="sita-points.webp" alt="bullet" />
                  <span>Create spiritual and nervous system literacy</span>
                </li>
                <li data-aos="fade-right" data-aos-delay="250">
                  <img src="sita-points.webp" alt="bullet" />
                  <span>
                    Honor individuality while supporting the collective
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <p className="mb-0" data-aos="fade-up" data-aos-delay="300">
            Whether the group is a family, a leadership team, or a circle of
            friends, the intention is to create coherence, clarity, and
            connection at the soul level.
          </p>
        </div>
      </section>
      {/* ---------------- SESSIONS SECTION ---------------- */}
      <section className="sita-masterclass sessions-section">
        <div className="container text-center">
          <h2 data-aos="fade-up" data-aos-duration="900" data-aos-delay="100">
            Sessions
          </h2>
          <img
            src="sita-motif.webp"
            alt="Sita Motif"
            className="motif"
            data-aos="fade-up"
            data-aos-delay="200"
          />
          <div className="row">
            <div
              className="col-lg-4 col-md-4 col-sm-12 col-12"
              data-aos="fade-up"
              data-aos-delay="250">
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
              data-aos-delay="400">
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
              data-aos-delay="550">
              <div className="masterclass-card">
                <img
                  src="masterclass-3.webp"
                  className="img-fluid"
                  alt="Ayurveda"
                />
                <div className="masterclass-content">
                  <h4>Kosha Counselling</h4>
                  <a
                    href="/kosha-counselling"
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
          <a href="/contact" className="sita-cta-btn">
            Book a Meeting with Sita
          </a>
        </span>
      </div>
    </>
  );
};

export default GroupSessions;
