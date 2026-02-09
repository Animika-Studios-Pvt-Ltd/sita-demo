import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import WorkShopCalendar from "../workshop calendar/WorkShopCalendar";
import Testimonials from "../testimonials/Testimonials";
import "../about/About.css";
import "../workshops/Workshops.css";

const SoulCurriculum = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-in-out",
      once: true,
      offset: 80,
    });
  }, []);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
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
            <img src="soul-curriculum-banner.webp" alt="Yoga Therapy Banner" />
          </div>
        </div>
        <div
          className="sita-inner-side-img"
          data-aos="fade-left"
          data-aos-duration="2000">
          <img src="/soul-curriculum-image.webp" alt="Soul Curriculum Image" />
        </div>
      </section>

      {/* -------------------- BREADCRUMB SECTION -------------------- */}
      <SitaBreadcrumb
        items={[
          { label: "Home", path: "/" },
          { label: "Sita Factor", path: "" },
          { label: "Soul Curriculum" },
        ]}
      />

      {/* --------------------- INNER PAGE CONTENT ---------------------- */}
      <section className="sita-inner-section soul-curriculum-bg-image">
        <div className="container position-relative">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <div className="sita-inner-content" data-aos="fade-up">
                <h2 data-aos="fade-up" data-aos-delay="100">
                  Soul Curriculum
                </h2>

                <img
                  src="/sita-motif.webp"
                  className="motif mb-4"
                  alt="Decorative Motif"
                  data-aos="zoom-in"
                  data-aos-delay="200"
                />
              </div>
              <div
                className="sita-inner-content-intro"
                data-aos="fade-up"
                data-aos-delay="300">
                <p>
                  Jyotish is the ancient science of light, rooted in the Vedic
                  tradition. It arose from seers who watched the sky to
                  understand the soul’s long journey through many lives. In the
                  West, most people are familiar with tropical astrology, which
                  measures the zodiac in relation to the changing seasons and
                  often focuses on personality and psychological themes.
                </p>
              </div>

              <div className="sita-inner-full-content">
                <p data-aos="fade-up" data-aos-delay="100">
                  Jyotish uses the sidereal zodiac, which is anchored to the
                  fixed stars. It is less about "who you are" in this moment and
                  more about "why you are here" and what your soul is learning
                  across lifetimes. It looks at destiny, dharma, karma, and the
                  living intelligence of time itself.
                </p>
                <p data-aos="fade-up" data-aos-delay="200">
                  Your Jyotish chart is a sacred map that I call your “Soul’s
                  Curriculum”. Sita sits with it as if she is sitting with your
                  soul. She is not only analyzing or intellectualizing, She is
                  listening. The planets, houses, and nakshatras become doorways
                  that show her what your higher self is asking you to remember.
                </p>
              </div>
            </div>
          </div>
          <a href="/booking" className="sita-workshops-btn mt-2">
            Explore Workshops
          </a>
        </div>
      </section>

      {/* --------------------- SOUL CURRICULUM ACCORDION SECTION ---------------------- */}
      <section className="accordion-section soul-curriculum-accordion">
        <div className="container">
          {/* Accordion Item 1 */}
          <div
            className={`accordion-item ${activeIndex === 0 ? "active" : ""}`}>
            <h4 onClick={() => toggleAccordion(0)} data-aos="fade-up">
              In a Soul’s Curriculum reading, Sita looks at things like:
              <span className="accordion-icon">
                {activeIndex === 0 ? "−" : "+"}
              </span>
            </h4>
            {activeIndex === 0 && (
              <div className="accordion-content">
                <ul className="accordion-section-list">
                  <li data-aos="fade-up" data-aos-delay="400">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      Karmic patterns you are unwinding in this lifetime
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="450">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      Gifts that are ripe and ripening, ready to be claimed
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="500">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      Relationship patterns and how they are asking you to grow
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="550">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      Family of origin themes and what you came in to master
                      through them
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="600">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      Archetypes you carry, how to activate their strengths, and
                      how they challenge you into your mastery
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="650">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      Career pathways that align with your values and natural
                      way of serving
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="700">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      Dharma, or the deeper purpose underneath what you "do" in
                      the world
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="750">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      Spiritual sadhana that fits your constitution and your
                      stage of life
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="800">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      Health patterns, including where there may be
                      vulnerability, where there is resilience, and how your
                      body mirrors your soul lessons
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="850">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      Timing windows that support healing, creation, rest, and
                      courageous change
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="900">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      Karmic and dharmic alignments, patterns, and activation
                      points for key areas of your life
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
              Jyotish readings are offered for:
              <span className="accordion-icon">
                {activeIndex === 1 ? "−" : "+"}
              </span>
            </h4>
            {activeIndex === 1 && (
              <div className="accordion-content">
                <ul className="accordion-section-list">
                  <li data-aos="fade-up" data-aos-delay="400">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      Individuals, for personal insights, healing, and dharma
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="450">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      Couples and families, to understand shared karmas,
                      relational patterns, and soul agreements
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="500">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      Groups and communities, to see the larger field of purpose
                      and healing
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="550">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      Businesses and projects, to align vision, leadership,
                      timing, and decision making with the chart of the
                      organization
                    </span>
                  </li>
                </ul>
                <p data-aos="fade-up" data-aos-delay="200">
                  These readings are living transmissions, not just information.
                  The chart gives me a structure, and then I channel what wants
                  to come through for you. I speak to the way your chart sings,
                  where it aches, where it remembers, and where there is
                  untapped strength.
                </p>
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
              The intention is:
              <span className="accordion-icon">
                {activeIndex === 2 ? "−" : "+"}
              </span>
            </h4>
            {activeIndex === 2 && (
              <div className="accordion-content">
                <ul className="accordion-section-list">
                  <li data-aos="fade-up" data-aos-delay="400">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      That you feel profoundly seen and understood at the level
                      of your soul
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="450">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      That you receive language for what you have always sensed
                      about yourself
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="500">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      That your challenges are reframed as initiations into
                      greater mastery
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="550">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      That you walk away with practical insight for
                      relationships, work, health, and spiritual practice
                    </span>
                  </li>
                  <li data-aos="fade-up" data-aos-delay="600">
                    <img src="/sita-points1.webp" alt="bullet" />
                    <span>
                      That your nervous system feels more at ease, because
                      something deep inside finally "clicks"
                    </span>
                  </li>
                </ul>
                <p data-aos="fade-up" data-aos-delay="200">
                  You can imagine this work as a love letter from your highest
                  self or from the Cosmic Mother. A reminder of why you came,
                  what you carry, and how deeply you are held as you walk your
                  Soul’s Curriculum.
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
        </div>
      </section>

      {/* --------------------- SOUL CURRICULUM HOW IT WORKS SECTION ---------------------- */}
      <section className="group-sessions-core-elements soul-curriculum-how-it-works">
        <div className="container">
          <h4 data-aos="fade-up">How it works: </h4>
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <p data-aos="fade-up" data-aos-delay="100">
                Birthdate, time and location are required for the reading. If
                you don’t have your exact time of birth, Sita will still do your
                reading, just know it may not be as specific.
              </p>
              <p data-aos="fade-up" data-aos-delay="200">
                You are welcomed, and encouraged to, share your questions being
                as specific as you’d like. You can also ask to focus on certain
                areas of your life. You can also just get a general reading and
                you won’t be disappointed.
              </p>
              <p className="mb-0" data-aos="fade-up" data-aos-delay="300">
                Once Sita receives your information, she will take this
                information, sit with it and begin writing. You will receive a
                typed curriculum. Some people choose to have a session after for
                an additional fee. Many people need time to digest their reading
                and schedule at a later date. Typically, it takes up to 2 weeks
                from when you submit your information. Sita will send you an
                email once she gets your information and she will let you know
                your lead time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- WORKSHOP CALENDAR SECTION ---------------- */}
      <WorkShopCalendar />

      {/* ---------------- TESTIMONIALS SECTION ---------------- */}
      <Testimonials />

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

export default SoulCurriculum;
