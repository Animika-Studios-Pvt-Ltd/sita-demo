import { useEffect } from "react";
import AOS from "aos";
import { useLocation } from "react-router-dom";
import "aos/dist/aos.css";

const Testimonials = () => {
  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-in-out",
      once: true,
      offset: 80,
    });
  }, []);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const carousel = document.getElementById("testimonialCarousel");
    const nameEl = document.querySelector(".sita-testimonial-name");
    const quoteImg = document.querySelector(".sita-testimonial-quote");

    if (!carousel || !nameEl || !quoteImg) return;

    const updateMeta = () => {
      const active = carousel.querySelector(".carousel-item.active");
      if (!active) return;

      nameEl.textContent = active.dataset.name || "";
      quoteImg.src = active.dataset.quote || "";
    };

    // Initial sync
    setTimeout(updateMeta, 100);

    carousel.addEventListener("slid.bs.carousel", updateMeta);

    return () => {
      carousel.removeEventListener("slid.bs.carousel", updateMeta);
    };
  }, []);

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
          <h2 data-aos="fade-up">Testimonials</h2>

          <img src="sita-motif.webp" alt="Sita Motif" className="motif" />

          <div className="sita-testimonial-wrapper" data-aos="zoom-in">
            <div className="row">
              <div className="col-lg-2 col-md-12 col-sm-12 col-12 text-center">
                <img
                  src="testimonial-quote.webp"
                  className="sita-testimonial-quote"
                  alt="Quote"
                />
                <span className="sita-testimonial-name"></span>
              </div>

              <div className="col-lg-8 col-md-12 col-sm-12 col-12">
                <div
                  id="testimonialCarousel"
                  className="carousel slide carousel-fade"
                  data-bs-ride="carousel"
                  data-bs-interval="3000"
                  data-bs-pause="false">
                  <div className="carousel-inner sita-testimonials-carousel-inner text-center">
                    <div
                      className="carousel-item active"
                      data-name="Ananya Sharma"
                      data-quote="testimonial-quote.webp">
                      <p>
                        Working with Sita has been a deeply transformative
                        experience. Her guidance helped me reconnect with my
                        inner self, find emotional balance, and move forward
                        with clarity and confidence.
                      </p>
                    </div>

                    <div
                      className="carousel-item"
                      data-name="Rahul Mehta"
                      data-quote="testimonial-quote.webp">
                      <p>
                        Sita’s sessions brought immense peace into my life. Her
                        compassionate approach and spiritual insight allowed me
                        to release long-held fears and rediscover my purpose.
                      </p>
                    </div>

                    <div
                      className="carousel-item"
                      data-name="Priya Nair"
                      data-quote="testimonial-quote.webp">
                      <p>
                        Every interaction with Sita feels grounding and
                        uplifting. Her wisdom, presence, and gentle guidance
                        helped me realign my life with intention and
                        mindfulness.
                      </p>
                    </div>
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
