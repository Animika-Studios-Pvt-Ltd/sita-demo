import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import "../about/About.css";
import "./Workshops.css";

const TeacherTraining = () => {
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
            <img src="group-sessions-banner.webp" alt="Group Sessions Banner" />
          </div>
        </div>
        <div
          className="sita-inner-side-img"
          data-aos="fade-left"
          data-aos-duration="2000">
          <img src="group-sessions-image.webp" alt="Teacher Training Image" />
        </div>
      </section>
      {/* -------------------- BREADCRUMB SECTION -------------------- */}
      <SitaBreadcrumb
        items={[
          { label: "Home", path: "/" },
          { label: "Workshops", path: "" },
          { label: "Teacher Training" },
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
                  Teacher Training
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
                  Teacher Trainings and Continuing Education
                </h4>
                <p data-aos="fade-up" data-aos-delay="400">
                  For over two decades, Sita has taught the inner sciences of
                  Yoga to dedicated practitioners, teachers, healers, and
                  lifelong students of consciousness. Her personal practice
                  spans three decades of study in lineages of Kundalini Tantra,
                  classical Yoga, Kundalini Yoga practitioner work informed by
                  tradition rather than modern Western styles, subtle anatomy,
                  kosha-based therapeutics, and energy psychology.
                </p>
              </div>
              <div className="sita-inner-full-content">
                <p data-aos="fade-up" data-aos-delay="450">
                  These trainings are crafted for those who feel a deep call to
                  understand the inner architecture of the human being. They are
                  for yoga teachers who want to deepen their offerings,
                  practitioners who want to develop a private practice, and
                  spiritually serious students who want to work from the level
                  of prana, mind, and consciousness rather than choreography
                  alone.
                </p>
              </div>
            </div>
          </div>
          <a
            href="/booking"
            className="sita-workshops-btn"
            data-aos="zoom-in-up"
            data-aos-delay="500">
            Enquiry Now
          </a>
        </div>
      </section>
      {/* --------------------- SITA SPECIALIZES IN TEACHINGS SECTION ---------------------- */}
      <section className="group-formats-core-elements sita-specializes-in-teachings">
        <div className="container">
          <h4 data-aos="fade-down">
            Sita specializes in teachings that bring the inner Yoga alive:
          </h4>
          <div className="row">
            <div
              className="col-lg-6 col-md-6 col-sm-12 col-12"
              data-aos="fade-right">
              <ul className="group-formats-core-elements-list">
                <li data-aos="fade-left" data-aos-delay="150">
                  <span className="point-num">01</span>
                  <span>
                    Kundalini Tantra with an emphasis on traditional forms of
                    awakening
                  </span>
                </li>
                <li data-aos="fade-right" data-aos-delay="200">
                  <span className="point-num">02</span>
                  <span>
                    Kundalini Yoga practitioner training rooted in classical
                    foundations
                  </span>
                </li>
                <li data-aos="fade-left" data-aos-delay="250">
                  <span className="point-num">03</span>
                  <span>
                    Kosha-related yogic tools for healing and self-realization
                  </span>
                </li>
                <li data-aos="fade-right" data-aos-delay="300">
                  <span className="point-num">04</span>
                  <span>Energy psychology through the yogic lens</span>
                </li>
              </ul>
            </div>
            <div
              className="col-lg-6 col-md-6 col-sm-12 col-12"
              data-aos="fade-left">
              <ul className="group-formats-core-elements-list">
                <li data-aos="fade-left" data-aos-delay="150">
                  <span className="point-num">05</span>
                  <span>
                    Subtle anatomy including nadis, chakras, vayus, bindu and
                    pranic pathways
                  </span>
                </li>
                <li data-aos="fade-right" data-aos-delay="200">
                  <span className="point-num">06</span>
                  <span>Trauma-informed yoga therapy frameworks</span>
                </li>
                <li data-aos="fade-left" data-aos-delay="250">
                  <span className="point-num">07</span>
                  <span>
                    Integrative teaching skills for private sessions and group
                    work
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* --------------------- TEACHER TRANING ACCORDION SECTION ---------------------- */}
      <section className="accordion-section">
        <div className="container">
          <p data-aos="fade-left" data-aos-delay="100">
            These are not surface-level trainings. They are built from lived
            experience, long-term practice, and direct study. Students learn not
            only the philosophy but the embodiment and application that brings
            the teachings into real-world practice.
          </p>
          {/* Accordion Item 1 */}
          <div
            className={`accordion-item ${activeIndex === 0 ? "active" : ""}`}>
            <h4 onClick={() => toggleAccordion(0)} data-aos="fade-up">
              Who These Trainings Are For
              <span className="accordion-icon">
                {activeIndex === 0 ? "−" : "+"}
              </span>
            </h4>
            {activeIndex === 0 && (
              <div className="accordion-content">
                <ul className="accordion-section-list">
                  <li data-aos="fade-up" data-aos-delay="150">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      Yoga teachers seeking Continuing Education and
                      specialization
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="200">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      Practitioners who want to build a private therapeutic or
                      spiritual practice
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="250">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      Lifelong learners devoted to the path of awakening
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="300">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      Energy healers and somatic practitioners seeking depth and
                      structure
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="350">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      The spiritually curious and dedicated who want authentic
                      teachings
                    </span>
                  </li>
                </ul>
                <div
                  className="accordion-read-less"
                  data-aos="fade-up"
                  data-aos-delay="650"
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
              What You Receive
              <span className="accordion-icon">
                {activeIndex === 1 ? "−" : "+"}
              </span>
            </h4>
            {activeIndex === 1 && (
              <div className="accordion-content">
                <ul className="accordion-section-list">
                  <li data-aos="fade-up" data-aos-delay="150">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Yoga Alliance Continuing Education credits</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="200">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      Handouts you may use in your own teaching and practice
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="250">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      Ready-to-use class plans for private clients or group
                      classes
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="300">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      Live and virtual instruction for accessible learning
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="350">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      Recordings available for continued study and review
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="400">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      Some programs available as recording-only with full
                      support materials
                    </span>
                  </li>
                </ul>
                <div
                  className="accordion-read-less"
                  data-aos="fade-up"
                  data-aos-delay="650"
                  onClick={() => toggleAccordion(1)}>
                  Read Less{" "}
                  <i className="fa-solid fa-angle-up accordion-read-less-icon"></i>
                </div>
              </div>
            )}
          </div>
          {/* Accordion Item 3 */}
          <div
            className={`accordion-item ${activeIndex === 2 ? "active" : ""}`}>
            <h4 onClick={() => toggleAccordion(2)} data-aos="fade-up">
              Training Philosophy
              <span className="accordion-icon">
                {activeIndex === 2 ? "−" : "+"}
              </span>
            </h4>
            {activeIndex === 2 && (
              <div className="accordion-content">
                <p data-aos="fade-left" data-aos-delay="100">
                  Sita teaches in a way that honors the tradition and honors the
                  individual. She translates subtle concepts into embodied
                  knowledge without losing the depth of the teachings. Students
                  leave prepared to guide others responsibly, ethically, and
                  with clarity.
                </p>
                <p
                  className="heading"
                  data-aos="fade-right"
                  data-aos-delay="200">
                  You will learn how to:
                </p>
                <ul className="accordion-section-list">
                  <li data-aos="fade-up" data-aos-delay="150">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      Teach from understanding rather than memorization
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="200">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Work with private clients as well as groups</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="250">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      Integrate subtle body literacy into physical practice
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="300">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      Support students through transformational process safely
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="350">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Use tools that match the person, not the trend</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="400">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      Bridge classical knowledge with contemporary application
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="450">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      Cultivate personal sadhana as the foundation of all
                      teaching
                    </span>
                  </li>
                </ul>
                <p data-aos="fade-left" data-aos-delay="200">
                  This path is for those who know that Yoga is not performance.
                  It is inner alchemy and the steady maturation of awareness and
                  capacity.
                </p>
                <div
                  className="accordion-read-less"
                  data-aos="fade-up"
                  data-aos-delay="650"
                  onClick={() => toggleAccordion(2)}>
                  Read Less{" "}
                  <i className="fa-solid fa-angle-up accordion-read-less-icon"></i>
                </div>
              </div>
            )}
          </div>
          {/* Accordion Item 4 */}
          <div
            className={`accordion-item ${activeIndex === 3 ? "active" : ""}`}>
            <h4 onClick={() => toggleAccordion(3)} data-aos="fade-up">
              Structure and Format
              <span className="accordion-icon">
                {activeIndex === 3 ? "−" : "+"}
              </span>
            </h4>
            {activeIndex === 3 && (
              <div className="accordion-content">
                <ul className="accordion-section-list">
                  <li data-aos="fade-up" data-aos-delay="150">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      Live online classes with Q and A, practice, and
                      integration
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="200">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Recordings provided for all live attendees</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="250">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      Recording-only courses available for self-paced study
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="300">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Support materials and class plans included</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="350">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Small group learning for relational depth</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="400">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Optional private mentoring available</span>
                  </li>
                </ul>
                <p data-aos="fade-left" data-aos-delay="200">
                  Sita teaches with clarity and experience. Students often speak
                  of her guidance as the missing link between classical Yoga
                  theory and practical application in modern practice and
                  teaching.
                </p>
                <p data-aos="fade-right" data-aos-delay="300">
                  If you are called to deepen, to mature your teaching, and to
                  work from the subtle body instead of the surface, this is the
                  right place
                </p>
                <div
                  className="accordion-read-less"
                  data-aos="fade-up"
                  data-aos-delay="650"
                  onClick={() => toggleAccordion(3)}>
                  Read Less{" "}
                  <i className="fa-solid fa-angle-up accordion-read-less-icon"></i>
                </div>
              </div>
            )}
          </div>
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

export default TeacherTraining;
