import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";

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
            <img src="/about-banner.webp" alt="About Banner" />
          </div>
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

      {/* --------------------- CORPORATE TRAINING SECTION ---------------------- */}
      <section className="sita-workshop-section">
        <div className="container">
          <h2 className="text-center">Corporate Training</h2>

          <img src="/sita-motif.webp" alt="Sita Motif" className="motif" />

          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <h4>Corporate Training and Organizational Development</h4>

              <p>
                Sita provides evidence-informed corporate trainings that support
                healthier workplaces, stronger teams, and more resilient
                leadership. Drawing from over two decades of experience in Yoga
                Therapy, mindfulness-based stress reduction, nervous system
                education, and human development, she offers practical
                frameworks that help organizations thrive in demanding
                environments.
              </p>

              <p>
                Her work treats teams and organizations as living ecosystems.
                Every system has its own culture, communication patterns,
                strengths, and blind spots. By understanding those dynamics,
                organizations are better equipped to lower stress, improve
                cohesion, and increase performance with clarity and compassion.
              </p>

              <p>Focus Areas Include</p>

              <ul>
                <li>Team building and interpersonal attunement</li>
                <li>Leadership development and human-centered management</li>
                <li>Stress reduction and nervous system resilience</li>
                <li>Psychological safety and compassionate communication</li>
                <li>Conflict navigation and repair</li>
                <li>Organizational insight and cultural alignment</li>
                <li>Burnout prevention and sustainable productivity</li>
                <li>
                  Wellness and mindfulness integration in real-world settings
                </li>
              </ul>

              <p>
                These trainings are designed for executives, managers, clinical
                teams, educators, and mission-driven organizations who value
                excellence, emotional intelligence, and respectful
                collaboration.
              </p>

              <h4>Training Philosophy</h4>

              <p>
                Modern organizations carry heavy cognitive and emotional
                workloads. Sita’s approach focuses on the human factors that
                directly impact workplace performance and culture, including:
              </p>

              <ul>
                <li>
                  <strong>Resilience</strong>
                  <p>
                    Skills that help individuals stay steady, adaptive, and
                    solution-oriented during stress.
                  </p>
                </li>

                <li>
                  <strong>Attunement</strong>
                  <p>
                    Listening and understanding that supports cross-functional
                    clarity.
                  </p>
                </li>

                <li>
                  <strong>Communication</strong>
                  <p>
                    Frameworks that reduce friction and increase psychological
                    safety.
                  </p>
                </li>

                <li>
                  <strong>Systems Awareness</strong>
                  <p>
                    Recognizing patterns and dynamics that influence culture and
                    collaboration.
                  </p>
                </li>

                <li>
                  <strong>Compassion Literacy</strong>
                  <p>
                    Supporting colleagues without sacrificing accountability or
                    performance.
                  </p>
                </li>
              </ul>

              <p>
                Organizations are not only structures. They are systems of human
                beings. When people function well, organizations function well.
              </p>

              <h4>Yogic Frameworks and Mind Nutrition</h4>

              <p>
                The foundation of Sita’s corporate work is grounded and
                accessible. It draws from Yoga Therapy, neuroscience, positive
                psychology, and leadership studies.
              </p>

              <p>Two key components are central to her approach:</p>

              <p>
                <strong>1. Yogic Frameworks</strong>
              </p>

              <p>These frameworks support:</p>

              <ul>
                <li>Stress physiology and regulation</li>
                <li>Cognitive clarity and focus</li>
                <li>Decision-making under pressure</li>
                <li>Emotional steadiness in challenging environments</li>
                <li>Energy management throughout the workday</li>
              </ul>

              <p>
                These sessions are not physical yoga classes. They are practical
                tools for the mind, nervous system, and emotional landscape.
              </p>

              <p>
                <strong>2. Mind Nutrition (not related to food)</strong>
              </p>

              <p>Mind Nutrition refers to what we feed the mind through:</p>

              <ul>
                <li>Content and information</li>
                <li>Digital stimulus</li>
                <li>Self-talk and internal narrative</li>
                <li>Organizational communication</li>
                <li>Attention patterns</li>
              </ul>

              <p>
                Teams learn how mind nutrition influences performance, burnout,
                emotional reactivity, and innovation. This training helps create
                healthier communication, reduces cognitive overload, and builds
                more sustainable working environments.
              </p>

              <p>
                <strong>Training Formats</strong>
              </p>

              <p>
                Programs are tailored to organizational needs and may include:
              </p>

              <ul>
                <li>60 to 90 minute sessions</li>
                <li>Half-day workshops</li>
                <li>Multi-day trainings</li>
                <li>Executive intensives</li>
                <li>Hybrid or virtual delivery</li>
                <li>Ongoing curriculum and coaching</li>
              </ul>

              <p>
                All sessions include practical tools that can be implemented
                immediately in professional environments.
              </p>

              <p>
                <strong>Who This Is For</strong>
              </p>

              <p>Sita works with:</p>

              <ul>
                <li>Corporate and executive teams</li>
                <li>Healthcare providers</li>
                <li>Education and academic institutions</li>
                <li>Startups and mission-driven organizations</li>
                <li>Clinical and wellness programs</li>
                <li>Nonprofits and social impact groups</li>
              </ul>

              <p>
                The goal is not to make organizations more spiritual. The goal
                is to make them more humane, resilient, and effective.
              </p>

              <p>
                <strong>Outcomes Organizations Commonly Report</strong>
              </p>

              <ul>
                <li>Decreased workplace stress and burnout</li>
                <li>Improved communication and collaboration</li>
                <li>Stronger emotional intelligence and attunement</li>
                <li>Better conflict navigation and problem-solving</li>
                <li>Increased morale and team cohesion</li>
                <li>Healthier culture and reduced turnover</li>
                <li>Renewed clarity of mission and purpose</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CorporateTraining;
