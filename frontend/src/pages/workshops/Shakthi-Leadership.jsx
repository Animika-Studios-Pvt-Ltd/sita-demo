import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import "../about/About.css";
import "./Workshops.css";

const ShakthiLeadership = () => {
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
            alt="Shakthi Leadership Image"
          />
        </div>
      </section>
      {/* -------------------- BREADCRUMB SECTION -------------------- */}
      <SitaBreadcrumb
        items={[
          { label: "Home", path: "/" },
          { label: "Workshops", path: "" },
          { label: "Shakthi Leadership" },
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
                  Shakthi Leadership
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
                <p data-aos="fade-up" data-aos-delay="350">
                  Sita is a certified Shakti Leadership Coach, trained through
                  Shakti Leadership and grounded in a transformative leadership
                  paradigm that integrates ancient yogic wisdom with conscious
                  leadership principles. Shakti Leadership offers a balanced
                  model of leadership that is cooperative, creative, inclusive,
                  and grounded in emotional intelligence, psychological
                  presence, and whole-person capacity. Leaders who practice this
                  approach learn to lead with clarity while nurturing resilient
                  systems and cultures of collaboration and purpose.
                </p>
              </div>
              <div className="sita-inner-full-content">
                <p data-aos="fade-left" data-aos-delay="400">
                  Where traditional leadership models often emphasize hierarchy,
                  competition, and authority, Shakti Leadership emphasizes
                  balance between capacities traditionally associated with the
                  feminine and those associated with the masculine. This balance
                  creates leaders and teams who are creative, adaptive,
                  inclusive, and effective.
                </p>
                <p data-aos="fade-right" data-aos-delay="450">
                  Sita brings this framework into her coaching, mentoring, and
                  group programs in a way that is accessible, human-centered,
                  and transformational. She works with individuals and teams to
                  cultivate presence, emotional intelligence, resilience,
                  flexibility, and congruence, which are core competencies of
                  conscious leadership in the Shakti Leadership model.
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
      {/* --------------------- SHAKTHI LEADERSHIIP SUPPORTS SECTION ---------------------- */}
      <section className="group-formats-core-elements sita-specializes-in-teachings">
        <div className="container">
          <h4 data-aos="fade-down">What Shakti Leadership Coaching Supports</h4>
          <div className="row">
            <div
              className="col-lg-12 col-md-12 col-sm-12 col-12"
              data-aos="fade-left">
              <p data-aos="fade-up" data-aos-delay="100">
                Sita offers coaching and mentoring programs for:
              </p>
              <ul className="group-formats-core-elements-list">
                <li data-aos="fade-left" data-aos-delay="150">
                  <span className="point-num">01</span>
                  <span>
                    Individuals ready to lead with clarity and purpose
                  </span>
                </li>
                <li data-aos="fade-right" data-aos-delay="200">
                  <span className="point-num">02</span>
                  <span>
                    Women in leadership who want to deepen presence and impact
                  </span>
                </li>
                <li data-aos="fade-left" data-aos-delay="250">
                  <span className="point-num">03</span>
                  <span>
                    Organizations and teams seeking greater cohesion and
                    psychological safety
                  </span>
                </li>
                <li data-aos="fade-right" data-aos-delay="300">
                  <span className="point-num">04</span>
                  <span>
                    Groups of all genders committed to inclusive leadership
                    development
                  </span>
                </li>
                <li data-aos="fade-left" data-aos-delay="350" className="mb-0">
                  <span className="point-num">05</span>
                  <span>
                    Changemakers and entrepreneurs who want to lead with vision
                    and grounded authority
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* --------------------- SHAKTHI LEADERSHIP ACCORDION SECTION ---------------------- */}
      <section className="accordion-section shakthi-leadership-accordion">
        <div className="container">
          <p data-aos="fade-left" data-aos-delay="100">
            Her work strengthens leaders to function with confidence under
            pressure, build cultures that support psychological well-being, and
            navigate complexity with coherence.
          </p>
          {/* Accordion Item 1 */}
          <div
            className={`accordion-item ${activeIndex === 0 ? "active" : ""}`}>
            <h4 onClick={() => toggleAccordion(0)} data-aos="fade-up">
              Core Elements of Sita’s Shakti Leadership Work
              <span className="accordion-icon">
                {activeIndex === 0 ? "−" : "+"}
              </span>
            </h4>
            {activeIndex === 0 && (
              <div className="accordion-content">
                <p
                  className="heading"
                  data-aos="fade-left"
                  data-aos-delay="100">
                  Balanced Leadership Development
                </p>
                <p data-aos="fade-right" data-aos-delay="200">
                  Sita guides leaders in accessing both categories of capacities
                  that make leadership sustainable and humane:
                </p>
                <ul className="accordion-section-list">
                  <li data-aos="fade-up" data-aos-delay="150">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      Creative and cooperative capacities such as curiosity,
                      empathy, collaboration, and listening
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="200">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      Decisiveness, accountability, structure, and strategic
                      clarity
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="250">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Emotional regulation in dynamic environments</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="300">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      Whole-system thinking that honors context, relationships,
                      and long-term outcomes
                    </span>
                  </li>
                </ul>
                <p data-aos="fade-up" data-aos-delay="400">
                  This balanced approach enhances leadership maturity and
                  creates cultures where individuals can contribute their best
                  thinking and energy without burnout.
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
              Programs and Formats
              <span className="accordion-icon">
                {activeIndex === 1 ? "−" : "+"}
              </span>
            </h4>
            {activeIndex === 1 && (
              <div className="accordion-content">
                <p data-aos="fade-left" data-aos-delay="100">
                  Sita’s Shakti Leadership Coaching is offered in flexible
                  formats that meet different organizational and individual
                  needs:
                </p>
                <ul className="accordion-section-list">
                  <li data-aos="fade-up" data-aos-delay="150">
                    <img src="sita-points1.webp" alt="bullet" />
                    <div className="points-text">
                      <p className="points-heading">
                        One-on-One Coaching and Mentoring
                      </p>
                      <span>
                        Personalized support focused on leadership presence,
                        communication, resilience, conflict navigation, and
                        purpose alignment.
                      </span>
                    </div>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="200">
                    <img src="sita-points1.webp" alt="bullet" />

                    <div className="points-text">
                      <p className="points-heading">Group Mentoring Circles</p>
                      <span>
                        Cohorts held for women or mixed-gender groups to deepen
                        shared learning, network across peers, and develop
                        leadership competencies together.
                      </span>
                    </div>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="250">
                    <img src="sita-points1.webp" alt="bullet" />
                    <div className="points-text">
                      <p className="points-heading">
                        Workshops for Teams and Organizations
                      </p>
                      <span>
                        Interactive sessions tailored to support better
                        collaboration, conflict navigation, psychological
                        safety, and awareness of systemic dynamics.
                      </span>
                    </div>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="300">
                    <img src="sita-points1.webp" alt="bullet" />
                    <div className="points-text">
                      <p className="points-heading">Virtual and Live Formats</p>
                      <span>
                        Remote or in-person options that fit team schedules and
                        organizational goals.
                      </span>
                    </div>
                  </li>
                </ul>
                <p data-aos="fade-up" data-aos-delay="350">
                  Across all formats, Sita blends practical frameworks with
                  reflective inquiry and structured skill development to support
                  meaningful and measurable growth.
                </p>
                <div
                  className="accordion-read-less"
                  data-aos="fade-up"
                  data-aos-delay="400"
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
              Why This Matters Now
              <span className="accordion-icon">
                {activeIndex === 2 ? "−" : "+"}
              </span>
            </h4>
            {activeIndex === 2 && (
              <div className="accordion-content">
                <p data-aos="fade-left" data-aos-delay="100">
                  Leadership today requires more than technical expertise. It
                  requires emotional intelligence, resilience, and relational
                  awareness. Shakti Leadership calls forward leaders who:
                </p>
                <ul className="accordion-section-list">
                  <li data-aos="fade-up" data-aos-delay="150">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Lead with strength and empathy simultaneously</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="200">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Align strategy with human experience</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="250">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      Build cultures that support contribution over compliance
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="300">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      Navigate change with presence, clarity, and steadiness
                    </span>
                  </li>
                </ul>
                <p data-aos="fade-right" data-aos-delay="350">
                  Sita’s coaching supports leaders at every stage, from emerging
                  leaders to experienced professionals seeking deeper alignment
                  and effectiveness.
                </p>
                <div
                  className="accordion-read-less"
                  data-aos="fade-up"
                  data-aos-delay="400"
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
              What Participants Gain
              <span className="accordion-icon">
                {activeIndex === 3 ? "−" : "+"}
              </span>
            </h4>

            {activeIndex === 3 && (
              <div className="accordion-content">
                <p data-aos="fade-left" data-aos-delay="100">
                  Individuals and teams working with Sita in Shakti Leadership
                  Coaching commonly report:
                </p>
                <ul className="accordion-section-list">
                  <li data-aos="fade-up" data-aos-delay="150">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Greater clarity in purpose and decision-making</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="200">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Enhanced emotional self-regulation</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="300">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Stronger collaboration and trust in teams</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="350">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>Increased resilience under pressure</span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="400">
                    <img src="sita-points1.webp" alt="bullet" />
                    <span>
                      More confidence in leading with integrity and inclusivity
                    </span>
                  </li>
                </ul>
                <p data-aos="fade-left" data-aos-delay="450">
                  Sita’s work helps leaders show up as whole human beings,
                  capable, grounded, and adaptive in ways that positively impact
                  people, systems, and outcomes.
                </p>
                <p data-aos="fade-right" data-aos-delay="500">
                  Shakti Leadership is a leadership paradigm and body of work
                  developed by Nilima Bhat and Raj Sisodia. It invites leaders
                  to embody a more conscious, balanced, and integrated form of
                  power that honors both inner and outer work, presence and
                  performance, intuition and analysis. Anchored in timeless
                  wisdom traditions and applied to contemporary organizational
                  life, Shakti Leadership offers a framework for leaders who
                  want to create sustainable success while honoring the full
                  humanity of themselves and the people they serve.
                </p>
                <div
                  className="accordion-read-less"
                  data-aos="fade-up"
                  data-aos-delay="550"
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
          <a href="/booking" className="sita-cta-btn">
            Book a Meeting with Sita
          </a>
        </span>
      </div>
    </>
  );
};

export default ShakthiLeadership;
