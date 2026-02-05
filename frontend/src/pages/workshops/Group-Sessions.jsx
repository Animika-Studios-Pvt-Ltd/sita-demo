import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";

const GropuSessions = () => {
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
          { label: "Group Sessions" },
        ]}
      />

      {/* -------------------- GROUP SESSIONS SECTION -------------------- */}
      <section className="sita-workshop-section">
        <div className="container">
          <h2 className="text-center">Group Sessions</h2>

          <img src="/sita-motif.webp" alt="Sita Motif" className="motif" />

          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <h4>Families, Teams, Friends, &amp; Organizations</h4>

              <p>Group sessions are designed for collective transformation.</p>

              <p>
                Families, leadership teams, friend groups, spiritual
                communities, and organizations invite Sita to speak, facilitate,
                and create shared understanding around purpose, communication
                and karmic dynamics.
              </p>

              <p>
                Sita brings her multidisciplinary background as an Ayurvedic
                Practitioner, Kundalini Yoga Therapist, Jyotishi, educator, and
                facilitator to support the group through insight and embodied
                practice.
              </p>

              <p>
                <strong>Core Elements of Group Work</strong>
              </p>

              <ul>
                <li>Soul Curriculum mapping for the group or system</li>
                <li>Relationship and compatibility dynamics</li>
                <li>Karmic and dharmic agreements within the group</li>
                <li>Identifying shared lessons, strengths, and blind spots</li>
                <li>Tools for communication, compassion, and attunement</li>
                <li>
                  Eastern frameworks for understanding conflict and growth
                </li>
                <li>Somatic and yogic practices for nervous system cohesion</li>
                <li>Facilitated dialogue and integration</li>
              </ul>

              <p>
                Group sessions are tailored to the needs of the system. Sita
                listens deeply and responds intuitively to the field of the
                group.
              </p>

              <p>
                <strong>Group Formats May Include</strong>
              </p>

              <ul>
                <li>Family soul curriculum sessions</li>
                <li>Leadership and executive team alignment</li>
                <li>Organizational or community purpose alignment</li>
                <li>Friend group spiritual intensives or retreats</li>
                <li>Speaking engagements on specific topics</li>
                <li>Ceremony, ritual, and guided practice</li>
              </ul>

              <p>
                Topics may include karma and dharma, nervous system literacy,
                Kundalini, Ayurveda, sacred relationships, planetary cycles,
                yoga therapy, and spiritual awakening.
              </p>

              <p>
                <strong>What Makes This Work Unique</strong>
              </p>

              <p>
                Sita blends ancient knowledge with attuned facilitation. She
                uses Jyotish, Ayurveda, Yogic psychology, and intuition to
                reveal the deeper architecture of a system. Once the pattern is
                named, the group can shift from confusion to clarity and from
                resistance to collaboration.
              </p>

              <p>This work helps groups:</p>

              <ul>
                <li>Understand each person’s role in the system</li>
                <li>Recognize karmic agreements and relational patterns</li>
                <li>Strengthen communication and emotional attunement</li>
                <li>Build intuitive trust and shared purpose</li>
                <li>Create spiritual and nervous system literacy</li>
                <li>Honor individuality while supporting the collective</li>
              </ul>

              <p>
                Whether the group is a family, a leadership team, or a circle of
                friends, the intention is to create coherence, clarity, and
                connection at the soul level.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GropuSessions;
