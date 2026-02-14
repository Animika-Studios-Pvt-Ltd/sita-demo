import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./About.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import { getSecureImageUrl } from "../../utils/imageUtils";

const BACKEND_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const sanitizeDescription = (html) => {
  return html
    .replace(/class="ql-align-[^"]*"/g, "")
    .replace(/style="[^"]*"/g, "");
};

const About = () => {
  const [currentBlogs, setCurrentBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/blogs`);
      const data = await res.json();
      const sorted = data
        .filter((blog) => !blog.suspended)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3); // Get only the latest 3
      setCurrentBlogs(sorted);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

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
      {/* -------------------- ABOUT PAGE HERO SECTION -------------------- */}
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
        <img
          src="/sita-image.webp"
          className="sita-about-side-img"
          alt="Sita Image"
          data-aos="fade-left"
          data-aos-duration="2000"
        />
      </section>
      {/* -------------------- BREADCRUMB SECTION -------------------- */}
      <SitaBreadcrumb
        items={[{ label: "Home", path: "/" }, { label: "About" }]}
      />
      {/* -------------------- ABOUT PAGE SECTION -------------------- */}
      <section className="sita-inner-section sita-about-page">
        <div className="container position-relative">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <div className="sita-inner-content">
                <h2 data-aos="fade-up" data-aos-delay="150">
                  About Sita
                </h2>
                <img
                  src="/sita-motif.webp"
                  className="motif mb-4"
                  alt="Decorative Motif"
                  data-aos="zoom-in"
                  data-aos-delay="250"
                />
              </div>
              <div className="sita-about-content">
                <div className="sita-about-image">
                  <img
                    src="/sita-image.webp"
                    className="sita-side-img"
                    alt="Sita Image"
                    data-aos="fade-left"
                    data-aos-duration="1200"
                    data-aos-delay="200"
                  />
                </div>
                <div
                  className="sita-inner-content-intro about-intro-content"
                  data-aos="fade-right"
                  data-aos-delay="300">
                  <p>
                    Sita Severson is a Spiritual Counselor and Mentor, offering
                    Teacher Training programs, individual and group sessions to
                    seekers. She supports and creates customized frameworks that
                    enable spiritual evolution. She is known also as a Vedic
                    Counselor, Ayurvedic Health Practitioner, Healer, Coach and
                    Author.
                  </p>
                </div>
              </div>
              <div className="sita-inner-full-content about-content">
                <h2 data-aos="fade-up">Detailed Bio</h2>
                <p data-aos="fade-up" data-aos-delay="100">
                  Sita Severson is the Director of Advanced Studies at the Soul
                  of Yoga Institute, a yoga therapist, Ayurvedic practitioner,
                  and mentor who turns Vedic tools into daily practice. She
                  trained with the Chopra Center in yoga, Ayurveda, meditation,
                  and breathwork and has worked across clinics, campuses, and
                  companies since 2007.
                </p>
                <p data-aos="fade-left" data-aos-delay="200">
                  She taught mindfulness and yoga at Johns Hopkins University
                  and in the Oncology unit at Johns Hopkins Hospital, and
                  created countywide curricula for the Baltimore County
                  Department of Aging that reached thousands of elders. In San
                  Diego she served as the meditation teacher for Dart
                  Neuroscience and co-founded Lead with the Lights On with her
                  husband, bringing Ayurveda into team development.
                </p>
                <p data-aos="fade-right" data-aos-delay="300">
                  She has taught on The Shift Network and Wisdom From North and
                  has shared platforms with James Nestor, Michael B. Beckwith,
                  Barbara De Angelis, PhD, and Dr. Sue Morter. Her clients
                  include leaders from The Shift Network, Gaia, Kripalu, and Hay
                  House.
                </p>
                <p data-aos="fade-left" data-aos-delay="400">
                  Sita reads the subtle with precision and translates it into
                  grounded steps that regulate the nervous system and clarify
                  direction. She uses Jyotish to speak in the voice of a
                  person’s soul and to write the soul curriculum from the chart.
                  Her approach is non predictive and practice forward, offering
                  remedies like japa, breath protocols, food and rhythm
                  medicine, altar practices, and seva minded action.
                </p>
                <p data-aos="fade-up" data-aos-delay="500">
                  She is C-IAYT, an Ayurvedic plant-based culinarian, a member
                  of IAYT and AAPNA, a four belt Nia mover, a lifelong animal
                  rescuer, and a committed member of the Shri Bhaktha Anjaneya
                  Temple. She guides people back into their dharmic heart where
                  healing and expansion live.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* -------------------- CERTIFICATIONS SECTION -------------------- */}
      <section className="sita-certifications">
        <div className="container">
          <h2 data-aos="fade-up">Certifications / Training</h2>
          <div className="row align-items-center">
            <div className="col-lg-4 col-md-12 col-sm-12 col-12 text-center">
              <img
                src="/certificate.webp"
                alt="Certification"
                data-aos="zoom-in"
                data-aos-delay="200"
              />
            </div>
            <div
              className="col-lg-8 col-md-12 col-sm-12 col-12"
              data-aos="fade-left">
              <p data-aos="fade-left" data-aos-delay="100">
                Sita brings in nearly two decades in the personal evolution and
                spiritual transformation experience. She aids in personal
                wellbeing, health resolution and spiritual development. She is a
                Certified Yoga Therapist (C-IAYT), an Ayurvedic Practitioner,
                Jyotish Astrologer, and an Ayurvedic plant-based culinarian.
              </p>
              <p data-aos="fade-left" data-aos-delay="200">
                An accomplished Vedic Counselor, Yoga Therapist, Ayurvedic
                Health Practitioner, Certified Kundalini Yoga Instructor, and
                Nia Technique Brown Belt with over 20 years of experience.
              </p>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <p className="mb-0" data-aos="fade-up" data-aos-delay="300">
                She is an active member of the International Association of Yoga
                Therapists and the Association of Ayurvedic Professionals of
                North America.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* -------------------- VISION & PHILOSOPHY -------------------- */}
      <section className="sita-vision-philosophy">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-10 col-md-12 col-sm-12 col-12 text-white">
              <h2 data-aos="fade-up">Vision & Philosophy</h2>
              <p data-aos="fade-up" data-aos-delay="150">
                Sita Severson envisions a world where people are empowered
                through the transformative practice of Spiritual Development,
                Therapeutic Yoga, and Healing — cultivating holistic health,
                lasting well-being, and a deeper alignment with their life’s
                true purpose.
              </p>
              <p data-aos="fade-up" data-aos-delay="250">
                Her purpose is to guide individuals toward inner clarity,
                emotional resilience, and conscious living. Sita honors each
                person’s unique journey, creating a safe, compassionate space
                where healing begins from within and transformation unfolds
                naturally.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* -------------------- VALUE PROPOSITION -------------------- */}
      <section className="sita-value-proposition">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 d-lg-none text-center">
              <h2 data-aos="fade-up">Value Proposition</h2>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12 col-12 order-lg-1 order-2 text-center">
              <img
                src="/value-proposition.webp"
                className="img-fluid"
                alt="Value Proposition"
                data-aos="zoom-in"
                data-aos-delay="200"
              />
            </div>
            <div
              className="col-lg-6 col-md-12 col-sm-12 col-12 order-lg-2 order-3"
              data-aos="fade-left">
              <h2 className="d-none d-lg-block" data-aos="fade-up">
                Value Proposition
              </h2>
              <p data-aos="fade-left" data-aos-delay="100">
                Sita and her work embody integrity, empathy, and a deeply
                intuitive presence. Every interaction is rooted in deep
                listening, embodied wisdom, and grounded spirituality.
              </p>
              <p data-aos="fade-left" data-aos-delay="200">
                She blends ancient practices with modern insight, offering
                tangible tools for clarity, purpose, healing, and personal
                empowerment.
              </p>
              <p data-aos="fade-left" data-aos-delay="300">
                Her work does not offer shortcuts — it offers truth, presence,
                and the space for deep inner transformation.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ---------------- RECENT BLOGS SECTION ---------------- */}
      <section className="sita-recent-blogs">
        <div className="container text-center">
          <h2 data-aos="fade-up">Recent Blogs</h2>
          <img
            src="sita-motif.webp"
            alt="Sita Motif"
            className="motif"
            data-aos="fade-up"
            data-aos-delay="200"
          />
          <div className="row">
            {currentBlogs.length > 0 ? (
              currentBlogs.map((blog, index) => {
                const btnColors = ["pink", "peach", "rose"];
                const btnColor = btnColors[index % btnColors.length]; // Cycle colors
                return (
                  <div
                    key={blog._id}
                    className="col-lg-4 col-md-4 col-sm-12 col-12"
                    data-aos="fade-up"
                    data-aos-delay={(index + 1) * 100}>
                    <div className="sita-blog-card">
                      <div className="sita-blog-image">
                        <img
                          src={getSecureImageUrl(blog.image)}
                          className="img-fluid w-100"
                          alt={blog.title}
                          style={{ height: "250px", objectFit: "cover" }}
                        />
                        <p className="blog-date">
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <h4>{blog.title}</h4>
                      <div className="blog-description-wrapper">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: sanitizeDescription(
                              blog.description.length > 150
                                ? blog.description.slice(0, 150) + "..."
                                : blog.description,
                            ),
                          }}
                        />
                      </div>
                      <span className="blog-author mb-3">
                        - {blog.author || "Sita Severson"}
                      </span>
                      <Link
                        to={`/blogs/${blog.slug || blog._id}`}
                        className={`sita-blog-btn ${btnColor}`}
                        style={{
                          minWidth: "150px",
                          display: "inline-flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
                        {blog.readMoreText || "Read More"}
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No blogs found.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
