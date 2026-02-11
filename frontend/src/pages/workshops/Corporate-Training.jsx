import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import "../about/About.css";
import "./Workshops.css";

const CorporateTraining = () => {
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
                <h4 data-aos="fade-up" data-aos-delay="350">
                  Corporate Training and Organizational Development
                </h4>
                <p data-aos="fade-left" data-aos-delay="400">
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
                <p data-aos="fade-right" data-aos-delay="450">
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
            data-aos="zoom-in-up"
            data-aos-delay="500">
            Enquiry Now
          </a>
        </div>
      </section>
      {/* --------------------- FOCUS AREAS INCLUDE SECTION ---------------------- */}
      <section className="group-formats-core-elements sita-specializes-in-teachings">
        <div className="container">
          <h4 data-aos="fade-down">Focus Areas Include</h4>
          <div className="row">
            <div
              className="col-lg-6 col-md-6 col-sm-12 col-12"
              data-aos="fade-right">
              <ul className="group-formats-core-elements-list">
                <li data-aos="fade-left" data-aos-delay="150">
                  <span className="point-num">01</span>
                  <span>Team building and interpersonal attunement</span>
                </li>
                <li data-aos="fade-right" data-aos-delay="200">
                  <span className="point-num">02</span>
                  <span>
                    Leadership development and human-centered management
                  </span>
                </li>
                <li data-aos="fade-left" data-aos-delay="250">
                  <span className="point-num">03</span>
                  <span>Stress reduction and nervous system resilience</span>
                </li>
                <li data-aos="fade-right" data-aos-delay="300">
                  <span className="point-num">04</span>
                  <span>
                    Psychological safety and compassionate communication
                  </span>
                </li>
              </ul>
            </div>
            <div
              className="col-lg-6 col-md-6 col-sm-12 col-12"
              data-aos="fade-left">
              <ul className="group-formats-core-elements-list">
                <li data-aos="fade-up" data-aos-delay="150">
                  <span className="point-num">05</span>
                  <span>Conflict navigation and repair</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="200">
                  <span className="point-num">06</span>
                  <span>Organizational insight and cultural alignment</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="250">
                  <span className="point-num">07</span>
                  <span>Burnout prevention and sustainable productivity</span>
                </li>
                <li data-aos="fade-up" data-aos-delay="300">
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
      {/* --------------------- CORPORATE TRAINING ACCORDION SECTION ---------------------- */}
      <section className="accordion-section shakthi-leadership-accordion">
        <div className="container">
          <p data-aos="fade-up" data-aos-delay="100">
            These trainings are designed for executives, managers, clinical
            teams, educators, and mission-driven organizations who value
            excellence, emotional intelligence, and respectful collaboration.
          </p>
          {/* Accordion Item 1 */}
          <div
            className={`accordion-item ${activeIndex === 0 ? "active" : ""}`}>
            <h4 onClick={() => toggleAccordion(0)} data-aos="fade-up">
              Training Philosophy
              <span className="accordion-icon">
                {activeIndex === 0 ? "−" : "+"}
              </span>
            </h4>
            {activeIndex === 0 && (
              <div className="accordion-content">
                <p data-aos="fade-left" data-aos-delay="100">
                  Modern organizations carry heavy cognitive and emotional
                  workloads. Sita’s approach focuses on the human factors that
                  directly impact workplace performance and culture, including:
                </p>
                <ul className="accordion-section-list">
                  <li data-aos="fade-up" data-aos-delay="150">
                    <img src="sita-points1.webp" alt="bullet" />
                    <div className="points-text">
                      <p className="points-heading">Resilience</p>
                      <span>
                        Skills that help individuals stay steady, adaptive, and
                        solution-oriented during stress.
                      </span>
                    </div>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="200">
                    <img src="sita-points1.webp" alt="bullet" />
                    <div className="points-text">
                      <p className="points-heading">Attunement</p>
                      <span>
                        Listening and understanding that supports
                        cross-functional clarity.
                      </span>
                    </div>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="250">
                    <img src="sita-points1.webp" alt="bullet" />
                    <div className="points-text">
                      <p className="points-heading">Communication</p>
                      <span>
                        Frameworks that reduce friction and increase
                        psychological safety.
                      </span>
                    </div>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="300">
                    <img src="sita-points1.webp" alt="bullet" />
                    <div className="points-text">
                      <p className="points-heading">Systems Awareness</p>
                      <span>
                        Recognizing patterns and dynamics that influence culture
                        and collaboration.
                      </span>
                    </div>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="350">
                    <img src="sita-points1.webp" alt="bullet" />
                    <div className="points-text">
                      <p className="points-heading">Compassion Literacy</p>
                      <span>
                        Supporting colleagues without sacrificing accountability
                        or performance.
                      </span>
                    </div>
                  </li>
                </ul>
                <p data-aos="fade-right" data-aos-delay="400">
                  Organizations are not only structures. They are systems of
                  human beings. When people function well, organizations
                  function well.
                </p>
                <div
                  className="accordion-read-less"
                  data-aos="fade-up"
                  data-aos-delay="450"
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
              Yogic Frameworks and Mind Nutrition
              <span className="accordion-icon">
                {activeIndex === 1 ? "−" : "+"}
              </span>
            </h4>
            {activeIndex === 1 && (
              <div className="accordion-content">
                <p data-aos="fade-left" data-aos-delay="100">
                  The foundation of Sita’s corporate work is grounded and
                  accessible. It draws from Yoga Therapy, neuroscience, positive
                  psychology, and leadership studies.
                </p>
                <p
                  className="heading"
                  data-aos="fade-right"
                  data-aos-delay="200">
                  Two key components are central to her approach:
                </p>
                <ul className="group-formats-core-elements-list">
                  <li data-aos="fade-up" data-aos-delay="150">
                    <span className="point-num">01</span>
                    <span className="points-heading points-main-heading">
                      Yogic Frameworks
                    </span>
                  </li>
                  <p data-aos="fade-left" data-aos-delay="200">
                    These frameworks support:
                  </p>
                  <ul className="accordion-section-list">
                    <li data-aos="fade-up" data-aos-delay="150">
                      <img src="sita-points1.webp" alt="bullet" />
                      <span>Stress physiology and regulation</span>
                    </li>
                    <li data-aos="fade-up" data-aos-delay="200">
                      <img src="sita-points1.webp" alt="bullet" />
                      <span>Cognitive clarity and focus</span>
                    </li>
                    <li data-aos="fade-up" data-aos-delay="250">
                      <img src="sita-points1.webp" alt="bullet" />
                      <span>Decision-making under pressure</span>
                    </li>
                    <li data-aos="fade-up" data-aos-delay="300">
                      <img src="sita-points1.webp" alt="bullet" />
                      <span>
                        Emotional steadiness in challenging environments
                      </span>
                    </li>
                    <li data-aos="fade-up" data-aos-delay="350">
                      <img src="sita-points1.webp" alt="bullet" />
                      <span>Energy management throughout the workday</span>
                    </li>
                  </ul>
                  <p data-aos="fade-left" data-aos-delay="400">
                    These sessions are not physical yoga classes. They are
                    practical tools for the mind, nervous system, and emotional
                    landscape.
                  </p>
                </ul>
                <ul className="group-formats-core-elements-list">
                  <li data-aos="fade-up" data-aos-delay="150">
                    <span className="point-num">02</span>
                    <span className="points-heading points-main-heading">
                      Mind Nutrition (not related to food)
                    </span>
                  </li>
                  <p data-aos="fade-up" data-aos-delay="200">
                    Mind Nutrition refers to what we feed the mind through:
                  </p>
                  <ul className="accordion-section-list">
                    <li data-aos="fade-up" data-aos-delay="150">
                      <img src="sita-points1.webp" alt="bullet" />
                      <span>Content and information</span>
                    </li>
                    <li data-aos="fade-up" data-aos-delay="200">
                      <img src="sita-points1.webp" alt="bullet" />
                      <span>Digital stimulus</span>
                    </li>
                    <li data-aos="fade-up" data-aos-delay="250">
                      <img src="sita-points1.webp" alt="bullet" />
                      <span>Self-talk and internal narrative</span>
                    </li>
                    <li data-aos="fade-up" data-aos-delay="300">
                      <img src="sita-points1.webp" alt="bullet" />
                      <span>Organizational communication</span>
                    </li>
                    <li data-aos="fade-up" data-aos-delay="350">
                      <img src="sita-points1.webp" alt="bullet" />
                      <span>Attention patterns</span>
                    </li>
                  </ul>
                  <p data-aos="fade-right" data-aos-delay="400">
                    Teams learn how mind nutrition influences performance,
                    burnout, emotional reactivity, and innovation. This training
                    helps create healthier communication, reduces cognitive
                    overload, and builds more sustainable working environments.
                  </p>
                </ul>
                <div
                  className="accordion-read-less"
                  data-aos="fade-up"
                  data-aos-delay="450"
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
              Training Formats
              <span className="accordion-icon">
                {activeIndex === 2 ? "−" : "+"}
              </span>
            </h4>
            {activeIndex === 2 && (
              <div className="accordion-content">
                <p data-aos="fade-left" data-aos-delay="100">
                  Programs are tailored to organizational needs and may include:
                </p>
                <ul className="accordion-section-list">
                  <li data-aos="fade-up" data-aos-delay="150">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>60 to 90 minute sessions</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="200">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Half-day workshops</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="250">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Multi-day trainings</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="300">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Executive intensives</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="350">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Hybrid or virtual delivery</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="400">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Ongoing curriculum and coaching</span>
                  </li>
                </ul>
                <p data-aos="fade-right" data-aos-delay="450">
                  All sessions include practical tools that can be implemented
                  immediately in professional environments.
                </p>
                <div
                  className="accordion-read-less"
                  data-aos="fade-up"
                  data-aos-delay="500"
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
              Who This Is For
              <span className="accordion-icon">
                {activeIndex === 3 ? "−" : "+"}
              </span>
            </h4>
            {activeIndex === 3 && (
              <div className="accordion-content">
                <p data-aos="fade-left" data-aos-delay="100">
                  Sita works with:
                </p>
                <ul className="accordion-section-list">
                  <li data-aos="fade-up" data-aos-delay="150">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Corporate and executive teams</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="200">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Healthcare providers</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="250">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Education and academic institutions</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="300">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Startups and mission-driven organizations</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="350">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Clinical and wellness programs</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="400">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Nonprofits and social impact groups</span>
                  </li>
                </ul>
                <p data-aos="fade-right" data-aos-delay="450">
                  The goal is not to make organizations more spiritual. The goal
                  is to make them more humane, resilient, and effective.
                </p>
                <div
                  className="accordion-read-less"
                  data-aos="fade-up"
                  data-aos-delay="500"
                  onClick={() => toggleAccordion(3)}>
                  Read Less{" "}
                  <i className="fa-solid fa-angle-up accordion-read-less-icon"></i>
                </div>
              </div>
            )}
          </div>
          {/* Accordion Item 5 */}
          <div
            className={`accordion-item ${activeIndex === 4 ? "active" : ""}`}>
            <h4 onClick={() => toggleAccordion(4)} data-aos="fade-up">
              Outcomes Organizations Commonly Report
              <span className="accordion-icon">
                {activeIndex === 4 ? "−" : "+"}
              </span>
            </h4>
            {activeIndex === 4 && (
              <div className="accordion-content">
                <ul className="accordion-section-list">
                  <li data-aos="fade-up" data-aos-delay="150">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Decreased workplace stress and burnout</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="200">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Improved communication and collaboration</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="250">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Stronger emotional intelligence and attunement</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="300">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Better conflict navigation and problem-solving</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="350">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Increased morale and team cohesion</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="400">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Healthier culture and reduced turnover</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="450">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Renewed clarity of mission and purpose</span>
                  </li>
                </ul>
                <p data-aos="fade-right" data-aos-delay="500">
                  These trainings are adaptable to different environments and
                  cultures, and they meet organizations where they are.
                </p>
                <div
                  className="accordion-read-less"
                  data-aos="fade-up"
                  data-aos-delay="550"
                  onClick={() => toggleAccordion(4)}>
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
