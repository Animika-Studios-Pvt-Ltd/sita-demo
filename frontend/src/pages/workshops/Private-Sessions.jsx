import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";

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
            <img src="/about-banner.webp" alt="About Banner" />
          </div>
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

      {/* --------------------- PRIVATE SESSIONS SECTION ---------------------- */}
      <section className="sita-workshop-section">
        <div className="container">
          <h2 className="text-center">Private Sessions</h2>

          <img src="/sita-motif.webp" alt="Sita Motif" className="motif" />

          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <h4>Individuals &amp; Couples</h4>

              <p>
                Private sessions are for those who are ready to understand
                themselves at the level of soul, not symptom.
              </p>

              <p>
                Through the lens of Ayurveda, Kundalini Yoga, Yoga Therapy, and
                Jyotish, Sita works with individuals and couples to uncover the
                deeper patterns shaping health, relationships, purpose, and
                emotional life.
              </p>

              <p>
                Sita’s approach is multidimensional. She reads your Soul’s
                Curriculum through intuition and Jyotish, then supports you
                through practical and spiritual pathways that fit your
                constitution, nervous system and stage of life. This may include
                Ayurvedic protocols, breathwork, mantra, somatic practices,
                meditation, sadhana design, lifestyle guidance, and karmic
                insight.
              </p>

              <p>
                <strong>Individual Sessions May Support</strong>
              </p>

              <ul>
                <li>Understanding your Soul’s Curriculum</li>
                <li>
                  Releasing karmic patterns that create repeating challenges
                </li>
                <li>
                  Rekindling health through Ayurvedic protocols and rhythm
                </li>
                <li>
                  Nervous system regulation through yogic and somatic tools
                </li>
                <li>Aligning with career and dharma without force</li>
                <li>Emotional healing and relational clarity</li>
                <li>Spiritual practice and sadhana development</li>
                <li>Trauma-informed integration and embodiment</li>
                <li>Reconnecting to meaning, dignity, and direction</li>
              </ul>

              <p>
                You are met where you are. Nothing is rushed. Nothing is forced.
                The intention is clarity, freedom, and alignment with your
                deepest purpose.
              </p>

              <p>
                <strong>Couples Sessions</strong>
              </p>

              <p>
                Sita also works with couples seeking clarity, healing or
                expansion in their relationship. These sessions are not conflict
                management or surface communication coaching. They go deeper
                into the energetic architecture of the relationship.
              </p>

              <p>
                Through Jyotish synastry, Ayurvedic psychology and yogic
                frameworks, Sita supports couples in understanding:
              </p>

              <ul>
                <li>Shared soul themes and karmic agreements</li>
                <li>Emotional and attachment patterns</li>
                <li>
                  Intimacy, communication, and nervous system compatibility
                </li>
                <li>Dharma of the partnership and where it is growing</li>
                <li>
                  How to strengthen the relationship through aligned practice
                  and truth
                </li>
              </ul>

              <p>
                These sessions bring compassion, insight, and a shared language
                that allows the relationship to make sense at the soul level.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivateSessions;
