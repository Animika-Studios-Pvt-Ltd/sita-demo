import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";

const TeacherTraining = () => {
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
          { label: "Teacher Training" },
        ]}
      />

      {/* -------------------- TEACHER TRAINING SECTION -------------------- */}
      <section className="sita-workshop-section">
        <div className="container">
          <h2 className="text-center">Teacher Training</h2>

          <img src="/sita-motif.webp" alt="Sita Motif" className="motif" />

          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <h4>Teacher Trainings and Continuing Education</h4>

              <p>
                For over two decades, Sita has taught the inner sciences of Yoga
                to dedicated practitioners, teachers, healers, and lifelong
                students of consciousness. Her personal practice spans three
                decades of study in lineages of Kundalini Tantra, classical
                Yoga, Kundalini Yoga practitioner work informed by tradition
                rather than modern Western styles, subtle anatomy, kosha-based
                therapeutics, and energy psychology.
              </p>

              <p>
                These trainings are crafted for those who feel a deep call to
                understand the inner architecture of the human being. They are
                for yoga teachers who want to deepen their offerings,
                practitioners who want to develop a private practice, and
                spiritually serious students who want to work from the level of
                prana, mind, and consciousness rather than choreography alone.
              </p>

              <p>
                Sita specializes in teachings that bring the inner Yoga alive:
              </p>

              <ul>
                <li>
                  Kundalini Tantra with an emphasis on traditional forms of
                  awakening
                </li>
                <li>
                  Kundalini Yoga practitioner training rooted in classical
                  foundations
                </li>
                <li>
                  Kosha-related yogic tools for healing and self-realization
                </li>
                <li>
                  Subtle anatomy including nadis, chakras, vayus, bindu and
                  pranic pathways
                </li>
                <li>Energy psychology through the yogic lens</li>
                <li>Trauma-informed yoga therapy frameworks</li>
                <li>
                  Integrative teaching skills for private sessions and group
                  work
                </li>
              </ul>

              <p>
                These are not surface-level trainings. They are built from lived
                experience, long-term practice, and direct study. Students learn
                not only the philosophy but the embodiment and application that
                brings the teachings into real-world practice.
              </p>

              <p>
                <strong>Who These Trainings Are For</strong>
              </p>

              <ul>
                <li>
                  Yoga teachers seeking Continuing Education and specialization
                </li>
                <li>
                  Practitioners who want to build a private therapeutic or
                  spiritual practice
                </li>
                <li>Lifelong learners devoted to the path of awakening</li>
                <li>
                  Energy healers and somatic practitioners seeking depth and
                  structure
                </li>
                <li>
                  The spiritually curious and dedicated who want authentic
                  teachings
                </li>
              </ul>

              <p>
                <strong>What You Receive</strong>
              </p>

              <ul>
                <li>Yoga Alliance Continuing Education credits</li>
                <li>Handouts you may use in your own teaching and practice</li>
                <li>
                  Ready-to-use class plans for private clients or group classes
                </li>
                <li>Live and virtual instruction for accessible learning</li>
                <li>Recordings available for continued study and review</li>
                <li>
                  Some programs available as recording-only with full support
                  materials
                </li>
              </ul>

              <p>
                Sita teaches in a way that honors the tradition and honors the
                individual. She translates subtle concepts into embodied
                knowledge without losing the depth of the teachings. Students
                leave prepared to guide others responsibly, ethically, and with
                clarity.
              </p>

              <p>
                <strong>Training Philosophy</strong>
              </p>

              <p>
                The purpose of these trainings is not to produce technicians.
                The purpose is to cultivate practitioners who can see, feel, and
                work with prana, mind, and consciousness in an intelligent and
                compassionate way.
              </p>

              <p>You will learn how to:</p>

              <ul>
                <li>Teach from understanding rather than memorization</li>
                <li>Work with private clients as well as groups</li>
                <li>Integrate subtle body literacy into physical practice</li>
                <li>
                  Support students through transformational process safely
                </li>
                <li>Use tools that match the person, not the trend</li>
                <li>
                  Bridge classical knowledge with contemporary application
                </li>
                <li>
                  Cultivate personal sadhana as the foundation of all teaching
                </li>
              </ul>

              <p>
                This path is for those who know that Yoga is not performance. It
                is inner alchemy and the steady maturation of awareness and
                capacity.
              </p>

              <p>
                <strong>Structure and Format</strong>
              </p>

              <ul>
                <li>
                  Live online classes with Q and A, practice, and integration
                </li>
                <li>Recordings provided for all live attendees</li>
                <li>Recording-only courses available for self-paced study</li>
                <li>Support materials and class plans included</li>
                <li>Small group learning for relational depth</li>
                <li>Optional private mentoring available</li>
              </ul>

              <p>
                Sita teaches with clarity and experience. Students often speak
                of her guidance as the missing link between classical Yoga
                theory and practical application in modern practice and
                teaching.
              </p>

              <p>
                If you are called to deepen, to mature your teaching, and to
                work from the subtle body instead of the surface, this is the
                right place.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TeacherTraining;
