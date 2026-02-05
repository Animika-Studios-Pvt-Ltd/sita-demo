import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";

const ShakthiLeadership = () => {
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
          { label: "Shakthi Leadership" },
        ]}
      />

      {/* ---------------- SHAKTHI LEADERSHIP SECTION ---------------- */}
      <section className="sita-workshop-section">
        <div className="container">
          <h2 className="text-center">Shakthi Leadership</h2>

          <img src="/sita-motif.webp" alt="Sita Motif" className="motif" />

          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <p>
                Sita is a certified Shakti Leadership Coach, trained through
                Shakti Leadership and grounded in a transformative leadership
                paradigm that integrates ancient yogic wisdom with conscious
                leadership principles. Shakti Leadership offers a balanced model
                of leadership that is cooperative, creative, inclusive, and
                grounded in emotional intelligence, psychological presence, and
                whole-person capacity. Leaders who practice this approach learn
                to lead with clarity while nurturing resilient systems and
                cultures of collaboration and purpose.
              </p>

              <p>
                Where traditional leadership models often emphasize hierarchy,
                competition, and authority, Shakti Leadership emphasizes balance
                between capacities traditionally associated with the feminine
                and those associated with the masculine. This balance creates
                leaders and teams who are creative, adaptive, inclusive, and
                effective.
              </p>

              <p>
                Sita brings this framework into her coaching, mentoring, and
                group programs in a way that is accessible, human-centered, and
                transformational. She works with individuals and teams to
                cultivate presence, emotional intelligence, resilience,
                flexibility, and congruence, which are core competencies of
                conscious leadership in the Shakti Leadership model.
              </p>

              <h4>What Shakti Leadership Coaching Supports</h4>

              <p>Sita offers coaching and mentoring programs for:</p>

              <ul>
                <li>Individuals ready to lead with clarity and purpose</li>
                <li>
                  Women in leadership who want to deepen presence and impact
                </li>
                <li>
                  Organizations and teams seeking greater cohesion and
                  psychological safety
                </li>
                <li>
                  Groups of all genders committed to inclusive leadership
                  development
                </li>
                <li>
                  Changemakers and entrepreneurs who want to lead with vision
                  and grounded authority
                </li>
              </ul>

              <p>
                Her work strengthens leaders to function with confidence under
                pressure, build cultures that support psychological well-being,
                and navigate complexity with coherence.
              </p>

              <h4>Core Elements of Sita’s Shakti Leadership Work</h4>

              <p>
                <strong>Balanced Leadership Development</strong>
              </p>

              <p>
                Sita guides leaders in accessing both categories of capacities
                that make leadership sustainable and humane:
              </p>

              <ul>
                <li>
                  Creative and cooperative capacities such as curiosity,
                  empathy, collaboration, and listening
                </li>
                <li>
                  Decisiveness, accountability, structure, and strategic clarity
                </li>
                <li>Emotional regulation in dynamic environments</li>
                <li>
                  Whole-system thinking that honors context, relationships, and
                  long-term outcomes
                </li>
              </ul>

              <p>
                This balanced approach enhances leadership maturity and creates
                cultures where individuals can contribute their best thinking
                and energy without burnout.
              </p>

              <p>
                <strong>Programs and Formats</strong>
              </p>

              <p>
                Sita’s Shakti Leadership Coaching is offered in flexible formats
                that meet different organizational and individual needs:
              </p>

              <ul>
                <li>
                  <strong> One-on-One Coaching and Mentoring</strong>
                  <p>
                    Personalized support focused on leadership presence,
                    communication, resilience, conflict navigation, and purpose
                    alignment.
                  </p>
                </li>

                <li>
                  <strong>Group Mentoring Circles</strong>
                  <p>
                    Cohorts held for women or mixed-gender groups to deepen
                    shared learning, network across peers, and develop
                    leadership competencies together.
                  </p>
                </li>

                <li>
                  <strong> Workshops for Teams and Organizations</strong>
                  <p>
                    Interactive sessions tailored to support better
                    collaboration, conflict navigation, psychological safety,
                    and awareness of systemic dynamics.
                  </p>
                </li>

                <li>
                  <strong>Virtual and Live Formats</strong>
                  <p>
                    Remote or in-person options that fit team schedules and
                    organizational goals.
                  </p>
                </li>
              </ul>

              <p>
                Across all formats, Sita blends practical frameworks with
                reflective inquiry and structured skill development to support
                meaningful and measurable growth.
              </p>

              <p>
                <strong>Why This Matters Now</strong>
              </p>

              <p>
                Leadership today requires more than technical expertise. It
                requires emotional intelligence, resilience, and relational
                awareness. Shakti Leadership calls forward leaders who:
              </p>

              <ul>
                <li>Lead with strength and empathy simultaneously</li>
                <li>Align strategy with human experience</li>
                <li>
                  Build cultures that support contribution over compliance
                </li>
                <li>Navigate change with presence, clarity, and steadiness</li>
              </ul>

              <p>
                Sita’s coaching supports leaders at every stage, from emerging
                leaders to experienced professionals seeking deeper alignment
                and effectiveness.
              </p>

              <p>
                <strong>What Participants Gain</strong>
              </p>

              <p>
                Individuals and teams working with Sita in Shakti Leadership
                Coaching commonly report:
              </p>

              <ul>
                <li>Greater clarity in purpose and decision-making</li>
                <li>Enhanced emotional self-regulation</li>
                <li>Stronger collaboration and trust in teams</li>
                <li>Increased resilience under pressure</li>
                <li>
                  More confidence in leading with integrity and inclusivity
                </li>
              </ul>

              <p>
                Sita’s work helps leaders show up as whole human beings,
                capable, grounded, and adaptive in ways that positively impact
                people, systems, and outcomes.
              </p>

              <p>
                Shakti Leadership is a leadership paradigm and body of work
                developed by Nilima Bhat and Raj Sisodia. It invites leaders to
                embody a more conscious, balanced, and integrated form of power
                that honors both inner and outer work, presence and performance,
                intuition and analysis. Anchored in timeless wisdom traditions
                and applied to contemporary organizational life, Shakti
                Leadership offers a framework for leaders who want to create
                sustainable success while honoring the full humanity of
                themselves and the people they serve.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShakthiLeadership;
