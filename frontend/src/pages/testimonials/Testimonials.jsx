import { useState, useEffect } from "react";
import AOS from "aos";
import { useLocation } from "react-router-dom";
import "aos/dist/aos.css";

const BACKEND_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/events/ratings/approved`);
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      offset: 100,
      mirror: false,
    });
  }, []);

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    if (testimonials.length === 0) return;

    const carousel = document.getElementById("testimonialCarousel");
    const nameEl = document.querySelector(".sita-testimonial-name");
    const quoteImg = document.querySelector(".sita-testimonial-quote");

    if (!carousel || !nameEl || !quoteImg) return;

    const updateMeta = () => {
      const active = carousel.querySelector(".carousel-item.active");
      if (!active) return;

      const newName = active.dataset.name || "";
      const newQuote = active.dataset.quote || "";

      if (nameEl.textContent !== newName) nameEl.textContent = newName;
      if (quoteImg.src !== newQuote) quoteImg.src = newQuote;
    };

    // Initial sync
    setTimeout(updateMeta, 200);

    carousel.addEventListener("slid.bs.carousel", updateMeta);

    return () => {
      carousel.removeEventListener("slid.bs.carousel", updateMeta);
    };
  }, [testimonials]);

  // Default fallback if no ratings exist yet
  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    {
      _id: "default1",
      userName: "Ananya Sharma",
      comment: "Working with Sita has been a deeply transformative experience. Her guidance helped me reconnect with my inner self, find emotional balance, and move forward with clarity and confidence.",
      rating: 5
    },
    {
      _id: "default2",
      userName: "Rahul Mehta",
      comment: "Sita’s sessions brought immense peace into my life. Her compassionate approach and spiritual insight allowed me to release long-held fears and rediscover my purpose.",
      rating: 5
    },
    {
      _id: "default3",
      userName: "Priya Nair",
      comment: "Every interaction with Sita feels grounding and uplifting. Her wisdom, presence, and gentle guidance helped me realign my life with intention and mindfulness.",
      rating: 5
    }
  ];

  return (
    <>
      <section className="sita-testimonials">
        {isHomePage && (
          <img
            src="lotus-1.webp"
            alt=""
            className="sita-testimonial-decor sita-decor"
            aria-hidden="true"
          />
        )}

        <div className="container">
          <h2 data-aos="fade-up" data-aos-duration="900" data-aos-delay="100">
            Testimonials
          </h2>

          <img
            src="sita-motif.webp"
            alt="Sita Motif"
            className="motif"
            data-aos="fade-up"
            data-aos-delay="200"
          />

          <div
            className="sita-testimonial-wrapper"
            data-aos="fade-up"
            data-aos-delay="300"
            data-aos-duration="1000">
            <div className="row">
              <div
                className="col-lg-2 col-md-12 col-sm-12 col-12 text-center"
                data-aos="fade-right"
                data-aos-delay="400">
                <img
                  src="testimonial-quote.webp"
                  className="sita-testimonial-quote"
                  alt="Quote"
                />
                <span className="sita-testimonial-name"></span>
              </div>

              <div
                className="col-lg-8 col-md-12 col-sm-12 col-12"
                data-aos="fade-left"
                data-aos-delay="450">
                <div
                  id="testimonialCarousel"
                  className="carousel slide carousel-fade"
                  data-bs-ride="carousel"
                  data-bs-interval="3000"
                  data-bs-pause="false">
                  <div className="carousel-inner sita-testimonials-carousel-inner text-center">
                    {displayTestimonials.map((item, index) => (
                      <div
                        key={item._id}
                        className={`carousel-item ${index === 0 ? "active" : ""}`}
                        data-name={item.userName}
                        data-quote="testimonial-quote.webp">
                        <p>
                          {item.comment}
                        </p>
                        {item.event && item.event.title && (
                          <small className="d-block mt-3 text-muted" style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
                            Attended: {item.event.title}
                          </small>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="sita-testimonial-arrows">
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#testimonialCarousel"
                      data-bs-slide="prev">
                      <i className="fas fa-arrow-left"></i>
                    </button>

                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target="#testimonialCarousel"
                      data-bs-slide="next">
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-3 d-none d-md-block"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
